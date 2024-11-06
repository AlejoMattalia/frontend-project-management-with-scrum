'use client'

import EmailIcon from '@mui/icons-material/Email';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
    InputAdornment,
    TextField,
    FormControl,
    InputLabel,
    OutlinedInput,
    IconButton,
} from "@mui/material";
import axios from 'axios';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import Toastify from "toastify-js";
import Cookies from "js-cookie";
import { useAppDispatch } from '@/app/redux/hook';
import { setUser } from '@/app/redux/feature/user/userSlice';
import { useRouter } from 'next/navigation';

export default function Page() {
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useAppDispatch();
    const router = useRouter();

    // Funciones para mostrar y ocultar la contraseña
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    // Esquema de validación con Yup
    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Correo electrónico inválido')
            .required('El correo electrónico es obligatorio'),
        password: Yup.string()
            .min(8, 'La contraseña debe tener al menos 8 caracteres')
            .required('La contraseña es obligatoria')
    });

    // Configuración de Formik
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values) => {
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
                router.push('/');
            }
            catch (err) {
                console.log(err)
                if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
                    Toastify({
                        text: (err.response.data as { message: string }).message,
                        duration: 3000,
                        close: true,
                        gravity: "top",
                        position: "right",
                        stopOnFocus: true,
                        style: {
                            background: "red",
                        },
                    }).showToast();
                }
            }
        },
    });


    return (
        <section className="min-h-screen flex items-center justify-center p-3 ">
            <div className="flex flex-col w-full max-w-[600px] min-h-[400px] bg-darkGray p-10 rounded-xl relative bottom-20">
                <h1 className="text-3xl font-bold mb-10">Iniciar Sesión</h1>
                <form className='flex flex-col gap-5 w-full' onSubmit={formik.handleSubmit}>
                    <TextField
                        label="Email"
                        id="email"
                        name="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <FormControl variant="outlined" error={formik.touched.password && Boolean(formik.errors.password)}>
                        <InputLabel htmlFor="outlined-adornment-password">Contraseña</InputLabel>
                        <OutlinedInput
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Contraseña"
                        />
                        {formik.touched.password && formik.errors.password && (
                            <p className="text-[#f44336] text-[0.75rem] relative left-[14px] mt-0.5">{formik.errors.password}</p>
                        )}
                    </FormControl>
                    <button type="submit" className="mt-5 bg-blue-500 text-white p-2 rounded">
                        Iniciar sesion
                    </button>

                    <p className='text-sm'>¿No ténes cuenta? <span onClick={() => router.push('/auth/register')} className="text-blue-500 cursor-pointer">Registrate</span></p>
                </form>
            </div>
        </section>
    );
}