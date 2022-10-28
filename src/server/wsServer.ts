import ws from 'ws'
import { applyWSSHandler } from '@trpc/server/adapters/ws'
import { appRouter } from './trpc/router/_app'
import { createContext } from './trpc/context'

const wss = new ws.Server({
  port: 3001,
})

const handler = applyWSSHandler({ wss, createContext, router: appRouter })

wss.on('connection', () => {
  console.log(`++ ws connection => ${wss.clients.size}`)
  wss.on('close', () => {
    console.log(`-- ws connection => ${wss.clients.size}`)
  })
})

console.log('ws server running')

process.on('SIGTERM', () => {
  console.log('SIGTERM -> ws connection closing')
  // Broadcast to all connections that they need to reconnect to ws -> and then close ws connection
  handler.broadcastReconnectNotification()
  wss.close()
})