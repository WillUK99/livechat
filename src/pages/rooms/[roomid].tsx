import React from 'react'
import { signIn, signOut, useSession } from "next-auth/react";

type Props = {}

const RoomId = (props: Props) => {
  const { data: session } = useSession()

  if (!session) return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 gap-5">
      <button onClick={() => signIn()} className='py-1 px-5 rounded-lg bg-green-500'>Login</button>
    </main>
  )

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 gap-5">
      <button onClick={() => signOut()} className='py-1 px-5 rounded-lg bg-red-500'>Logout</button>
    </main>
  )
}

export default RoomId