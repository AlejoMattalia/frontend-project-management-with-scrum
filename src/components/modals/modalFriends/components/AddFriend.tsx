import { useGetToken } from '@/hook/useGetToken';
import { useAppSelector } from '@/redux/hook';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { CardAddFriend } from './CardAddFriend';
import { TextField } from '@mui/material';
import { User } from '@/interfaces/user';
import { InfiniteUserScroll } from './InfiniteScroll';

// Definir la interfaz para un usuario

export const AddFriend: React.FC = () => {
    const user = useAppSelector((state) => state.user) as User;
    const token = useGetToken();

    // Estados para almacenar los usuarios
    const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>(''); // Estado para el término de búsqueda
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]); // Estado para usuarios filtrados

    // Función para cargar todos los usuarios una vez
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}friend/users/${user.id}`, {
                headers: {
                    Authorization: `${token}`,
                },
            });

            // Separar usuarios sugeridos y todos los demás usuarios
            setSuggestedUsers(res.data.suggestedUsers);
            setAllUsers(res.data.users);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    // Cargar usuarios una vez al montar el componente
    useEffect(() => {
        if (token) fetchUsers();
    }, [token]);

    // Función para normalizar texto (eliminar acentos y convertir a minúsculas)
    const normalizeText = (text: string) => {
        return text
            .normalize('NFD') // Normaliza a forma de descomposición
            .replace(/[\u0300-\u036f]/g, '') // Elimina los acentos
            .toLowerCase(); // Convierte a minúsculas
    };

    // Filtrar los usuarios cuando cambie el término de búsqueda
    useEffect(() => {
        const normalizedSearchTerm = normalizeText(searchTerm);

        // Combinar todos los usuarios y sugeridos para el filtrado
        const newArray = [...allUsers, ...suggestedUsers];

        const filtered = newArray.filter((user) => {
            const normalizedName = normalizeText(user.name);
            const normalizedEmail = normalizeText(user.email);
            return normalizedName.includes(normalizedSearchTerm) || normalizedEmail.includes(normalizedSearchTerm);
        });

        setFilteredUsers(filtered);
    }, [searchTerm, allUsers, suggestedUsers]);

    return (
        <div>
            <TextField
                id="outlined-basic"
                label="Buscar Usuario"
                variant="outlined"
                fullWidth
                size='small'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Actualizar el término de búsqueda
            />

            {!searchTerm && ( // Mostrar solo cuando no hay búsqueda
                <>
                    <h2 className='font-bold mt-5'>Usuarios Sugeridos</h2>
                    <div className='flex flex-col gap-3 mt-1'>
                        {suggestedUsers.map((user) => (
                            <CardAddFriend 
                                key={user.id} 
                                name={user.name} 
                                img={user.image_url} 
                                email={user.email} 
                                friendId={user.id}
                            />
                        ))}
                    </div>
                </>
            )}

            <h2 className='font-bold mt-5'>Todos los Usuarios</h2>
            <InfiniteUserScroll users={filteredUsers} friend={false}/>

            {loading && <p>Cargando...</p>}
        </div>
    );
};

