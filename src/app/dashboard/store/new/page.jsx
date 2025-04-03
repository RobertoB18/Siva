"use client"
import React from 'react'
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useStore } from '@/Context/newStoreContext'

export default function page() {

  const router = useRouter();
  const params = useParams();
  const {addStore} = useStore()

  const {register, handleSubmit, formState: {errors}} = useForm();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
      if (params.idProduct) {
          fetch(`/api/${params.idProduct}`)
              .then((res) => {
                  if (!res.ok) throw new Error("Error en la petición");
                  return res.json();
              })
              .then((data) => {
                  setName(data.name);
                  setEmail(data.email),
                  setPhone(data.phone),
                  setAddress(data.address)
              })
              .catch(error => console.error("Error al obtener el producto:", error));
      }
  }, []); 

  const onSubmit = handleSubmit(async (e) => {
    
    try {
      const newStore = {name, email, phone, address};
      await addStore(newStore);
      router.push("/dashboard")

    } catch (error) {
      console.error("Error al crear la tienda:", error)
    }
  })
  return (
    <div className='flex flex-col justify-center items-center h-3/4'>
      <h1 className='text-4xl font-bold mt-10 '>Crear nueva Empresa</h1>
      <form className='flex flex-col w-3/4 p-10'onSubmit={onSubmit}>
        
        <label htmlFor="name">Nombre de la tienda</label>
        <input id="name" type="text" className={`border rounded-md p-1 mb-4 ${errors.name ? "border-red-400 border-2": "border-gray-500"}`} placeholder='Nombre de la tienda' {...(register("name", {required: true,} ))} onChange={e => setName(e.target.value)} value={name}/>
        
        <label htmlFor="email">Email</label>
        <input id="email" type="text" className={`border rounded-md p-1 mb-4 w-full text-black ${errors.email ? "border-red-400 border-2": "border-gray-500"}`} placeholder="example1@gmail.com" {...(register("email", {required: true,} ))} onChange={e => setEmail(e.target.value)} value={email}/>

        <label htmlFor="phone">Telefono de la tienda</label>
        <input type="text" name="phone" id="phone" placeholder='Telefono de la tienda' className={`border rounded-md p-1 mb-4 ${errors.phone ? "border-red-400 border-2": "border-gray-500"}`} {...(register("phone", {required: true,} ))} onChange={e => setPhone(e.target.value)} value={phone}/>
        
        <label htmlFor="address">Direccion de la tienda</label>
        <input type="text" name="address" id="address" placeholder='Direccion de la tienda' className={`border rounded-md p-1 mb-4 ${errors.address ? "border-red-400 border-2": "border-gray-500"}`} {...(register("address", {required: true,} ))} onChange={e => setAddress(e.target.value)} value={address}/>
        
        <button type='submit' className='bg-slate-900 text-white rounded-lg p-2'>Crear</button>
      </form>
    </div>
  )
  /*<label htmlFor="logo">Logo de la tienda</label>
        <input type="file" name="logo" id="logo" accept="image/*" placeholder='Logo de la tienda' className={`border rounded-md p-1 mb-4 ${errors.logo ? "border-red-400 border-2": "border-gray-500"}`} {...(register("logo", {required: true,} ))}/>*/ 
}
