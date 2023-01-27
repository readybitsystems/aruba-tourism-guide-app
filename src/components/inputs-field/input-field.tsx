import React from 'react';

import { View } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { COLORS } from '../../globals';

const InputField = React.forwardRef(({ containerSt = {}, value = '', error = '', handleChange = (e: any) => { }, ...props }: any, ref: any): JSX.Element => {

    const ErrorText = (err: any) => {
        return <HelperText type="error" style={{ color: COLORS.redMain }} visible={Boolean(err)} children={err} />;
    }

    return (
        <View style={{ ...containerSt }}>
            <TextInput
                value={value}
                error={Boolean(error !== '')}
                autoCapitalize="none"
                onChangeText={handleChange}
                selectionColor={Boolean(error !== '') ? '#EB9481' : COLORS.primary}
                style={{ color: '#AAAAAA', backgroundColor: Boolean(error !== '') ? "#FFE8E3" : '#FBFBFB'}}
                placeholderTextColor='#AAAAAA'
                {...props}
                ref={ref}
            />
            {error && ErrorText(error)}
        </View>
    );
})

export default InputField;