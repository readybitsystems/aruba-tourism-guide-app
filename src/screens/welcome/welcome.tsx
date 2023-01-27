import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useWindowDimensions, FlatList, Platform, Linking } from 'react-native';

import { ActivityIndicator, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { WebView } from 'react-native-webview';
import DeviceInfo from 'react-native-device-info';
import IntentLauncher from '@yz1311/react-native-intent-launcher';
import format from 'pretty-format';

import { ListEmptyComponent } from '../../components';
import { getDbConnection } from '../../database/database';
import { getAllCountries } from '../../database/country';

const frame: string = `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124638.86245164614!2d-70.03732894194522!3d12.518513977065503!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e8538cfe25a77db%3A0xf16a8a3e89818c2f!2sAruba!5e0!3m2!1sen!2s!4v1674122273482!5m2!1sen!2s" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
const divContent = `<h2 style="color:rgba(255,255,255,0.4);font-weight:700;font-size:46px;)">Offline</h2>`;

function Welcome({ navigation }: any): JSX.Element {
    const { width, height } = useWindowDimensions();
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { isNetAvailable, hasPermission } = useSelector((state: any) => state.storeReducer);

    React.useEffect(() => {
        getData();        
    }, []);

    // getting all countries from local db
    const getData = async () => {
        await AsyncStorage.setItem('@firstTime', 'true');
        setIsLoading(true);
        const db = await getDbConnection();
        try {
            let data = await getAllCountries(db);
            setRecords(data);
        } catch (error) {
            console.error("🚀 ~ file: welcome.tsx ~ myUser ~ error", format(error))
        } finally {
            db.close();
            setIsLoading(false);
        }
    }

    const mapRenderer = () => (
        <View style={{ position: 'relative' }}>
            <WebView
                source={{ html: isNetAvailable ? frame : divContent }}
                style={{ width: width - 20, height: height * 0.25, backgroundColor: '#9BBBEB' }}
            />
        </View>
    );

    const headerView = () => (
        <>
            {mapRenderer()}
            <View style={{ alignItems: 'center', marginTop: 15 }}>
                <Text style={styles.greeting}>Welcome</Text>
                <Text style={styles.txt}>
                    Lorem ipsum dolor sit amet consectetur. Gravida lobortis viverra sodales sapien eu..
                </Text>
            </View>
            <Text style={styles.txt2}>
                Please Select your Language
            </Text>
        </>
    )

    const Item = ({ item }: any) => {
        return (
            <View style={{ flex: 1, paddingVertical: 5, paddingHorizontal: 5, marginHorizontal: 5 }}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => navigation.navigate('Tours', { country_id: item.server_id })}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                        <View>
                            <Image
                                source={{ uri: item?.local_path }}
                                resizeMode='contain'
                                style={{ width: 40, height: 40 }}
                            />
                        </View>
                        <Text style={{ color: '#000', fontSize: 15 }}>{item?.title}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    const footerView = () => {
        if (isLoading) {
            return <View><ActivityIndicator animating={true} size='large' /></View>
        } else {
            return <></>
        }
    }

    const openAppSettings = () => {
        const _package: any = DeviceInfo.getBundleId();
        if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:')
        } else {
            IntentLauncher.startActivity({
                action: 'android.settings.APPLICATION_DETAILS_SETTINGS',
                data: `package:${_package}`
            })
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.hp}>
                {hasPermission ?
                    <FlatList
                        data={records || []}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={headerView()}
                        renderItem={({ item }: any) => <Item item={item} />}
                        numColumns={2}
                        ListEmptyComponent={isLoading ? <></> : <ListEmptyComponent />}
                        ListFooterComponent={footerView()}
                        keyExtractor={(item: any) => item.id}
                    />
                    :
                    <View style={{ height: height * 0.9, justifyContent: 'space-between' }}>
                        <Text style={{ color: '#000', fontFamily: 'Roboto-Regular' }}>
                            App require storage permission for offline mode. In order to continue please allow the storage permission.
                        </Text>
                        <Button mode='contained' onPress={openAppSettings} style={{ marginTop: 15 }}>Go to settings</Button>
                    </View>
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    hp: {
        paddingTop: 10,
        paddingHorizontal: 10,
    },
    greeting: {
        fontFamily: 'Roboto-Bold',
        fontSize: 42,
        color: '#000'
    },
    txt: {
        fontFamily: 'Roboto-Regular',
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
        color: '#6C6C6C'
    },
    txt2: {
        fontFamily: 'Roboto-Regular',
        fontSize: 15,
        lineHeight: 20,
        color: '#000',
        marginTop: 20,
        marginBottom: 20,
        paddingHorizontal: 10
    },
})

export default Welcome;