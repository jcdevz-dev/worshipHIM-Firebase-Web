// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';
import { StyledChart } from './components/chart';

import Auth from './context/auth';
// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeProvider>
      <Auth>
        <ScrollToTop />
        <StyledChart />
        <Router />
      </Auth>
    </ThemeProvider>
  );
}
