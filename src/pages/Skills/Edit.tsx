import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SkillForm from './components/SkillForm';
import type { Skill } from '../../types/pages/skills';
import { skillService } from '../../services/skills';
import { ApiException } from '../../types/api/errors';

export default function Edit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSkill = async () => {
      if (!id) {
        setError('ID de compétence manquant');
        setLoading(false);
        return;
      }

      const controller = new AbortController();

      try {
        setLoading(true);
        setError(null);

        const data = await skillService.getById(
          parseInt(id),
          controller.signal
        );
        setSkill(data);
      } catch (err) {
        if (err instanceof ApiException) {
          if (err.status === 404) {
            setError('Compétence non trouvée');
          } else {
            setError(err.message);
          }
        } else {
          setError('Erreur lors du chargement de la compétence');
        }
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }

      return () => controller.abort();
    };

    loadSkill();
  }, [id]);

  const handleSubmit = async (
    data: Omit<Skill, 'id' | 'dateCreated' | 'dateUpdated'>
  ) => {
    if (!skill) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await skillService.update(skill.id, data);
      navigate('/skills');
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message);
      } else {
        setError('Erreur lors de la mise � jour');
      }
      console.error('Erreur lors de la mise � jour:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/skills');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !skill) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error || 'Compétence non trouvée'}
          </div>
          <button
            onClick={handleCancel}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            ← Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                Modifier la compétence
              </h1>
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
                Informations de la compétence
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Modifiez les informations de la compétence.
              </p>
            </div>

            <SkillForm
              initialData={skill}
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
