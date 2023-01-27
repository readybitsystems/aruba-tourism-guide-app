import React from 'react';

import { View } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { COLORS } from '../../globals';

const PasswordField = React.forwardRef(({ containerSt = {}, value = '', error = '', handleChange = (e: any) => { }, ...props }: any, ref: any): JSX.Element => {
    const [secureTextEntry, setSecureTextEntry] = React.useState<boolean>(true);

    const handleEntry = () => setSecureTextEntry(!secureTextEntry)

    const ErrorText = (err: any) => {
        return <HelperText type="error" visible={Boolean(err)} children={err} />;
    }

    return (
        <View style={{ ...containerSt }}>
            <TextInput
                value={value}
                error={Boolean(error !== '')}
                onChangeText={handleChange}
                autoCapitalize="none"
                secureTextEntry={secureTextEntry}
                right={<TextInput.Icon onPress={handleEntry} icon={secureTextEntry ? "eye" : "eye-off"} />}
                {...props}
                selectionColor={Boolean(error !== '') ? '#EB9481' : COLORS.primary}
                style={{ color: '#AAAAAA', backgroundColor: Boolean(error !== '') ? "#FFE8E3" : '#FBFBFB'}}
                placeholderTextColor='#AAAAAA'
                ref={ref}
            />
            {error && ErrorText(error)}
        </View>
    );
})

export default PasswordField;