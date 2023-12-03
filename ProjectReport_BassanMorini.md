# Project report

> First project of Cyberphysical System and IoT Security - <a href="https://www.unipd.it/en/educational-offer/second-cycle-degree/science?tipo=LM&scuola=SC&ordinamento=2021&key=SC2598&cg=science">*Master degree in Computer Science* </a>

Replication of first paper -  IDS for CAN: A Practical Intrusion Detection System for CAN Bus Security

- link to the paper: https://ieeexplore.ieee.org/document/10001536
- link to the dataset: https://ocslab.hksecurity.net/Dataset/CAN-intrusion-dataset (section 1.3)

**Authors:** 
- Davide Bassan
- Alberto Morini (mat. 2107783)

**ALL SOURCE CODE IS PUBLIC ON GITHUB (in various branch)**: https://github.com/albertomorini/CyberphisicalSystem <br/>
_For storage reasons we do not provide the datasets of the paper into the repository_


## Abstract

We have to replicate what done into the paper linked before, so, we can divide the job into two side:

1. **Intrusion detection side**: which analyze the datasets identifiy potential threat
2. **Mobile app**: that via notifications alert the user of the threat identified before


### Architecture
Thus, we designed a simple architecture, made by a backend (server with detection algorithm) and a frontend (app/webapp).

In short, the backend analyze the datasets and after identifiy the threats, provide them to the HTTP server side which makes them available for the clients.


![Flowchart](images/flowchart.jpg)
_fig1: flowchart of designed architecture_

### Technical specifications

The **backend** is made via python scripts.
- *The building and testing has been made with Python 3.11.4*

The **frontend** is a web application made with <a href="https://ionicframework.com/">Ionic framework</a>
- *Building and testing has been made with Ionic 7.1.1*
- *Emulator used with Android Studio Giraffe 2022.3.1 Patch 2 and Android 14 (5 sept 2023) API34*

The OS and hardware specifications are not relevant for the project, anyway.
- Mac Mini M1 8Gb RAM with MacOS Sonoma 14.1.2
- MacBook??

## Intrusion detection side (backend)


## Mobile app

Otherwise as the paper, we opted to create a web-application which communicate to server via HTTP packets.

This decision has been made for many aspects:
- **portability**, because web application can be easily build for both mobile OS major: iOS and Android
    - this represent a huge benefit to maintainability and extensions of the code

- **real life scenario**: we imagine the backend detection system installed on the car, maybe integrated with Android Auto or CarPlay, which systems can communicate via Wi-Fi.

Of course, HTTP is an unsecure protocol, we adopt it just for an easily approach, but we strongly suggests to adopt a SSL certificate (_can be a self-signed one_) in way to use HTTPS.

### Architecture

Server sends the client the message retrieved by the Detection Algorithm adding the property of which dataset the detection is from. <br/>
The Content-type of packets is in "application/json" from.

_Example of content_
```JSON
{
    "timestamp": integer,
    "msg_length": int,
    "msg": "VARCHAR",
    "id": id_CANComponent,
    "kind": "Sospicious/Unknown",
    "dataset": "DoS/Fuzzy/Impersonate/..."
}
```



**DISCLAIMER**: to simulate a real life scenario server sends the client a new detection at every request received. <br/>
**In an effective scenario, server will sends/make available detections in real time as soon as they are identified**

So, we let the client define the polling time to check server for new data.
*Actually every 5 seconds*

### Server HTTP

Made with Python and default libraries:
```python
import json #to parse/stringify JSON
from http.server import BaseHTTPRequestHandler, HTTPServer # HTTP server
import sys # to get command line params
import DetectionAlgorithm # our algorithm
``````

For simplicity, server as soon as it started launch the detection algorithm on every dataset provided; then, save the detections in a local variable.

Server provide the client a limited number of detections, indicated by the user as parameter. This decision has been made in way to get into the client the detections of every dataset in reduced time. <br/>
If none parameter is provided, the default number of message for every dataset is 10.

For example: `$ python3 server.py 5` --> will send 15 message in total to the client (5 for each dataset)

![DifferentDatasets](images/differentDataset.png)

#### Adding the dataset

Server also add the current dataset into the detection:
```python
detections = {
    "DoS" : DetectionAlgorithm.analyze_traffic(matrix,aux_ids, datasetExtractions["DoS"]),
    "Fuzzy" : DetectionAlgorithm.analyze_traffic(matrix,aux_ids, datasetExtractions["Fuzzy"]),
    "Impersonate" : DetectionAlgorithm.analyze_traffic(matrix,aux_ids, datasetExtractions["Impersonate"]),
}

for i in detections:    ## for each attack 
        for j in range(limitDetections): 
            detections[i][j]["dataset"]= i
            AllDetections.append(detections[i][j])

    return AllDetections
```


### Client application

As said before, the client application has been made in React with Ionic framework, which allows to bring React into an Android APK or iOS App.

Has been used several libraries.

- `@ionic/storage` to store into app's cache the detection history
- `@capacitor/local-notifications` in way to create a native notification visible in the localbar of mobile
- `moment.js` to have an easily manipulation of datetime format

#### Life cycle

App starts asking the permission, then start polling the server which is not configurated untill user don't save the server's socket.
![Ask4Permissions](images/notificationPermission.png)

As soon IP address and port of the server process are configurated, client retrive data and store into the cache, after that, via a "React State" automatically update the UI.

![Working](images/working.png)
_Mobile app polling the server and retrieving data_

Also at every new data, apps push into notification center of Android the message.
![NotificationBar](images/notificationBar.png)


#### Messages

At every detection received, client baptize the message with a timestamp called "receptionTS". This information can be very useful in future project thus to measure potential delay/latency of the system.
```js
res.data.forEach(message => { //res.data is an array of message, forEach one show a notification
    showLocalNotification(message.id, message.kind, message.msg); //trigger the android notification

    message.receptionTS = moment().format("DD/MM/YYYY HH:mm:ss"); //baptize the reception timestamp
})
```

Local notification are divided into two group as the message history, as the paper did.
This information is retrieved by the Detection Algorithm and carried by the server into the client, so the client basically show the respective message.

```js
async function showLocalNotification(id, kindMessage = "NODATA", CANMessage) {
        let tmpBody;
        if (kindMessage == "UNKNOWN") {
            tmpBody = "Invalid messages have been detected. This may indicate a bus error or an attack."
        } else if (kindMessage == "ATTACK") {
            tmpBody = "Unusual patterns of messages have been detected. This may be the result of unusual activity, or it may indicate an attack."
        }

        let options = {
            notifications: [
                {
                    id: id,
                    title: "ALERT: potential attack detect!",
                    body: tmpBody + "\n CAN MESSAGE: " + CANMessage
                }
            ]
        }

        try {
            await LocalNotifications.schedule(options); //SHOW NOTIFICATION
        } catch (ex) {
            console.log(ex);
        }
    }
```

We can scroll the history to check the detections, which have a red background in case of "Attack" and light grey if the detections have identified the threat as "Unknown traffic"

## Conclusion


The only negative observation that we need to make is about energy consumption of Wi-Fi, Bluetooth is lighter and probabily available on more vehicles.


### Data of detection

