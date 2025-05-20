"use client"
import Link from "next/link"
import WacthClients from "@/components/WatchClients";
import { useStore } from "@/Context/newStoreContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const dynamic = "force-dynamic";

export default function compras() {

  const { selectedStore } = useStore();
  const [data, setData] = useState([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    const toastId = toast.loading("Cargando...")
    const productos = async () => {
      try {
        const resp = await fetch(`/api/clientes?idStore=${selectedStore}&casse=1`)
        const data = await resp.json()
        setData(data)
        console.log(data)
        toast.success("Clientes cargados", { id: toastId })
      } catch (error) {
        toast.error("Error al cargar los clientes", { id: toastId })
      }
    };
    productos()
  }, [selectedStore])  

  const filteredData = data.filter(cliente =>{
    return cliente.name.toLowerCase().includes(search.toLowerCase())
  }
  );

  return (
    <div>
      <div className="flex flex-col items-start ms-16 mt-6 w-3/4 h-auto">
        <input type="text" placeholder="Buscar compra" className="border border-gray-300 w-full rounded-lg p-2" onChange={(e) => setSearch(e.target.value)} />
        <div className="mt-2 flex gap-2">
          <Link href="./clientes/newCliente" className="flex items-center justify-center bg-black text-white h-10 w-auto text-lg font-bold rounded-lg hover:bg-slate-600">+ Nuevo Proveedor</Link>
        </div>
      </div>
      <div className="h-screen w-3/4 flex flex-row ms-16 mt-5">
        <table className="table-auto border-collapse border border-gray-300 w-full h-7">
          <thead>
            <tr className="bg-black text-white">
                <th className="border border-gray-300 px-4 py-2">RFC</th>
                <th className="border border-gray-300 px-4 py-2">Nombre</th>
                <th className="border border-gray-300 px-4 py-2">Telefono</th>
                <th className="border border-gray-300 px-4 py-2">Correo</th>
                <th className="border border-gray-300 px-4 py-2">Direccion</th>
                <th className="border border-gray-300 px-4 py-2">Opciones</th>
            </tr>
          </thead>
          {filteredData.map(client => (
              <WacthClients client={client} key={client.id}/>
            ))
          }
        </table>
      </div>
    </div>
  )
}

