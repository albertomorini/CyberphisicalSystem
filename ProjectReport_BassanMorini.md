

# Project report

> First project of Cyberphysical System and IoT Security - <a href="https://www.unipd.it/en/educational-offer/second-cycle-degree/science?tipo=LM&scuola=SC&ordinamento=2021&key=SC2598&cg=science">*Master degree in Computer Science* </a>

Replication of first paper -  IDS for CAN: A Practical Intrusion Detection System for CAN Bus Security

- link to the paper: https://ieeexplore.ieee.org/document/10001536
- link to the dataset: https://ocslab.hksecurity.net/Dataset/CAN-intrusion-dataset (section 1.3)

**Authors:** 
- Davide Bassan
- Alberto Morini (mat. 2107783)

**ALL SOURCE CODE IS PUBLIC ON GITHUB**: https://github.com/albertomorini/CyberphisicalSystem

## Abstract

We have to replicate what done into the paper linked before, so, we can divide the job into two side:

1. **Intrusion detection side**: which analyze the datasets identifiy potential threat
2. **Mobile appp**: that via notifications alert the user of the threat idenitied before


### Architecture
Thus, we designed a simple architecture, made by a backend (server with detection algorithm) and a frontend (app/webap).

In short, the backend analize the datasets and after identifiy the threats, provide them to the HTTP server side which makes them available for the clients.


![Alt text](images/flowchart.jpg)
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

Othewise as the paper, we opted to create a webapplication which communicate to server via HTTP packets.

This decision has been made for many aspects:
- **portability**, because web application can be easily build for both mobile OS major: iOS and Android
    - this represent a huge benefit to maintainability and extensions of the code

- **real life scenario**: we imagine the backend detection system installed on the car, maybe integrated with Android Auto or CarPlay, which systems can communicate via Wi-Fi.

Of course, HTTP is an ensecure protocol, we adopt it just for an easily approach, but we strongly suggests to adopt a SSL certificate (_can be a self-signed one_) in way to use HTTPS.

### Architecture

```JSON
{
    "timestamp": integer,
    "msg_length": int,
    "msg": "VARCHAR",
    "id": id_CANComponent,
    "kind": "Sospicious/Unknown"
}
```


### Server


    - http
    - 
### client side
    - ionic/react
    - cache
    - local notification
    - exporting for android


## Conclusion

The only negative observation that we need to make is about energy consumption of Wi-Fi, Bluetooth is lighter and probabily available on more vehicles.
