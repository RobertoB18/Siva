"use client"
import Link from "next/link"
import WacthFacturas from "@/components/Facturas";
import { useStore } from "@/Context/newStoreContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation'
import { useSession } from "next-auth/react"
import { generarPDF } from "@/app/Hooks/generatePdf";

export const dynamic = "force-dynamic";

export default function contabilidad() {

  const { selectedStore } = useStore();
  const [data, setData] = useState([])
  const [search, setSearch] = useState("")
  const [access, setAccess] = useState(false)
  const [document, setDocument] = useState(false)
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reporte, setReporte] = useState();

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
        if (data.permissions.includes("Contabilidad") || data.permissions.includes("Administrador")) {
          setAccess(true);
        } else {
          toast.error("No tienes acceso a contabilidad de esta tienda");
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
        const resp = await fetch(`/api/factura?idStore=${selectedStore}`)
        const data = await resp.json()
        setData(data)
        console.log(data)
        toast.success("Facturas cargadas", { id: toastId })
      } catch (error) {
        toast.error("Error al cargar las facturas", { id: toastId })
      }
    };
    productos()
  }, [access])  

  const filteredData = data.filter(factura =>{
    return factura.clientes.razonSocial.toLowerCase().includes(search.toLowerCase())
  }
  );

  const hacerReporte = async () => {
    const toastId = toast.loading("Generando reporte...");
    try {
      if(!toDate || !fromDate) return toast.error("Seleccione las fechas para el reporte", {id: toastId})
      
      const res = await fetch(`/api/facturaReporte?idStore=${selectedStore}&from=${fromDate}&to=${toDate}`);
      const data = await res.json();
      
      console.log(data);
      generarPDF(data, fromDate, toDate);
      
      toast.success("Reporte generado", {id: toastId})
    } catch (error) {
      toast.error("Error al generar el reporte", {id: toastId})
    }finally {
      setDocument(false);
    }

  };

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
          <Link href="./clientes" className="flex items-center justify-center bg-black text-white h-10 w-auto text-lg font-bold rounded-lg hover:bg-slate-600">Ver Cliente</Link>
          <Link href="./contabilidad/newFactura" className="flex items-center justify-center bg-black text-white h-10 w-auto text-lg font-bold rounded-lg hover:bg-slate-600">+Nueva Factura</Link>
          <button className="ms-56 p-2 flex items-center justify-center bg-green-600 text-white h-10 w-auto text-lg font-bold rounded-lg hover:bg-green-700" onClick={() => setDocument(true)}>Generar reporte financiero</button>
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
                <th className="border border-gray-300 px-4 py-2">Fecha</th>
                <th className="border border-gray-300 px-4 py-2">Opciones</th>
            </tr>
          </thead>
          {filteredData.map(factura => (
              <WacthFacturas factura={factura} key={factura.id}/>
            ))
          }
        </table>
      </div>
      { document && (
        <div>

        </div>
      )

      }
      {document && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Facturar</h2>
              <p className="text-gray-600 mb-6">¿Deseas facturar la venta de una vez?</p>

              <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={hacerReporte}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition duration-200"
                >
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  )
}

