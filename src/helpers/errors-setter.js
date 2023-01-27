export default function errorsSetter(error) {
    let errObj = {};
    if (error?.response?.status === 422) {
        for (const [key, value] of Object.entries(
            error?.response?.data?.errors
        )) {
            errObj = { ...errObj, [key]: value[0] };
        }
    }
    return errObj;
}