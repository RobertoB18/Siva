"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function StoreNav() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStores() {
      try {
        const response = await fetch("/api/user-store"); // Endpoint para obtener tiendas del usuario
        console.log(response);

        if (!response.ok) throw new Error("Error al obtener tiendas");
        
        const data = await response.json();
        console.log(data);
        setStores(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchStores();
  }, []);

  return (
    <aside className="h-screen w-[80px] bg-slate-900 border-r-2 border-slate-700 overflow-y-auto scrollbar-thin scroll-m-2">
      <ul className="flex px-2 items-center flex-col text-xl text-center">
        <li className="mt-5 h-10 text-slate-300 rounded-sm w-full hover:bg-slate-400 hover:text-white transition-all duration-500">
          <Link href="/dashboard">Home</Link>
        </li>

        {loading ? (
          <p className="text-white">Cargando...</p>
        ) : (
          stores.map((store) => (
            <li key={store.id} className="mt-2 h-10 text-slate-300 rounded-sm w-full hover:bg-slate-400 hover:text-white transition-all duration-500">
              <Link href={`/store/${store.id}`}>{store.name}</Link>
            </li>
          ))
        )}
      </ul>
    </aside>
  );
}
