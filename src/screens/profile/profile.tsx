import React, { useState } from 'react';

import { View, Platform, StyleSheet, useWindowDimensions, ScrollView, Keyboard, Alert } from 'react-native';
import { FAB, Avatar, Button, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { launchImageLibrary } from 'react-native-image-picker';
import format from 'pretty-format';

import { COLORS } from '../../globals';
import { getDbConnection } from '../../database/database';
import { dropUser, getUser, updateUser } from '../../database/users';
import { logOutUser, openPopUp } from '../../store/reducer';
import ApiManager from '../../api-manager';
import errorsSetter from '../../helpers/errors-setter';
import { InputField, PasswordField } from '../../components';

function Profile({ navigation }: { navigation: any }): JSX.Element {
    const { width } = useWindowDimensions();
    const [records, setRecords] = useState<any>([]);
    const { token, isNetAvailable } = useSelector((state: any) => state.storeReducer);
    const [formData, setFormData] = useState<object | any>({
        avatar: '',
        profile_image: '',
        user_name: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });
    const [formErrors, setFormErrors] = useState<object | any>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const passInput = React.useRef(null);
    const cPassInput = React.useRef(null);
    const numInput = React.useRef(null);

    const dispatch = useDispatch();

    React.useEffect(() => {
        getData();
    }, []);

    // getting user from local db
    const getData = async () => {
        const db = await getDbConnection();
        try {
            let data = await getUser(db);
            console.log("🚀 ~ file: profile.tsx:47 ~ getData ~ data", data)
            setRecords(data);
            setFormData({
                ...formData,
                user_name: data?.user_name,
                avatar: data?.profile_image,
                phone: data?.phone.toString(),
            })
        } catch (error: any) {
            console.error("🚀 ~ file: profile.tsx ~ getData ~ error", format(error))
        } finally {
            db.close();
        }
    }

    const onImageLibraryPress = async () => {
        var result: any = await launchImageLibrary(
            {
                selectionLimit: 1,
                mediaType: 'photo',
                includeBase64: false,
            },
            result => profileImage(result),
        );
    };

    const profileImage = async (result: any) => {
        if (result == null || result.didCancel) return;
        const uri = await result?.assets[0];
        let createObj = {
            name:uri.fileName,
            type:uri.type,
            uri: Platform.OS === 'android' ? uri.uri : uri.uri.replace('file://', ''),
        }
        setFormData({ ...formData, avatar: uri.uri, profile_image: createObj })
    }

    const logout = async () => {
        try {
            const db = await getDbConnection();
            await dropUser(db);
            db.close();
            dispatch(logOutUser());
        } catch (error) {
            console.error("🚀 ~ file: welcome.tsx:101 ~ logout ~ error", format(error))
        }
    }

    const validate = () => {
        let flag = true;
        let _errors: any = {}
        const { password, confirmPassword, user_name, phone } = formData;
        if (password !== '' && password.length < 5) {
            _errors.password = 'Password should be 6 characters long.'
            flag = false;
        }
        if (password !== '' && confirmPassword === '') {
            _errors.confirmPassword = 'Field is required.'
            flag = false;
        } else if (password !== confirmPassword) {
            _errors.password = 'Password does not match.'
            _errors.confirmPassword = 'Password does not match.'
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
        setFormErrors(_errors);
        return flag;
    }

    const showAlert = () =>
        Alert.alert(
            '',
            'Please connect to internet and then try again.',
            [
                {
                    text: 'ok',
                    style: 'cancel',
                },
            ],
            { cancelable: true }
        );

    const handleUpdate = async () => {
        if (!isNetAvailable) {
            showAlert();
            return;
        }
        if (Boolean(validate())) {
            let _fd = new FormData();
            _fd.append('user_name', formData.user_name);
            _fd.append('phone', formData.phone);
            if (formData.password !== '') {
                _fd.append('password', formData.password);
            }
            if (formData?.profile_image !== '') {
                _fd.append('profile_image', formData?.profile_image);
            }
            try {
                setIsLoading(true);
                let { data }: any = await ApiManager('post', 'update/profile', _fd, token, { "Content-Type": "multipart/form-data" });
                const db = await getDbConnection();
                let user: any = await updateUser(db, data);
                setRecords(user);
                setFormData({
                    ...formData,
                    user_name: user?.user_name,
                    avatar: user?.profile_image,
                    phone: user?.phone.toString(),
                })
                db.close();
                dispatch(openPopUp('Profile updated successfully'))
            } catch (error: any) {
                if (error?.response?.status === 422) {
                    setFormErrors(errorsSetter(error));
                } else {
                    dispatch(openPopUp(error?.response?.data?.message));
                }
            } finally {
                setIsLoading(false);
            }
        }
    }

    const myForm = () => {
        return (
            <View style={{ gap: 20 }}>
                <InputField
                    mode="outlined"
                    label="Name"
                    value={formData?.user_name || ''}
                    handleChange={(e: any) => setFormData({ ...formData, user_name: e })}
                    placeholder='Name'
                    error={formErrors?.user_name}
                    left={<TextInput.Icon icon="at" />}
                    onSubmitEditing={() => {
                        numInput?.current?.focus();
                    }}
                    blurOnSubmit={false}
                />
                <InputField
                    mode="outlined"
                    label="Name"
                    value={records?.email}
                    left={<TextInput.Icon icon="at" />}
                    disabled
                />
                <InputField
                    mode="outlined"
                    label="Phone Number"
                    placeholder='123-456-789-111'
                    value={formData?.phone || ''}
                    handleChange={(e: any) => setFormData({ ...formData, phone: e })}
                    error={formErrors?.phone}
                    left={<TextInput.Icon icon="phone" />}
                    onSubmitEditing={() => {
                        passInput?.current?.focus();
                    }}
                    blurOnSubmit={false}
                    ref={numInput}
                />
                <PasswordField
                    mode="outlined"
                    label="Password"
                    value={formData?.password}
                    placeholder='xxxxxx'
                    error={formErrors?.password}
                    handleChange={(e: any) => setFormData({ ...formData, password: e })}
                    left={<TextInput.Icon icon="lock" />}
                    onSubmitEditing={() => {
                        cPassInput?.current?.focus();
                    }}
                    blurOnSubmit={false}
                    ref={passInput}
                />
                <PasswordField
                    mode="outlined"
                    label="Confirm Password"
                    value={formData?.confirmPassword}
                    placeholder='xxxxxx'
                    error={formErrors?.confirmPassword}
                    handleChange={(e: any) => setFormData({ ...formData, confirmPassword: e })}
                    left={<TextInput.Icon icon="lock" />}
                    onSubmitEditing={() => { handleUpdate(); Keyboard.dismiss() }}
                    blurOnSubmit={false}
                    ref={cPassInput}
                />
                <Button
                    theme={{ roundness: 1 }}
                    loading={isLoading}
                    disabled={isLoading}
                    mode="contained"
                    onPress={handleUpdate}
                >Submit</Button>
            </View>
        )
    }

    return (
        <>
            <View style={styles.container}>
                <View style={styles.fabContainer}>
                    <FAB
                        theme={{ roundness: 20 }}
                        icon="arrow-left"
                        color={COLORS.primary}
                        size="small"
                        style={{ backgroundColor: '#FFFFFF' }}
                        onPress={() => navigation.navigate('Welcome')}
                    />
                    <FAB
                        theme={{ roundness: 20 }}
                        icon="logout"
                        color={COLORS.primary}
                        size="small"
                        style={{ backgroundColor: '#FFFFFF' }}
                        onPress={logout}
                    />

                </View>
                <ScrollView showsHorizontalScrollIndicator={false}>
                    <View style={styles.hp}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 45, marginBottom: 15 }}>
                            {formData?.avatar !== '' ?
                                <Avatar.Image size={width * 0.35} source={{ uri: formData?.avatar }} />
                                : <Avatar.Icon size={width * 0.35} icon="face-man" color='#fff' />
                            }
                            <FAB
                                theme={{ roundness: 20 }}
                                icon="camera"
                                color={COLORS.primary}
                                size="small"
                                style={{ backgroundColor: '#FFFFFF', marginLeft: 60, marginTop: -25 }}
                                onPress={onImageLibraryPress}
                            />
                        </View>
                        {myForm()}
                    </View>
                </ScrollView>
            </View>
        </>
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
        paddingBottom: 25,
    },
    greeting: {
        fontFamily: 'Roboto-Medium',
        fontSize: 28,
        marginTop: 10,
        marginBottom: 10,
        color: '#000'
    },
    myTxt: {
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
        marginTop: 10,
        marginBottom: 10,
        color: '#000'
    },
    fabContainer: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        left: 0,
        top: 10,
        paddingHorizontal: 10,
        width: '100%',
        zIndex: 5,
    },
})

export default Profile;