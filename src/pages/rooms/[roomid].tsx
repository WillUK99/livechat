import React from 'react'
import { signIn, signOut, useSession } from "next-auth/react";

type Props = {}

const RoomId = (props: Props) => {
  const { data: session } = useSession()

  if (!session) return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 gap-5">
      <button onClick={() => signIn()} className="relative inline-block px-4 py-2 font-medium group">
        <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
        <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-black"></span>
        <span className="relative text-black group-hover:text-white">Tap to login</span>
      </button>
    </main>
  )

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 gap-5">
      <button onClick={() => signOut()} className="relative inline-block px-4 py-2 font-medium group">
        <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
        <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-black"></span>
        <span className="relative text-black group-hover:text-white">Tap to logout</span>
      </button>
    </main>
  )
}

export default RoomId