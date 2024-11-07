// src/utils/registerUser.ts
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import Toastify from 'toastify-js';
import { setUser } from '@/app/redux/feature/user/userSlice';
import { AppDispatch } from '@/app/redux/store';

interface RegisterValues {
    name: string;
    email: string;
    image_url: string;
    password: string;
}

interface Props {
    values: RegisterValues;
    dispatch: AppDispatch;
}

export const registerUser = async ({ values, dispatch }: Props): Promise<boolean> => {
    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}auth/register`, values);

        console.log(res);

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
        
        return true; // Indica éxito
    } catch (error) {
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
};
