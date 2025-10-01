import { useState } from 'react';
import type { Skill } from '../../../types/pages/skills';

interface SkillFormProps {
  initialData?: Partial<Skill>;
  onSubmit: (data: Omit<Skill, 'id' | 'dateCreated' | 'dateUpdated'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function SkillForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: SkillFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (value: string) => {
    setFormData({ name: value });
    if (errors.name) {
      setErrors({});
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom de la compétence */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom de la compétence *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={e => handleChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ex: React, TypeScript, Node.js..."
            disabled={isLoading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={isLoading}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}
