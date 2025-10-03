import { useEffect, useState } from 'react';
import SkillSelector from '../../../components/ui/SkillSelector';
import { skillService } from '../../../services/skills/skillService';
import type { Education, Skill } from '../../../types/pages/education';
import type { CreateEducationDto } from '../../../services/education/types';
import { formatDateForInput } from '../../../utils/date';

interface EducationFormProps {
  initialData?: Partial<Education>;
  onSubmit: (data: CreateEducationDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function EducationForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: EducationFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    school: initialData?.school || '',
    link: initialData?.link || '',
    location: initialData?.location || '',
    description: initialData?.description || '',
    skills: initialData?.skills || [],
    dateStart: formatDateForInput(initialData?.dateStart) || '',
    dateEnd: formatDateForInput(initialData?.dateEnd) || '',
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

    if (!formData.school.trim()) newErrors.school = "L'école est requise";
    if (!formData.dateStart)
      newErrors.dateStart = 'La date de début est requise';
    if (!formData.dateEnd) newErrors.dateEnd = 'La date de fin est requise';

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
        {/* École */}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              École / Institution *
            </label>
            <input
              type="text"
              value={formData.school}
              onChange={e => handleChange('school', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.school ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Université de Paris"
              disabled={isLoading}
            />
            {errors.school && (
              <p className="mt-1 text-sm text-red-600">{errors.school}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diplôme
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Doctorat informatique quantique"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
        </div>

        {/* Lien et Lieu */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lien
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={e => handleChange('link', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: https://www.ecole.fr"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lieu
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={e => handleChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Paris, France"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={e => handleChange('description', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez votre parcours, projets, spécialisation..."
            disabled={isLoading}
          />
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
              Date de fin *
            </label>
            <input
              type="date"
              value={formData.dateEnd}
              onChange={e => handleChange('dateEnd', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.dateEnd ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.dateEnd && (
              <p className="mt-1 text-sm text-red-600">{errors.dateEnd}</p>
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
