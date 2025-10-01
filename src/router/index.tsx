import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout/Layout';
import Home from '../pages/Home/Home';
import ExperienceList from '../pages/Experience/List';
import ExperienceCreate from '../pages/Experience/Create';
import ExperienceEdit from '../pages/Experience/Edit';
import Login from '../pages/Auth/Login';
import NotFound from '../pages/Error/NotFound';
import ProtectedRoute from '../components/auth/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout headerTitle="" />
      </ProtectedRoute>
    ),
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
  {
    path: '/auth',
    element: <Login />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
