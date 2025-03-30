"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

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
        <li className="mt-2 h-12 w-12 text-4xl text-center text-slate-400 font-bold rounded-full bg-slate-200 hover:bg-slate-300 hover:text-white">
          <Link href="/dashboard"><Image src={"/inicio.jpg"} width={100} height={100} alt="hola"/> </Link>
        </li>

        {loading ? (
          <p className="text-white">Cargando...</p>
        ) : (
          stores.map((store) => (
            <li key={store.id} className="mt-2 h-12 text-slate-400 rounded-full w-12 hover:bg-slate-600 hover:text-white transition-all duration-500">
              <Link href={`/dashboard/store/${store.id}`}>{store.name}</Link>
            </li>
          ))
        )}
        <Link href="/" className="mt-2 h-12 w-12 text-4xl text-center text-slate-400 font-bold rounded-full bg-slate-200 hover:bg-slate-500 hover:text-white">+</Link>
      </ul>
    </aside>
  );
}
