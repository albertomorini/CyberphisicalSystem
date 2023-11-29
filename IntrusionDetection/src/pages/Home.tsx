import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Dashboard from '../components/Dashboard'

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle size="large">Intrusion detection for CAN</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <Dashboard />
      </IonContent>
    </IonPage>
  );
};

export default Home;
