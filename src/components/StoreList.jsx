"use client";

import Link from "next/link";
import { useStore } from "@/Context/newStoreContext";

export default function StoreListClient() {
  const { stores, selectStore } = useStore();

  return (
    <ul className="flex flex-wrap gap-6 ms-10 mt-6">
  {stores.map((store) => (
    <li
      key={store.id}
      className={`w-64 p-4 border rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer`}
    >
      <Link
        href={`/dashboard/store/${store.id}/inicio`}
        onClick={() => selectStore(store.id)}
        className="flex items-center gap-4"
      >
        <img
          src={store.logo}
          alt={`Logo de ${store.name}`}
          className="rounded-full object-cover w-16 h-16 border"
        />
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold text-slate-800">{store.name}</h1>
          <p className="text-sm text-slate-500">Telefono: {store.phone}</p>
        </div>
      </Link>
    </li>
  ))}
</ul>

  );
}
