import { useState } from 'react';
import type { Experience, Skill } from '../../../types/pages/experiences';
import { formatDateForInput } from '../../../utils/date';

interface ExperienceFormProps {
  initialData?: Partial<Experience>;
  onSubmit: (
    data: Omit<Experience, 'id' | 'dateCreated' | 'dateUpdated'>
  ) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ExperienceForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: ExperienceFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    company: initialData?.company || '',
    location: initialData?.location || '',
    description: initialData?.description || '',
    dateStart: formatDateForInput(initialData?.dateStart) || '',
    dateEnd: formatDateForInput(initialData?.dateEnd) || '',
    skills: initialData?.skills || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.company.trim())
      newErrors.company = "L'entreprise est requise";
    if (!formData.description.trim())
      newErrors.description = 'La description est requise';
    if (!formData.dateStart)
      newErrors.dateStart = 'La date de début est requise';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: string, value: string | Skill[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur si elle existe
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now(),
      name: 'Nouvelle compétence',
      dateCreated: new Date().toISOString().split('T')[0],
      dateUpdated: new Date().toISOString().split('T')[0],
    };
    handleChange('skills', [...formData.skills, newSkill]);
  };

  const updateSkill = (index: number, name: string) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index] = {
      ...updatedSkills[index],
      name,
      dateUpdated: new Date().toISOString().split('T')[0],
    };
    handleChange('skills', updatedSkills);
  };

  const removeSkill = (index: number) => {
    const updatedSkills = formData.skills.filter((_, i) => i !== index);
    handleChange('skills', updatedSkills);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom du poste */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom du poste *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={e => handleChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ex: Développeur Full Stack"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Entreprise */}
        <div  className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Entreprise *
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={e => handleChange('company', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.company ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ex: Google"
            disabled={isLoading}
          />
          {errors.company && (
            <p className="mt-1 text-sm text-red-600">{errors.company}</p>
          )}
        </div>

        {/* Lieu */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lieu
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={e => handleChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Paris"
            disabled={isLoading}
          />
        </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={e => handleChange('description', e.target.value)}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Décrivez vos missions et responsabilités..."
            disabled={isLoading}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de début *
            </label>
            <input
              type="date"
              value={formData.dateStart}
              onChange={e => handleChange('dateStart', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.dateStart ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.dateStart && (
              <p className="mt-1 text-sm text-red-600">{errors.dateStart}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de fin
            </label>
            <input
              type="date"
              value={formData.dateEnd}
              onChange={e => handleChange('dateEnd', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Compétences */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Compétences
            </label>
            <button
              type="button"
              onClick={addSkill}
              disabled={isLoading}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Ajouter
            </button>
          </div>

          <div className="space-y-2">
            {formData.skills.map((skill, index) => (
              <div key={skill.id} className="flex gap-2">
                <input
                  type="text"
                  value={skill.name}
                  onChange={e => updateSkill(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nom de la compétence"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  disabled={isLoading}
                  className="px-3 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 disabled:opacity-50"
                >
                  Supprimer
                </button>
              </div>
            ))}

            {formData.skills.length === 0 && (
              <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
                <p className="text-gray-500 text-sm text-center">
                  Aucune compétence ajoutée
                </p>
              </div>
            )}
          </div>
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
