"use client"
import { useState, useEffect } from 'react';
import { debounce, times } from 'lodash';
import { useStore } from '@/Context/newStoreContext';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function NuevaFacturaPage() {
  const {selectedStore} = useStore();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [ventas, setVentas] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [paymentForm, setPaymentForm] = useState('');
  const [useCFDI, setUseCFDI] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataStore, setDataStore] = useState(false)

  useEffect(() =>{
    const storeInfo = async () =>{
      const res = await fetch(`/api/${selectedStore}`)
      const data = await res.json();
      console.log(data);
      if(data && data.length !==0){
        if(data.key){
          setDataStore(true)
        }
        else{
          toast.error("No se han actualizado los datos de facturacion en ajustes")
          router.push("../contabilidad");
        }
      } 
    }
    storeInfo();
  }, [selectedStore])
  // Buscar ventas pendientes
  useEffect(() => {
    const buscarVentas = async () => {
      const res = await fetch(`/api/sales?idStore=${selectedStore}&casse=1&client=${filtro}`);
      const data = await res.json();
      console.log(data);
      setVentas(data);
    };

    const debouncedSearch = debounce(buscarVentas, 400);
    if (step === 1) debouncedSearch();
    return () => debouncedSearch.cancel();
  }, [filtro, step]);

  const handleSiguiente = () => {
    if (!ventaSeleccionada) return toast.error("Selecciona una venta")
    setStep(2);
  };

  const handleFacturar = async (e) => {
    const toastId = toast.loading("Generando la factura...");
    e.preventDefault();
    if (!ventaSeleccionada) return toast.error("Selecciona una venta");
    if(useCFDI === "" || paymentForm ==="") return toast.error("Rellena todos los datos")
    const payload = {
      ...ventaSeleccionada,         // Todos los datos de la venta
      payment_form: paymentForm,    // Forma de pago elegida
      use_cfdi: useCFDI,             // Uso de CFDI elegido
    };
    
    console.log(payload)
    setLoading(true);
    setMensaje('');
    try {
      const res = await fetch(`/api/factuData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) throw new Error(data.message || 'Error al facturar');

      toast.success(`Factura generada y enviada a ${ventaSeleccionada.clientes.email}`, {id: toastId});
      router.push(`../contabilidad/${data.facturaData.id}`);
    } catch (err) {
      toast.error(`${err.message}`, {id: toastId});
    } finally {
      setLoading(false);
    }
  };

  if(dataStore === false) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl">Verificando configuracion de facturacion...</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nueva Factura</h1>

      {step === 1 && (
        <>
          <input type="text" placeholder="Buscar por nombre del cliente..." className="border p-2 w-full mb-4" value={filtro} onChange={(e) => setFiltro(e.target.value)}/>
          <ul className="border rounded max-h-64 overflow-y-auto mb-4">
            {ventas.map((venta) => (
              <li key={venta.id} onClick={() => {setVentaSeleccionada(venta);
                setPaymentForm(venta.metodoPago || '');
                setUseCFDI(venta.use || '');
                console.log(ventaSeleccionada);
              }} className={`p-3 cursor-pointer hover:bg-gray-500 ${ventaSeleccionada?.id === venta.id ? 'bg-slate-800 text-white' : ''}`} >
                <strong>{venta.clientes?.name}</strong> — ${venta.total.toFixed(2)}
              </li>
            ))}
          </ul>
          <button onClick={handleSiguiente} className="bg-black text-white px-4 py-2 rounded-md">
            Siguiente
          </button>
        </>
      )}
      
      {step !== 1 && (
        <button onClick={() => setStep(1)} className="my-4 text-xl" >
          ← Volver
        </button>
      )}

      {step === 2 && (
        <form onSubmit={handleFacturar} className="space-y-4">
          <div className="p-4 border rounded">
            <p><strong>Emisor:</strong> {ventaSeleccionada.store.name}</p>
            <p><strong>Telefono:</strong> {ventaSeleccionada.store.phone}</p>
            <p><strong>Correo:</strong> {ventaSeleccionada.store.email}</p>
            <p><strong>CP:</strong> ${ventaSeleccionada.store.address}</p>
            <p><strong>Fecha:</strong> {new Date(ventaSeleccionada?.date).toLocaleDateString()}</p>
          </div>
          <div className="p-4 border rounded bg-gray-300">
            <p><strong>Cliente:</strong> {ventaSeleccionada?.clientes?.razonSocial}</p>
            <p><strong>RFC:</strong> {ventaSeleccionada?.clientes?.rfc}</p>
            <p><strong>Regimen Fiscal:</strong> {ventaSeleccionada?.clientes?.regimenFiscal}</p>
            <p><strong>Telefono:</strong> {ventaSeleccionada?.clientes?.phone}</p>
            <p><strong>Correo:</strong> {ventaSeleccionada?.clientes?.email}</p>
          </div>
          <div>
            <label>Forma de Pago:</label>
            <select value={ventaSeleccionada.metodoPago} required={true} onChange={(e) => setPaymentForm(e.target.value)} className="border p-2 ml-2">
              <option value="">---Selecciona la forma de pago---</option>
              <option value="01">Efectivo</option>
              <option value="03">Transferencia</option>
              <option value="04">Tarjeta de Crédito</option>
            </select>
          </div>

          <div>
            <label>Uso CFDI:</label>
            <select value={ventaSeleccionada.use} onChange={(e) => setUseCFDI(e.target.value)} className="border p-2 ml-2">
              <option value="">---Selecciona el uso de CFDI---</option>
              <option value="G01">Adquisición de mercancías</option>
              <option value="G03">Gastos en general</option>
              <option value="P01">Por definir</option>
            </select>
          </div>

          <table className="table-auto border-collapse border border-gray-300 w-full h-7">
          <thead>
            <tr className="bg-black text-white">
                <th className="border border-gray-300 px-4 py-2">Cantidad</th>
                <th className="border border-gray-300 px-4 py-2">U. Medida</th>
                <th className="border border-gray-300 px-4 py-2">Nombre</th>
                <th className="border border-gray-300 px-4 py-2">Precio Unitario</th>
                <th className="border border-gray-300 px-4 py-2">Precio Total</th>
            </tr>
            </thead>
            <tbody>
              { ventaSeleccionada.productos.map((item) => (
                <tr key={item.id}>
                  <td className="border border-gray-300 px-4 py-2 text-center">{item.quantity}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center"><span className="text-sm break-words">{item.unity}</span></td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{item.name}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">${item.price}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">${item.total}</td>
                </tr>
              ))
              }
            </tbody>
          </table>
          <div className="flex flex-col justify-end items-end w-full">
          <div className="grid grid-cols-2 gap-2 mt-5 w-full max-w-sm">
            <p className="text-right">Subtotal:</p>
            <p className="text-left">${ventaSeleccionada.subtotal.toFixed(2)}</p>

            <p className="text-right">Descuento:</p>
            <p className="text-left">{ventaSeleccionada.descuento.toFixed(2)}%</p>

            <p className="text-right font-bold text-xl">Total:</p>
            <p className="text-left font-bold text-xl">${ventaSeleccionada.total.toFixed(2)}</p>
          </div>
        </div>

          
          <button type="submit" disabled={loading} className="bg-black text-white px-4 py-2 rounded">
            {loading ? 'Facturando...' : 'Emitir Factura'}
          </button>
        </form>
      )}
    </div>
  );
}
