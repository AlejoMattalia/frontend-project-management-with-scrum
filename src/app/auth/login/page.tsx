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
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import Toastify from "toastify-js";
import { useAppDispatch } from '@/redux/hook';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import GoogleIcon from '@mui/icons-material/Google';
import { loginUser } from './utils/loginUser';

export default function Page() {
    const { data: session } = useSession();
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
            const success = await loginUser({ values, dispatch });
            if (success) {
                router.push('/'); // Redirige solo si el registro es exitoso
            }
        },
    });


    const handleGoogleSignIn = async () => {
        try {
            await signIn('google');
        } catch (error) {
            console.log(error);
            Toastify({
                text: "Error al iniciar sesión con Google",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: { background: "red" },
            }).showToast();
        }
    };

    useEffect(() => {
        const registerWithGoogleSession = async () => {
            if (session?.user) {
                const values = {
                    email: session.user.email ?? '',
                    password: session.user.name ?? '',
                };

                if (!values.email || !values.password ) return;

                const success = await loginUser({ values, dispatch });
                if (success) router.push('/');
            }
        };
        registerWithGoogleSession();
    }, [session, dispatch, router]);


    return (
        <section className="min-h-screen flex items-center justify-center p-3 ">
            <div className="flex flex-col w-full max-w-[600px] min-h-[400px] bg-darkGray p-10 rounded-xl">
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

                    <p className="flex items-center justify-center">-- o --</p>

                    <button
                        type="button"
                        className="bg-[#0062ff] text-white p-2 rounded flex items-center gap-2 justify-center cursor-pointer"
                        onClick={handleGoogleSignIn}
                    >
                        <GoogleIcon /> Iniciar sesión con Google
                    </button>

                    <p className='text-sm'>¿No ténes cuenta? <span onClick={() => router.push('/auth/register')} className="text-blue-500 cursor-pointer">Registrate</span></p>
                </form>
            </div>
        </section>
    );
}