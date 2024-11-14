import { useEffect } from 'react';
import Toastify from 'toastify-js'; 
import { useAppDispatch } from '@/redux/hook';
import { setUser } from '@/redux/feature/user/userSlice';
import { useGetToken } from './useGetToken';

export const GetUser = () => {
  const dispatch = useAppDispatch();
  const token = useGetToken();

  useEffect(() => {
    if (token) {
      const getUser = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/user`, {
            headers: {
              Authorization: `${token}`,
            },
          });

          // Asegúrate de que la respuesta sea un JSON válido
          const data = await res.json();

          // Asegúrate de que la respuesta tenga el formato esperado
          dispatch(setUser(data)); // Suponiendo que `data` es el usuario
        } catch (error) {
          console.error(error);

          Toastify({
            text: "Error al obtener el usuario",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: { background: "red" },
          }).showToast();
        }
      };

      getUser();
    }
  }, [token, dispatch]);

  return null; // El componente no renderiza nada visualmente, solo ejecuta la lógica
};

