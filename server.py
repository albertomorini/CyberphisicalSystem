import json
from http.server import BaseHTTPRequestHandler, HTTPServer
import DetectionAlgorithm
import sys
PORT = 1999
######################################################

# detect the message of CAN BUS and returns the respective analysis
# @param {int} limitDetections nr of detections desired for every attack
# return {Array} array of object (the detections for each attack)
def detectionPhases(limitDetections):
    ids = DetectionAlgorithm.extract_id('./dataset/Attack_free_dataset.txt')
    matrix, aux_ids = DetectionAlgorithm.generate_matrix(ids)
    print("IDS of CAN-BUS:")
    print(aux_ids) ## unique IDS

    datasetExtractions = {
        "DoS" : DetectionAlgorithm.extract_everything('./dataset/DoS_attack_dataset.txt'),
        "Fuzzy" : DetectionAlgorithm.extract_everything('./dataset/Fuzzy_attack_dataset.txt'),
        "Impersonate" : DetectionAlgorithm.extract_everything('./dataset/Impersonation_attack_dataset.txt'),
    }
    detections = {
        "DoS" : DetectionAlgorithm.analyze_traffic(matrix,aux_ids, datasetExtractions["DoS"]),
        "Fuzzy" : DetectionAlgorithm.analyze_traffic(matrix,aux_ids, datasetExtractions["Fuzzy"]),
        "Impersonate" : DetectionAlgorithm.analyze_traffic(matrix,aux_ids, datasetExtractions["Impersonate"]),
    }

    AllDetections = []

    for i in detections:    ## for each attack
        for j in range(limitDetections): 
            detections[i][j]["dataset"]= i
            AllDetections.append(detections[i][j])

    return AllDetections


##################################################################################################
##################################################################################################



indexMessage = 0 ## to simulate a real time scenario, we send just a single message every request

## class will handle the requests
class GetHandler(BaseHTTPRequestHandler):
    def do_GET(self): ##GET REQUESTS
        self.send_response(200)
        # TODO: set JSON
        self.send_header('Content-type','application/json')
        self.send_header('Access-Control-Allow-Origin','*')
        self.end_headers()

        # the response
        message = {
            "data": []
        }

        ## FOR TEST ONLY: every request we send the next detection
        global indexMessage
        if(indexMessage<len(detections)):
            message["data"].append(detections[indexMessage])
            indexMessage += 1 #increment
        else:
            message["data"]="null"
        parsed = json.dumps(message)
        self.wfile.write(bytes(parsed, "utf8"))
        message["data"]=[] ##JUST FOR TESTING


## START HTTP SERVER
def startServer():
    print('Server started...')
    server_address = ('10.0.0.3', PORT)
    httpd = HTTPServer(server_address, GetHandler)
    print('Server in ready...')
    httpd.serve_forever()
        

if(len(sys.argv)>1):
    print("Picked: "+sys.argv[1]+ " detection messages")
    detections = detectionPhases(sys.argv[1]) #limit to n-message for each attack
else:   
    print("Default case, 10 detection messages")
    detections = detectionPhases(10) #limit to 10 message for each attack

startServer()