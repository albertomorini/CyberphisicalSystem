import utils

limitNrDetections = 10

ids = utils.extract_id('dataset/Attack_free_dataset.txt')
matrix, aux_ids = utils.generate_matrix(ids)
print(aux_ids) ## unique IDS

datasetExtractions = {
    "DoS" : utils.extract_everything('dataset/DoS_attack_dataset.txt'),
    "Fuzzy" : utils.extract_everything('dataset/Fuzzy_attack_dataset.txt'),
    "Impersonate" : utils.extract_everything('dataset/Impersonation_attack_dataset.txt'),
}
detections = {
    "DoS" : utils.analyze_traffic(matrix,aux_ids, datasetExtractions["DoS"]),
    "Fuzzy" : utils.analyze_traffic(matrix,aux_ids, datasetExtractions["Fuzzy"]),
    "Impersonate" : utils.analyze_traffic(matrix,aux_ids, datasetExtractions["Impersonate"]),
}


dataToSend = []

for i in detections:    ## for each attack
    for j in range(limitNrDetections): ## [JUST FOR TEST] limit to a fixed number of detection in way to send few message to the client
        detections[i][j]["dataset"]= i
        dataToSend.append(detections[i][j])


print(dataToSend)
