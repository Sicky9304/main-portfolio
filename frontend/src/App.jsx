import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SmoothScrollProvider } from './components/layout/SmoothScroll';
import { router } from './routes/Routes';

/**
 * App Root component
 * Sets up global contexts (Theme, Smooth Scroll) and mounts the production-level
 * centralized RouterProvider to orchestrate navigation and AppLayout shells.
 */
function App() {
  return (
    <ThemeProvider>
      <SmoothScrollProvider>
        <RouterProvider router={router} />
      </SmoothScrollProvider>
    </ThemeProvider>
  );
}

export default App;