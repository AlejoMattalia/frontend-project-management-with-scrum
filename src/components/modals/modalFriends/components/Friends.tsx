import { useGetToken } from '@/hook/useGetToken';
import { useAppSelector } from '@/redux/hook';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Toastify from 'toastify-js';
import { InfiniteUserScroll } from './InfiniteScroll';
import { TextField } from '@mui/material';
import { User } from '@/interfaces/user';

export const Friends = () => {
  const user = useAppSelector((state) => state.user);
  const updateComponent = useAppSelector((state) => state.updateComponent.value);
  const token = useGetToken();

  const [friends, setFriends] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
  const [filteredFriends, setFilteredFriends] = useState<User[]>([]); // Estado para almacenar los amigos filtrados

  useEffect(() => {
    const getFriends = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}friend/friends/${user.id}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setFriends(response.data);
        setFilteredFriends(response.data); // Inicializar el filtro con todos los amigos
      } catch (error) {
        console.log(error);
        Toastify({
          text: 'Error al obtener amigos',
          duration: 3000,
          close: true,
          gravity: 'top',
          position: 'right',
          stopOnFocus: true,
          style: { background: 'red' },
        }).showToast();
      }
    };

    if (token && user.id) {
      getFriends();
    }
  }, [token, user.id, updateComponent]);

  // Actualizar el filtro de amigos cuando cambie el término de búsqueda
  useEffect(() => {
    const filtered = friends.filter((friend) =>
      friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFriends(filtered);
  }, [searchTerm, friends]);

  return (
    <div className='w-full'>
      <TextField
        id="outlined-basic"
        label="Buscar Usuario"
        variant="outlined"
        fullWidth
        size='small'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mt: 1 }}
      />
      <div className='mt-4'>
        {filteredFriends.length === 0 ? (
          <p className='text-sm'>No tienes amigos</p>
        ) : <InfiniteUserScroll users={filteredFriends} friend={true} />}

      </div>
    </div>
  );
};
