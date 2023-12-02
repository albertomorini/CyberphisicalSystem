# CyberphisicalSystem
Repo for CyberphisicalSystem course of UNIPD



## Webapp w/ IonicFramework

1. polling to the server
2. at new data --> baptize the message with timestamp
3. store the new data into cache -> ionic storage
4. show data

## HTTP packet

```JSON
*{
    'timestamp': '....',
    'msg_length': int'
    'msg': '...',
    'id': '...',
    'kind': "Sospicious/Unknown",
    'dataset': String
}
````


## TODO

[x] save message to cache

[x] push notification for new data

[X] server python