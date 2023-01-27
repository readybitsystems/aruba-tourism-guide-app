import React from 'react';

import { View, Text, StyleSheet, useWindowDimensions, ImageBackground } from 'react-native';
import { Modal, Portal } from 'react-native-paper';

function MyModal({ gotError, visible, closeModal }: { gotError: boolean, visible: boolean, closeModal: Function }): JSX.Element {
    const { width, height } = useWindowDimensions();

    const imageSt = {
        width: '100%',
        height: height * 0.25,
        borderTopRightRadius: 10
    }

    const renderImage = (src: any) => {
        return (
            <ImageBackground
                source={src}
                style={imageSt}
                imageStyle={{
                    resizeMode: "cover",
                    alignItems: 'flex-start'
                }}
            />
        );
    }

    return (
        <Portal>
            <Modal visible={visible} onDismiss={() => closeModal(false)} contentContainerStyle={modalContainer}>
                <View>
                    <View>
                        {gotError ?
                            renderImage(require('../../assets/images/bg-pink.png'))
                            :
                            renderImage(require('../../assets/images/bg-green.png'))
                        }
                    </View>
                    <View style={{ padding: 20, paddingBottom: 40 }}>
                        <Text style={styles.modalHeading}>{gotError ? "Unsuccessful" : "Successful"}</Text>
                        <Text style={styles.modalText}>{gotError ? `There's a temporary problem with the service, please try again later.` : 'Your password has been changed successfully.'}</Text>
                    </View>
                </View>
            </Modal>
        </Portal>
    );
}

const modalContainer: any = {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 10,
    width:320,
    alignSelf: 'center',
    borderRadius: 10,
    overflow: 'hidden'
}

const styles = StyleSheet.create({
    modalHeading: {
        textAlign: 'center',
        fontFamily: 'Roboto-Bold',
        fontSize: 28,
        marginBottom: 10,
        color: '#000'
    },
    modalText: {
        textAlign: 'center',
        fontFamily: 'Roboto-Regular',
        color: '#000'
    }
})

export default MyModal;