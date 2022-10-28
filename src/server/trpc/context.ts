// src/server/router/context.ts
import ws from 'ws'
import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { Session } from "next-auth";
import { EventEmitter } from 'events';
import { getServerAuthSession } from "../common/get-server-auth-session";
import { prisma } from "../db/client";
import { NodeHTTPCreateContextFnOptions, NodeHTTPHandlerOptions } from '@trpc/server/dist/adapters/node-http';
import { IncomingMessage } from 'http';

const eventEmitter = new EventEmitter()

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 **/
export const createContextInner = async (opts: NodeHTTPCreateContextFnOptions<IncomingMessage, ws> & { session: Session | null }) => {
  return {
    session: opts.session,
    prisma,
    eventEmitter,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  // Get the session from the server using the unstable_getServerSession wrapper function
  const session = await getServerAuthSession({ req, res });

  return await createContextInner({
    session,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
