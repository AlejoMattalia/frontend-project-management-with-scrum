'use client'

import React from 'react';
import { Button, Modal, Box } from '@mui/material';
import { AddFriend } from './components/AddFriend';
import { Friends } from './components/Friends';


const style = {
  position: 'absolute' ,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflowY: 'auto', // Para permitir el desplazamiento si el contenido es muy grande
  maxHeight: '90vh', // Limita la altura máxima al 90% de la pantalla
};

export function ModalFriends() {
  const [open, setOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("friends");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>Amigos</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <header className="flex items-center justify-between px-10">
            <p
              className={`font-bold cursor-pointer border-b-2 ${
                activeTab === "friends" ? "border-blue-500" : "border-transparent"
              } transition-all duration-300`}
              onClick={() => setActiveTab("friends")}
            >
              AMIGOS
            </p>
            <p
              className={`font-bold cursor-pointer border-b-2 ${
                activeTab === "addFriend" ? "border-blue-500" : "border-transparent"
              } transition-all duration-300`}
              onClick={() => setActiveTab("addFriend")}
            >
              AGREGAR AMIGO
            </p>
          </header>

          {/* Contenedor adaptable */}
          <div className="mt-4">
            {activeTab === "friends" ? (
              <div className="transition-all duration-300">
                <Friends />
              </div>
            ) : (
              <div className="transition-all duration-300">
                <AddFriend />
              </div>
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
}
