import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { TextInput, Avatar } from 'react-native-paper';

import InputField from '../inputs-field/input-field';

function MyTopBar({ getKeyWords }: any) {
    const [search, setSearch] = React.useState<string>('');
    const navigation = useNavigation();
    const [user, setUser] = React.useState<any>({});

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 15 }}>
            <InputField
                theme={{ roundness: 25 }}
                placeholder="Search...."
                mode="outlined"
                value={search}
                handleChange={setSearch}
                right={<TextInput.Icon onPress={() => getKeyWords(search)} icon="magnify" />}
                containerSt={{ flexGrow: 1 }}
            />
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Profile')}
            >
                {/* {user?.profile_image ?
                    <Avatar.Image size={50} source={{ uri: user?.profile_image }} />
                    : <Avatar.Icon size={50} icon="face-man" color='#fff' />
                } */}
                <Avatar.Icon size={50} icon="face-man" color='#fff' />
            </TouchableOpacity>
        </View>
    );
}

export default MyTopBar;