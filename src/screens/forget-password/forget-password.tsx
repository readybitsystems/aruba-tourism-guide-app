import React, { useState } from 'react';

import { View, Text, StyleSheet, Image, useWindowDimensions, Keyboard, ScrollView, Alert } from 'react-native';
import { TextInput, FAB } from 'react-native-paper';
import { Button } from 'react-native-paper';

import errorsSetter from '../../helpers/errors-setter';
import { InputField } from '../../components';
import { COLORS } from '../../globals';
import ApiManager from '../../api-manager';
import { useDispatch } from 'react-redux';
import { openPopUp } from '../../store/reducer';

function ForgetPassword({ navigation }: { navigation: any }): JSX.Element {
    const { width, height } = useWindowDimensions();
    const [email, setEmail] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formErrors, setFormErrors] = useState<object | any>({});
    const dispatch = useDispatch();

    const validate = () => {
        let flag = true;
        let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
        let _errors: any = {}
        if (email === '') {
            _errors.email = 'Field is required.'
            flag = false;
        } else if (regex.test(email) === false) {
            _errors.email = 'Please type valid email.'
            flag = false;
        }
        setFormErrors(_errors);
        return flag;
    }

    const showAlert = (message: string) => {
        Alert.alert(
            '',
            message,
            [
                {
                    text: 'Next',
                    onPress: () => navigation.navigate('ResetPassword'),
                    style: 'cancel',
                },
            ],
        );
    }

    const handleRequest = async () => {
        if (Boolean(validate())) {
            setIsLoading(true);
            try {
                let _fd: { email: string } = { email: email };
                let { data }: any = await ApiManager('post', 'forget/password', _fd);
                showAlert(data);
            } catch (error: any) {
                if (error?.response?.status === 422) {
                    setFormErrors(errorsSetter(error));
                } else {
                    dispatch(openPopUp(error?.response?.data?.message))
                }
            } finally {
                setIsLoading(false);
            }
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.hp}>
                    <View style={styles.fabContainer}>
                        <FAB
                            theme={{ roundness: 20 }}
                            icon="arrow-left"
                            color={COLORS.primary}
                            size="small"
                            style={{ backgroundColor: '#FFFFFF' }}
                            onPress={() => navigation.navigate('SignIn')}
                        />
                    </View>
                    <Image
                        source={require('../../assets/images/forgot-password.png')}
                        resizeMode='contain'
                        style={{
                            width: width,
                            height: height * 0.35
                        }}
                    />
                    <Text style={styles.greeting}>Forgot Password?</Text>
                    <Text style={{ marginBottom: 30, color: '#000' }}>Don’t worry! It happens, Please enter your address associated with your Account.</Text>
                    <InputField
                        value={email}
                        handleChange={setEmail}
                        mode="outlined"
                        label="Email address"
                        placeholder='johndoe@example.com'
                        error={formErrors?.email}
                        left={<TextInput.Icon icon="at" />}
                        containerSt={{ marginBottom: 20 }}
                        onSubmitEditing={()=>{handleRequest();Keyboard.dismiss()}}
                        blurOnSubmit={false}
                        keyboardType="email-address"
                    />
                    <Button
                        theme={{ roundness: 1 }}
                        loading={isLoading}
                        disabled={isLoading}
                        mode="contained"
                        onPress={handleRequest}
                    >SUBMIT</Button>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        position: 'relative',
    },
    hp: {
        paddingHorizontal: 10,
        paddingBottom: 25
    },
    greeting: {
        fontFamily: 'Roboto-Medium',
        fontSize: 28,
        marginTop: 10,
        marginBottom: 10,
        color: '#000'
    },
    fabContainer: {
        position: 'absolute',
        margin: 16,
        left: 0,
        top: 0,
        zIndex: 5
    },
})

export default ForgetPassword;