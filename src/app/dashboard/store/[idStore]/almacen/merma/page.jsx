"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useStore } from '@/Context/newStoreContext'
import AsyncSelect from 'react-select/async'
import { useSale } from '@/app/Hooks/useSale'
import BarcodeScannerPage from '@/components/ScanCode'

export default function () {
  const { selectedStore } = useStore();
  const {clearCart, addtoSale, updateCartQuantity, removeFromCart, validateQuantity, finishSale, iva, descuento, subtotalConDescuento, setDescuento, setStore, subtotal,  totalConDescuento, cart, setCart, totalCart, updateSale} = useSale()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [Clients, setClients] = useState(null)
  const [clientSelected, setClientSelected] = useState(null)
  const [valido, setValido] = useState(true)
  const [mode, setMode] = useState(false)

  const params = useParams();

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
          priceMen: 0,
          name: item.name,
          unity: item.unity,
          stock: item.stock,
          stockMin: item.stockMin
        }))
      })
  }

  const eliminar = async () => {
    const toastId = toast.loading("Cancelando venta...")
    try {
      clearCart()
      toast.success("Venta cancelada", { id: toastId })
      router.push("../ventas")
    } catch (error) {
      console.log(error)
      toast.error("Error al cancelar la venta", { id: toastId })
    }
  }

  const finishedSale = async () => {
    const toastId = toast.loading("Finalizando venta...")
    if(cart.length === 0){
      toast.error("No hay productos en el carrito", { id: toastId })
      return false;
    } 
    const payload = {
      clienteId: null,
      use: null,
      pago: null,   
      storeId: selectedStore,
      status: true,
    }

    try {
        const result = await finishSale(payload)
        if(!result.success) return toast.error("Error al finalizar la venta", { id: toastId });
        toast.success("Venta finalizada", { id: toastId })
        clearCart();
        router.push("../almacen");
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

    <div>
      <h1 className="text-3xl font-bold">Nueva Venta</h1>

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

      {/* Tabla de productos */}
      <div className="h-auto w-3/4 flex flex-col ms-16 mt-5 mb-10">
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr className="bg-black text-white">
              <th className="border px-4 py-2">Cantidad</th>
              <th className="border px-4 py-2">U. Medida</th>
              <th className="border px-4 py-2">Nombre</th>
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
            <p className="text-right font-bold text-xl">Total con IVA:</p>
            <p className="text-left font-bold text-xl">${totalCart.toFixed(2)}</p>
          </div>
        </div>
      </div>

        <div className="flex justify-between px-5 mt-2 w-3/4">
          <>
            <button
              className="bg-black hover:bg-slate-500 text-white rounded-xl w-[200px] h-auto text-2xl"
              onClick={finishedSale}
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
    </div>
  </div>
);
}
