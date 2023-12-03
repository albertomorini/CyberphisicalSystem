import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Dashboard from '../components/Dashboard'

const Home = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle mode="ios" size="large">IDS for CAN</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <Dashboard />
      </IonContent>
    </IonPage>
  );
};

export default Home;
