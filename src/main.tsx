import * as React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import { ColorScheme, MantineProvider } from '@mantine/core';

import App from './App';

const rootElement = document.getElementById('root');
const root = rootElement && createRoot(rootElement);

const Main = () => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'dark',
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  return (
    <StrictMode>
      <MantineProvider
        withGlobalStyles
        theme={{
          colorScheme,
          fontFamily: 'Bitter',
          headings: {
            fontFamily: 'Bitter',
          },
          primaryColor: 'green',
          defaultRadius: 'xs',
          colors: {
            green: [
              '#e4faf3',
              '#c6e8df',
              '#a6d7ca',
              '#85c7b5',
              '#64b6a0',
              '#4b9d86',
              '#387a69',
              '#26574b',
              '#12352d',
              '#00140f',
            ],
          },
        }}
      >
        <App />
      </MantineProvider>
    </StrictMode>
  );
};

if (root) {
  root.render(<Main />);
}
