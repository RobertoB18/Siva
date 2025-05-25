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
        clearCart()
      //router.refresh();
      router.push("../ventas");
    } catch (error) {
      console.log(error)
      toast.error("Error al finalizar la venta", { id: toastId })
      
    }
    
  }

  const exit = () => {
    clearCart()
  }

  return (
    <div className='ms-12 mt-5'>
      <Link href="../ventas" onClick={exit} className=''>
        <img src="/volver.png" width={30} height={30} alt="Regresar" />
      </Link>
      <div>
        <h1 className='text-3xl font-bold'>Nueva Venta</h1>
        <div className='mt-5 flex flex-col' >
          <button className='text-xl font-bold bg-black text-white rounded-md w-1/4 h-10 mb-5' onClick={() => setMode(!mode)}>{mode ? "Ingresar producto" : "Escanear codigo"}</button>
          { mode ?
            <BarcodeScannerPage className="h-5" addtoSale={addtoSale} setMode={setMode} /> :
            <AsyncSelect className='w-4/5' onChange={addtoSale} loadOptions={options} placeholder="Buscar producto..." defaultOptions cacheOptions> </AsyncSelect>
          
          }
            
        </div>
        <div className='mt-6 flex'>
          <button className='bg-slate-700 hover:bg-slate-500 text-xl text-white rounded-md h-8' onClick={() => setIsOpen(true)}>Escoger un Cliente</button>
          {clientSelected && 
            <>
              <p className='ms-6 font-bold'>Nombre cliente:</p>
              <p className='border rounded-md w-auto'>{clientSelected.name}</p>
            </> 
            ||
            <>
              <p className='ms-6 font-bold'>Nombre cliente:</p>
              <p className='border rounded-md w-auto'>Sin cliente</p>
            </> 
          }
        </div>
        <div className='h-auto w-3/4 flex flex-col ms-16 mt-5 mb-10'>
          <table className="table-auto border-collapse border border-gray-300 w-full h-7">
          <thead>
            <tr className="bg-black text-white">
                <th className="border border-gray-300 px-4 py-2">Cantidad</th>
                <th className="border border-gray-300 px-4 py-2">U. Medida</th>
                <th className="border border-gray-300 px-4 py-2">Nombre</th>
                <th className="border border-gray-300 px-4 py-2">Precio Unitario</th>
                <th className="border border-gray-300 px-4 py-2">Precio Total</th>
                <th className="border border-gray-300 px-4 py-2">Acciones</th>
            </tr>
            </thead>
            <tbody>
              { cart.map((item) => (
                <tr key={item.id}>
                  
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <input 
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateCartQuantity(item.id, e.target.value)}
                      onBlur={(e) => validateQuantity(item.id, e.target.value)}
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center"><span className="text-sm break-words">{item.unity}</span></td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{item.name}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">${item.price}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">${item.total}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                        <button onClick={() => removeFromCart(item.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700">
                        Eliminar
                        </button> 
                    </td>
                </tr>
              ))
              }
            </tbody>
          </table>
          <div className="flex flex-col justify-end items-end w-full">
              <div className='grid grid-cols-2 gap-2 mt-5 w-full max-w-sm'>              
              <p className="text-right">Subtotal:</p>
              <p className="text-left">${subtotal.toFixed(2)}</p>

              <label className="text-right font-bold" htmlFor="descuento">Descuento: </label>
              <input id='descuento' className='"border rounded-md w-10 px-2' type="number" placeholder='10%' value={descuento} onChange={(e) => setDescuento(Number(e.target.value))} />
            
              <p className="text-right">Subtotal con descuento:</p>
                <p className="text-left">${subtotalConDescuento.toFixed(2)}</p>

                <p className="text-right">IVA (16%):</p>
                <p className="text-left">${iva.toFixed(2)}</p>

                <p className="text-right font-bold text-xl col-span-1">Total con IVA:</p>
                <p className="text-left font-bold text-xl col-span-1">${totalCart.toFixed(2)}</p>

            </div>
          </div>
          
        </div>
        
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          ></div>
        )}
        <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg z-50 transform transition-transform duration-500 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="p-4 flex justify-between items-center border-b">
            <h2 className="text-lg font-bold">Clientes</h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-600">X</button>
          </div>
          <div className='flex flex-col items-center h-full'>
            <label htmlFor="">Clientes</label>
            <select name="cliente" id="cliente" className='border p-2 rounded' onChange={handleChange}>
              <option value="">Seleccione un cliente</option>
              {Clients && Clients.map((client) => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
            {clientSelected && (
              <div className="mt-4">
                <p><strong>Id:</strong> {clientSelected.id}</p>
                <p><strong>Nombre:</strong> {clientSelected.name}</p>
                <p><strong>Direccion:</strong> {clientSelected.address || "Sin datos"}</p>
                <p><strong>Correo:</strong> {clientSelected.email || "Sin Datos"}</p>
                <p><strong>Telefono:</strong> {clientSelected.phone || "Sin datos"}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between px-5 mt-2 w-3/4">
          <button className="bg-black hover:bg-slate-500 text-white rounded-xl w-[200px] h-auto text-2xl" onClick={finishedSale}>Finalizar venta</button> 
          <button className='bg-red-500 hover:bg-red-700 text-white rounded-xl w-[200px] h-auto text-2xl' onClick={eliminar}>Eliminar Venta</button>
        </div>
        </div>
    </div>
  )
}
