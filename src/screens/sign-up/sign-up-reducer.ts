export interface InitialState {
    user_name: string;
    email: string;
    pass: string;
    c_pass: string;
    phone: string;
    formErrors:any
}

export const initialState: InitialState = {
    user_name: '',
    email: '',
    pass: '',
    c_pass: '',
    phone: '',
    formErrors:{}
};

export function reducer(state: any, action: any) {
    const { type, payload } = action;
    if (type === 'setName') {
        return {...state,user_name :payload};
    }
    if (type === 'setEmail') {
        return {...state,email :payload};
    }
    if (type === 'setPass') {
        return {...state,pass :payload};
    }
    if (type === 'setConfirmPass') {
        return {...state,c_pass :payload};
    }
    if (type === 'setNumber') {
        return {...state,phone :payload};
    }
    if (type === 'setErrors') {
        return {...state,formErrors :payload};
    }
    throw Error(`Unknown action. ---- ${action}`);
}