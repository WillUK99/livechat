import { router, publicProcedure } from "../trpc";
import { observable } from '@trpc/server/observable';
import { z } from "zod";
import { randomUUID } from "crypto";

import { Events } from "../../../constants/events";
import { Message, messageSubSchema, sendMessageSchema } from "../../../constants/schemas";

export const roomRouter = router({
  sendMessage: publicProcedure
    .input(sendMessageSchema)
    .mutation(({ ctx, input }) => {
      const message: Message = {
        // inputs properties will be whatever are inside of sendMessageSchema
        ...input,
        id: randomUUID(),
        sentAt: new Date(),
        sender: {
          name: ctx.session?.user?.name || 'anonymous'
        }
      }

      ctx.eventEmitter.emit(Events.SEND_MESSAGE, message)

      return true
    }),
  onSendMessage: publicProcedure
    .input(messageSubSchema)
    .subscription(({ ctx, input }) => {
      return observable<Message>((emit) => {
        const onMessage = (data: Message) => {
          // @note: only want to emit a events to rooms that a user is associated with
          if (input.roomId === data.roomId) emit.next(data)
        }

        ctx.eventEmitter.on(Events.SEND_MESSAGE, onMessage)

        return () => ctx.eventEmitter.off(Events.SEND_MESSAGE, onMessage)
      })
    })
});
