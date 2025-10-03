import type { Experience } from '../../types/pages/experiences';

export type CreateExperienceDto = Omit<
  Experience,
  'id' | 'dateCreated' | 'dateUpdated' | 'skills'
> & {
  skills: string[]; // IRIs
};

export type UpdateExperienceDto = Omit<
  Experience,
  'id' | 'dateCreated' | 'dateUpdated' | 'skills'
> & {
  skills: string[]; // IRIs
};

export type PatchExperienceDto = Partial<UpdateExperienceDto>;
