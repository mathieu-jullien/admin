import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExperienceForm from './components/ExperienceForm';
import type { Experience } from '../../types/pages/experiences';
import { experienceService } from '../../services/experiences';
import { ApiException } from '../../types/api/errors';

export default function Create() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    data: Omit<Experience, 'id' | 'dateCreated' | 'dateUpdated'>
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      await experienceService.create(data);
      navigate('/experiences');
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message);
      } else {
        setError('Erreur lors de la création');
      }
      console.error('Erreur lors de la création:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/experiences');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* En-tête */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                Créer une nouvelle expérience
              </h1>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                disabled={isLoading}
              >
                ← Retour à la liste
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="py-8">
        <div className="max-w-2xl mx-auto">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Informations de l'expérience
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Remplissez les informations ci-dessous pour créer une nouvelle
                expérience professionnelle.
              </p>
            </div>

            <ExperienceForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
