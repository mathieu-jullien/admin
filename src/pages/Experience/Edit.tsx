import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ExperienceForm from './components/ExperienceForm';
import type { Experience } from '../../types/pages/experiences';
import type { UpdateExperienceDto } from '../../services/experiences/types';
import { experienceService } from '../../services/experiences';
import { ApiException } from '../../types/api/errors';

export default function Edit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExperience = async () => {
      if (!id) {
        setError("ID d'expérience manquant");
        setLoading(false);
        return;
      }

      const controller = new AbortController();

      try {
        setLoading(true);
        setError(null);

        const data = await experienceService.getById(
          parseInt(id),
          controller.signal
        );
        setExperience(data);
      } catch (err) {
        if (err instanceof ApiException) {
          if (err.status === 404) {
            setError('Expérience non trouvée');
          } else {
            setError(err.message);
          }
        } else {
          setError("Erreur lors du chargement de l'expérience");
        }
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }

      return () => controller.abort();
    };

    loadExperience();
  }, [id]);

  const handleSubmit = async (data: UpdateExperienceDto) => {
    if (!experience) return;

    setIsSubmitting(true);

    try {
      await experienceService.update(experience.id, data);
      navigate('/experiences');
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message);
      } else {
        setError('Erreur lors de la mise à jour');
      }
      console.error('Erreur lors de la mise à jour:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/experiences');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de l'expérience...</p>
        </div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Erreur</h1>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  ← Retour à la liste
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white shadow rounded-lg p-8">
              <div className="text-red-600 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {error || 'Expérience non trouvée'}
              </h2>
              <p className="text-gray-600 mb-6">
                L'expérience demandée n'existe pas ou n'a pas pu être chargée.
              </p>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Retour à la liste
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* En-tête */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Modifier l'expérience
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  {experience.name} chez {experience.company}
                </p>
              </div>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                disabled={isSubmitting}
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
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Informations de l'expérience
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Modifiez les informations ci-dessous pour mettre à jour cette
                expérience professionnelle.
              </p>
            </div>

            <ExperienceForm
              initialData={experience}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
