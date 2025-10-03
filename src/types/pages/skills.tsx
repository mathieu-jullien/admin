import type { TableColumn } from '../ui/table/TableColumn';

export interface Skill {
  id: number;
  name: string;
  inProfile: boolean;
  soft: boolean;
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
    key: 'inProfile',
    header: 'Dans le profil',
    render: value => (value ? 'Oui ✅' : 'Non ❌'),
  },
  {
    key: 'soft',
    header: 'Soft Skill',
    render: value => (value ? 'Oui ✅' : 'Non ❌'),
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
    header: 'Date de modification',
    render: value =>
      value ? new Date(value as string).toLocaleDateString('fr-FR') : '',
    sortable: true,
  },
];
