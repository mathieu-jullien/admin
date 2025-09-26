import type { TableColumn } from '../ui/table/TableColumn';
import type { Skill } from './skills';

export interface Experience {
  id: number;
  name: string;
  company: string;
  location?: string;
  description: string;
  skills: Skill[];
  startDate: string;
  endDate: string;
  createdDate: string;
  updatedDate: string;
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
  },
  {
    key: 'skills',
    header: 'Compétences',
    render: value => value.map(skill => skill.name).join(', '),
  },
  {
    key: 'startDate',
    header: 'Date de début',
    render: value => new Date(value).toLocaleDateString('fr-FR'),
    sortable: true,
  },
  {
    key: 'endDate',
    header: 'Date de fin',
    render: value => new Date(value).toLocaleDateString('fr-FR'),
    sortable: true,
  },
  {
    key: 'createdDate',
    header: 'Date de création',
    render: value => new Date(value).toLocaleDateString('fr-FR'),
    sortable: true,
  },
  {
    key: 'updatedDate',
    header: 'Date de Modification',
    render: value => new Date(value).toLocaleDateString('fr-FR'),
    sortable: true,
  },
];