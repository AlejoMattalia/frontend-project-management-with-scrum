import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import Toastify from 'toastify-js';
import { AppDispatch } from '@/redux/store';
import { setUser } from '@/redux/feature/user/userSlice';

interface loginValues {
    email: string;
    password: string;
}

interface Props {
    values: loginValues;
    dispatch: AppDispatch;
}

export const loginUser = async ({ values, dispatch }: Props): Promise<boolean> => {

    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}auth/login`, values);

        Toastify({
            text: res.data.message,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#25D366",
            },
        }).showToast();

        Cookies.set('token', res.data.token);
        dispatch(setUser(res.data.user));
        return true;
    }
    catch (error) {
        const err = error as AxiosError<{ message: string }>;
        
        if (err.response && err.response.data.message) {
            Toastify({
                text: err.response.data.message,
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "red",
                },
            }).showToast();
        } else {
            console.error("Unexpected error:", error);
        }
        
        return false; // Indica fallo
    }

}
