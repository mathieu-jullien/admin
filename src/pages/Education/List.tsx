import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/ui/Table/Table';
import { educationColumns } from '../../types/pages/education';
import type { Education } from '../../types/pages/education';
import { educationService } from '../../services/education';
import { ApiException } from '../../types/api/errors';

export default function List() {
  const navigate = useNavigate();
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentPage = 1;
  const pageSize = 10;

  useEffect(() => {
    const loadEducations = async () => {
      const controller = new AbortController();

      try {
        setLoading(true);
        setError(null);

        const response = await educationService.getAll(
          {
            page: currentPage,
            limit: pageSize,
          },
          controller.signal
        );

        setEducations(response.member);
      } catch (err) {
        if (err instanceof ApiException) {
          setError(err.message);
        } else {
          setError('Erreur lors du chargement des formations');
        }
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }

      return () => controller.abort();
    };

    loadEducations();
  }, [currentPage]);

  const handleCreate = () => {
    navigate('/formations/create');
  };

  const handleEdit = (id: number) => {
    navigate(`/formations/${id}/edit`);
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
        Ajouter une formation
      </button>
      <Table
        data={educations}
        columns={educationColumns}
        title="Liste des formations"
        pagination
        pageSize={pageSize}
        onRowClick={education => handleEdit(education.id)}
        loading={loading}
      />
    </div>
  );
}
