import Popover from '@mui/material/Popover';
import { Badge } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAppSelector } from '@/redux/hook';
import { useEffect, useState } from 'react';
import { useGetToken } from '@/hook/useGetToken';
import { io } from 'socket.io-client';
import axios from 'axios';
import { CardNotificationUser } from './CardNotificationUser';
import { FriendAdd } from '@/interfaces/user';





export function NotificationUser() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;


  const user = useAppSelector((state) => state.user);
  const updateComponent = useAppSelector((state) => state.updateComponent.value);
  const [pendingRequests, setPendingRequests] = useState([]); // Estado para almacenar solicitudes pendientes
  const [pendingCount, setPendingCount] = useState(0); // Estado para el contador
  const token = useGetToken();

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL, {
      query: { userId: user.id },
      transports: ['websocket'],
    });

    // Función para cargar solicitudes pendientes y contador
    const loadPendingRequests = async () => {
      try {
        if (!token) {
          return;
        }
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}friend/pending/${user.id}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        console.log(response.data);
        setPendingRequests(response.data.users); // Actualizar el estado con las solicitudes pendientes
        setPendingCount(response.data.count); // Actualizar el contador de solicitudes pendientes
      } catch (error) {
        console.error("Error al cargar las solicitudes pendientes:", error);
      }
    };

    if (token && user.id) {
      loadPendingRequests();
    }

    // Escuchar nuevas solicitudes de amistad en tiempo real
    socket.on('newFriendRequest', () => {
      console.log('Nueva solicitud de amistad recibida');
      loadPendingRequests(); // Recargar solicitudes pendientes y contador
    });

    socket.on('friendRequestRejected', () => {
      console.log('Solicitud de amistad rechazada');
      loadPendingRequests(); // Recargar solicitudes pendientes y contador
    });

    // Limpiar la conexión al desmontar el componente
    return () => {
      socket.disconnect();
    };
  }, [token, user.id, updateComponent]);


  return (
    <div>
      <Badge badgeContent={pendingCount} color="primary" onClick={handleClick}>
        <PersonAddIcon color="action" />
      </Badge>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <div className='p-3'>
          <p className='font-bold text-sm'>Aceptar solicitudes</p>


          <div className='mt-5'>
            {pendingRequests && pendingRequests.length > 0 ? (
              <div className='flex flex-col gap-4'>
                {pendingRequests.map((user: FriendAdd) => (
                  <CardNotificationUser key={user.id} userFriend={user}/>
                ))}
              </div>
            ) : (
              <p className='text-sm'>No tienes solicitudes pendientes</p>
            )}
          </div>

        </div>

      </Popover>
    </div>
  );
}
