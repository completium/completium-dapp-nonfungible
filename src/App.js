import './App.css';
import React, { useState, useRef } from 'react';
import { appTitle, appName, network } from './settings.js';
import HeaderBar from './components/HeaderBar';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { DAppProvider, useConnect } from './dapp.js';
import SnackMsg from './components/SnackMsg';
import Footer from './components/Footer';
import Container from '@material-ui/core/Container';
import { NonFungibleStateProvider } from './NonFungibleState.js';

function App() {
  return (
    <DAppProvider appName={appName}>
      <NonFungibleStateProvider>
        <React.Suspense fallback={null}>
          <PageRouter />
        </React.Suspense>
      </NonFungibleStateProvider>
    </DAppProvider>
  );
}

function PageRouter (props) {
  const [viewSnack, setViewSnack] = React.useState(false);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  var connect = useConnect();
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
          secondary: {
            light: '#4ACFFF',
            main: '#00B8F0',
            dark: '#009FD9',
            contrastText: '#fff',
          }
        },
      }),
    [prefersDarkMode],
  );
  const handleConnect = React.useCallback(async () => {
    try {
      await connect(network);
    } catch (err) {
      alert(err.message);
    };
  }, [connect]);
  const openSnack = () => {
    setViewSnack(true);
  }
  const closeSnack = () => {
    setViewSnack(false);
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <HeaderBar appTitle={appTitle} handleConnect={handleConnect} theme={theme} />
      <Container  maxWidth="md">
      </Container>
      <Footer appName={appName}/>
      <SnackMsg open={viewSnack} theme={theme} />
    </ThemeProvider>
  );
}

export default App;
