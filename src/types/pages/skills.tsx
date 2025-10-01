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
    render: (value: boolean) => (value ? 'Oui ✅' : 'Non ❌'),
  },
  {
    key: 'soft',
    header: 'Soft Skill',
    render: (value: boolean) => (value ? 'Oui ✅' : 'Non ❌'),
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
