"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from "react-hook-form"
import toast from 'react-hot-toast'
import { useStore } from '@/Context/newStoreContext'

export default function NewProvider() {
  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm();
  const params = useParams();
  const router = useRouter();
  const { selectedStore } = useStore();

  useEffect(() => {
    
    if (params.idProvider) {
      console.log("ID de proveedor:", params.idProvider);
      const toastId = toast.loading("Cargando...");
      fetch(`/api/providers/${params.idProvider}`)
        .then(res => res.json())
        .then(async data => {
          setValue("name", data.name);
          setValue("phone", data.phone);
          setValue("email", data.email);
          setValue("address", data.address);
          setValue("rfc", data.rfc);
          setValue("code", data.codeProvider);
          setValue("status", data.status);

          toast.success("Proveedor cargado", { id: toastId });
        })
        .catch(error => toast.error("Error al cargar al proveedor", { id: toastId }));
    }
  }, [params.idProvider, setValue, selectedStore]);

  const onSubmit = handleSubmit(async (data) => { 
    const toastId = toast.loading("Registrando...");

    if (data.phone.length < 10) {
      toast.error("El numero telefonico debe ser de 10 digitos", { id: toastId });
      return;
    }
      
    const payload = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      address: data.address,
      status: data.status,
      rfc: data.rfc,
      storeId: selectedStore,
      codeProvider: data.code,
    };
    //console.log("Payload:", payload);

    try {
      if (params.idProvider) {
        await fetch(`/api/providers/${params.idProvider}`, {
          method: 'PUT',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        toast.success("Proveedor actualizado", { id: toastId });
      } else {
        const res = await fetch('/api/providers', {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if(!res.ok) throw new Error("Error al crear al proveedor");
        toast.success("Proveedor registrado", { id: toastId });
      }
      router.refresh();
      router.push("../proveedores");
    } catch (e) {
        toast.error("Error al registrar al proveedor", { id: toastId });
        console.error("Error:", e);
    }
  });

  return (
    <div className="flex flex-col mt-5 justify-center items-center h-screen">
      <div className="flex p-10 w-full h-[50px]">
        <Link href="../proveedores" className=''>
        <img src="/volver.png" width={30} height={30} alt="Regresar" />
        </Link>
      </div>
      
      <div className="flex justify-center items-center h-screen">
        <form onSubmit={onSubmit} className="p-6 w-full h-auto">
          <div className="bg-gray-200 flex flex-col justify-center border-2 rounded-lg w-[500px] m-4">
            
            <div className=" w-[450px] m-4">
              <h2 className="font-bold text-xl mb-6">Nuevo Proveedor</h2>
              <label htmlFor="name">Nombre:</label>
              <input id="name" type='text'{...register("name", { required: true })} className={`border p-2 mb-4 w-full rounded-lg ${errors.name ? "border-red-400 border-2" : "border-gray-500"}`} placeholder="Ej. EcoBolsa" />
              
              <label htmlFor="description">Telefono</label>
              <input id="phone" type='tel' {...register("phone", {required: true})} className={`border p-2 mb-4 w-full text-black rounded-lg ${errors.phone ? "border-red-400 border-2" : "border-gray-500"}`} placeholder="33-XXXX-XXXX"/>
              
              <label htmlFor="email">Correo electronico</label>
              <input id="email" type="text" {...register("email", { required: true })} className={`border p-2 mb-4 w-full text-black rounded-lg ${errors.email ? "border-red-400 border-2" : "border-gray-500"}`} placeholder="1" />
              
              <label htmlFor="address">Direccion</label>
              <input id="address" type="text" {...register("address", { required: true })} className={`border p-2 mb-4 w-full text-black rounded-lg ${errors.address ? "border-red-400 border-2" : "border-gray-500"}`} placeholder="1"/>
              
              <label htmlFor="rfc"><span>RFC Proveedor</span>
              <input id="rfc" type="text" {...register("rfc", { required: true })} className={`border p-2 mb-4 w-full text-black rounded-lg ${errors.rfc ? "border-red-400 border-2" : "border-gray-500"}`} placeholder="$15" />
              </label>              
  
              <label htmlFor="code">Codigo de proveedor</label>
              <input id="code" type="text" {...register("code")} className={`border mb-4 p-2 w-full text-black rounded-lg ${errors.code ? "border-red-400 border-2" : "border-gray-500"}`} placeholder="1"/>
              <p className="text-sm text-gray-600 italic mb-4">Nota: Algunos proveedores generan un código para obtener descuentos o beneficios especiales. Si no cuentas con uno no lo agreges</p>

              <label htmlFor="status" className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium">Habilitado:</span>
                <div className="relative inline-block w-12 h-6">
                  <input id="status" type="checkbox" {...register("status")} defaultChecked className="peer sr-only"/>
                  <div className="w-full h-full hover:cursor-pointer bg-gray-300 rounded-full peer-checked:bg-green-500 transition-colors duration-300"></div>
                  <div className="absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 peer-checked:translate-x-6"></div>
                </div>
              </label>
              <button type="submit" className="bg-black hover:bg-slate-500 text-white rounded-xl w-full h-auto text-2xl">Guardar</button>
            </div>
              </div>

          
        </form>
      </div>
    </div>
  );
}
