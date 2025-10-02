import ContactsCard from './components/ContactsCard';
import GoogleAnalyticsCard from './components/GoogleAnalyticsCard';

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Vue d'ensemble de votre portfolio et des interactions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContactsCard />
        <GoogleAnalyticsCard />
      </div>
    </div>
  );
}
