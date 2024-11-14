import React, { useState } from 'react';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { IconButton, Tooltip, tooltipClasses } from '@mui/material';
import { useAppSelector } from '@/redux/hook';
import Toastify from 'toastify-js';
import axios from 'axios';
import { useGetToken } from '@/hook/useGetToken';
import UndoIcon from '@mui/icons-material/Undo';
import { Friends } from '@/interfaces/friend';


export const CardAddFriend = ({ name, img, email, friendId }: Friends) => {
    const user = useAppSelector((state) => state.user);
    const token = useGetToken();
    const [requestSent, setRequestSent] = useState(false);

    const addUser = async () => {
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}friend/add`,
                { userId: user.id, friendId: friendId },
                { headers: { Authorization: `${token}` } }
            );

            Toastify({
                text: 'Solicitud de amistad enviada',
                duration: 3000,
                close: true,
                gravity: 'top',
                position: 'right',
                stopOnFocus: true,
                style: { background: '#25D366' },
            }).showToast();

            setRequestSent(true);
        } catch (error) {
            console.log(error);

            Toastify({
                text: 'Error al agregar amigo',
                duration: 3000,
                close: true,
                gravity: 'top',
                position: 'right',
                stopOnFocus: true,
                style: { background: 'red' },
            }).showToast();
        }
    };

    const undoRequest = async() => {
        
        try{
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}friend/delete/${friendId}/${user.id}`,
                { headers: { Authorization: `${token}` } }
            );

            Toastify({
                text: 'Deshaciste la solicitud de amistad',
                duration: 3000,
                close: true,
                gravity: 'top',
                position: 'right',
                stopOnFocus: true,
                style: { background: '#25D366' },
            }).showToast();


            setRequestSent(false);
        }
        catch(error){
            console.log(error);

            Toastify({
                text: 'Error al deshacer la solicitud de amistad',
                duration: 3000,
                close: true,
                gravity: 'top',
                position: 'right',
                stopOnFocus: true,
                style: { background: 'red' },
            }).showToast();
        }
    };

    return (
        <div className='w-full flex items-center justify-between'>
            <header className='flex items-center gap-2'>
                <div className='w-[50px] h-[50px]'>
                    <img src={img} alt='' className='w-full h-full object-cover rounded-full' />
                </div>

                <div className='flex flex-col'>
                    <p className='font-bold text-sm'>{name}</p>
                    <p className='text-xs'>{email}</p>
                </div>
            </header>

            {requestSent ? (
                <Tooltip
                    onClick={undoRequest}
                    title='Deshacer Solicitud'
                    slotProps={{
                        popper: {
                            sx: {
                                [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]: {
                                    marginTop: '0px',
                                },
                            },
                        },
                    }}
                >
                    <IconButton>
                        <UndoIcon color='error'/>
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip
                    onClick={addUser}
                    title='Agregar Amigo'
                    slotProps={{
                        popper: {
                            sx: {
                                [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]: {
                                    marginTop: '0px',
                                },
                            },
                        },
                    }}
                >
                    <IconButton>
                        <PersonAddIcon color='primary'/>
                    </IconButton>
                </Tooltip>
            )}
        </div>
    );
};
