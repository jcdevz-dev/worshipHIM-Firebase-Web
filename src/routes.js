import { useContext } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import { UserContext } from './context/auth';

// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import ArtistsPage from './pages/ArtistsPage';
import SongsPage from './pages/SongsPage';
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';

// ----------------------------------------------------------------------

export default function Router() {

  const userAuth = useContext(UserContext);  


  const routes = useRoutes([
    {
      path: '/dashboard',
      element: userAuth.valid ?<DashboardLayout /> : <Navigate to="/login" replace />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'artists', element: <ArtistsPage /> },
        { path: 'songs', element: <SongsPage /> },
        { path: 'hymns', element: <SongsPage /> },
        // { path: 'user', element: <UserPage /> },
        // { path: 'products', element: <ProductsPage /> },
        // { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: 'login',
      element: userAuth.valid ? <Navigate to="/dashboard/app" replace /> : <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
