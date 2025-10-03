import { useState } from 'react';
import type { Skill } from '../../types/pages/skills';

interface SkillSelectorProps {
  selectedSkills: Skill[];
  availableSkills: Skill[];
  onSkillsChange: (skills: Skill[]) => void;
  disabled?: boolean;
}

export default function SkillSelector({
  selectedSkills,
  availableSkills,
  onSkillsChange,
  disabled = false,
}: SkillSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredSkills = (availableSkills || []).filter(
    skill =>
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !(selectedSkills || []).some(selected => selected.id === skill.id)
  );

  const addSkill = (skill: Skill) => {
    onSkillsChange([...(selectedSkills || []), skill]);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const removeSkill = (skillId: number) => {
    onSkillsChange(
      (selectedSkills || []).filter(skill => skill.id !== skillId)
    );
  };

  const createNewSkill = () => {
    if (!searchTerm.trim()) return;

    const newSkill: Skill = {
      id: Date.now(), // ID temporaire
      name: searchTerm.trim(),
      inProfile: false,
      soft: false,
      dateCreated: new Date().toISOString().split('T')[0],
      dateUpdated: new Date().toISOString().split('T')[0],
    };

    onSkillsChange([...(selectedSkills || []), newSkill]);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setShowDropdown(true);
  };

  const handleSearchFocus = () => {
    setShowDropdown(true);
  };

  const handleSearchBlur = () => {
    // Délai pour permettre le clic sur les options
    setTimeout(() => setShowDropdown(false), 200);
  };

  return (
    <div className="space-y-4">
      {/* Compétences sélectionnées */}
      {(selectedSkills || []).length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Compétences sélectionnées
          </h4>
          <div className="flex flex-wrap gap-2">
            {(selectedSkills || []).map(skill => (
              <span
                key={skill.id}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {skill.name}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeSkill(skill.id)}
                    className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                    aria-label={`Retirer ${skill.name}`}
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recherche et ajout */}
      {!disabled && (
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ajouter une compétence
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher ou créer une compétence..."
              value={searchTerm}
              onChange={e => handleSearchChange(e.target.value)}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={disabled}
            />

            {/* Icône de recherche */}
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Dropdown avec suggestions */}
          {showDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {/* Compétences filtrées */}
              {filteredSkills.length > 0 ? (
                <div>
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide bg-gray-50">
                    {searchTerm.trim()
                      ? 'Résultats'
                      : 'Compétences disponibles'}
                  </div>
                  {filteredSkills.map(skill => (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => addSkill(skill)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    >
                      <div className="flex items-center justify-between">
                        <span>{skill.name}</span>
                        <span className="text-xs text-gray-400">Existante</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : searchTerm.trim() ? (
                /* Aucun résultat trouvé - proposer de créer */
                <div>
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide bg-gray-50">
                    Aucun résultat
                  </div>
                  <button
                    type="button"
                    onClick={createNewSkill}
                    className="w-full text-left px-3 py-2 hover:bg-green-50 focus:bg-green-50 focus:outline-none"
                  >
                    <div className="flex items-center justify-between">
                      <span>Créer "{searchTerm}"</span>
                      <span className="text-xs text-green-600">Nouvelle</span>
                    </div>
                  </button>
                </div>
              ) : (
                /* Champ vide */
                <div className="px-3 py-4 text-center text-gray-500 text-sm">
                  {(availableSkills || []).length === 0
                    ? 'Aucune compétence disponible'
                    : 'Commencez à taper pour rechercher'}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Message d'état vide */}
      {(selectedSkills || []).length === 0 && disabled && (
        <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
          <p className="text-gray-500 text-sm text-center">
            Aucune compétence sélectionnée
          </p>
        </div>
      )}
    </div>
  );
}
