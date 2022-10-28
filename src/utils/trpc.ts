// src/utils/trpc.ts
import superjson from "superjson";

import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { GetInferenceHelpers } from "@trpc/server";
import { wsLink, createWSClient } from "@trpc/client";

import type { AppRouter } from "../server/trpc/router/_app";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

const url = `${getBaseUrl()}/api/trpc`

/**
 * An ending link is something which can make a request from the client to the application
 * -> As the name suggests logger links should go at the end of the link[]
 */
const getEndingLink = () => {
  if (typeof window === 'undefined') {
    return httpBatchLink({
      url,
    })
  }

  const client = createWSClient({
    url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'
  })

  return wsLink({
    client,
  })
}

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        getEndingLink()
      ],
      headers() {
        if (ctx?.req) {
          return {
            ...ctx.req.headers
          }
        } else {
          return {}
        }
      }
    };
  },
  ssr: false,
});

/**
 * Inference helpers
 * @example type HelloOutput = AppRouterTypes['example']['hello']['output']
 **/
export type AppRouterTypes = GetInferenceHelpers<AppRouter>;
