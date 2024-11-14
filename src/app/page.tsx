'use client';

import { ModalFriends } from "@/components/modals/modalFriends/ModalFriends";

export default function Home() {
 
  return (
    <div>
      <ModalFriends />
      {/* {pendingRequests.length > 0 ? (
        <ul>
          {pendingRequests.map((request) => (
            <li key={request}>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes solicitudes pendientes</p>
      )} */}
    </div>
  );
}
