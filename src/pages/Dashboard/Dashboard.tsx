import ContactsCard from './components/ContactsCard';
import GoogleAnalyticsCard from './components/GoogleAnalyticsCard';

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white mt-1">
          Vue d'ensemble des statistiques portfolio et des interactions via le
          formulaire de contact
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContactsCard />
        <GoogleAnalyticsCard />
      </div>
    </div>
  );
}
