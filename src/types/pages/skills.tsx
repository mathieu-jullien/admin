import type { TableColumn } from '../ui/table/TableColumn';

export interface Skill {
  id: number;
  name: string;
  dateCreated: string;
  dateUpdated: string;
}

export const skillColumns: TableColumn<Skill>[] = [
  {
    key: 'name',
    header: 'Nom',
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
    header: 'Date de modification',
    render: (value: string) => new Date(value).toLocaleDateString('fr-FR'),
    sortable: true,
  },
];
