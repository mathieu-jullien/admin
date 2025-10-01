import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/ui/Table/Table';
import { skillColumns } from '../../types/pages/skills';
import type { Skill } from '../../types/pages/skills';
import { skillService } from '../../services/skills';
import { ApiException } from '../../types/api/errors';
import { showSuccess, showError } from '../../utils/toast';

export default function List() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentPage = 1;
  const pageSize = 10;

  useEffect(() => {
    const loadSkills = async () => {
      const controller = new AbortController();

      try {
        setLoading(true);
        setError(null);

        const response = await skillService.getAll(
          {
            page: currentPage,
            limit: pageSize,
          },
          controller.signal
        );

        setSkills(response.member);
      } catch (err) {
        if (err instanceof ApiException) {
          setError(err.message);
        } else {
          setError('Erreur lors du chargement des compétences');
        }
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }

      return () => controller.abort();
    };

    loadSkills();
  }, [currentPage]);

  const handleCreate = () => {
    navigate('/skills/create');
  };

  const handleEdit = (skill: Skill) => {
    navigate(`/skills/${skill.id}/edit`);
  };

  const handleDelete = async (skill: Skill) => {
    try {
      await skillService.delete(skill.id);
      showSuccess(`La compétence "${skill.name}" a été supprimée avec succès`);

      // Reload skills list
      const controller = new AbortController();
      const response = await skillService.getAll(
        {
          page: currentPage,
          limit: pageSize,
        },
        controller.signal
      );
      setSkills(response.member);
    } catch (err) {
      if (err instanceof ApiException) {
        showError(err.message);
      } else {
        showError('Erreur lors de la suppression de la compétence');
      }
      console.error('Erreur:', err);
      throw err;
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
        Ajouter une compétence
      </button>
      <Table
        data={skills}
        columns={skillColumns}
        title="Liste des compétences"
        pagination
        pageSize={pageSize}
        loading={loading}
        actions={{
          onEdit: handleEdit,
          onDelete: handleDelete,
          editLabel: 'Éditer',
          deleteLabel: 'Supprimer',
          deleteConfirmTitle: 'Supprimer la compétence',
          deleteConfirmMessage: skill =>
            `Êtes-vous sûr de vouloir supprimer la compétence "${skill.name}" ?`,
        }}
      />
    </div>
  );
}
