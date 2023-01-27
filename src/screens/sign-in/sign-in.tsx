import React, { useRef, useState } from 'react';

import { View, Text, StyleSheet, Image, useWindowDimensions, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';

import { COLORS } from '../../globals';
import { logInUser, openPopUp } from '../../store/reducer';
import errorsSetter from '../../helpers/errors-setter';
import { InputField, PasswordField } from '../../components';
import ApiManager from '../../api-manager';
import { getDbConnection } from '../../database/database';
import { insertUser } from '../../database/users';
import format from 'pretty-format';
import { Keyboard } from 'react-native';

function SignIn({ navigation }: { navigation: any }): JSX.Element {
    const { width, height } = useWindowDimensions();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [firstLoad, setFirstLoad] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formErrors, setFormErrors] = useState<object | any>({});

    const passwordInput = useRef(null);

    const dispatch = useDispatch();

    React.useEffect(() => {
        checkIsFirstTime();
    }, []);


    const checkIsFirstTime = async () => {
        try {
            let flag = await AsyncStorage.getItem('@firstTime');
            if (flag) {
                return
            } else {
                setFirstLoad(true);
            }
        } catch (error) {
            console.error("🚀 ~ file: sign-in.tsx ~ checkIsFirstTime ~ error", error);
        }
    }

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
        if (password === '') {
            _errors.password = 'Field is required.'
            flag = false;
        } else if (password.length <= 5) {
            _errors.password = 'Password should be 6 characters long.'
            flag = false;
        }
        setFormErrors(_errors);
        return flag;
    }

    const handleLogin = async () => {
        if (Boolean(validate())) {
            setIsLoading(true);
            try {
                let _fd: { email: string, password: string } = { email: email, password: password };
                let { data }: any = await ApiManager('post', 'login', _fd);
                await AsyncStorage.setItem('@token', data?.access_token);
                try {
                    const db = await getDbConnection();
                    await insertUser(db, data?.user, data?.access_token);
                    db.close();
                    dispatch(logInUser(data?.access_token));
                } catch (error) {
                    console.error("🚀 ~ file: sign-in.tsx ~ handleLogin ~ error", format(error))
                }
            } catch (error: any) {
                console.log("🚀 ~ file: sign-in.tsx:90 ~ handleLogin ~ error", format(error.response))
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
                    <Image
                        source={require('../../assets/images/tour-guide-cuate.png')}
                        resizeMode='contain'
                        style={{
                            width: width,
                            height: height * 0.35
                        }}
                    />
                    <Text style={styles.greeting}>Welcome{!firstLoad && ' Back'}</Text>
                    <Text style={{ marginBottom: 30, width: 280, color: '#000' }}>Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet</Text>
                    <View style={{ gap: 20 }}>
                        <InputField
                            mode="outlined"
                            label="Email address"
                            value={email}
                            handleChange={setEmail}
                            placeholder='johndoe@example.com'
                            error={formErrors?.email}
                            left={<TextInput.Icon icon="at" />}
                            onSubmitEditing={() => {
                                passwordInput?.current?.focus();
                            }}
                            blurOnSubmit={false}
                            keyboardType="email-address"
                        />
                        <PasswordField
                            mode="outlined"
                            label="Password"
                            value={password}
                            placeholder='xxxxxx'
                            error={formErrors?.password}
                            handleChange={setPassword}
                            left={<TextInput.Icon icon="lock" />}
                            onSubmitEditing={()=>{handleLogin();Keyboard.dismiss()}}
                            blurOnSubmit={false}
                            ref={passwordInput}
                        />
                    </View>
                    <View
                        style={{ alignItems: 'flex-end', marginBottom: 25, marginTop: 10 }}
                        children={<Button theme={{ roundness: 1 }} onPress={() => navigation.navigate('ForgetPassword')} textColor={COLORS.redMain}>Forget Password</Button>}
                    />
                    <Button
                        theme={{ roundness: 1 }}
                        loading={isLoading}
                        disabled={isLoading}
                        mode="contained"
                        onPress={handleLogin}
                    >Sign In</Button>
                    <MyDivider />
                    <Button
                        mode="contained"
                        theme={{ roundness: 1 }}
                        buttonColor='#000'
                        onPress={() => navigation.navigate('SignUp')}
                    >Sign Up</Button>
                </View>
            </ScrollView>
        </View>
    );
}

const MyDivider = () => {
    return (
        <View style={styles.dividerContainer}>
            <View style={{ flexGrow: 1, height: 1, backgroundColor: '#F9F9F9' }} />
            <Text style={{ paddingHorizontal: 2,color:'#333', fontFamily: 'Roboto-Medium' }}>OR</Text>
            <View style={{ flexGrow: 1, height: 1, backgroundColor: '#F9F9F9' }} />
            <View />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#fff'
    },
    hp: {
        paddingHorizontal: 10,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 15
    },
    greeting: {
        fontFamily: 'Roboto-Medium',
        fontSize: 28,
        marginBottom: 10,
        color: '#000'
    }
})

export default SignIn;