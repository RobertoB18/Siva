"use client"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { usePathname } from "next/navigation";
import { useStore } from "@/Context/newStoreContext";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { selectedStore} = useStore();
  console.log("selectedStore", selectedStore);
  if (!selectedStore) {
    return (
      <div>  
      </div>
    );
  }

  return (
    <>
      <aside className="sticky h-screen w-[190px] bg-black top-0 left-0">
        <ul className="px-2 items-center flex-col text-xl">
          {[
            { name: "Home", path: "/dashboard/store/"+selectedStore +"/inicio" },
            { name: "Compra", path: "/dashboard/store/"+selectedStore + "/compras"  },
            { name: "Venta", path: "/dashboard/store/"+selectedStore +"/ventas" },
            { name: "Almacen", path: "/dashboard/store/"+selectedStore + "/almacen" },
            { name: "Contabilidad", path: "/dashboard/store/"+selectedStore + "/contabilidad" },
            { name: "Ajustes", path: `/dashboard/store/${selectedStore}` }, // ✅ nueva opción
          ].map((item) => (
            <li
              key={item.path}
              className={`h-10 text-slate-300 rounded-sm w-full transition-all duration-500 ${
                pathname === item.path
                  ? "bg-slate-600 text-white" // Estilo para la opción activa
                  : "hover:bg-slate-400 hover:text-white"
              }`}
            >
              <Link href={item.path} className="block w-full h-full flex items-center px-4" >{item.name}</Link>
            </li>
          ))}
        </ul>
        <button className="text-slate-300 mt-5" onClick={() => {signOut()
          localStorage.removeItem("selectedStoreId");
        }}>
          Salir sesión
        </button>
      </aside>
    </>
  );
}
