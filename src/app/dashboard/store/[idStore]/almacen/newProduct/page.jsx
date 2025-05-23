"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from "react-hook-form"
import toast from 'react-hot-toast'
import { useStore } from '@/Context/newStoreContext'
import CodeBar from '@/components/CodeBar'
import AsyncSelect from 'react-select/async'
import BarcodeScannerPage from '@/components/ScanCode'

export default function NewProduct() {
  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm();
  const params = useParams();
  const router = useRouter();
  const { selectedStore } = useStore();

  const [loadCodeBar, setLoadCodeBar] = useState(null);
  const [selectedUnidad, setSelectedUnidad] = useState(null);
  const [mode, setMode] = useState("none");
  
  const priceCost = watch("priceCost");

  useEffect(() => {
    
    if (params.idProduct) {
      const toastId = toast.loading("Cargando...");
      fetch(`/api/productos/${params.idProduct}`)
        .then(res => res.json())
        .then(async data => {
          setMode("generate");
          setLoadCodeBar(data.codeBar);
          setValue("name", data.name);
          setValue("description", data.description);
          setValue("priceCost", data.priceCost);
          setValue("priceMen", data.priceMen);
          setValue("stockMin", data.stockMin);
          setValue("stock", data.stock);
          setValue("priceMay", data.priceMay);
          setValue("codesat", data.codesat);
          setValue("status", data.status);
          setValue("mayQuantity", data.mayQuantity);
          setValue("codeBar", data.codeBar);
          console.log(data.unity)
          const resUnidad = await fetch(`/api/unity?q=${data.unityCode}`);
          const dataUnidad = await resUnidad.json();
          console.log(dataUnidad);
          
          const unidad = dataUnidad.data.find(u => u.key === data.unityCode);

          if (unidad) {
            setSelectedUnidad({
              label: `${unidad.description} (${unidad.key})`,
              value: unidad.key,
              unidad: unidad.description
            });
          }
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

  const handleUnidadChange = (selectedOption) => {
    setSelectedUnidad(selectedOption);
  }

  const options = async (inputValue) => {
    if(!inputValue) return [];
    try {
      const res = await fetch(`/api/unity?q=${inputValue}`);
      const data = await res.json();

      return data.data.map((item) => ({
        label: `${item.description} (${item.key})`,
        value: item.key,
        unidad: item.description
      }));

    } catch (error) {
      console.error("Error fetching options:", error);
    }
  }

  const onSubmit = handleSubmit(async (data) => {
    const toastId = toast.loading("Guardando...");

    if (!selectedUnidad) {
      toast.error("Debes seleccionar una unidad de medida", { id: toastId });
      return;
    }
    if(!data.codesat || data.codesat.length < 8 || data.codesat.length > 8){
      toast.error("El codigo SAT debe tener 8 digitos", { id: toastId });
      return;
    }
      
    const payload = {
      name: data.name,
      storeId: Number(selectedStore),
      priceCost: Number(data.priceCost),
      priceMen: Number(data.priceMen),
      stockMin: Number(data.stockMin),
      stock: Number(data.stock),
      unity: selectedUnidad.unidad,
      unityCode: selectedUnidad.value,
      description: data.description,
      status: data.status,
      codesat: data.codesat,
      priceMay: Number(data.priceMay),
      mayQuantity: Number(data.mayQuantity),
      codeBar: data.codeBar,
    };
    //console.log("Payload:", payload);

    try {
      if (params.idProduct) {
        await fetch(`/api/productos/${params.idProduct}`, {
          method: 'PUT',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        toast.success("Producto actualizado", { id: toastId });
      } else {
        const res = await fetch('/api/productos', {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if(!res.ok) throw new Error("Error al crear el producto");
        toast.success("Producto creado", { id: toastId });
      }
      router.refresh();
      router.push("../compras/newCompra");
    } catch (e) {
        toast.error("Error al guardar el producto", { id: toastId });
        console.error("Error:", e);
    }
  });

  return (
    <>
      <Link href="../compras/newCompra" className=''>
        <img src="/volver.png" width={30} height={30} alt="Regresar" />
      </Link>
      <div className="h-screen flex flex-col">
        <form onSubmit={onSubmit} className="p-6 w-full h-auto">
          <div className="flex flex-grow justify-center ">
            
            <div className=" w-1/2 m-4">
              <h2 className="font-bold text-xl mb-6">Nuevo Producto</h2>
              <label htmlFor="name">Nombre del producto</label>
              <input id="name" {...register("name", { required: true })} className={`border p-2 mb-4 w-full text-black rounded-lg ${errors.name ? "border-red-400 border-2" : "border-gray-500"}`} placeholder="Ej. Tortilla" />
              
              <label htmlFor="description">Descripcion</label>
              <input id="description" {...register("description", {required: true})} className={`border p-2 mb-4 w-full text-black rounded-lg ${errors.description ? "border-red-400 border-2" : "border-gray-500"}`} placeholder="Torilla de maiz"/>
              
              <div className='flex flex-grow w-full'>
                <div className="flex flex-col w-1/2">
                  <label htmlFor="stockMin">Cantidad minima</label>
                  <input id="stockMin" type="number" {...register("stockMin", { required: true })} className={`border p-2 mb-4 w-4/5 text-black rounded-lg ${errors.stockMin ? "border-red-400 border-2" : "border-gray-500"}`} placeholder="1" />
                </div>
                <div className="flex flex-col w-1/2">
                  <label htmlFor="stock">Cantidad</label>
                  <input id="stock" type="number" {...register("stock", { required: true })} className={`border p-2 mb-4 w-4/5 text-black rounded-lg ${errors.stock ? "border-red-400 border-2" : "border-gray-500"}`} placeholder="1" disabled={!!params.idProduct} />
                </div>
              </div>

              <div className='flex flex-grow w-full'>
                <div className="flex flex-col w-1/2">
                  <label htmlFor="priceCost">Precio de compra</label>
                  <input id="priceCost" type="number" onChange={handleInput1Change} {...register("priceCost", { required: true })} className={`border p-2 mb-4 w-4/5 text-black rounded-lg ${errors.priceCost ? "border-red-400 border-2" : "border-gray-500"}`} placeholder="$10" />
                </div>
                <div className="flex flex-col w-1/2">
                  <label htmlFor="porcent">* Cantidad de ganancia %</label>
                  <input type="number" onChange={handleInput1Change} className="border border-gray-500 p-2 mb-4 w-4/5 text-black rounded-lg" />
                </div>
              </div>
              
              
              <label htmlFor="precioMen">Precio</label>
              <br />
              <input id="precioMen" type="number" {...register("priceMen", { required: true })} className={`border p-2 mb-4 w-2/5 text-black rounded-lg ${errors.priceMen ? "border-red-400 border-2" : "border-gray-500"}`} placeholder="$15" />

              <div className='flex flex-grow w-full'>
                <div className="flex flex-col w-1/2">
                  <label htmlFor="unidad">Unidad de medida</label>
                  <AsyncSelect id="unity" className='w-4/5' value={selectedUnidad} onChange={handleUnidadChange} loadOptions={options} placeholder="Buscar unidad..." isClearable defaultOptions cacheOptions />
                </div>
                <div className="flex flex-col w-1/2">
                  <label htmlFor="codeBar">Codigo SAT</label>
                  <input id="codesat" type="number" {...register("codesat", { required: true })} className={`border p-2 mb-4 w-2/5 text-black rounded-lg ${errors.codesat ? "border-red-400 border-2" : "border-gray-500"}`} placeholder="12345678" />
                </div>
              </div>
              
              <label htmlFor="status">Habilitado: </label>
              <input id="status" type="checkbox" {...register("status")} className="border border-gray-500 p-2 mb-4 w-2/5 text-black rounded-lg" defaultChecked />
            </div>

            <div className="w-1/2 m-4 border-s-2 border-gray-500 p-5">
              <h2 className="font-bold text-xl mb-6">Opciones de Mayoreo</h2>
              <label htmlFor="priceMay">Precio Mayoreo</label>
              <input id="priceMay" type="number" {...register("priceMay")} className="border border-gray-500 p-2 mb-4 w-full text-black rounded-lg" placeholder="$13" />

              <label htmlFor="quantityMay">Cantidad Mayoreo</label>
              <input id="quantityMay" type="number" {...register("mayQuantity")} className="border border-gray-500 p-2 mb-4 w-full text-black rounded-lg" placeholder="5" disabled={!watch("priceMay")} />
              <div className="my-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setMode("generate")}
                  className={`px-4 py-2 rounded ${mode === "generate" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                  Generar Código de Barras
                </button>
                <button
                  type="button"
                  onClick={() => setMode("scan")}
                  className={`px-4 py-2 rounded ${mode === "scan" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                  Escanear Código de Barras
                </button>
              </div>
              {mode === "generate" && (
                <div className="my-4">
                  <CodeBar
                    register={register}
                    setValue={setValue}
                    defaultValue={loadCodeBar}
                  />
                </div>
              )}

              {mode === "scan" && (
                <div className="my-4">
                  <BarcodeScannerPage
                  setloadCodeBar={setLoadCodeBar}
                  setValue={setValue}
                  setMode={setMode}

                  />
                </div>
              )}
              
            </div>
            
          </div>

          <div className="flex justify-between px-5 mt-2">
            
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
