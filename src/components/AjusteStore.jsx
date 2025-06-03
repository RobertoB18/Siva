"use client"
import React from 'react'
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useStore } from '@/Context/newStoreContext'
import toast, { Toaster } from "react-hot-toast";
import ImagenLogo from '@/components/ImagenLogo'

export default function AjusteStore() {

  const router = useRouter();
  const params = useParams();
  const {addStore, updateStore} = useStore()

  const {register, handleSubmit, setValue, formState: {errors}} = useForm();
  const [logo, setLogo] = useState(null);
  const [file, setFile] = useState({});

  useEffect(() => {
      if (params.idStore) {
          fetch(`/api/${params.idStore}`)
          .then((res) => {
              if (!res.ok) throw new Error("Error en la petición");
              return res.json();
          })
          .then((data) => {
            console.log(data);
            setLogo(data.logo),
            setValue("name", data.name),
            setValue("email", data.email),
            setValue("phone",data.phone),
            setValue("address",data.address)
            setValue("descuento",data.descuento)
          })
          .catch(error => console.error("Error al obtener el producto:", error));
      }
  }, []); 

  const onSubmit = handleSubmit(async (data) => {
    const toastId = toast.loading("Creando negocio...");
    if(data.descuento){
      if(data.descuento > 70 || data.descuento < 10){
        toast.error("El descuento debe estar entre 10% y 70%", { id: toastId });
        return;
      }
      
    }

    let uploadedImageUrl = logo;
    try {
      if (file && file.name) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "preset_publico");

        const res = await fetch( `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: "POST",
          body: formData,
        });

        const cloudinaryData = await res.json();
        uploadedImageUrl = cloudinaryData.secure_url;
      }


      const payload = {
        name: data.name, 
        email: data.email, 
        phone: data.phone, 
        address: data.address,
        logo: uploadedImageUrl,
        descuento: data.descuento ? Number(data.descuento) : 70,
        storeId: Number(params.idStore),
      };
      console.log("payload", payload);
      if(params.idStore){
        await updateStore(payload,);
        toast.success("Actualización exitosa", { id: toastId });
      }
      else{
        await addStore(payload);
        toast.success("Registro exitoso", { id: toastId });
      }
      router.refresh();
      router.push("/dashboard")

    } catch (error) {
      toast.success("Error al crear el negocio", { id: toastId });
    }
  })
  return (
    <div className="min-h-screen flex flex-col items-center overflow-y-auto px-4 py-8">
      <h1 className='text-4xl font-bold mt-10 '>Crear nueva Empresa</h1>
      <form className='flex flex-col w-3/4 p-10'onSubmit={onSubmit}>
        
        <label htmlFor="name">Nombre Tienda</label>
        <input disabled={params.idStore} id="name" {...register("name", { required: true })} className={`border p-2 mb-4 w-full text-black rounded-lg ${errors.name ? "border-red-400 border-2" : "border-gray-500"}`} placeholder="Ej. Tortilla" />
              
        <label htmlFor="email">Email</label>
        <input id="email" type="text" className={`border rounded-md p-1 mb-4 w-full text-black ${errors.email ? "border-red-400 border-2": "border-gray-500"}`} placeholder="example1@gmail.com" {...(register("email", {required: true,} ))}/>

        <label htmlFor="phone">Telefono de la tienda</label>
        <input type="number" name="phone" id="phone" placeholder='Telefono de la tienda' className={`border rounded-md p-1 mb-4 ${errors.phone ? "border-red-400 border-2": "border-gray-500"}`} {...(register("phone", {required: true,} ))}/>
        
        <label htmlFor="address">Codigo Postal</label>
        <input type="number" name="address" id="address" placeholder='Direccion de la tienda' className={`border rounded-md p-1 mb-4 ${errors.address ? "border-red-400 border-2": "border-gray-500"}`} {...(register("address", {required: true,} ))}/>
        
        <label htmlFor="address">% Descuento maximo permitido (10% - 70%)</label>
        <input type="number" name="address" id="address" placeholder='Direccion de la tienda' className={`border rounded-md p-1 mb-4 ${errors.descuento ? "border-red-400 border-2": "border-gray-500"}`} {...(register("descuento"))}/>
        <p className="text-sm text-gray-600 italic mb-4">Nota: En caso de no proporcionar un descuento se establecera un maximo de 70%</p>
      
        <ImagenLogo register={register} setValue={setValue} defaultValue={logo} errors={errors} setFile={setFile}/>
        
        <button type='submit' className='bg-slate-900 text-white rounded-lg p-2'>{params.idStore ? "Actualizar tienda" : "Crear tienda"}</button>
      </form>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )

}
