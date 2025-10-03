import { useEffect, useState } from 'react';
import SkillSelector from '../../../components/ui/SkillSelector';
import { skillService } from '../../../services/skills/skillService';
import type { Experience, Skill } from '../../../types/pages/experiences';
import type { CreateExperienceDto } from '../../../services/experiences/types';
import { formatDateForInput } from '../../../utils/date';

interface ExperienceFormProps {
  initialData?: Partial<Experience>;
  onSubmit: (data: CreateExperienceDto) => void;
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
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);

  useEffect(() => {
    const loadSkills = async () => {
      setIsLoadingSkills(true);
      try {
        const response = await skillService.getAll({ page: 1, limit: 1000 });
        setAvailableSkills(response.member);
      } catch (error) {
        console.error('Erreur chargement skills:', error);
      } finally {
        setIsLoadingSkills(false);
      }
    };
    loadSkills();
  }, []);

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

  const createNewSkills = async (skills: Skill[]): Promise<string[]> => {
    const newSkills = skills.filter(s => s.id > 1000000000); // IDs temporaires
    const existingSkills = skills.filter(s => s.id < 1000000000);

    const createdSkills = await Promise.all(
      newSkills.map(skill =>
        skillService.create({
          name: skill.name,
          inProfile: skill.inProfile,
          soft: skill.soft,
        })
      )
    );

    const allSkills = [...existingSkills, ...createdSkills];
    return allSkills.map(skill => `/api/skills/${skill.id}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const skills = await createNewSkills(formData.skills);
        onSubmit({ ...formData, skills });
      } catch (error) {
        console.error('Erreur création skills:', error);
      }
    }
  };

  const handleChange = (field: string, value: string | Skill[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur si elle existe
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
        <div className="grid grid-cols-2 gap-4">
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
          <SkillSelector
            selectedSkills={formData.skills}
            availableSkills={availableSkills}
            onSkillsChange={skills => handleChange('skills', skills)}
            disabled={isLoading || isLoadingSkills}
          />
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
