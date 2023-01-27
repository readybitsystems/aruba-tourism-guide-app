import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, FlatList, ImageBackground } from 'react-native';
import { ActivityIndicator, Chip } from 'react-native-paper';
import { BlurView } from "@react-native-community/blur";
import format from 'pretty-format';

import { ListEmptyComponent, MyTopBar } from '../../components';
import { getAllPlaces, searchFromPlaces } from '../../database/places';
import { getDbConnection } from '../../database/database';
import decodeEntity from '../../helpers/decode-entity';

function Places({ route, navigation }: any): JSX.Element {
    const { height } = useWindowDimensions();
    const [records, setRecords] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const { tour_id, _title } = route.params;

    React.useEffect(() => {
        getData();
    }, []);

    // getting all Places from local db
    const getData = async () => {
        setIsLoading(true);
        const db = await getDbConnection();;
        try {
            let data = await getAllPlaces(db, tour_id);
            setRecords(data);
        } catch (error) {
            console.error("🚀 ~ file: places.tsx ~ getData ~ error", format(error))
        } finally {
            db.close();
            setIsLoading(false);
        }
    }

    // getting all Tours from local db using search
    const getSearchResult = async (_search: string) => {
        setRecords([]);
        setIsLoading(true);
        const db = await getDbConnection();
        try {
            let data = await searchFromPlaces(db, tour_id, _search);
            setRecords(data);
        } catch (error) {
            console.error("🚀 ~ file: tours.tsx ~ getData ~ error", format(error))
        } finally {
            db.close();
            setIsLoading(false);
        }
    }

    const Item = ({ item }: any) => (
        <View style={{ flex: 1, paddingVertical: 5 }}>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Location', { place_id: item?.server_id })}>
                <View style={{ borderRadius: 10, overflow: 'hidden', backgroundColor: '#ccc' }}>
                    <ImageBackground
                        source={{ uri: item?.local_path }}
                        resizeMode='cover'
                        style={{ width: '100%', height: height * 0.20 }}
                    >
                        <View style={{ justifyContent: 'flex-end', flex: 1 }}>
                            <BlurView
                                blurType="light"
                                blurAmount={4}
                                reducedTransparencyFallbackColor="white"
                            >
                                <View style={{ paddingHorizontal: 10, paddingVertical: 5, }}>
                                    <Text style={styles.title}>{decodeEntity(item?.title)}</Text>
                                    <Text style={styles.subTxt}>{decodeEntity(item?.sub_title || 'Aruba')}</Text>
                                </View>
                            </BlurView>
                        </View>
                    </ImageBackground>
                </View>
            </TouchableOpacity>
        </View>
    )

    const headerView = () => (
        <>
            {/* <MyTopBar key={search} getKeyWords={(e: string) => {
                setSearch(e);
                getSearchResult(e);
            }}
            /> */}
            {search &&
                <View style={{ marginTop: 12 }}>
                    <Chip icon="close" mode='flat' onPress={() => { getData(); setSearch('') }}>{search}</Chip>
                </View>
            }
            <View style={{ marginTop: 15 }}>
                <Text style={styles.txt}>
                    Let's explore
                </Text>
                <Text style={styles.mainTitle}>{_title}</Text>
            </View>
        </>
    )

    const footerView = () => {
        if (isLoading) {
            return <View><ActivityIndicator animating={true} size='large' /></View>
        } else {
            return <></>
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.hp}>
                <FlatList
                    data={records}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }: any) => <Item item={item} />}
                    ListHeaderComponent={headerView()}
                    numColumns={2}
                    columnWrapperStyle={{ gap: 10 }}
                    ListFooterComponent={footerView()}
                    ListEmptyComponent={isLoading ? <></> : <ListEmptyComponent />}
                    keyExtractor={(item: any) => item.id}
                />
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
    mainTitle: {
        fontFamily: 'Roboto-Medium',
        fontSize: 36,
        color: '#000',
        marginBottom: 15
    },
    txt: {
        fontFamily: 'Roboto-Regular',
        fontSize: 15,
        lineHeight: 22,
        color: '#6C6C6C'
    },
    title: {
        fontFamily: 'Roboto-Medium',
        fontSize: 14,
        color: '#FFFFFF'
    },
    subTxt: {
        fontFamily: 'Roboto-Regular',
        fontSize: 11,
        color: '#FFFFFF'
    },
})

export default Places;