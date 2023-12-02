

# Report project

First project of Cyberphysical System and IoT Security - *Master degree in Computer Science*

Replication of first paper -  IDS for CAN: A Practical Intrusion Detection System for CAN Bus Security

**Authors:** 
- Davide Bassan (mat. 2076779)
- Alberto Morini (mat. 2107783)


## Panoramic

- un paio di parole su quello che dobbiamo fare (replicare l'algoritmo e app)
- inserisco uno schemino/flusso concettuale
- caratteristiche Software Hardware su cui è eseguito il test

## Intrusion detection side (backend)

### Creation of the matrix
In this phase, we have replicated the algorithm proposed in the paper.

Specifically, from the file `Attack_free_dataset.txt`, we used a regular expression to extract all the IDs of the frames.

```python
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
```

Next, we initialized a matrix of size `N*N`, where `N` is the number of unique IDs that appear in the `Attack_free_dataset.txt` dataset, with all values set to `False`.

Then, we populated the matrix, setting those IDs to True that appear one after the other in the dataset. This is because we assume that the traffic on the CAN bus is highly recurrent.

```python
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
```

### Threat detection
We have evaluated the algorithm on three different subset of frames

- `DoS_attack_dataset.txt`
- `Fuzzy_attack_dataset.txt`
- `Impersonation_attack_dataset.txt`

To achieve this, we checked if subsequent IDs appeared in one of these subsets, which is also present in the `Attack_free_dataset.txt` dataset. In other words, in the matrix built previously, if the value is `True` at position `id, next_id`, then the ID is considered to have appeared after the other.

If the ID does not exist in the matrix, or if the value in the matrix is `False`, it is added to a list of potential dangerous messages.

```python
    [...]
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
    [...]
```

We have divided the evaluation in batch, in order to calculate a BATCH_RATIO of threat, we have also setted a threshold, in order to ignore false positives.

In fact, if a batch have a BATCH_RATIO lower than a certain threshold we have considered those messages as false positives, and instead of notify the users of potentially unknown messages, we have update the matrix setting to true those false positives.

```python
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
```

## Mobile app

Intro... insted of an app with bluetooth, a webapp working both for Android and iOS.

### Panoramic

### server side
    - http
    - 
### client side
    - ionic/react
    - cache
    - local notification
    - exporting for android


## Conclusion

