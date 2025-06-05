"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useStore } from '@/Context/newStoreContext'
import AsyncSelect from 'react-select/async'
import { useSaleMay } from '@/app/Hooks/useSaleMay'
import BarcodeScannerPage from '@/components/ScanCode'

export default function () {
  const { selectedStore } = useStore();
  const {clearCart, addtoSale, updateCartQuantity, removeFromCart, validateQuantity, finishSale, descuento, setDescuento, setStore, cart, subtotal, subtotalConDescuento, iva, totalCart} = useSaleMay()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [Clients, setClients] = useState(null)
  const [clientSelected, setClientSelected] = useState(null)
  const [mode, setMode] = useState(false)
  const [factura, setFactura] = useState(false) 
  const [useCFDI, setUseCFDI] = useState('');
  const [paymentForm, setPaymentForm] = useState('');
  const [facturaData, setFacturaData] = useState([])
  useEffect(() => {
    setStore(selectedStore)
    const fetchClients = async () => {
      const response = await fetch(`/api/clientes?idStore=${selectedStore}`) // Cambia la URL según tu API
      const data = await response.json()
      setClients(data)
    }

    fetchClients()
  }, [selectedStore])

  const options = (inputValue) => {
    if(!inputValue) return [];
    return fetch(`/api/searchProduct?q=${inputValue}&idStore=${selectedStore}`) // Cambia la URL según tu API
      .then((response) => response.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          console.error("searchProduct no devolvió un array:", data);
          return [];
        }

        return data.map((item) => ({
          label: `${item.name} `,
          id: item.id,
          name: item.name,
          description: item.description,
          priceMen: item.priceMen,
          priceMay: item.priceMay,
          mayQuantity: item.mayQuantity,
          codesat: item.codesat,
          unity: item.unity,
          unityCode: item.unityCode,
          stock: item.stock,
          stockMin: item.stockMin
        }))
      })
  }
  const facturar = async ()=>{
    const toastId = toast.loading("Generando factura...")
    try {
      console.log(facturaData);
      const res = await fetch(`/api/factuData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(facturaData),
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) throw new Error(data.message || 'Error al facturar');
      toast.success("Facura generada y enviada a " + facturaData.clientes.email, {id: toastId})
      return true
    } catch (error) {
      toast.error("No se pudo realizar la factura, Intente en otro momento", {id: toastId})
      return false
    }
  }

  const handleChange = (e) => {
    const id = Number(e.target.value)
    const selected = Clients.find(cat => cat.id === id);
    setClientSelected(selected)
  }

  const eliminar = async () => {
    const toastId = toast.loading("Eliminando venta...")
    try {
      clearCart()
      toast.success("Venta eliminada", { id: toastId })
      router.push("../ventas")
    } catch (error) {
      console.log(error)
      toast.error("Error al eliminar la venta", { id: toastId })
    }
  }

  const finishedSale = async () => {
    const toastId = toast.loading("Finalizando venta...")
    try {
      if(cart.length === 0) return toast.error("No hay productos en el carrito", { id: toastId })
      const clientId = clientSelected ? Number(clientSelected.id) : null
      const result = await finishSale(selectedStore, clientId)
    
      if(!result.success) return toast.error("Error al finalizar la venta", { id: toastId });
      toast.success("Venta finalizada", { id: toastId })
      console.log(result.newSale);
      setFacturaData(result.newSale);
      clearCart()

    } catch (error) {
      console.log(error)
      toast.error("Error al finalizar la venta", { id: toastId })
    } 
  }

  const exit = () => {
    clearCart()
  }

  return (
  <div className="ms-12 mt-5">
    {/* Botón volver */}
    <Link href="../ventas" onClick={exit}>
      <img src="/volver.png" width={30} height={30} alt="Regresar" />
    </Link>

    {/* Título */}
    <div>
      <h1 className="text-3xl font-bold">Nueva Venta</h1>

      {/* Sección de ingreso de producto */}
      <div className="mt-5 flex flex-col">
          <button
            className="text-xl font-bold bg-black text-white rounded-md w-1/4 h-10 mb-5"
            onClick={() => setMode(!mode)}
          >
            {mode ? "Ingresar producto" : "Escanear código"}
          </button>

        {mode ? (
          <BarcodeScannerPage className="h-5" addtoSale={addtoSale} setMode={setMode} />
        ) : (
          <AsyncSelect
            className="w-4/5"
            onChange={addtoSale}
            loadOptions={options}
            placeholder="Buscar producto..."
            defaultOptions
            cacheOptions
          />
        )}
      </div>

      {/* Cliente seleccionado */}
      <div className="mt-6 flex items-center">
        <button
          className="bg-slate-700 w-1/4 hover:bg-slate-500 text-xl text-white rounded-md h-8"
          onClick={() => setIsOpen(true)}
        >
          Cliente
        </button>

        <p className="ms-6 font-bold">Nombre cliente:</p>
        <p className="border rounded-md px-2">
          {clientSelected ? clientSelected.name : "Sin cliente"}
        </p>
      </div>

      {/* Forma de pago */}
      <div className="mt-5">
        <label>Forma de Pago:</label>
        <select
          value={paymentForm}
          required
          onChange={(e) => setPaymentForm(e.target.value)}
          className="border p-2 ml-2"
        >
          <option value="">---Selecciona la forma de pago---</option>
          <option value="01">Efectivo</option>
          <option value="03">Transferencia</option>
          <option value="04">Tarjeta de Crédito</option>
        </select>
      </div>

      {/* Tabla de productos */}
      <div className="h-auto w-3/4 flex flex-col ms-16 mt-5 mb-10">
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr className="bg-black text-white">
              <th className="border px-4 py-2">Cantidad</th>
              <th className="border px-4 py-2">U. Medida</th>
              <th className="border px-4 py-2">Nombre</th>
              <th className="border px-4 py-2">Precio Unitario</th>
              <th className="border px-4 py-2">Precio Total</th>
              <th className="border px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id}>
                <td className="border px-4 py-2 text-center">
                  <input
                    type="number"
                    value={item.quantity}
                    className={`w-auto text-center`}
                    onChange={(e) => updateCartQuantity(item.id, e.target.value)}
                    onBlur={(e) => validateQuantity(item.id, e.target.value)}
                  />
                </td>
                <td className="border px-4 py-2 text-center text-sm">{item.unity}</td>
                <td className="border px-4 py-2 text-center">{item.name}</td>
                <td className="border px-4 py-2 text-center">${item.price}</td>
                <td className="border px-4 py-2 text-center">${item.total}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totales */}
        <div className="flex flex-col justify-end items-end w-full">
          <div className="grid grid-cols-2 gap-2 mt-5 w-full max-w-sm">
            <p className="text-right">Subtotal:</p>
            <p className="text-left">${subtotal.toFixed(2)}</p>

            <label className="text-right font-bold" htmlFor="descuento">Descuento:</label>
            <input
              id="descuento"
              className="border rounded-md w-20 px-2"
              type="number"
              placeholder="10%"
              value={descuento}
              onChange={(e) => setDescuento(Number(e.target.value))}
            />

            <p className="text-right">Subtotal con descuento:</p>
            <p className="text-left">${subtotalConDescuento.toFixed(2)}</p>

            <p className="text-right">IVA (16%):</p>
            <p className="text-left">${iva.toFixed(2)}</p>

            <p className="text-right font-bold text-xl">Total con IVA:</p>
            <p className="text-left font-bold text-xl">${totalCart.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Panel lateral para seleccionar cliente */}
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-lg z-50 transition-transform duration-500 transform translate-x-0">
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-lg font-bold">Clientes</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-600">X</button>
            </div>
            <div className="flex flex-col items-center h-full p-4">
              <label>Clientes</label>
              <select className="border p-2 rounded w-full" onChange={handleChange}>
                <option value="">Seleccione un cliente</option>
                {Clients.map((client) => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>

              {clientSelected && (
                <div className="mt-4 w-full">
                  <p><strong>ID:</strong> {clientSelected.id}</p>
                  <p><strong>Nombre:</strong> {clientSelected.name}</p>
                  <p><strong>Dirección:</strong> {clientSelected.address || "Sin datos"}</p>
                  <p><strong>Correo:</strong> {clientSelected.email || "Sin datos"}</p>
                  <p><strong>Teléfono:</strong> {clientSelected.phone || "Sin datos"}</p>

                  <label>Uso CFDI:</label>
                  <select
                    value={useCFDI}
                    onChange={(e) => setUseCFDI(e.target.value)}
                    className="border p-2 mt-2 w-full"
                  >
                    <option value="">---Selecciona el uso de CFDI---</option>
                    <option value="G01">Adquisición de mercancías</option>
                    <option value="G03">Gastos en general</option>
                    <option value="P01">Por definir</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Botones de acción */}
      <div className="flex justify-between px-5 mt-2 w-3/4">
          <>
            <button
              className="bg-black hover:bg-slate-500 text-white rounded-xl w-[200px] h-auto text-2xl"
              onClick={() => (setFactura(true))}
            >
              Finalizar venta
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white rounded-xl w-[200px] h-auto text-2xl"
              onClick={eliminar}
            >
              Cancelar Venta
            </button>
          </>
      </div>

      {/* Confirmación de factura */}
      {factura && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">Facturar</h2>
              <p>¿Deseas facturar la venta de una vez?</p>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                  onClick={async () => {
                    let success = false
                    success = await finishedSale();
                    console.log(success);
                    if (success) {
                      router.push(`../ventas`);
                    }
                    setFactura(false)
                  }}
                >
                  No
                </button>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  onClick={async () => {
                    if (!clientSelected || !useCFDI) {
                      toast.error("Selecciona un cliente y el uso de CFDI");
                      setFactura(false);
                      return;
                    }
                    const success = await finishedSale();
                    if (success) {
                      let succes = false;
                      succes = facturar()
                      if(!succes) return router.push(`../ventas`);
                    }
                    else setFactura(false)
                  }}
                >
                  Sí
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  onClick={async () => {
                    let succes = false;
                    succes = facturar()
                    if(succes){
                      router.push("../ventas");
                    }
                  }}
                >
                  Reintentar
                </button>
                
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
);
}
