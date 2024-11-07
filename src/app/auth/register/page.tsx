'use client';

import { useEffect, useState } from 'react';
import {
    InputAdornment,
    TextField,
    FormControl,
    InputLabel,
    OutlinedInput,
    IconButton,
} from "@mui/material";
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Toastify from "toastify-js";
import { useAppDispatch } from '@/redux/hook';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { registerUser } from './utils/registerUser';
import GoogleIcon from '@mui/icons-material/Google';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';

export default function Page() {
    const { data: session } = useSession();
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();

    const validationSchema = Yup.object({
        name: Yup.string().required('El nombre es obligatorio'),
        image_url: Yup.string().required('La URL de la imagen es obligatoria'),
        email: Yup.string().email('Correo electrónico inválido').required('El correo electrónico es obligatorio'),
        password: Yup.string().min(6, 'La contraseña debe tener al menos 8 caracteres').max(20, 'La contraseña debe tener menos de 20 caracteres').required('La contraseña es obligatoria'),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            image_url: '',
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            const success = await registerUser({ values, dispatch });
            if (success) {
                router.push('/'); // Redirige solo si el registro es exitoso
            }
        }
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
                    name: session.user.name ?? '',
                    image_url: session.user.image ?? '',
                    email: session.user.email ?? '',
                    password: session.user.name ?? '',
                };

                if (!values.name || !values.email || !values.password || !values.image_url) return;

                const success = await registerUser({ values, dispatch });
                if (success) router.push('/');
            }
        };
        registerWithGoogleSession();
    }, [session, dispatch, router]);

    return (
        <section className="min-h-screen flex items-center justify-center p-3 ">
            <div className="flex flex-col w-full max-w-[600px] bg-darkGray p-10 rounded-xl">
                <h1 className="text-3xl font-bold mb-10">Registrarse</h1>
                <form className="flex flex-col gap-5 w-full" onSubmit={formik.handleSubmit}>
                    <TextField
                        label="Nombre"
                        id="name"
                        name="name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="URL de la imagen"
                        id="image_url"
                        name="image_url"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.image_url}
                        error={formik.touched.image_url && Boolean(formik.errors.image_url)}
                        helperText={formik.touched.image_url && formik.errors.image_url}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CameraAltIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
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
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">Registrarse</button>

                    <p className="flex items-center justify-center">-- o --</p>

                    <button
                        type="button"
                        className="bg-[#0062ff] text-white p-2 rounded flex items-center gap-2 justify-center cursor-pointer"
                        onClick={handleGoogleSignIn}
                    >
                        <GoogleIcon /> Registrarse con Google
                    </button>

                    <p className="text-sm">
                        ¿Ya tienes una cuenta?{' '}
                        <span onClick={() => router.push('/auth/login')} className="text-blue-500 cursor-pointer">
                            Iniciar sesión
                        </span>
                    </p>
                </form>
            </div>
        </section>
    );
}
