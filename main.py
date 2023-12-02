import utils

ids = utils.extract_id('dataset/Attack_free_dataset.txt')
matrix, aux_ids = utils.generate_matrix(ids)

print(aux_ids)
data = utils.extract_everything('dataset/Impersonation_attack_dataset.txt')
saved_msg = utils.analyze_traffic(matrix, aux_ids, data)

print(len(saved_msg))