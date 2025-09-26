import Table from '../../components/ui/Table/Table';
import { experienceColumns } from '../../types/pages/experiences.tsx';
import type { Experience } from '../../types/pages/experiences.tsx';

const experiences: Experience[] = [
  {
    id: 1,
    name: 'Développeur Full Stack',
    company: 'Google',
    location: 'Paris',
    description: 'Développement d\'une application web',
    skills: [
      {
        id: 1,
        name: 'React',
        createdDate: '2021-01-01',
        updatedDate: '2021-12-31',
      },
      {
        id: 2,
        name: 'PHP',
        createdDate: '2021-01-01',
        updatedDate: '2021-12-31',
      }
    ],
    startDate: '2021-01-01',
    endDate: '2021-12-31',
    createdDate: '2021-01-01',
    updatedDate: '2021-12-31',
  },
  {
    id: 2,
    name: 'Lead Développeur',
    company: 'Google',
    location: 'Paris',
    description: 'Développement d\'une application web',
    skills: [
      {
        id: 1,
        name: 'Symfony',
        createdDate: '2021-01-01',
        updatedDate: '2021-12-31',
      },
      {
        id: 2,
        name: 'PHP',
        createdDate: '2021-01-01',
        updatedDate: '2021-12-31',
      }
    ],
    startDate: '2021-01-01',
    endDate: '2021-12-31',
    createdDate: '2021-01-01',
    updatedDate: '2021-12-31',
  }
]

export default function List() {
  return (
    <Table
      data={experiences}
      columns={experienceColumns}
      title='Liste des expériences'
      pagination
      pageSize={1}
    />
  );
}
