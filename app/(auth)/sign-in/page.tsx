"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button
        className="bg-blue-500 hover:bg-blue-700 cursor-pointer px-3 py-2 rounded text-white "
        onClick={() => signIn()}
      >
        Sign in
      </button>
    </>
  );
}
