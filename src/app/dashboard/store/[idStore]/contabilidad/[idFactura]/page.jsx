"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Mail, Download } from "lucide-react";
import { useStore } from "@/Context/newStoreContext";
import Link from "next/link"

export default function EfitarFactura() {
  const {selectedStore} = useStore()
  const params = useParams();
  const router = useRouter()
  const [factura, setFactura] = useState([]);
  const [valido, setValido] = useState(true);
 
  useEffect(() => {
  if(params.idFactura && selectedStore){
    const toastId = toast.loading("Cargando...");
    fetch(`/api/factura/${params.idFactura}`)
      .then(res => res.json())
      .then(async data => {
          if(selectedStore){
              if(Number(data.storeId) !== Number(selectedStore)){
                  console.log(data);
                  router.push(`../contabilidad`)
              }
              const hoy = new Date();
              const fechaVenta = new Date(data.date);
              const mismoDia = fechaVenta.getDate() === hoy.getDate() && fechaVenta.getMonth() === hoy.getMonth() && fechaVenta.getFullYear() === hoy.getFullYear();
              console.log(mismoDia)
              if(!mismoDia){
                console.log("Hola")
                setValido(false)
              }
              setFactura(data)
              console.log(data)
              toast.success("Venta cargado", { id: toastId });   
          }
        })
      .catch(error => toast.error("Error al cargar la venta", { id: toastId }));
    }
  }, [params.idFactura, selectedStore]);

  const Enviar = async () =>{
    const toastId = toast.loading("Enviando factura...")
    try {
      const payload = {
        storeId: factura.storeId,
        email: factura.clientes.email,
        idFactura: factura.idFactura
      }
      console.log(payload);
      const res = await fetch(`/api/factura/${factura.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if(!res.ok) throw new Error("Error al enviar el mensaje");
      toast.success(`Factura enviada a ${factura.clientes.email}`, {id: toastId})
    } catch (error) {
      toast.error("Error al enviar el mensaje", {id: toastId})
    }
  }


  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link href="../contabilidad" className=''>
        <img src="/volver.png" width={30} height={30} alt="Regresar" />
      </Link>
        <div className="p-4 border rounded bg-gray-300">
            <p><strong>Cliente:</strong> {factura?.clientes?.name}</p>
            <p><strong>RFC:</strong> {factura?.clientes?.rfc}</p>
            <p><strong>Correo electronico:</strong> {factura?.clientes?.email}</p>
            <p><strong>Telefono:</strong> {factura?.clientes?.phone}</p>
            <p><strong>Fecha:</strong> {new Date(factura?.date).toLocaleDateString()}</p>
        </div>
        <div className="flex justify-around">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow transition-all duration-300" onClick={Enviar}><Mail size={18} /> Enviar a correo</button>
          
        </div>
        
      </div>
  )
}
