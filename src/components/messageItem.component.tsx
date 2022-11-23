import React from 'react'
import { useSession } from 'next-auth/react'
import type { Message } from '../constants/schemas'

const MessageItem = (props: Message) => {
  const { data: session } = useSession()

  console.log('***', session)

  const {
    message,
    sender,

  } = props

  return (
    <li>
      {message}
    </li>
  )
}

export default MessageItem