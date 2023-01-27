import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, FlatList, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { ActivityIndicator, Chip } from 'react-native-paper';
import format from 'pretty-format';

import { ListEmptyComponent, MyTopBar } from '../../components';
import { getDbConnection } from '../../database/database';
import { getAllTours, searchFromTours } from '../../database/tours';
import decodeEntity from '../../helpers/decode-entity';

function Tours({ route, navigation }: any): JSX.Element {
    const { height } = useWindowDimensions();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [records, setRecords] = useState([]);
    const { country_id } = route.params;

    React.useEffect(() => {
        getData();
    }, []);

    // getting all Tours from local db
    const getData = async () => {
        setIsLoading(true);
        const db = await getDbConnection();
        try {
            let data = await getAllTours(db, country_id);
            setRecords(data);
        } catch (error) {
            console.error("🚀 ~ file: tours.tsx ~ getData ~ error", format(error))
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
            let data = await searchFromTours(db, country_id, _search);
            setRecords(data);
        } catch (error) {
            console.error("🚀 ~ file: tours.tsx ~ getData ~ error", format(error))
        } finally {
            db.close();
            setIsLoading(false);
        }
    }

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
                    Our Current
                </Text>
                <Text style={styles.greeting}>Tours</Text>
            </View>
        </>
    )

    const Item = ({ item }: any) => (
        <View style={{ flex: 1, paddingVertical: 5 }}>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Places', { tour_id: item.server_id, _title: item.title })}>
                <View style={{ borderRadius: 10, overflow: 'hidden', backgroundColor: '#ccc' }}>
                    <ImageBackground
                        source={{ uri: item?.local_path }}
                        resizeMode='cover'
                        style={{ width: '100%', height: height * 0.35 }}
                    >
                        <View style={{ alignItems: 'center', gap: 10, justifyContent: 'center', flex: 1 }}>
                            <Text style={styles.title}>{decodeEntity(item?.title)}</Text>
                            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                <Icon name="clockcircle" size={22} color="#FFFFFF" />
                                <Text style={styles.timing}>{decodeEntity(item?.duration)}</Text>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
            </TouchableOpacity>
        </View>
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
                    data={records || []}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }: any) => <Item item={item} />}
                    ListHeaderComponent={headerView()}
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
    greeting: {
        fontFamily: 'Roboto-Bold',
        fontSize: 42,
        color: '#000'
    },
    txt: {
        fontFamily: 'Roboto-Regular',
        fontSize: 15,
        lineHeight: 22,
        color: '#6C6C6C'
    },
    title: {
        fontFamily: 'Roboto-Medium',
        fontSize: 24,
        color: '#FFFFFF'
    },
    timing: {
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
        color: '#FFFFFF'
    },
})

export default Tours;