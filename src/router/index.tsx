import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout/Layout';
import Home from '../pages/Home/Home';
import Dashboard from '../pages/Dashboard';
import ExperienceList from '../pages/Experience/List';
import ExperienceCreate from '../pages/Experience/Create';
import ExperienceEdit from '../pages/Experience/Edit';
import SkillList from '../pages/Skills/List';
import SkillCreate from '../pages/Skills/Create';
import SkillEdit from '../pages/Skills/Edit';
import EducationList from '../pages/Education/List';
import EducationCreate from '../pages/Education/Create';
import EducationEdit from '../pages/Education/Edit';
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
        path: 'dashboard',
        element: <Dashboard />,
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
      {
        path: 'skills',
        children: [
          {
            index: true,
            element: <SkillList />,
          },
          {
            path: 'create',
            element: <SkillCreate />,
          },
          {
            path: ':id/edit',
            element: <SkillEdit />,
          },
        ],
      },
      {
        path: 'formations',
        children: [
          {
            index: true,
            element: <EducationList />,
          },
          {
            path: 'create',
            element: <EducationCreate />,
          },
          {
            path: ':id/edit',
            element: <EducationEdit />,
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
