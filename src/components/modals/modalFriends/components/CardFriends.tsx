import { Friends } from '@/interfaces/friend'
import React from 'react'
import { ModalDeleteFriend } from './ModalDeleteFriend';

export const CardFriends = ({ name, email, img, friendId}: Friends) => {


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

            <ModalDeleteFriend friendId={friendId}/>
            </div>
    )
}
