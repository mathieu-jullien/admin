import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/ui/Table/Table';
import { experienceColumns } from '../../types/pages/experiences.tsx';
import type { Experience } from '../../types/pages/experiences.tsx';
import { experienceService } from '../../services/experiences';
import { ApiException } from '../../types/api/errors';
import { showSuccess, showError } from '../../utils/toast';

export default function List() {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentPage = 1;
  const pageSize = 10;

  useEffect(() => {
    const loadExperiences = async () => {
      const controller = new AbortController();

      try {
        setLoading(true);
        setError(null);

        const response = await experienceService.getAll(
          {
            page: currentPage,
            limit: pageSize,
          },
          controller.signal
        );

        setExperiences(response.member);
      } catch (err) {
        if (err instanceof ApiException) {
          setError(err.message);
        } else {
          setError('Erreur lors du chargement des expériences');
        }
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }

      return () => controller.abort();
    };

    loadExperiences();
  }, [currentPage]);

  const handleCreate = () => {
    navigate('/experiences/create');
  };

  const handleEdit = (experience: Experience) => {
    navigate(`/experiences/${experience.id}/edit`);
  };

  const handleDelete = async (experience: Experience) => {
    try {
      await experienceService.delete(experience.id);
      showSuccess(
        `L'expérience "${experience.name}" a été supprimée avec succès`
      );

      // Reload experiences list
      const controller = new AbortController();
      const response = await experienceService.getAll(
        {
          page: currentPage,
          limit: pageSize,
        },
        controller.signal
      );
      setExperiences(response.member);
    } catch (err) {
      if (err instanceof ApiException) {
        showError(err.message);
      } else {
        showError("Erreur lors de la suppression de l'expérience");
      }
      console.error('Erreur:', err);
      throw err; // Re-throw to let Table component handle loading state
    }
  };

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <button
        onClick={handleCreate}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Ajouter une expérience
      </button>
      <Table
        data={experiences}
        columns={experienceColumns}
        title="Liste des expériences"
        pagination
        pageSize={pageSize}
        loading={loading}
        actions={{
          onEdit: handleEdit,
          onDelete: handleDelete,
          editLabel: 'Éditer',
          deleteLabel: 'Supprimer',
          deleteConfirmTitle: "Supprimer l'expérience",
          deleteConfirmMessage: exp =>
            `Êtes-vous sûr de vouloir supprimer l'expérience "${exp.name}" ?`,
        }}
      />
    </div>
  );
}
