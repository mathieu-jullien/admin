import { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import StatCard from '../../../components/ui/StatCard';
import { contactService } from '../../../services/contacts';
import type { ContactStats } from '../../../types/pages/contacts';
import { ApiException } from '../../../types/api/errors';

export default function ContactsCard() {
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      const controller = new AbortController();

      try {
        setLoading(true);
        setError(null);

        const data = await contactService.getWeeklyStats(controller.signal);
        setStats(data);
      } catch (err) {
        if (err instanceof ApiException) {
          setError(err.message);
        } else {
          setError('Erreur lors du chargement des statistiques');
        }
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }

      return () => controller.abort();
    };

    loadStats();
  }, []);

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <StatCard
      title="Messages de contact"
      value={stats?.currentWeek ?? 0}
      icon={Mail}
      variation={stats?.variation}
      loading={loading}
    >
      {stats && stats.recentContacts.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Messages récents
          </h4>
          <div className="space-y-2">
            {stats.recentContacts.map(contact => (
              <div
                key={contact.id}
                className="flex items-start gap-3 p-2 rounded hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {contact.name}
                    </p>
                    <time className="text-xs text-gray-500 flex-shrink-0">
                      {format(new Date(contact.createdAt), 'dd MMM', {
                        locale: fr,
                      })}
                    </time>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {contact.email}
                  </p>
                  {contact.subject && (
                    <p className="text-xs text-gray-600 truncate mt-1">
                      {contact.subject}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </StatCard>
  );
}
