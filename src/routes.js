import { useContext, useEffect, useState } from 'react';
import { Navigate, useRoutes, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const [loading, setloading] = useState(!userAuth.valid)

  useEffect(() => {
    setloading(!userAuth.valid)
    setTimeout(() => {
      if(userAuth.name===""){
        navigate('/login', { replace: true });
      }
    }, 500);
  }, [userAuth.valid, userAuth.name])
  

  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout loading={loading} />,
      children: [
        // { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'artists',element: <ArtistsPage />},
        { path: 'artists/:filter/:type', element: <SongsPage /> },
        { path: 'songs', element: <SongsPage /> },
        { path: 'songs/:filter/:type', element: <SongsPage /> },
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
