import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout/Layout';
import Home from '../pages/Home/Home';
import ExperienceList from '../pages/Experience/List';
import ExperienceCreate from '../pages/Experience/Create';
import ExperienceEdit from '../pages/Experience/Edit';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout headerTitle="" />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'experiences',
        children: [
          {
            index: true,
            element: <ExperienceList />,
          },
          {
            path: 'create',
            element: <ExperienceCreate />,
          },
          {
            path: ':id/edit',
            element: <ExperienceEdit />,
          },
        ],
      },
    ],
  },
]);
