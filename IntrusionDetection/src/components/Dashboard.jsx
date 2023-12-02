import { IonButton, IonCol, IonContent, IonItem, IonRow, IonText } from '@ionic/react';
import { useEffect, useState } from 'react';
import moment from "moment"

import { Storage } from '@ionic/storage';

import { LocalNotifications } from '@capacitor/local-notifications';

const Dashboard= () => {
    const [Messages, setMessages] = useState([]);
    const store = new Storage();


    async function getData() {
        //await store.create();

        setInterval(() => {

            // fetch("http://localhost:1199", {
            //     mode: "cors",
            //     method: "GET"
            // }).then(res => res.json()).then(res => {
            //     console.log(res.data);
            //     let x = Messages.concat(res.data)
            //     setMessages(x)
            // })

        }, 2000);
    }
    async function test(){
        console.log("clieckd");
        let options = {
                notifications: [
                    {
                        id: 111,
                        title: "TEST",
                        body: "corpo"
                    }
                ]
            }
            try {
                await LocalNotifications.schedule(options)
            } catch (ex) {
                console.log(ex);
            }
        console.log("clieckd");

    }
   

    useEffect(() => {
        
        getData();
    }, [])

    return (
        <IonContent>
            <IonRow>
                <IonItem style={{ width: "100%" }}>
                    <IonCol><b>Date</b></IonCol>
                    <IonCol><b>Message</b></IonCol>
                </IonItem>
            </IonRow>
            <IonContent style={{ height: "50%" }}>

                {Messages?.map((s, index) => (
                    <IonRow>
                        <IonItem style={{ width: "100%" }}>
                            <IonCol>
                                {moment(s.timestamp).format("DD/MM/YYYY HH:mm:ss")}
                            </IonCol>
                            <IonCol>
                                {s.message}
                            </IonCol>
                        </IonItem>
                    </IonRow>
                ))}
            </IonContent>

            <IonButton color="danger" expand='block' onClick={()=>test()}>Clear cache</IonButton>
            <h3 className='ion-text-center'>
                Made by Alberto Morini & Davide Bassan
            </h3>
            
        </IonContent>
    )
}


export default Dashboard;