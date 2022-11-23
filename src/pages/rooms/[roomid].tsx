import React, { ChangeEvent, useState } from 'react'
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from 'next/router';

import { trpc } from '../../utils/trpc';
import { Message } from '../../constants/schemas';
import MessageItem from '../../components/messageItem.component';

const RoomId = () => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])

  const { query } = useRouter()
  const roomId = query.roomId as string;
  const { data: session } = useSession()

  const { mutateAsync: sendMessageMutation } = trpc.room.sendMessage.useMutation()

  trpc.room.onSendMessage.useSubscription({ roomId }, {
    onData: (message) => {
      setMessages((m) => {
        return [...m, message]
      })
    }
  })

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target
    if (!value) return
    setMessage(value)
  }

  const handleSendMessage = () => {
    console.log(message)
  }

  if (!session) return (
    <main className="container flex flex-col items-center justify-center min-h-screen gap-5 p-4 mx-auto">
      <button onClick={() => signIn()} className="relative inline-block px-4 py-2 font-medium group">
        <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
        <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-black"></span>
        <span className="relative text-black group-hover:text-white">Tap to login :D</span>
      </button>
    </main>
  )

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen gap-5 p-4 mx-auto">
      <ul>
        {
          messages.map((message) => (
            <div className='flex gap-1'>
              <p>{message.message}</p>
              <span>-</span>
              <p>{message.sender.name}</p>
            </div>
          )
          )
        }
      </ul>
      <form
        className='flex flex-col items-center justify-center gap-5 p-4'
        onSubmit={(e) => {
          e.preventDefault()
          sendMessageMutation({
            roomId,
            message,
          })
          setMessage('')
        }}
      >
        <textarea
          onChange={handleTextChange}
          className='p-4 border-2 border-black rounded-md shadow-lg resize-none'
          placeholder='What would you like to say?'
          value={message}
          name=""
          id=""
          cols={30}
          rows={10}
        />
        <button
          onClick={handleSendMessage}
          className="relative inline-block px-4 py-2 font-medium group"
        >
          <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
          <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-black"></span>
          <span className="relative text-black group-hover:text-white">&gt; Send your message &lt;</span>
        </button>
      </form>

      <div className='absolute top-2 left-2'>
        <button onClick={() => signOut()} className="relative inline-block px-4 py-2 font-medium group">
          <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
          <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-black"></span>
          <span className="relative text-black group-hover:text-white">Tap to logout :(</span>
        </button>
      </div>
    </div>
  )
}

export default RoomId