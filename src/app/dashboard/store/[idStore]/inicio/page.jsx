"use client"
import React from 'react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useStore } from "@/Context/newStoreContext";


export default function Cargando() {
  const {selectStore } = useStore();
  const {idStore} = useParams();
  const [store, setStore] = useState([]);

  useEffect(() => {async function fetchStores(){
    const toastId = toast.loading("Cargando tienda...");
    try {
      const response = await fetch("/api/" + idStore);
      console.log(response);

      if (!response.ok) throw new Error("Error al obtener tienda");
      
      const data = await response.json();
      if(!data) throw new Error("No se encontró la tienda");
      setStore(data);
      toast.success("Tienda cargada", { id: toastId });
    } catch (error) {
      selectStore(null);
      toast.error("Error al cargar tienda o no perteneces a esta", { id: toastId });
      console.error(error);
    }
  }
    fetchStores();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col items-center overflow-y-auto px-4 py-8">
      <h1 className='text-4xl'>Bienvenido a {store.name}</h1>
      <p className='text-2xl'>Telefono: {store.phone}</p>
      <p className='text-2xl'>Direccion: {store.address}</p>
      <p className='text-2xl'>Correo: {store.email}</p>
      <p className='text-2xl'>logo</p>
      <img src={store.logo} alt="Vista previa" width="100" height="100" className="mb-2 rounded-full" />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}
