'use client';

import { Provider } from "react-redux";
import { store } from "./store";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/navbar/Navbar";
import { usePathname } from "next/navigation";
import { GetUser } from "@/hook/useGetUser";

interface Props {
    children: React.ReactNode
}

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

export function Providers({ children }: Props) {
    const pathname = usePathname();

    // Definir las rutas en las que no se debe mostrar el Navbar
    const noNavbarRoutes = ["/auth/register", "/auth/login"];

    return (
        <Provider store={store}>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <SessionProvider>
                    <GetUser />
                    {!noNavbarRoutes.includes(pathname) && <Navbar />}
                    {children}
                </SessionProvider>
            </ThemeProvider>
        </Provider>
    );
}
