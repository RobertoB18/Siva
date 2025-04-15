"use client"
import Link from 'next/link'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from "react-hook-form"
import toast from 'react-hot-toast'
import { useStore } from '@/Context/newStoreContext'
import Image from 'next/image'

export default function NewProduct() {
  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm();
  const params = useParams();
  const router = useRouter();
  const { selectedStore } = useStore();

  const priceCost = watch("priceCost");

  useEffect(() => {
    
    if (params.idProduct) {
      const toastId = toast.loading("Cargando...");
      fetch(`/api/productos/${params.idProduct}`)
        .then(res => res.json())
        .then(data => {
          setValue("name", data.name);
          setValue("priceCost", data.priceCost);
          setValue("priceMen", data.priceMen);
          setValue("stock", data.stock);
          setValue("priceMay", data.priceMay);
          setValue("mayQuantity", data.mayQuantity);
          toast.success("Producto cargado", { id: toastId });
        })
        .catch(error => toast.error("Error al cargar el producto", { id: toastId }));
    }
  }, [params.idProduct, setValue]);

  const handleInput1Change = (e) => {
    const percentage = parseFloat(e.target.value);
    if (!isNaN(percentage) && priceCost) {
      const price = (parseFloat(priceCost) * (percentage / 100)) + parseFloat(priceCost);
      setValue("priceMen", price.toFixed(2));
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    const toastId = toast.loading("Guardando...");

    const payload = {
      name: data.name,
      storeId: Number(selectedStore),
      priceCost: Number(data.priceCost),
      priceMen: Number(data.priceMen),
      stock: Number(data.stock),
      priceMay: Number(data.priceMay),
      mayQuantity: Number(data.mayQuantity),
    };

    try {
      if (params.idProduct) {
        await fetch(`/api/productos/${params.idProduct}`, {
          method: 'PUT',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        toast.success("Producto actualizado", { id: toastId });
      } else {
        await fetch('/api/productos', {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        toast.success("Producto creado", { id: toastId });
      }
      router.refresh();
      router.push("../almacen");
    } catch (e) {
        toast.error("Error al guardar el producto", { id: toastId });
        console.error("Error:", e);
    }
  });

  return (
    <>
      <Link href="../almacen" className=''>
        <img src="/volver.png" width={30} height={30} alt="Regresar" />
      </Link>
      <div className="h-screen flex flex-col">
        <form onSubmit={onSubmit} className="p-6 w-full h-auto">
          <div className="flex flex-grow justify-center">
            <div className="w-1/2 m-4">
              <h2 className="font-bold text-xl mb-6">Registro</h2>

              <label htmlFor="name">Nombre del producto</label>
              <input id="name" {...register("name", { required: true })} className={`border p-2 mb-4 w-full text-black rounded-lg ${errors.name ? "border-red-400 border-2" : "border-gray-500"}`} placeholder="Ej. Tortilla" />

              <label htmlFor="priceCost">Precio de compra</label>
              <input id="priceCost" type="number" onChange={handleInput1Change} {...register("priceCost", { required: true })} className={`border p-2 mb-4 w-full text-black rounded-lg ${errors.priceCost ? "border-red-400 border-2" : "border-gray-500"}`} placeholder="$10" />

              <label htmlFor="porcent">* Cantidad de ganancia %</label>
              <input type="number" onChange={handleInput1Change} className="border border-gray-500 p-2 mb-4 w-full text-black rounded-lg" />

              <label htmlFor="precioMen">Precio</label>
              <input id="precioMen" type="number" {...register("priceMen", { required: true })} className={`border p-2 mb-4 w-full text-black rounded-lg ${errors.priceMen ? "border-red-400 border-2" : "border-gray-500"}`} placeholder="$15" />

              <label htmlFor="stock">Stock</label>
              <input id="stock" type="number" {...register("stock", { required: true })} className={`border p-2 mb-4 w-full text-black rounded-lg ${errors.stock ? "border-red-400 border-2" : "border-gray-500"}`} placeholder="1" disabled={!!params.idProduct} />
            </div>

            <div className="w-1/2 m-4">
              <h2 className="font-bold text-xl mb-6">Opciones de Mayoreo *</h2>
              <label htmlFor="priceMay">Precio Mayoreo</label>
              <input id="priceMay" type="number" {...register("priceMay")} className="border border-gray-500 p-2 mb-4 w-full text-black rounded-lg" placeholder="$13" />

              <label htmlFor="quantityMay">Cantidad Mayoreo</label>
              <input id="quantityMay" type="number" {...register("mayQuantity")} className="border border-gray-500 p-2 mb-4 w-full text-black rounded-lg" placeholder="5" disabled={!watch("priceMay")} />
            </div>
          </div>

          <div className="flex justify-between pt-10 m-4">
            <button type="submit" className="bg-black hover:bg-slate-500 text-white rounded-xl w-[150px] h-auto text-2xl">Guardar</button>
            {params.idProduct && (
              <button type="button" className="bg-red-500 hover:bg-red-700 text-white rounded-xl w-[150px] h-auto text-2xl"
                onClick={async () => { 
                  await fetch(`/api/productos/${params.idProduct}`, { method: 'DELETE' });
                  router.refresh();
                  router.push("../almacen");
                }}>Eliminar</button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
