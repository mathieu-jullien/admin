import type { Education } from '../../types/pages/education';

export type CreateEducationDto = Omit<
  Education,
  'id' | 'dateCreated' | 'dateUpdated' | 'skills'
> & {
  skills: string[]; // IRIs
};

export type UpdateEducationDto = Omit<
  Education,
  'id' | 'dateCreated' | 'dateUpdated' | 'skills'
> & {
  skills: string[]; // IRIs
};

export type PatchEducationDto = Partial<UpdateEducationDto>;
