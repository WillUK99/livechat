import z from 'zod'

// saves adding bulky code to room.ts
export const sendMessageSchema = z.object({
  roomId: z.string(),
  message: z.string(),
})

const messageSchema = z.object({
  id: z.string(),
  roomId: z.string(),
  message: z.string(),
  sentAt: z.date(),
  sender: z.object({
    name: z.string(),
  }),
})

export type Message = z.TypeOf<typeof messageSchema>

export const messageSubSchema = z.object({
  roomId: z.string(),
})
