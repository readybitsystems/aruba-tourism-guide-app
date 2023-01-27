/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import RootNavigation from './src/navigation/root-navigation';
import SplashScreen from 'react-native-splash-screen';
import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';

import store from './src/store/store';
import { Provider } from 'react-redux';
import { COLORS } from './src/globals';
import { initDatabase } from './src/database/database';
import { logInUser,netStatus } from './src/store/reducer';
import NetInfo from "@react-native-community/netinfo";

const theme: any = {
  ...DefaultTheme,
  myOwnProperty: true,
  colors: {
    ...DefaultTheme.colors,
    ...COLORS
  },
};

function App(): JSX.Element {
  React.useEffect(() => {
    async function init() {
      try {
        const user = await initDatabase();
        if (user) {
          store.dispatch(logInUser(user?.token));
        }
      } finally {
        setTimeout(() => {
          SplashScreen.hide();
        }, 1000);
      }
    }
    init();
    const unsubscribe = NetInfo.addEventListener(state => {
      store.dispatch(netStatus(state.isConnected));
    });
    return (() => {
      unsubscribe();
    })
  }, []);

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <RootNavigation />
      </PaperProvider>
    </Provider>
  );
}

export default App;