"use client";

import { useSession, signOut } from "next-auth/react";
import StoreListClient from "@/components/StoreList";
import { useEffect } from "react";

export default function HomePage() {
  const { data: session, status } = useSession();
  useEffect(() => {
    if (session) {
      console.log("🕒 Sesión actual:", session)
      console.log("⏳ Expira en:", new Date(session.expires))
    }
  }, [session])

  if (status === "loading") {
    return <p className="text-center mt-10 text-gray-500">Cargando sesión...</p>;
  }

  return (
    <div>
      <div className="flex justify-center flex-col items-center p-10">
        {session.user.image && (
          <img
            src={session.user.image}
            alt="Foto de perfil"
            className="rounded-full h-36 w-36 mb-4"
          />
        )}
        <h2 className="text-4xl font-bold text-center">Bienvenido {session.user.name}</h2>
        <button
          className="mt-5 px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600"
          onClick={() => {
            signOut();
            localStorage.removeItem("selectedStoreId");
          }}
        >
          Cerrar sesión
        </button>
      </div>

      <StoreListClient />
    </div>
  );
}
