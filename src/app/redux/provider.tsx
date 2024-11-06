'use client';

import { Provider } from "react-redux";
import { store } from "./store";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

interface Props {
    children: React.ReactNode
}

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});
export function Providers({ children }: Props) {

    // useClearToken();

    return (

        <Provider store={store}>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </Provider>
    )
}