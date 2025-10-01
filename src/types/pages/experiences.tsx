import type { TableColumn } from '../ui/table/TableColumn';
import type { Skill } from './skills';

export type { Skill } from './skills';

export interface Experience {
  id: number;
  name: string;
  company: string;
  location?: string;
  description: string;
  skills: Skill[];
  dateStart: string;
  dateEnd: string;
  dateCreated: string;
  dateUpdated: string;
}

export const experienceColumns: TableColumn<Experience>[] = [
  {
    key: 'name',
    header: 'Nom',
    sortable: true,
  },
  {
    key: 'company',
    header: 'Entreprise',
    sortable: true,
  },
  {
    key: 'location',
    header: 'Lieu',
    sortable: true,
  },
  {
    key: 'description',
    header: 'Description',
    sortable: true,
    render: (value: string) => <span className="line-clamp-2">{value}</span>,
  },
  {
    key: 'skills',
    header: 'Compétences',
    render: (value: Skill[]) =>
      value?.map(skill => skill.name).join(', ') || '',
  },
  {
    key: 'dateStart',
    header: 'Date de début',
    render: (value: string) => new Date(value).toLocaleDateString('fr-FR'),
    sortable: true,
  },
  {
    key: 'dateEnd',
    header: 'Date de fin',
    render: (value: string) =>
      value ? new Date(value).toLocaleDateString('fr-FR') : '-',
    sortable: true,
  },
  {
    key: 'dateCreated',
    header: 'Date de création',
    render: (value: string) => new Date(value).toLocaleDateString('fr-FR'),
    sortable: true,
  },
  {
    key: 'dateUpdated',
    header: 'Date de Modification',
    render: (value: string) => new Date(value).toLocaleDateString('fr-FR'),
    sortable: true,
  },
];
