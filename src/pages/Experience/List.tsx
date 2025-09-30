import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/ui/Table/Table';
import { experienceColumns } from '../../types/pages/experiences.tsx';
import type { Experience } from '../../types/pages/experiences.tsx';
import { experienceService } from '../../services/experiences';
import { ApiException } from '../../types/api/errors';

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

  const handleEdit = (id: number) => {
    navigate(`/experiences/${id}/edit`);
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
      <button onClick={handleCreate}>Créer une expérience</button>
      <Table
        data={experiences}
        columns={experienceColumns}
        title="Liste des expériences"
        pagination
        pageSize={pageSize}
        onRowClick={experience => handleEdit(experience.id)}
        loading={loading}
      />
    </div>
  );
}
