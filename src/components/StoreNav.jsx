"use client";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/Context/newStoreContext"; // Importa el contexto
import { useRouter, usePathname } from "next/navigation";

export default function StoreNav() {
  const { stores, loading, selectStore } = useStore(); // Agrega selectedStore y selectStore
  const pathname = usePathname();

  return (
    <aside className="h-screen w-[90px] bg-slate-900 border-r-2 border-slate-700 overflow-y-auto scrollbar-thin scroll-m-2">
      <ul className="flex px-2 items-center flex-col text-xl text-center">
        {/* Botón de inicio */}
        <li className="mt-2 h-12 w-12 text-4xl text-center text-slate-400 font-bold rounded-full bg-slate-200 hover:bg-slate-300 hover:text-white" onClick={() => selectStore(null)}>
          <Link href="/dashboard">
            <Image src={"/inicio.jpg"} width={100} height={100} alt="Inicio" />
          </Link>
        </li>

        {/* Cargando tiendas */}
        {loading ? (
          <p className="text-white">Cargando...</p>
        ) : (
          stores.map((store) => (
            <li
              key={store.id}
              className={`mt-2 h-12 text-slate-400 rounded-full w-12 transition-all duration-500 ${
                pathname === "/dashboard/store/"+store.id
                  ? "bg-slate-600 text-white" // Resalta la tienda seleccionada
                  : "hover:bg-slate-600 hover:text-white"
              }`}
            >
              <Link 
                href={`/dashboard/store/${store.id}`}
                onClick={() => selectStore(store.id)} // Guarda la tienda seleccionada en el contexto
              >
                {store.name}
              </Link>
            </li>
          ))
        )}

        {/* Botón para agregar nueva tienda */}
        <Link
          href="/dashboard/store/new"
          className="mt-2 h-12 w-12 text-4xl text-center text-slate-400 font-bold rounded-full bg-slate-200 hover:bg-slate-500 hover:text-white"
        >
          +
        </Link>
      </ul>
    </aside>
  );
}
