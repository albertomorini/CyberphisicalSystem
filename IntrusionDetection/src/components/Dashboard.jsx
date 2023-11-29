import { IonCol, IonContent, IonItem, IonRow } from '@ionic/react';
import { useEffect, useState } from 'react';
import moment from "moment"

const Dashboard = () => {
    const [Messages, setMessages] = useState([]);

    function getData() {
        setTimeout(() => {

            let x = Array.from(Array(15).keys());
            console.log(x);
            setMessages([...Messages, ...x])

        }, 2000);
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
                                {moment().format("DD/MM/YYYY HH:mm:ss")}
                            </IonCol>
                            <IonCol>
                                {s}
                            </IonCol>
                        </IonItem>
                    </IonRow>
                ))}
            </IonContent>

        </IonContent>
    )
}


export default Dashboard;