import re

def extract_id(file_path):
    """
    Extracts values from the 'ID' column in a text file.
    :file_path (str): The path to the text file.
    @returns List[str]: A list of strings containing the values from the 'ID' column.
    """
    with open(file_path, 'r') as file:
        file_content = file.read()
    ids = re.findall(r'ID:\s+(\w+)', file_content)
    return ids

def extract_info_from_line(line):    
    match = re.match(r'Timestamp:\s+([\d.]+)\s+ID:\s+(\w+)\s+(\d{3})\s+DLC:\s+(\d+)\s*([0-9a-f\s]*)', line)
    if match:
        timestamp = float(match.group(1))
        identifier = match.group(2)
        dlc = int(match.group(4))
        if dlc > 0:
            message = match.group(5).replace(' ', '')
        else:
            message = ''
        return timestamp, identifier, dlc, message
    return match

def extract_everything(dataset):
    with open(dataset,'r') as file:
        file_content = file.readlines()
    info = []
    for line in file_content:
        info.append(extract_info_from_line(line))

    return info
    
def generate_matrix(ids):
    """
    Generation of the matrix
    :ids (List[str]): a list of strings containing the values from the 'ID' column.
    @returns List[List[Boolean]]: a matrix of all transaction appeared on the dataset
    """
    auxiliary_ids = list(dict.fromkeys(ids))

    matrix_size = len(auxiliary_ids)
    boolean_matrix = [[False] * matrix_size for _ in range(matrix_size)]

    for i in range(len(ids)-1):
        row_index = auxiliary_ids.index(ids[i])
        column_index = auxiliary_ids.index(ids[i+1])
        boolean_matrix[row_index][column_index] = True

    return boolean_matrix, auxiliary_ids
def analyze_traffic(matrix, ids, dataset):
    """
    :matrix
    :dataset
    @returns List[Json*].
    *{
        'timestamp': '....',
        'msg_length': int'
        'msg': '...',
        'id': '...',
        'kind': "ATTACK/UNKNOWN"
    }
    """

    threat_len = 0
    counter = 0
    batch_threat = []
    batch_size = 100
    saved_msg = []
    id_to_be_saved = []

    for i in range(0, len(dataset)-1):
        if counter == batch_size:
            error_ratio = threat_len / batch_size
            if error_ratio >= 0.05:
                #print(error_ratio)
                # Metti l'errore negli attacchi
                for timestamp, id, msg_length, msg in batch_threat:
                    json = {
                        "timestamp": timestamp,
                        "msg_length": msg_length,
                        "msg": msg,
                        "id": id,
                        "kind": "ATTACK"
                    }
                    saved_msg.append(json)
            else:
                for timestamp, id, msg_length, msg in batch_threat:
                    json = {
                        "timestamp": timestamp,
                        "msg_length": msg_length,
                        "msg": msg,
                        "id": id,
                        "kind": "UNKNOWN"
                    }
                    saved_msg.append(json)
                if error_ratio < 0.02:
                    matrix = update_matrix(matrix, ids, batch_threat, id_to_be_saved)
                
            id_to_be_saved = []
            batch_threat = []
            counter = 0
            threat_len = 0

        actual_id = dataset[i][1]
        next_id = dataset[i+1][1]

        if actual_id not in ids or next_id not in ids:
            threat_len += 1
            batch_threat.append(dataset[i])
            if actual_id not in ids:
                id_to_be_saved.append(actual_id)
            if next_id not in ids:
                id_to_be_saved.append(next_id)
        else:
            row = ids.index(actual_id)
            column = ids.index(next_id)

            if not matrix[row][column]:
                threat_len += 1
                batch_threat.append(dataset[i])
                
        counter += 1

    return saved_msg


def update_matrix(matrix, ids, dataset, adding_ids):
    ids += adding_ids

    for _ in range(len(adding_ids)):
        matrix.append([False] * len(matrix[0]))

    for _ in range(len(adding_ids)):
        matrix[_].extend([False] * len(adding_ids))

    for i in range(0, len(dataset)-1, 2):
        row = ids.index(dataset[i][1])
        column = ids.index(dataset[i+1][1])
        matrix[row][column] = True

    return matrix