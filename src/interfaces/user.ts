export interface User {
    id: string;
    name: string;
    email: string;
    image_url: string;
}


export interface FriendAdd {
    email: string;
    friendRequestId: string;
    id: string;
    image_url: string;
    name: string;
    requestCreatedAt: string;
  }