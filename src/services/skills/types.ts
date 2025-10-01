import type { Skill } from '../../types/pages/skills';

export type CreateSkillDto = Omit<Skill, 'id' | 'dateCreated' | 'dateUpdated'>;

export type UpdateSkillDto = Omit<Skill, 'id' | 'dateCreated' | 'dateUpdated'>;

export type PatchSkillDto = Partial<UpdateSkillDto>;
