import { createContext, useState, useEffect, useContext } from 'react';

export const gradientThemes = {
  emerald: {
    primary: '#10B981', primaryLight: '#34D399', primaryDark: '#047857', primaryRgb: '16, 185, 129',
    secondary: '#06B6D4', secondaryLight: '#22D3EE', secondaryDark: '#0891B2', secondaryRgb: '6, 182, 212',
    accent: '#6366F1', accentLight: '#818CF8', accentDark: '#4F46E5',
    bgLight: 'linear-gradient(135deg, #f0fdf4 0%, #e2e8f0 100%)',
    bgDark: 'linear-gradient(135deg, #030712 0%, #064e3b 100%)',
    name: 'Emerald Aurora'
  },
  hyperdrive: {
    primary: '#7C3AED', primaryLight: '#A78BFA', primaryDark: '#5B21B6', primaryRgb: '124, 58, 237',
    secondary: '#EC4899', secondaryLight: '#F472B6', secondaryDark: '#BE185D', secondaryRgb: '236, 72, 153',
    accent: '#3B82F6', accentLight: '#60A5FA', accentDark: '#1D4ED8',
    bgLight: 'linear-gradient(135deg, #faf5ff 0%, #cbd5e1 100%)',
    bgDark: 'linear-gradient(135deg, #030712 0%, #2e1065 100%)',
    name: 'Hyperdrive Purple'
  },
  gold: {
    primary: '#F59E0B', primaryLight: '#FBBF24', primaryDark: '#D97706', primaryRgb: '245, 158, 11',
    secondary: '#EF4444', secondaryLight: '#F87171', secondaryDark: '#B91C1C', secondaryRgb: '239, 68, 68',
    accent: '#10B981', accentLight: '#34D399', accentDark: '#047857',
    bgLight: 'linear-gradient(135deg, #fffbeb 0%, #f1f5f9 100%)',
    bgDark: 'linear-gradient(135deg, #030712 0%, #451a03 100%)',
    name: 'Cyberpunk Gold'
  },
  sunset: {
    primary: '#FF007F', primaryLight: '#FF5EAE', primaryDark: '#9B004F', primaryRgb: '255, 0, 127',
    secondary: '#FF5722', secondaryLight: '#FF8A65', secondaryDark: '#C41C00', secondaryRgb: '255, 87, 34',
    accent: '#E91E63', accentLight: '#F06292', accentDark: '#880E4F',
    bgLight: 'linear-gradient(135deg, #fff5f5 0%, #eef2f6 100%)',
    bgDark: 'linear-gradient(135deg, #030712 0%, #500028 100%)',
    name: 'Neon Sunset'
  },
  frost: {
    primary: '#0EA5E9', primaryLight: '#38BDF8', primaryDark: '#0369A1', primaryRgb: '14, 165, 233',
    secondary: '#14B8A6', secondaryLight: '#2DD4BF', secondaryDark: '#0F766E', secondaryRgb: '20, 184, 166',
    accent: '#6366F1', accentLight: '#818CF8', accentDark: '#4F46E5',
    bgLight: 'linear-gradient(135deg, #f0f9ff 0%, #e2e8f0 100%)',
    bgDark: 'linear-gradient(135deg, #030712 0%, #0c4a6e 100%)',
    name: 'Arctic Frost'
  },
  toxic: {
    primary: '#84CC16', primaryLight: '#A3E635', primaryDark: '#4D7C0F', primaryRgb: '132, 204, 22',
    secondary: '#06B6D4', secondaryLight: '#22D3EE', secondaryDark: '#0891B2', secondaryRgb: '6, 182, 212',
    accent: '#EAB308', accentLight: '#FACC15', accentDark: '#A16207',
    bgLight: 'linear-gradient(135deg, #f7fee7 0%, #f1f5f9 100%)',
    bgDark: 'linear-gradient(135deg, #030712 0%, #1e3a1e 100%)',
    name: 'Toxic Waste'
  },
  volcanic: {
    primary: '#DC2626', primaryLight: '#F87171', primaryDark: '#991B1B', primaryRgb: '220, 38, 38',
    secondary: '#EA580C', secondaryLight: '#FB923C', secondaryDark: '#9A3412', secondaryRgb: '234, 88, 12',
    accent: '#F59E0B', accentLight: '#FBBF24', accentDark: '#D97706',
    bgLight: 'linear-gradient(135deg, #fff5f5 0%, #f8fafc 100%)',
    bgDark: 'linear-gradient(135deg, #030712 0%, #450a0a 100%)',
    name: 'Volcanic Ash'
  },
  deepsea: {
    primary: '#2563EB', primaryLight: '#60A5FA', primaryDark: '#1D4ED8', primaryRgb: '37, 99, 235',
    secondary: '#0ea5e9', secondaryLight: '#38bdf8', secondaryDark: '#0369a1', secondaryRgb: '14, 165, 233',
    accent: '#4F46E5', accentLight: '#818CF8', accentDark: '#3730A3',
    bgLight: 'linear-gradient(135deg, #eff6ff 0%, #e2e8f0 100%)',
    bgDark: 'linear-gradient(135deg, #030712 0%, #172554 100%)',
    name: 'Deep Sea Titan'
  },
  rose: {
    primary: '#EC4899', primaryLight: '#F472B6', primaryDark: '#BE185D', primaryRgb: '236, 72, 153',
    secondary: '#8B5CF6', secondaryLight: '#A78BFA', secondaryDark: '#6D28D9', secondaryRgb: '139, 92, 246',
    accent: '#FF007F', accentLight: '#FF5EAE', accentDark: '#9B004F',
    bgLight: 'linear-gradient(135deg, #fdf2f8 0%, #f1f5f9 100%)',
    bgDark: 'linear-gradient(135deg, #030712 0%, #4a044e 100%)',
    name: 'Mystic Rose'
  },
  steel: {
    primary: '#475569', primaryLight: '#64748B', primaryDark: '#334155', primaryRgb: '71, 85, 105',
    secondary: '#94A3B8', secondaryLight: '#CBD5E1', secondaryDark: '#475569', secondaryRgb: '148, 163, 184',
    accent: '#0F172A', accentLight: '#1E293B', accentDark: '#020617',
    bgLight: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)',
    bgDark: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
    name: 'Corporate Steel'
  },
  purewhite: {
    primary: '#000000', primaryLight: '#1e293b', primaryDark: '#000000', primaryRgb: '0, 0, 0',
    secondary: '#000000', secondaryLight: '#1e293b', secondaryDark: '#000000', secondaryRgb: '0, 0, 0',
    accent: '#000000', accentLight: '#1e293b', accentDark: '#000000',
    bgLight: 'linear-gradient(135deg, #ffffff 0%, #ffffff 100%)',
    bgDark: 'linear-gradient(135deg, #030712 0%, #030712 100%)',
    name: 'Pure White'
  },
  pureblack: {
    primary: '#ffffff', primaryLight: '#cbd5e1', primaryDark: '#ffffff', primaryRgb: '255, 255, 255',
    secondary: '#ffffff', secondaryLight: '#cbd5e1', secondaryDark: '#ffffff', secondaryRgb: '255, 255, 255',
    accent: '#ffffff', accentLight: '#cbd5e1', accentDark: '#ffffff',
    bgLight: 'linear-gradient(135deg, #000000 0%, #000000 100%)',
    bgDark: 'linear-gradient(135deg, #030712 0%, #030712 100%)',
    name: 'Pure Black'
  }
};

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [gradientTheme, setGradientTheme] = useState(() => {
    const saved = localStorage.getItem('portfolio-gradient-theme');
    return gradientThemes[saved] ? saved : 'emerald';
  });

  const [bgStyle, setBgStyle] = useState(() => {
    const saved = localStorage.getItem('portfolio-bg-style');
    return ['aura', 'grid', 'minimal', 'celestial'].includes(saved) ? saved : 'aura';
  });

  // Effect to manage Light/Dark class lists
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  // Effect to manage Background Styles class list
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('bg-style-aura', 'bg-style-grid', 'bg-style-minimal', 'bg-style-celestial');
    root.classList.add(`bg-style-${bgStyle}`);
    localStorage.setItem('portfolio-bg-style', bgStyle);
  }, [bgStyle]);

  // Effect to inject CSS variables for active gradient theme (reverts to emerald in dark mode)
  useEffect(() => {
    const root = document.documentElement;
    const activeKey = gradientTheme;
    const config = gradientThemes[activeKey] || gradientThemes.emerald;

    root.style.setProperty('--color-primary', config.primary);
    root.style.setProperty('--color-primary-light', config.primaryLight);
    root.style.setProperty('--color-primary-dark', config.primaryDark);
    root.style.setProperty('--color-primary-rgb', config.primaryRgb);

    root.style.setProperty('--color-secondary', config.secondary);
    root.style.setProperty('--color-secondary-light', config.secondaryLight);
    root.style.setProperty('--color-secondary-dark', config.secondaryDark);
    root.style.setProperty('--color-secondary-rgb', config.secondaryRgb);

    root.style.setProperty('--color-accent', config.accent);
    root.style.setProperty('--color-accent-light', config.accentLight);
    root.style.setProperty('--color-accent-dark', config.accentDark);

    root.style.setProperty('--bg-gradient-light', config.bgLight);
    root.style.setProperty('--bg-gradient-dark', config.bgDark);

    localStorage.setItem('portfolio-gradient-theme', gradientTheme);
  }, [gradientTheme, theme]);

  // Effect to manage Pure White & Pure Black class tags (only in day mode)
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-purewhite', 'theme-pureblack');
    if (theme === 'light') {
      if (gradientTheme === 'purewhite') {
        root.classList.add('theme-purewhite');
      } else if (gradientTheme === 'pureblack') {
        root.classList.add('theme-pureblack');
      }
    }
  }, [gradientTheme, theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      gradientTheme,
      setGradientTheme,
      gradientThemes,
      bgStyle,
      setBgStyle
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
