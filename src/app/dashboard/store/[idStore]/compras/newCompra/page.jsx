"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useStore } from '@/Context/newStoreContext'
import CodeBar from '@/components/CodeBar'
import AsyncSelect from 'react-select/async'
import { useBuys } from '@/app/Hooks/useBuys'

export default function page() {
  const { selectedStore } = useStore();
  const {clearCart, addtoBuy, updateCartQuantity, removeFromCart, validateQuantity, finishBuy, totalIva, cart,setCart, totalCart, updateBuy} = useBuys()
  
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [providers, setProviders] = useState(null)
  const [providerSelected, setProviderSelected] = useState(null)
  const params = useParams();

  useEffect(() => {
    if(params.idCompra){
      const toastId = toast.loading("Cargando...");
      fetch(`/api/buys/${params.idCompra}`)
        .then(res => res.json())
        .then(async data => {
          setCart(data.productos);

          if (providers) {
            const providerObj = providers.find(c => c.id === data.providerId);
            console.log(providerObj)
            if (providerObj){
              setProviderSelected(providerObj);
            } 
          } else {
            console.log(data.providerId)
            setProviderSelected(data.providerId);
          }
          toast.success("Compra cargada", { id: toastId });
        })
        .catch(error => toast.error("Error al cargar la compra", { id: toastId }));
      }
    }, [params.idCompra, providers]);

  useEffect(() => {
    
    const fetchproviders = async () => {
      const response = await fetch(`/api/providers?idStore=${selectedStore}`) // Cambia la URL según tu API
      const data = await response.json()
      setProviders(data)
    }

    fetchproviders()
  }, [selectedStore])

  const options = (inputValue) => {
    if(!inputValue) return [];
    return fetch(`/api/searchProduct?q=${inputValue}&idStore=${selectedStore}&casse=1`) // Cambia la URL según tu API
      .then((response) => response.json())
      .then((data) => {
        return data.map((item) => ({
          label: `${item.name} `,
          id: item.id,
          name: item.name,
          priceCost: item.priceCost,
          unity: item.unities,
          stock: item.stock,
        }))
      })
  }

  const handleChange = (e) => {
    const id = Number(e.target.value)
    const selected = providers.find(cat => cat.id === id);
    setProviderSelected(selected)
  }

  const eliminar = async () => {
    const toastId = toast.loading("Eliminando compra...")
    try {
      if(params.idCompra){
        const result = await fetch(`/api/buys/${params.idCompra}`, {
          method: "DELETE",
        })
        if(!result.ok) return toast.error("Error al eliminar la compra", { id: toastId });
      } 
      clearCart()
      toast.success("Compra eliminada", { id: toastId })
      router.push("../compras")
    } catch (error) {
      console.log(error)
      toast.error("Error al eliminar la compra", { id: toastId })
    }
  }

  const finishedBuy = async () => {
    const toastId = toast.loading("Registrando compra...")
    try {
      if(params.idCompra){
        if(cart.length === 0) return toast.error("No hay productos en el carrito", { id: toastId })
        const clientId = providerSelected ? Number(providerSelected.id) : null
        const buyId = Number(params.idCompra)
        const result = await updateBuy(selectedStore, clientId, buyId)

        if(!result.success) return toast.error("Error al actualizar la compra", { id: toastId });
        toast.success("Compra actualizada", { id: toastId })
        clearCart()
      }
      else{
        if(cart.length === 0) return toast.error("No hay productos en el carrito", { id: toastId })
        if(!providerSelected) return toast.error("Seleccione un proveedor", { id: toastId })

        const providerId = Number(providerSelected.id)
        const result = await finishBuy(selectedStore, providerId)
      
        if(!result.success) return toast.error("Error al registrar la compra", { id: toastId });
        toast.success("Compra finalizada", { id: toastId })
        clearCart()
      }
      
      //router.refresh();
      router.push("../compras");
    } catch (error) {
      console.log(error)
      toast.error("Error al registrar la compra", { id: toastId }) 
    }
  }

  const exit = () => {
    if(params.idCompra){
      clearCart()
    }

  }
  return (
    <div className='ms-12 mt-5'>
      <Link href="../compras" onClick={exit} className=''>
        <img src="/volver.png" width={30} height={30} alt="Regresar" />
      </Link>
      <div>
        <h1 className='text-3xl font-bold'>Registrar Compra de mercancia</h1>
        <div className='mt-5 flex flex-col'>
          <h2 className='text-xl font-bold'>Selecciona el producto</h2>
          <AsyncSelect className='w-4/5' onChange={addtoBuy} loadOptions={options} placeholder="Buscar producto..." defaultOptions cacheOptions> </AsyncSelect>
        </div>
        <div className='mt-6 flex'>
          <button className='bg-slate-700 hover:bg-slate-500 text-xl text-white rounded-md h-8' onClick={() => setIsOpen(true)}>Selecciona un proveedor</button>
          {providerSelected && 
            <>
              <p className='ms-6 font-bold'>Proveedor:</p>
              <p className='border rounded-md w-auto'>{providerSelected.name}</p>
            </> 
          }
        </div>
        <div className='h-auto w-3/4 flex flex-col ms-16 mt-5 mb-10'>
          <table className="table-auto border-collapse border border-gray-300 w-full h-7">
          <thead>
            <tr className="bg-black text-white">
                <th className="border border-gray-300 px-4 py-2">Cantidad</th>
                <th className="border border-gray-300 px-4 py-2">Nombre</th>
                <th className="border border-gray-300 px-4 py-2">Stock Actual</th>
                <th className="border border-gray-300 px-4 py-2">Precio S/IVA</th>
                <th className="border border-gray-300 px-4 py-2">Precio de Compra </th>
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
                  <td className="border border-gray-300 px-4 py-2 text-center">{item.name}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{item.stock}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">${item.priceIva}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">${item.priceCost}</td>
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
        
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          ></div>
        )}
        <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg z-50 transform transition-transform duration-500 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="p-4 flex justify-between items-center border-b">
            <h2 className="text-lg font-bold">Proveedores</h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-600">X</button>
          </div>
          <div className='flex flex-col items-center h-full'>
            <label htmlFor="">Proveedores</label>
            <select name="cliente" id="cliente" className='border p-2 rounded' onChange={handleChange}>
              <option value="">Seleccione un Proveedores</option>
              {providers && providers.map((client) => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
            {providerSelected && (
              <div className="mt-4">
                <p><strong>Id:</strong> {providerSelected.id}</p>
                <p><strong>Nombre:</strong> {providerSelected.name}</p>
                <p><strong>Direccion:</strong> {providerSelected.address || "Sin datos"}</p>
                <p><strong>Correo:</strong> {providerSelected.email || "Sin Datos"}</p>
                <p><strong>Telefono:</strong> {providerSelected.phone || "Sin datos"}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between px-5 mt-2 w-3/4">
          <button className="bg-black hover:bg-slate-500 text-white rounded-xl w-[200px] h-auto text-2xl" onClick={finishedBuy}>{params.idCompra ? "" : "Registrar compra"}</button>
          <button className='bg-red-500 hover:bg-red-700 text-white rounded-xl w-[200px] h-auto text-2xl' onClick={eliminar}>{params.idCompra ? "Eliminar compra" : "Cancelar compra"}</button>
        </div>
        </div>
    </div>
  )
}
