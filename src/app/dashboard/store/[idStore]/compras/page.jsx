"use client"
import Link from "next/link"
import WacthBuys from "@/components/WhatchBuys";
import { useStore } from "@/Context/newStoreContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation'
import { useSession } from "next-auth/react"

export const dynamic = "force-dynamic";

export default function compras() {

  const { selectedStore } = useStore();
  const [data, setData] = useState([])
  const [search, setSearch] = useState("")

  const [access, setAccess] = useState(false)

  const { data: session, status } = useSession()
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        if(!session || !selectedStore) return;
        const response = await fetch(`/api/userPermisos?idStore=${selectedStore}&idUser=${session.user.id}`);
        if (!response.ok) throw new Error("Error al verificar acceso");
        const data = await response.json();
        console.log("Permisos del usuario:", data.permissions);
        if (data.permissions.includes("Compras") || data.permissions.includes("Administrador") || data.permissions.includes("Empleado")) {
          setAccess(true);
        } else {
          toast.error("No tienes acceso al registra compas en esta tienda");
          router.push(`/dashboard/store/${selectedStore}/inicio`);
        }
      } catch (error) {
        console.error("Error al verificar acceso:", error);
      }
    };
    checkAccess();
  }, [session, selectedStore]);
  
  useEffect(() => {
    const toastId = toast.loading("Cargando...")
    const productos = async () => {
      try {
        const resp = await fetch(`/api/buys?idStore=${selectedStore}`)
        const data = await resp.json()
        setData(data)
        console.log(data)
        toast.success("Productos cargados", { id: toastId })
      } catch (error) {
        toast.error("Error al cargar los productos", { id: toastId })
      }
    };
    productos()
  }, [selectedStore])  

  const filteredData = data.filter(compra =>{
    if(search === "") return compra
    return compra.provider?.name?.toLowerCase().includes(search.toLowerCase())
  }
  );
  
  if(access === false) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl">Cargando...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col items-start ms-16 mt-6 w-3/4 h-auto">
        <input type="text" placeholder="Buscar compra" className="border border-gray-300 w-full rounded-lg p-2" onChange={(e) => setSearch(e.target.value)} />
        <div className="mt-2 flex gap-2">
          <Link href="./compras/newCompra" className="flex items-center justify-center bg-black text-white h-10 w-auto text-lg font-bold rounded-lg hover:bg-slate-600">+ Registar compra</Link>
          <Link href="./proveedores" className="flex items-center justify-center bg-green-600 text-white h-10 w-auto text-lg font-bold rounded-lg hover:bg-slate-600">+ Añadir Proveedor</Link>
        </div>
      </div>
      <div className="h-screen w-3/4 flex flex-row ms-16 mt-5">
        <table className="table-auto border-collapse border border-gray-300 w-full h-7">
          <thead>
            <tr className="bg-black text-white">
              <th className="border border-gray-300 px-4 py-2">Fecha</th>
              <th className="border border-gray-300 px-4 py-2">Proveedor</th>
              <th className="border border-gray-300 px-4 py-2">Total</th>
              <th className="border border-gray-300 px-4 py-2">Codigo de pedido</th>
              <th className="border border-gray-300 px-4 py-2">Opciones</th>
            </tr>
          </thead>
          {filteredData.map(compra => (
              <WacthBuys buy={compra} key={compra.id}/>
            ))
          }
        </table>
      </div>
    </div>
  )
}

