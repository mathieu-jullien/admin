import type { Education } from '../../types/pages/education';

export type CreateEducationDto = Omit<
  Education,
  'id' | 'dateCreated' | 'dateUpdated'
>;

export type UpdateEducationDto = Omit<
  Education,
  'id' | 'dateCreated' | 'dateUpdated'
>;

export type PatchEducationDto = Partial<UpdateEducationDto>;
