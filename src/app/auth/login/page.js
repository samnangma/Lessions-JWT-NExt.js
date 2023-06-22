"use client";

import { useRouter } from "next/navigation";
import FormLogin from "./components/Form";

export default function Login() {
  const router = useRouter();
  return (
    <main className="h-screen  ">
      <button
        onClick={() => router.push("/")}
        title="back to home page"
        className="text-4xl font-bold text-center m-5"
      >
        ⬅️ Back
      </button>
      <div className="w-full flex flex-wrap justify-center items-center">
        <img
          src="https://i.gifer.com/X0XF.gif"
          alt="logo"
          className="w-1/4 rounded-lg"
        />
        <FormLogin />
      </div>
    </main>
  );
}
