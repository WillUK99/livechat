import { router, publicProcedure } from "../trpc";
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
    .subscription(() => {
      return true
    })
});
