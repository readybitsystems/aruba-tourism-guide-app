import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

function ListEmptyComponent({ msg = 'Data not Found' }) {
    return (
        <View style={styles.container}>
            <Text style={styles.txt}>
                {msg}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ccc',
        opacity: 0.25
    },
    txt: {
        fontFamily: 'Roboto-Medium',
        fontSize: 15,
        lineHeight: 20,
        textAlign: 'center',
        color: '#6C6C6C'
    },
})

export default ListEmptyComponent;