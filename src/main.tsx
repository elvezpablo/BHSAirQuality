import * as React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import { ColorScheme, MantineProvider } from '@mantine/core';

import App from './App';
import App2 from './App2';

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
          defaultRadius: 'xs'
        }}
      >
        <App2 />
      </MantineProvider>
    </StrictMode>
  );
};

if (root) {
  root.render(<Main />);
}
