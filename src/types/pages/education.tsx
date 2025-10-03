import type { TableColumn } from '../ui/table/TableColumn';
import type { Skill } from './skills';

export type { Skill } from './skills';

export interface Education {
  id: number;
  name: string;
  school: string;
  link?: string;
  location?: string;
  description?: string;
  skills: Skill[];
  dateStart: string;
  dateEnd: string;
  dateCreated: string;
  dateUpdated: string;
}

export const educationColumns: TableColumn<Education>[] = [
  {
    key: 'name',
    header: 'Nom',
    sortable: true,
  },
  {
    key: 'school',
    header: 'Ecole',
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
    key: 'link',
    header: 'Lien',
    sortable: true,
    render: value => (
      <span className="line-clamp-2">{String(value || '')}</span>
    ),
  },
  {
    key: 'skills',
    header: 'Compétences',
    render: value => {
      if (Array.isArray(value)) {
        return value.map(skill => skill.name).join(', ');
      }
      return '';
    },
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
      value ? new Date(value as string).toLocaleDateString('fr-FR') : '',
    sortable: true,
  },
  {
    key: 'dateCreated',
    header: 'Date de création',
    render: value =>
      value ? new Date(value as string).toLocaleDateString('fr-FR') : '',
    sortable: true,
  },
];
