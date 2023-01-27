import * as React from 'react';

import { View, Text, StyleSheet, Image, useWindowDimensions, Keyboard, ScrollView, Alert, TouchableOpacity } from 'react-native';

import { TextInput, FAB } from 'react-native-paper';
import { Button } from 'react-native-paper';
import format from 'pretty-format';

import { reducer, initialState } from './sign-up-reducer';
import { COLORS } from '../../globals';
import errorsSetter from '../../helpers/errors-setter';
import { InputField, PasswordField } from '../../components';
import { useDispatch } from 'react-redux';
import { openPopUp } from '../../store/reducer';
import ApiManager from '../../api-manager';

function SignUp({ navigation }: any): JSX.Element {

    const [_state, _dispatch] = React.useReducer(reducer, initialState);
    const { user_name, email, pass, c_pass, phone, formErrors } = _state;
    const [isLoading, setIsLoading] = React.useState(false);
    const { width, height } = useWindowDimensions();
    const dispatch = useDispatch();
    const emailInput = React.useRef(null);
    const passInput = React.useRef(null);
    const cPassInput = React.useRef(null);
    const numInput = React.useRef(null);

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
        if (pass === '') {
            _errors.pass = 'Field is required.'
            flag = false;
        } else if (pass.length < 5) {
            _errors.pass = 'Password should be 6 characters long.'
            flag = false;
        }
        if (c_pass === '') {
            _errors.c_pass = 'Field is required.'
            flag = false;
        } else if (pass !== c_pass) {
            _errors.pass = 'Password does not match.'
            _errors.c_pass = 'Password does not match.'
            flag = false;
        }
        if (user_name === '') {
            _errors.user_name = 'Field is required.'
            flag = false;
        }
        if (phone === '') {
            _errors.phone = 'Field is required.'
            flag = false;
        }
        _dispatch({ type: 'setErrors', payload: _errors });
        return flag;
    }

    const showAlert = () =>
        Alert.alert(
            'Welcome',
            'Your account has been created successfully.Please sign in to continue.',
            [
                {
                    text: 'ok',
                    onPress: () => navigation.navigate('SignIn'),
                    style: 'cancel',
                },
            ],
        );

    const handleSignUp = async () => {
        if (Boolean(validate())) {
            setIsLoading(true);
            try {
                let _fd: { user_name: string, email: string, phone: string, password: string,confirm_password:string } = {
                    user_name: user_name,
                    email: email,
                    password: pass,
                    confirm_password: c_pass,
                    phone: phone
                }
                await ApiManager('post', 'register', _fd);
                showAlert();
            } catch (error: any) {
                console.log("🚀 ~ file: sign-up.tsx:94 ~ handleSignUp ~ error", format(error?.response?.data));
                if (error?.response?.status === 422) {
                    _dispatch({ type: 'setErrors', payload: errorsSetter(error) });
                } else {
                    dispatch(openPopUp(error?.response?.data?.message));
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
                        source={require('../../assets/images/tour-guide-pana.png')}
                        resizeMode='contain'
                        style={{
                            width: width,
                            height: height * 0.35
                        }}
                    />
                    <Text style={styles.greeting}>Sign Up</Text>
                    <Text style={{ marginBottom: 30, width: 280, color: '#000' }}>Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet</Text>
                    <View style={{ gap: 15, marginBottom: 20 }}>
                        <InputField
                            mode="outlined"
                            label="Name"
                            placeholder='John Doe'
                            value={user_name}
                            handleChange={e => _dispatch({ type: 'setName', payload: e })}
                            error={formErrors?.user_name}
                            onSubmitEditing={() => {
                                emailInput?.current?.focus();
                            }}
                            blurOnSubmit={false}
                        />
                        <InputField
                            mode="outlined"
                            label="Email address"
                            placeholder='johndoe@example.com'
                            value={email}
                            handleChange={e => _dispatch({ type: 'setEmail', payload: e })}
                            error={formErrors?.email}
                            left={<TextInput.Icon icon="at" />}
                            onSubmitEditing={() => {
                                passInput?.current?.focus();
                            }}
                            ref={emailInput}
                            blurOnSubmit={false}
                            keyboardType="email-address"
                        />
                        <PasswordField
                            mode="outlined"
                            label="Password"
                            value={pass}
                            placeholder='xxxxxx'
                            error={formErrors?.pass}
                            handleChange={e => _dispatch({ type: 'setPass', payload: e })}
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
                            value={c_pass}
                            placeholder='xxxxxx'
                            error={formErrors?.c_pass}
                            handleChange={e => _dispatch({ type: 'setConfirmPass', payload: e })}
                            left={<TextInput.Icon icon="lock" />}
                            onSubmitEditing={() => {
                                numInput?.current?.focus();
                            }}
                            ref={cPassInput}
                            blurOnSubmit={false}
                        />
                        <InputField
                            mode="outlined"
                            label="Phone Number"
                            placeholder='123-456-789-111'
                            value={phone}
                            handleChange={e => _dispatch({ type: 'setNumber', payload: e })}
                            error={formErrors?.phone}
                            left={<TextInput.Icon icon="phone" />}
                            onSubmitEditing={()=>{handleSignUp();Keyboard.dismiss()}}
                            ref={numInput}
                            blurOnSubmit={false}
                        />
                    </View>
                    <Button
                        theme={{ roundness: 1 }}
                        loading={isLoading}
                        disabled={isLoading}
                        mode="contained"
                        onPress={handleSignUp}
                    >Sign Up</Button>
                    <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center' }}>
                        <Text style={{ color: '#000' }}>Joined us Before?{' '}</Text>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => navigation.navigate('SignIn')}
                        >
                            <Text style={{ fontWeight: '700', color: '#000' }}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View >
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

export default SignUp;