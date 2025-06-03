"use client"
import Link from "next/link"
import WatchSales from "@/components/WatchSales";
import { useStore } from "@/Context/newStoreContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation'
import { useSession } from "next-auth/react"

export const dynamic = "force-dynamic";

export default function Ventas() {
  const router = useRouter()
  const { selectedStore } = useStore();
  const [data, setData] = useState([])
  const [search, setSearch] = useState("")
  const [tipe, setTipe] = useState(false);
  const [access, setAccess] = useState(false)

  const { data: session, status } = useSession()

  useEffect(() => {
    const checkAccess = async () => {
      try {
        if(!session || !selectedStore) return;
        const response = await fetch(`/api/userPermisos?idStore=${selectedStore}&idUser=${session.user.id}`);
        if (!response.ok) throw new Error("Error al verificar acceso");
        const data = await response.json();
        console.log("Permisos del usuario:", data.permissions);
        if (data.permissions.includes("Ventas") || data.permissions.includes("Administrador") || data.permissions.includes("Empleado")) {
          setAccess(true);
        } else {
          toast.error("No tienes acceso a vender en esta tienda");
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
        const resp = await fetch(`/api/sales?idStore=${selectedStore}`)
        const data = await resp.json()
        setData(data)
        console.log(data)
        toast.success("Ventas cargadas", { id: toastId })
      } catch (error) {
        toast.error("Error al cargar las ventas", { id: toastId })
      }
    };
    productos()
  }, [selectedStore])  

  const filteredData = data.filter(venta =>{
    if(search === "") return venta
    return venta.clientes?.name?.toLowerCase().includes(search.toLowerCase())
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
        <input type="text" placeholder="Buscar venta" className="border border-gray-300 w-full rounded-lg p-2" onChange={(e) => setSearch(e.target.value)} />
        <div className="mt-2 flex gap-4">
          <button onClick={() => setTipe(true)} className="flex items-center justify-center bg-black text-white h-10 w-auto text-lg font-bold rounded-lg hover:bg-slate-600">+ Nueva Venta</button>
          <Link href="./ventas/cotizacion " className="flex items-center justify-center bg-green-700 text-white h-10 w-auto text-lg font-bold rounded-lg hover:bg-green-600">+ Generar Cotizacion</Link>
        </div>
      </div>
      <div className="h-screen w-3/4 flex flex-row ms-16 mt-5">
        <table className="table-auto border-collapse border border-gray-300 w-full h-7">
          <thead>
            <tr className="bg-black text-white">
              <th className="border border-gray-300 px-4 py-2">Fecha</th>
              <th className="border border-gray-300 px-4 py-2">Total</th>
              <th className="border border-gray-300 px-4 py-2">Cliente</th>
              <th className="border border-gray-300 px-4 py-2">Opciones</th>
            </tr>
          </thead>
          {filteredData.map(ventas => (
              <WatchSales sale={ventas} key={ventas.id}/>
            ))
          }
          {tipe && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Tipo de venta</h2>
                <p>Selecciona si quieres hacer una venta para mayoristas o normal</p>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                    onClick={() => router.push(`/dashboard/store/${selectedStore}/ventas/newMayor`)}
                  >
                    Venta Mayoreo
                  </button>
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    onClick={() => {
                      router.push(`/dashboard/store/${selectedStore}/ventas/newVenta`)
                   }}
                  >
                    Venta Normal
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        </table>
      </div>
    </div>
  )
}
