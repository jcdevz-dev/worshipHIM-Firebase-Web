// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';

import Auth from './context/auth';
// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeProvider>
      <Auth>
        <ScrollToTop />
        <Router />
      </Auth>
    </ThemeProvider>
  );
}
