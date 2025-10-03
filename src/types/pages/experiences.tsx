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
    render: value => (
      <span className="line-clamp-2">{String(value || '')}</span>
    ),
  },
  {
    key: 'skills',
    header: 'Compétences',
    render: value =>
      Array.isArray(value) ? value.map(skill => skill.name).join(', ') : '',
  },
  {
    key: 'dateStart',
    header: 'Date de début',
    render: value =>
      value ? new Date(value as string).toLocaleDateString('fr-FR') : '',
    sortable: true,
  },
  {
    key: 'dateEnd',
    header: 'Date de fin',
    render: value =>
      value ? new Date(value as string).toLocaleDateString('fr-FR') : '-',
    sortable: true,
  },
  {
    key: 'dateCreated',
    header: 'Date de création',
    render: value =>
      value ? new Date(value as string).toLocaleDateString('fr-FR') : '',
    sortable: true,
  },
  {
    key: 'dateUpdated',
    header: 'Date de Modification',
    render: value =>
      value ? new Date(value as string).toLocaleDateString('fr-FR') : '',
    sortable: true,
  },
];
