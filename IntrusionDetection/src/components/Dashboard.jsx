import { IonButton, IonCol, IonContent, IonItem, IonRow, IonText } from '@ionic/react';
import { useEffect, useState } from 'react';
import moment from "moment"

import { Storage } from '@ionic/storage';
import { PushNotifications } from '@capacitor/push-notifications';


const Dashboard= () => {
    const [Messages, setMessages] = useState([]);
    const store = new Storage();

    const addListeners = async () => {
        await PushNotifications.addListener('registration', token => {
            console.info('Registration token: ', token.value);
        });

        await PushNotifications.addListener('registrationError', err => {
            console.error('Registration error: ', err.error);
        });

        await PushNotifications.addListener('pushNotificationReceived', notification => {
            console.log('Push notification received: ', notification);
        });

        await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
            console.log('Push notification action performed', notification.actionId, notification.inputValue);
        });
    }

    const registerNotifications = async () => {
        let permStatus = await PushNotifications.checkPermissions();

        if (permStatus.receive === 'prompt') {
            permStatus = await PushNotifications.requestPermissions();
        }

        if (permStatus.receive !== 'granted') {
            throw new Error('User denied permissions!');
        }

        await PushNotifications.register();
    }

    const getDeliveredNotifications = async () => {
        const notificationList = await PushNotifications.getDeliveredNotifications();
        console.log('delivered notifications', notificationList);
    }

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

    useEffect(() => {
        addListeners();
        registerNotifications();
        getDeliveredNotifications();
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

            <IonButton color="danger" expand='block'>Clear cache</IonButton>
            <h3 className='ion-text-center'>
                Made by Alberto Morini & Davide Bassan
            </h3>
            
        </IonContent>
    )
}


export default Dashboard;