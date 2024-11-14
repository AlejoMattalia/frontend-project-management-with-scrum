import { FriendAdd } from '@/interfaces/user'
import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { IconButton, Tooltip, tooltipClasses } from '@mui/material';
import axios from 'axios';
import Toastify from 'toastify-js';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { useGetToken } from '@/hook/useGetToken';
import { increment } from '@/redux/feature/updateComponent/updateComponentSlice';


interface Props {
    userFriend: FriendAdd
}

export const CardNotificationUser = ({ userFriend }: Props) => {

    const user = useAppSelector((state) => state.user);
    const token = useGetToken();
    const dispatch = useAppDispatch();

    const rejectFriend = async () => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}friend/delete/${userFriend.id}/${user.id}`, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            
            dispatch(increment());
            Toastify({
                text: 'Rechazaste la solicitud de amistad',
                duration: 3000,
                close: true,
                gravity: 'top',
                position: 'right',
                stopOnFocus: true,
                style: { background: 'red' },
            }).showToast();

        } catch (error) {
            console.error('Error al rechazar la solicitud de amistad:', error);
            Toastify({
                text: 'Error al rechazar la solicitud de amistad',
                duration: 3000,
                close: true,
                gravity: 'top',
                position: 'right',
                stopOnFocus: true,
                style: { background: 'red' },
            }).showToast();
        }
    };



    const acceptFriend = async () => {
        try {
            await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}friend/accept/${userFriend.id}/${user.id}`, {}, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            dispatch(increment());


            Toastify({
                text: 'Aceptaste la solicitud de amistad',
                duration: 3000,
                close: true,
                gravity: 'top',
                position: 'right',
                stopOnFocus: true,
                style: { background: '#25D366' },
            }).showToast();

        } catch (error) {
            console.error('Error al aceptar la solicitud de amistad:', error);
            Toastify({
                text: 'Error al aceptar la solicitud de amistad',
                duration: 3000,
                close: true,
                gravity: 'top',
                position: 'right',
                stopOnFocus: true,
                style: { background: 'red' },
            }).showToast();
        }
    }


    return (
        <div className='w-full flex gap-10 justify-between items-center'>
            <div className='flex items-center gap-2'>
                <div className='w-[40px] h-[40px]'>
                    <img src={userFriend.image_url} alt='' className='w-full h-full object-cover rounded-full' />
                </div>

                <p className='text-sm'>{userFriend.name}</p>
            </div>



            <div>
                <Tooltip
                    onClick={acceptFriend}
                    title='Aceptar Solicitud'
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
                        <CheckIcon color='success' />
                    </IconButton>
                </Tooltip>

                <Tooltip
                    onClick={rejectFriend}
                    title='Rechazar Solicitud'
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
                        <CloseIcon color='error' />
                    </IconButton>
                </Tooltip>
            </div>
        </div>
    )
}

