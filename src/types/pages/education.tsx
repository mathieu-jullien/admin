import type { TableColumn } from '../ui/table/TableColumn';

export interface Education {
  id: number;
  name: string;
  school: string;
  link?: string;
  location?: string;
  description?: string;
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
    render: (value: string) => <span className="line-clamp-2">{value}</span>,
  },
  {
    key: 'link',
    header: 'Lien',
    sortable: true,
    render: (value: string) => <span className="line-clamp-2">{value}</span>,
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
    render: (value: string) => new Date(value).toLocaleDateString('fr-FR'),
    sortable: true,
  },
  {
    key: 'dateCreated',
    header: 'Date de création',
    render: (value: string) => new Date(value).toLocaleDateString('fr-FR'),
    sortable: true,
  },
];
