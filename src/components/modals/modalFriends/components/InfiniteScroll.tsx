import { User } from '@/interfaces/user'
import React, { useState, useEffect, useRef } from 'react'
import { CardAddFriend } from './CardAddFriend'
import { CardFriends } from './CardFriends'

export const InfiniteUserScroll = ({ users, friend }: { users: User[], friend: boolean }) => {
  const [currentUsers, setCurrentUsers] = useState<User[]>([])
  const usersPerPage = 20
  const [loading, setLoading] = useState(false)

  // Referencia para el contenedor del scroll
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Inicializar con los primeros usuarios
    setCurrentUsers(users.slice(0, usersPerPage))
  }, [users])

  useEffect(() => {
    // Función para detectar cuando llegamos al final del contenedor
    const handleScroll = () => {
      const container = containerRef.current
      if (!container || loading) return

      const bottom = container.scrollHeight === container.scrollTop + container.clientHeight
      if (bottom && currentUsers.length < users.length) {
        loadMoreUsers()
      }
    }

    const loadMoreUsers = () => {
      if (loading) return

      setLoading(true)
      // Cargar más usuarios
      setTimeout(() => {
        const nextUsers = users.slice(currentUsers.length, currentUsers.length + usersPerPage)
        setCurrentUsers((prevUsers) => [...prevUsers, ...nextUsers])
        setLoading(false)
      }, 500) // Simulando un retraso (puedes eliminarlo si es innecesario)
    }

    // Agregar el listener de scroll
    const container = containerRef.current
    container?.addEventListener('scroll', handleScroll)

    return () => {
      // Limpiar el listener de scroll al desmontar el componente
      container?.removeEventListener('scroll', handleScroll)
    }
  }, [users, currentUsers, loading])

  const allUsersLoaded = currentUsers.length >= users.length

  return (
    <>
      <div ref={containerRef} className={`flex flex-col gap-3 mt-1 overflow-y-auto ${friend ? 'max-h-auto' : 'max-h-[300px]'}`}>
        {currentUsers.length > 0 ? (
          currentUsers.map((user) => (
            <>
              {
                friend ? (
                  <CardFriends
                    key={user.id}
                    name={user.name}
                    img={user.image_url}
                    email={user.email}
                    friendId={user.id}
                  />
                ) :
                  <CardAddFriend
                    key={user.id}
                    name={user.name}
                    img={user.image_url}
                    email={user.email}
                    friendId={user.id}
                  />
              }
            </>

          ))
        ) : (
          <p className='text-sm'>No se encontraron usuarios que coincidan con la búsqueda.</p>
        )}

        {loading && !allUsersLoaded && (
          <div className='flex items-center justify-center mt-3'>
            <span>Cargando más usuarios...</span>
          </div>
        )}
      </div>

      <style jsx>{`
    /* Estilizando el scrollbar */
    .overflow-y-auto::-webkit-scrollbar {
      width: 6px;
    }
  
    .overflow-y-auto::-webkit-scrollbar-thumb {
      background-color: #c1c1c1;
      border-radius: 8px;
    }
  
    .overflow-y-auto::-webkit-scrollbar-track {
      background-color: #f1f1f1;
    }
  `}</style>
    </>
  )
}

