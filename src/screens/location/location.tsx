import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, FlatList, TouchableOpacity, Image, ImageBackground, Share } from 'react-native';
import { useSelector } from 'react-redux';
import format from 'pretty-format';
import { AudioPlayer } from 'react-native-simple-audio-player';
import { ActivityIndicator, FAB } from 'react-native-paper';

import { ListEmptyComponent } from '../../components';
import { getDbConnection } from '../../database/database';
import { getPlaceById } from '../../database/places';
import decodeEntity from '../../helpers/decode-entity';
import { COLORS } from '../../globals';

function Location({ route, navigation }: any): JSX.Element {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [playSound, setPlaySound] = useState<boolean>(false);
    const [coverImg, setCoverImg] = useState<string>('');
    const { isNetAvailable } = useSelector((state: any) => state.storeReducer);

    const [selectedIndex, setSelectedIndex] = useState<Number>(1);
    const [record, setRecord] = useState<any>({});
    const { width, height } = useWindowDimensions();
    const { place_id } = route.params;

    React.useEffect(() => {
        getData();
    }, []);

    // getting Place by ID from local db
    const getData = async () => {
        setIsLoading(true);
        const db = await getDbConnection();
        try {
            let data: any = await getPlaceById(db, place_id);
            setRecord(data);
            setCoverImg(data.local_path)
        } catch (error) {
            console.error("🚀 ~ file: location.tsx ~ getData ~ error", format(error))
        } finally {
            db.close();
            setIsLoading(false);
        }
    }

    // add app link to share
    const shareMyPost = () => {
        Share.share({
            message: record?.title || 'DePalmToursAruba',
            url: 'url',
            title: record?.title || 'Aruba'
        }).then(({ action, activityType }: any) => {
            console.log(action, activityType);
        }).catch((e) => console.warn('error', e));
    }

    const SlideShow = ({ item }: any) => {
        return <View>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => { setSelectedIndex(item.id); setCoverImg(item?.img_url) }}>
                {selectedIndex === item.id ?
                    <View style={{ borderRadius: 15, padding: 5, transform: [{ scale: 1.1 }], width: 75, height: 65, zIndex: 5, backgroundColor: '#ccc', overflow: 'hidden' }}>
                        <Image
                            source={{ uri: item?.img_url }}
                            resizeMode='cover'
                            style={{ width: '100%', height: '100%', borderRadius: 10 }}
                        />
                    </View>
                    :
                    <View style={{ borderRadius: 10, paddingHorizontal: 5, overflow: 'hidden', width: 75, height: 65 }}>
                        <Image
                            source={{ uri: item?.img_url }}
                            resizeMode='cover'
                            style={{ width: '100%', height: '100%', borderRadius: 10 }}
                        />
                    </View>
                }
            </TouchableOpacity>
        </View>
    }

    const Item = ({ item }: any) => {
        let galleryItem: any = [];
        try {
            galleryItem = JSON.parse(item?.place_images);
        } catch (error) {
            galleryItem = [];
        }
        return (
            <View style={{ flex: 1, paddingBottom: 25, position: 'relative' }}>
                <View style={{ borderBottomStartRadius: 30, borderBottomEndRadius: 30, overflow: 'hidden', backgroundColor: "#ccc" }}>
                    {!!coverImg && <ImageBackground
                        source={{ uri: coverImg }}
                        resizeMode='cover'
                        style={{ width: width, height: height * 0.4 }}
                    >
                        {Boolean(galleryItem.length) && <View style={{ flex: 1, position: 'relative' }}>
                            <View style={{ alignItems: 'center', position: 'absolute', bottom: 15, left: 0, right: 0, paddingHorizontal: 15 }}>
                                <View style={{ borderRadius: 15, overflow: 'hidden' }}>
                                    <FlatList
                                        data={galleryItem}
                                        showsHorizontalScrollIndicator={false}
                                        horizontal={true}
                                        contentContainerStyle={{ padding: 5 }}
                                        renderItem={({ item }: any) => <SlideShow item={item}/>}
                                        keyExtractor={(item: any) => String(item?.id)}
                                    />
                                </View>
                            </View>
                        </View>}
                    </ImageBackground>}
                </View>
                <View style={styles.hp}>
                    <Text style={styles.title}>{decodeEntity(item?.title)}</Text>
                    <Text style={styles.para}>{decodeEntity(item?.description)}</Text>
                </View>
            </View>
        )
    }

    const footerView = () => {
        if (isLoading) {
            return <View style={{ height: height, alignItems: 'center', justifyContent: 'center', flex: 1 }}><ActivityIndicator animating={true} size='large' /></View>
        } else {
            return <></>
        }
    }

    return (
        <View style={{ position: 'relative', flex: 1 }}>
            <View style={styles.container}>
                <FlatList
                    data={[record] || []}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }: any) => <Item item={item} />}
                    ListFooterComponent={footerView()}
                    ListEmptyComponent={isLoading ? <></> : <ListEmptyComponent />}
                    keyExtractor={(item: any) => String(item?.id)}
                />
                <FAB
                    theme={{ roundness: 20 }}
                    icon="arrow-left"
                    color='#000'
                    size="small"
                    style={{ backgroundColor: '#FFFFFF', position: "absolute", top: 15, left: 15 }}
                    onPress={() => navigation.goBack()}
                />
                {isNetAvailable && <FAB
                    theme={{ roundness: 20 }}
                    icon='share-variant'
                    color='#000'
                    size="small"
                    style={{ backgroundColor: '#FFFFFF', position: "absolute", top: 15, right: 15 }}
                    onPress={shareMyPost}
                />}
                <View
                    style={{ position: "absolute", bottom: 15, right: 15, gap: 10 }}
                >
                    {(record?.video_url && isNetAvailable) &&
                        <FAB
                            theme={{ roundness: 20 }}
                            icon="video"
                            color='#fff'
                            style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
                            onPress={() => navigation.navigate('VideoScreen', { place_id: place_id })}
                        />
                    }
                    {(record?.audio_url && isNetAvailable) &&
                        <FAB
                            theme={{ roundness: 20 }}
                            icon={playSound ? 'close' : "play"}
                            color='#fff'
                            style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
                            onPress={() => setPlaySound(!playSound)}
                        />}
                </View>
            </View>
            {playSound ?
                <View style={{ backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', width: width, height: 130 }}>
                    <AudioPlayer
                        url={record?.audio_url}
                    />
                </View>
                : null
            }
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#fff'
    },
    hp: {
        paddingTop: 10,
        paddingHorizontal: 10,
    },
    title: {
        fontFamily: 'Roboto-Medium',
        fontSize: 24,
        color: '#000',
        marginBottom: 5
    },
    title2: {
        fontFamily: 'Roboto-Regular',
        fontWeight: '600',
        fontSize: 18,
        color: '#000'
    },
    para: {
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 10,
        color: '#757575'
    },
})

export default Location;