import React, { useState } from 'react';

import { View, Text, StyleSheet, Image, useWindowDimensions, ScrollView, Keyboard } from 'react-native';
import { TextInput, FAB, Button } from 'react-native-paper';

import errorsSetter from '../../helpers/errors-setter';
import { InputField, PasswordField } from '../../components';
import { COLORS } from '../../globals';
import ApiManager from '../../api-manager';
import MyModal from './my-modal';

function ResetPassword({ navigation }: { navigation: any }): JSX.Element {
    const { width, height } = useWindowDimensions();
    const [token, setToken] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formErrors, setFormErrors] = useState<object | any>({});
    const [visible, setVisible] = React.useState(false);
    const [gotError, setGotError] = React.useState(false);
    const passInput = React.useRef(null);
    const cPassInput = React.useRef(null);

    const validate = () => {
        let flag = true;
        let _errors: any = {}
        if (token === '') {
            _errors.token = 'Enter your OTP.'
            flag = false;
        }
        if (password === '') {
            _errors.password = 'Field is required.'
            flag = false;
        } else if (password.length <= 5) {
            _errors.password = 'Password should be 6 characters long.'
            flag = false;
        }
        if (confirmPassword === '') {
            _errors.confirmPassword = 'Field is required.'
            flag = false;
        } else if (password !== confirmPassword) {
            _errors.password = 'Password does not match.'
            _errors.confirmPassword = 'Password does not match.'
            flag = false;
        }
        setFormErrors(_errors);
        return flag;
    }

    const handleRequest = async () => {
        if (validate()) {
            setIsLoading(true);
            try {
                let _fd: { reset_token: number, password: string, confirm_password: string } = {
                    reset_token: Number(token),
                    password: password,
                    confirm_password: confirmPassword,
                }
                await ApiManager('post', 'reset/password', _fd);
                setVisible(true);
                setGotError(false);
            } catch (error: any) {
                if (error?.response?.status === 422) {
                    setFormErrors(errorsSetter(error));
                } else {
                    setVisible(true);
                    setGotError(true);
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
                        source={require('../../assets/images/reset-password.png')}
                        resizeMode='contain'
                        style={{
                            width: width,
                            height: height * 0.35
                        }}
                    />
                    <Text style={styles.greeting}>Reset Password?</Text>
                    <Text style={{ marginBottom: 30, color: '#000' }}>Don’t worry! It happens, Please enter your address associated with your Account.</Text>
                    <View style={{ gap: 20, marginBottom: 20 }}>
                        <InputField
                            value={token}
                            handleChange={setToken}
                            mode="outlined"
                            label="OTP"
                            placeholder='123456'
                            error={formErrors?.reset_token}
                            left={<TextInput.Icon icon="security" />}
                            containerSt={{ marginBottom: 20 }}
                            onSubmitEditing={() => {
                                passInput?.current?.focus();
                            }}
                            blurOnSubmit={false}
                        />
                        <PasswordField
                            mode="outlined"
                            label="Password"
                            placeholder="xxxxxx"
                            value={password}
                            error={formErrors?.password}
                            handleChange={setPassword}
                            left={<TextInput.Icon icon="lock" />}
                            onSubmitEditing={() => {
                                cPassInput?.current?.focus();
                            }}
                            ref={passInput}
                            blurOnSubmit={false}
                        />
                        <PasswordField
                            mode="outlined"
                            label="Confirm Password"
                            placeholder="xxxxxx"
                            value={confirmPassword}
                            error={formErrors?.confirmPassword}
                            handleChange={setConfirmPassword}
                            left={<TextInput.Icon icon="lock" />}
                            onSubmitEditing={()=>{handleRequest();Keyboard.dismiss()}}
                            ref={cPassInput}
                            blurOnSubmit={false}
                        />
                    </View>
                    <Button
                        theme={{ roundness: 1 }}
                        loading={isLoading}
                        disabled={isLoading}
                        mode="contained"
                        onPress={handleRequest}
                    >Reset Password</Button>
                </View>
            </ScrollView>
            <MyModal visible={visible} closeModal={()=>navigation.navigate('SignIn')} gotError={gotError} />
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

export default ResetPassword;