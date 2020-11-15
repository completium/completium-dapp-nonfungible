import './App.css';
import React, { useState, useRef } from 'react';
import { appTitle, appName, network, contractAddress } from './settings.js';
import HeaderBar from './components/HeaderBar';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { DAppProvider, useAccountPkh, useConnect, useReady } from './dapp.js';
import SnackMsg from './components/SnackMsg';
import Footer from './components/Footer';
import Container from '@material-ui/core/Container';
import { NonFungibleStateProvider, useNonFungibleStateContext } from './NonFungibleState.js';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { robotributes } from './robots.js';
import Robot from './components/Robot';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Account from './components/Account';
import SortButton from './components/SortButton';
import { TezosToolkit } from '@taquito/taquito';
import { LinearProgress } from '@material-ui/core';

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

function strcmp(a, b) {
  return (a.toString()<b.toString()?-1:(a.toString()>b.toString()?1:0));
}

function PageRouter (props) {
  const [viewSnack, setViewSnack] = React.useState(false);
  const prefersDarkMode = false /*useMediaQuery('(prefers-color-scheme: dark)')*/;
  var connect = useConnect();
  const [value, setValue] = React.useState(0);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const ready = useReady();
  const Tezos = new TezosToolkit('https://delphinet-tezos.giganode.io/');
  const { nonFungibleState, isReady, setNonFungibleState, setNotReady } = useNonFungibleStateContext();
  const accountAddress = useAccountPkh();
  const compareRobot = (a, b) => {
    switch (selectedIndex) {
      case 0: return strcmp(a.name,b.name);
      case 1: return strcmp(b.name,a.name);
      case 2: return a.price - b.price;
      case 3: return b.price - a.price;
      case 4: return a.id - b.id;
      case 5: return b.id - a.id;
      default: return 0;
    }
  }
  robotributes.sort(compareRobot);
  if (!isReady()) {
    Tezos.contract
    .at(contractAddress)
    .then(contract => {
      contract.storage().then(storage => {
        var forsales = [];
        var botwallet = [];
        // operator is an array
        storage.operator.forEach(element => {
          forsales.push(element[1].toString());
        });
        // ledger is a map
        // read ledger for ownership information
        if (ready) {
          storage.ledger.forEach((l,k,m) => {
            if(l === accountAddress) {
              botwallet.push(k);
            }
          })
        }
        setNonFungibleState({
          forsales  : forsales,
          botwallet : botwallet,
          basket    : nonFungibleState.basket,
          ready     : true
        });
      })
    })
    .catch(error => console.log(`Error: ${error}`));
  }
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
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
      setNotReady();
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
  const displayedRobots =  robotributes.filter((r) => {
    switch(value) {
      case 0: return nonFungibleState.forsales.includes(r.id); break;
      case 1: return nonFungibleState.botwallet.includes(r.id); break;
      default: return false;
    }
  });
  console.log(`nb robots to display: ${displayedRobots.length}`);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <HeaderBar appTitle={appTitle} handleConnect={handleConnect} theme={theme} />
      <Container  maxWidth="lg" style={{ marginTop: 30 }}>
        <Grid container direction="row" justify="flex-start" alignItems="center">
          <Grid item xs={1}>
            <img src={process.env.PUBLIC_URL + "/cryptobot_logo.svg"}></img>
          </Grid>
          <Grid item xs={3}>
            <Typography variant='h4' style={{
              fontFamily: 'Orbitron',
              marginLeft: 30
            }}>Cryptobots</Typography>
          </Grid>
          <Grid item xs={7}>
            <Account openSnack={openSnack} closeSnack={closeSnack} />
          </Grid>
          <Grid item xs={8}></Grid>
          <Container maxWidth='md' style={{ marginTop: 0 }}>
            <Grid container direction="row" justify="flex-start" alignItems="center">
              <Grid item xs={12}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="secondary"
                  color='secondary'
                >
                  <Tab label="Catalog" />
                  <Tab label="My Robots" />
                </Tabs>
              </Grid>
              <Grid item xs={1} style={{ marginTop: 40 }}>
                <Typography>Sort by</Typography>
              </Grid>
              <Grid item xs={4} style={{ marginTop: 40 }}>
                <SortButton selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex}/>
              </Grid>
            </Grid>
          </Container>
          <Container maxWidth='md' style={{ marginTop: 60, marginBottom: 60 }}>
            <Grid container direction="row" justify="flex-start" alignItems="center" spacing={4}> {
              (isReady())?(
              (displayedRobots.length === 0)? (
                <Grid item xs={12} style={{ textAlign: 'center' }}>
                  <Typography style={{ color: '#9e9e9e' }}>
                    {(ready)?("No robot in wallet!"):("(Connect to wallet)")}
                  </Typography>
                  <img src={process.env.PUBLIC_URL + "/warning_robot.svg"}></img>
                </Grid>
              ) : (
                displayedRobots.map(r =>
                <Grid item>
                  <Robot data={r} ready={ready} value={value} openSnack={openSnack} closeSnack={closeSnack}/>
                </Grid>
                )
              )) : (
                <Grid item xs={12}>
                <LinearProgress color='secondary'></LinearProgress>
                </Grid>
              )

            } </Grid>
          </Container>
        </Grid>
      </Container>
      <Footer appName={appName}/>
      <SnackMsg open={viewSnack} theme={theme} />
    </ThemeProvider>
  );
}

export default App;
