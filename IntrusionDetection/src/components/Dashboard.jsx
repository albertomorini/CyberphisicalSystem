import { IonButton, IonCol, IonContent, IonItemDivider,IonInput, IonItem, IonLabel, IonRow } from '@ionic/react';
import { useEffect, useState } from 'react';
import moment from "moment";
import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@capacitor/local-notifications';

const Dashboard = () => {
    const [Messages, setMessages] = useState([{}]); //to show messages in UI
    const [SocketServer, setSocketServer] = useState("http://localhost:1199")
    const store = new Storage(); //to store data into cache
    const pollingTime = 5000; //5 sec;

    /**
     * Create a local notification for capacitor/native ~ Android&&iOS
     * @param {string} id the id of CAN message
     * @param {string} kindMessage kind of threat 
     * @param {string} CANMessage message of CAN
     */
    async function showLocalNotification(id, kindMessage = "NODATA", CANMessage) {
        let tmpBody;
        if (kindMessage == "ATTACK") {
            tmpBody = "Invalid messages have been detected. This may indicate a bus error or an attack."
        } else if (kindMessage == "UNUSUAL") {
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
    //FETCH server to retreive new detections
    async function getDataFromServer() {
        const store = new Storage();
        store.create();
        let sckSrv = await store.get("socketServer");
        console.log(sckSrv);
        fetch(sckSrv, {
            mode: "cors",
            method: "GET"
        }).then(res => res.json()).then(async res => {
            console.log(res);
            if (res.data != "null") { //Server will send null string when ended the detections
                //DATA RECEIVED
                res.data.forEach(message => { //res.data is an array of message, forEach one show a notification
                    showLocalNotification(message.id, message.kind, message.msg); //trigger the android notification

                    message.receptionTS = moment().format("DD/MM/YYYY HH:mm:ss"); //baptize the reception timestamp
                })

                // STORE DATA INTO CACHE AND UPDATE UI            
                const store = new Storage();
                store.create();
                let arrayStorico = await store.get('historyData');
                if (arrayStorico == null) {
                    arrayStorico = [];
                }
                let tmpArray = Array.from(arrayStorico).concat(res.data); //cast into a proper array
                store.set('historyData', tmpArray); //save new array with oldData.append(newData) --> where newData is an array of detection

                setMessages(arrayStorico); //update state to show into UI
            }
        }).catch(err => { //visible with logcat
            console.log("Communication error: " + err);
        });
    }
    // clean history cache of detections
    function cleanCache() {
        console.log("Cleaning cache");
        const store = new Storage();
        store.create();
        store.set('historyData', []);; //set an empty array
        setMessages([])
    }
    // Store socket server into cache
    function storeSocketServer() {
        const store = new Storage();
        store.create();
        store.set("socketServer", SocketServer);
    }
    /**
     * ASK Permission for local notification
     */
    async function askPermissionLN() {

        let x = await LocalNotifications.requestPermissions();


        let chkPermission = await LocalNotifications.checkPermissions();
        console.log("PERMISSION: " + chkPermission);
        console.log(chkPermission);
        if (chkPermission == null || chkPermission == "prompt-with-rationale" || chkPermission == "prompt") { //user have to choiche
            LocalNotifications.requestPermissions();
        }
    }

    function checkPermissions() {
        //TODO: check if already asked
        LocalNotifications.requestPermissions();
    }

    useEffect(() => {
        checkPermissions();
        getDataFromServer();
        setInterval(() => {
            getDataFromServer();
        }, pollingTime); //then start the iteration to retrieve data
    }, []) //execute just one time with []

    return (
        <IonContent class='ion-padding'>
            <IonRow>
                <IonItem style={{ width: "100%" }}>
                    <IonCol><b>Received date</b></IonCol>
                    <IonCol><b>Message</b></IonCol>
                    <IonCol><b>Dataset</b></IonCol>
                </IonItem>
            </IonRow>
            <IonContent style={{ height: "50%" }}>

                {Messages?.filter(s => s.kind != null).map((s, index) => ( //clean the dataset and show the list of detections
                    <IonRow>
                        <IonItem style={{ width: "100%" }} key={index}
                            color={(s.kind == "ATTACK") ? "danger" : "light"}
                        >
                            <IonCol>
                                {moment(s.receptionTS).format("DD/MM/YYYY HH:mm:ss")}
                            </IonCol>
                            <IonCol>
                                {s.kind}
                                <br />
                                {s.msg}
                            </IonCol>
                            <IonCol>
                                {s.dataset}
                            </IonCol>
                        </IonItem>
                    </IonRow>
                ))}
            </IonContent>

            <IonItemDivider />
            <IonRow>
                <IonCol>
                    <IonLabel>Server config</IonLabel>
                    <IonInput mode='md' type='text' fill='outline' placeholder='http://localhost:1199' onIonInput={(ev) => setSocketServer(ev.target.value)} />
                </IonCol>
                <IonCol size='2'>
                    <IonButton style={{ marginTop: "20px", height: "70%" }} expand='block' color="success" onClick={() => storeSocketServer()}>SAVE</IonButton>
                </IonCol>
            </IonRow>


            <IonButton color="warning" expand='block' onClick={() => cleanCache()}>Clear cache</IonButton>
            <h3 className='ion-text-center'>
                Made by Alberto Morini & Davide Bassan
            </h3>

        </IonContent>
    )
}

export default Dashboard;