import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Button, IconButton, Tooltip, tooltipClasses } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Toastify from 'toastify-js';
import { useGetToken } from '@/hook/useGetToken';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { increment } from '@/redux/feature/updateComponent/updateComponentSlice';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export function ModalDeleteFriend({friendId}: {friendId: string}) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const token = useGetToken();

    const deleteFriend = async () => {
        try{
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}friend/delete/${friendId}/${user.id}`,
                { headers: { Authorization: `${token}` } }
            );

            Toastify({
                text: 'Amigo eliminado',
                duration: 3000,
                close: true,
                gravity: 'top',
                position: 'right',
                stopOnFocus: true,
                style: { background: '#25D366' },
            }).showToast();

            dispatch(increment());
            handleClose();
        }
        catch(error){
            console.log(error);

            Toastify({
                text: 'Error al eliminar amigo',
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
        <div>
            <Tooltip
                onClick={handleOpen}
                title='Eliminar amigo'
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
                    <DeleteIcon color='error' />
                </IconButton>
            </Tooltip>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <p className='text-2xl'>¿Eliminar amigo?</p>
                    
                    <div className='w-full flex items-center justify-end gap-2 mt-5'>
                        <Button variant='outlined' onClick={handleClose} color='primary'>Cancelar</Button>
                        <Button variant='contained' onClick={deleteFriend} color='error'>Eliminar</Button>
                    </div>

                </Box>
            </Modal>
        </div>
    );
}
