import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { FAB, ActivityIndicator } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import format from 'pretty-format';

import { getDbConnection } from '../../database/database';
import { getPlaceById } from '../../database/places';

function VideoScreen({ navigation, route }: any): JSX.Element {
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [url, setUrl] = React.useState<string>('');
    const { width, height } = useWindowDimensions();
    const { place_id } = route.params;

    React.useEffect(() => {
        async function init() {
            setIsLoading(true);
            const db = await getDbConnection();
            try {
                let data: any = await getPlaceById(db, place_id);
                setUrl(data?.video_url);
            } catch (error) {
                console.error("🚀 ~ file: location.tsx ~ getData ~ error", format(error))
            } finally {
                db.close();
                setIsLoading(false);
            }
        }
        init();
    }, []);

    return (
        <View style={styles.container}>
            <View
                style={{ position: "absolute", left: 15, top: 15, zIndex: 999 }}
            >
                <FAB
                    theme={{ roundness: 20 }}
                    icon="arrow-left"
                    color='#000'
                    size="small"
                    style={{ backgroundColor: '#FFFFFF' }}
                    onPress={() => navigation.goBack()}
                />
            </View>
            {isLoading ?
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator animating={true} size='large' /></View>
                :
                <WebView
                    source={{
                        html: `<html>
                <body style='background-color:#000'>
                    <video id="video-44" width="100%" height="100%" playsInline loop autoplay controls>
                        <source src="${url}" type="video/mp4">
                        Does not support video.
                    </video>    
                </body>
            </html>
            `}}
                    style={{ width: width, height: height }}
                    setBuiltInZoomControls={false}
                />
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
})

export default VideoScreen;