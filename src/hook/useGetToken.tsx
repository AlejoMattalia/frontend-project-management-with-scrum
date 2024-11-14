import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useAppSelector } from '../redux/hook';

export const useGetToken = () => {
    const [token, setToken] = useState<string | null>(null);

    const updateComponent = useAppSelector((state) => state.updateComponent.value);

    useEffect(() => {
        // Obtén el token de las cookies
        const storedToken = Cookies.get('token'); // Reemplaza 'token' con el nombre de tu cookie

        if (storedToken) {
            setToken(storedToken);
        }

    }, [updateComponent]);

    return token;
};