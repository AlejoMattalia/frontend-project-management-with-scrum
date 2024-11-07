'use client'

import { useAppSelector } from "@/redux/hook";

export default function Home() {

  const user = useAppSelector((state) => state.user);

  console.log(user);

  return (
    <div>
      <p>Home</p>
    </div>
  );
}
