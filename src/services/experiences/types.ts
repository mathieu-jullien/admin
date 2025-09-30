import type { Experience } from '../../types/pages/experiences';

export type CreateExperienceDto = Omit<
  Experience,
  'id' | 'dateCreated' | 'dateUpdated'
>;

export type UpdateExperienceDto = Omit<
  Experience,
  'id' | 'dateCreated' | 'dateUpdated'
>;

export type PatchExperienceDto = Partial<UpdateExperienceDto>;
