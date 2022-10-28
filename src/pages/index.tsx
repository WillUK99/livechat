import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const hello = trpc.example.hello.useQuery({ text: "from the depths of mordor" });

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1>{hello?.data?.greeting}</h1>
        <div className='h-10' />
        <button className='py-1 px-5 bg-slate-400 text-white rounded-lg transition-all hover:scale-105'>Create chat room</button>
      </main>
    </>
  );
};

export default Home