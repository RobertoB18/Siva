"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useStore } from '@/Context/newStoreContext'
import CodeBar from '@/components/CodeBar'
import AsyncSelect from 'react-select/async'
import { useSale } from '@/app/Hooks/useSale'

export default function () {
  const { selectedStore } = useStore();
  const {clearCart, addtoSale, updateCartQuantity, removeFromCart, validateQuantity, generatePdf, cart, totalCart, totalIva} = useSale()
  const router = useRouter()

  const [showConfirm, setShowConfirm] = useState(false)

  const options = (inputValue) => {
    if(!inputValue) return [];
    return fetch(`/api/searchProduct?q=${inputValue}&idStore=${selectedStore}`) // Cambia la URL según tu API
      .then((response) => response.json())
      .then((data) => {
        return data.map((item) => ({
          label: `${item.name} `,
          id: item.id,
          name: item.name,
          description: item.description,
          priceMen: item.priceMen,
          priceMay: item.priceMay,
          mayQuantity: item.mayQuantity,
          product_key: item.codesat,
          unity: item.unity,
          unityCode: item.unityCode,
          stock: item.stock,
          stockMin: item.stockMin
        }))
      })
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

    const generadorPdf = async () => {
    const toastId = toast.loading("Generando recibo...")
    try {
        if(cart.length === 0) {
          toast.error("No hay productos en la cotizacion", { id: toastId })
          return
        }
        generatePdf(selectedStore)
        clearCart()
        toast.success("Generado con exito", { id: toastId })
        router.push("../ventas");
    } catch (error) {
      console.log(error)
      toast.error("Error al general el recibo")
    }    
  }

  const finishedSale = async () => {
    const toastId = toast.loading("Cambiando a venta...")
    try {
        toast.success("Cambio realizado", { id: toastId })
        router.push("../ventas/newVenta");
    } catch (error) {
      console.log(error)
      toast.error("Error al realizar el cambio")
    }    
  }

  return (
    <div className='ms-12 mt-5'>
      <Link href="../ventas" onClick={clearCart} className=''>
        <img src="/volver.png" width={30} height={30} alt="Regresar" />
      </Link>
      <div>
        <h1 className='text-3xl font-bold'>Generar cotizacion</h1>
        <div className='mt-5 flex flex-col'>
            <h2 className='text-xl font-bold'>Selecciona el producto</h2>
            <AsyncSelect className='w-4/5' onChange={addtoSale} loadOptions={options} placeholder="Buscar producto..." defaultOptions cacheOptions> </AsyncSelect>
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
          <p className='text-xl mt-6'>Sub-Total: ${totalIva}</p>
          <p className='text-xl mt-6'>Total: ${totalCart}</p>
        </div>
        
        <div className="flex justify-between px-5 mt-2 w-3/4">
          <button className="bg-black hover:bg-slate-500 text-white rounded-xl w-[200px] h-auto text-2xl" onClick={() => setShowConfirm(true)}>Finalizar Cotizacion</button> 
          <button className='bg-red-500 hover:bg-red-700 text-white rounded-xl w-[200px] h-auto text-2xl' onClick={eliminar}>Eliminar Cotizacion</button>
        </div>
        </div>
        {showConfirm && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Finalizar cotizacion</h2>
                <p>¿Como deceas finalizar esta cotizacion?</p>
               <div className="flex justify-end gap-4 mt-6">
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                    onClick={() => {
                        setShowConfirm(false)
                        generadorPdf()
                    }}>
                    Generar PDF
                  </button>
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    onClick={() => {
                      setShowConfirm(false);
                      finishedSale();
                    }}
                  >
                    Realizar venta
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
    </div>
  )
}
