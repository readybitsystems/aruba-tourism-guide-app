import * as React from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import { PermissionsAndroid, Platform } from "react-native";
import { ActivityIndicator, Snackbar, Text } from 'react-native-paper';

import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import format from 'pretty-format';

import LogStack from './log-stack';
import AppStack from './app-stack';
import { closePopUp,checkPermission } from '../store/reducer';
import { getDbConnection } from '../database/database';
import { deleteTourById, getToursById, insertTours, updateTourById } from '../database/tours';
import { deletePlaceById, getPlaceById, insertPlaces, updatePlaceById } from '../database/places';
import { deleteCountryById, getCountryById, insertCountry, updateCountryById } from '../database/country';
import ApiManager from '../api-manager';
import { COLORS } from '../globals';
import RNFetchBlob from 'rn-fetch-blob'

function RootNavigation(): JSX.Element {
  const { isLogged, popUp, token, isNetAvailable } = useSelector((state: any) => state.storeReducer);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [dataStored, setDataStored] = React.useState<boolean>(false);
  const [stopUser, setStopUser] = React.useState<boolean>(false);
  const dispatch = useDispatch();

  React.useEffect(() => {
    async function init() {
      try {
        if (token && !dataStored && isNetAvailable) {
          getData(token);
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        console.error("🚀 ~ file: root-navigation.tsx ~ init ~ err", format(err));
        setIsLoading(false);
      }
    }
    init();
  }, [token, isNetAvailable]);

  React.useEffect(() => {
    async function init() {
      let timestamp: any = await AsyncStorage.getItem('@timestamp');
      if (isNetAvailable) {
        return setStopUser(false);
      } else {
        if (timestamp === null || timestamp === 0) {
          setStopUser(true);
        }
      }
    }
    init();
  }, [isNetAvailable]);

  const getData = async (token: any) => {
    let permission = await hasDevicePermission();
    dispatch(checkPermission(permission))
    if (permission) {
      setIsLoading(true);
      try {
        let timestamp = await AsyncStorage.getItem('@timestamp');
        let { data }: any = await ApiManager('get', `get/all/data?timestamp=${timestamp || 0}`, '', token);
        setAllData(data);
      } catch (error: any) {
        console.error("🚀 ~ file: welcome.tsx ~ getData ~ error", format(error?.response));
      }
    }
  }

  const setAllData = async (data: any) => {
    const db = await getDbConnection();
    const { countries, tours, places } = data;
    try {
      if (Boolean(countries.length)) {
        for (let i = 0; i < countries.length; i++) {
          let item = await getCountryById(db, countries[i]?.id);
          if (item) {
            if (countries[i]?.deleted_at !== null) {
              await deleteCountryById(db, countries[i]?.id);
            } else {
              let createdPath = await downloadFile(countries[i].image_url);
              await updateCountryById(db, { ...countries[i], localPath: createdPath });
            }
          } else {
            let createdPath = await downloadFile(countries[i].image_url);
            await insertCountry(db, { ...countries[i], localPath: createdPath });
          }
        }
      }
      if (Boolean(tours.length)) {
        for (let i = 0; i < tours.length; i++) {
          let item = await getToursById(db, tours[i]?.id);
          if (item) {
            if (tours[i]?.deleted_at !== null) {
              await deleteTourById(db, tours[i]?.id);
            } else {
              let createdPath = await downloadFile(tours[i].image_url);
              await updateTourById(db, { ...tours[i], localPath: createdPath });
            }
          } else {
            let createdPath = await downloadFile(tours[i].image_url);
            await insertTours(db, { ...tours[i], localPath: createdPath });
          }
        }
      }
      if (Boolean(places.length)) {
        for (let i = 0; i < places.length; i++) {
          let item = await getPlaceById(db, places[i]?.id);
          if (item) {
            if (places[i]?.deleted_at !== null) {
              await deletePlaceById(db, places[i]?.id);
            } else {
              let createdPath = await downloadFile(places[i].image_url);
              let gallery = [];
              if (Boolean(places[i]?.place_images.length)) {
                for (let index = 0; index < places[i].place_images.length; index++) {
                  let slide = await downloadFile(places[i].place_images[index].image_url);
                  gallery.push({ id: places[i].place_images[index].id, img_url: slide });
                }
              }
              await updatePlaceById(db, { ...places[i], localPath: createdPath, gallery: gallery });
            }
          } else {
            let createdPath = await downloadFile(places[i].image_url);
            let gallery = [];
            if (Boolean(places[i]?.place_images.length)) {
              for (let index = 0; index < places[i].place_images.length; index++) {
                let slide = await downloadFile(places[i].place_images[index].image_url);
                gallery.push({ id: places[i].place_images[index].id, img_url: slide });
              }
            }
            await insertPlaces(db, { ...places[i], localPath: createdPath, gallery: gallery });
          }
        }
      }      
      await AsyncStorage.setItem('@timestamp', data?.timestamp.toString());
      setDataStored(true);
    } finally {
      db.close();
      setIsLoading(false);
    }
  }

  const downloadFile = (image_url: string): Promise<string> => {
    return new Promise(function (resolve, reject) {
      RNFetchBlob
        .config({
          fileCache: true,
        })
        .fetch('GET', image_url, {})
        .then((res) => {
          let path = Platform.OS === "android" ? `file://${res.path()}` : res.path();
          resolve(path);
        }).catch(err => {
          console.log("🚀 ~ file: root-navigation.tsx ~ .then ~ err", err)
          reject('');
        })
    });
  }

  async function hasDevicePermission() {
    //  IOS Permission handling
    if(Platform.OS == "ios") {
      return true;
    }

    //  Android Permission handling
    const permission = Platform.Version >= 33 ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {stopUser ?
        <MyModal />
        : isLoading ?
          <LoadingScreen />
          :
          <NavigationContainer>
            {isLogged ? <AppStack /> : <LogStack />}
          </NavigationContainer>
      }
      <Snackbar
        visible={popUp.open}
        onDismiss={() => dispatch(closePopUp())}
        action={{ label: 'Close', onPress: () => dispatch(closePopUp()), }}>
        {popUp?.message}
      </Snackbar>
    </SafeAreaView>
  );
}

export default RootNavigation;

function LoadingScreen(): JSX.Element {
  const [delayMsg, setDelayMsg] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setDelayMsg(true);
    }, 10000);
  }, []);

  return (
    <View style={styles.modalContainer}>
      <View style={styles.inner}>
        <ActivityIndicator animating={true} size='large' />
        {delayMsg?<Text style={styles.modalText}>Please wait as this might take a while.</Text>:
        <Text style={styles.modalText}>Loading data and images from server for offline mode.</Text>
        }
      </View>
    </View>
  );
}

function MyModal(): JSX.Element {
  return (
    <View style={styles.modalContainer}>
      <View style={styles.inner}>
        <Icon name='network' size={35} color={COLORS.primary} />
        <Text style={styles.modalText}>Your device is not connected to the internet.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalText: {
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
    color: '#000000',
    fontSize: 16,
    marginTop: 15
  },
  text: { textAlign: 'center', fontFamily: 'Roboto-Medium', fontSize: 16, marginTop: 10, color: '#FFFFFF' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)' },
  modalContainer: { flex: 1, alignItems: 'center', justifyContent: 'center',paddingHorizontal: 35, backgroundColor: COLORS.primary },
  inner: { backgroundColor: '#FFFFFF', paddingHorizontal: 35, paddingVertical: 35, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }
})