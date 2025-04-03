"use client"
import React from 'react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from "react";

export default function Cargando() {

  const {idStore} = useParams();
  const [store, setStore] = useState([]);
  useEffect(() => {async function fetchStores(){
    try {
      const response = await fetch("/api/" + idStore);
      console.log(response);

      if (!response.ok) throw new Error("Error al obtener tienda");
      
      const data = await response.json();
      setStore(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }
    fetchStores();
  }, []);
  return (
    <div className="flex flex-col justify-center items-center h-2/4">
      <h1 className='text-4xl'>Bienvenido a {store.name}</h1>
      <p className='text-2xl'>Telefono: {store.phone}</p>
      <p className='text-2xl'>Direccion: {store.address}</p>
      <p className='text-2xl'>Correo: {store.email}</p>
      <p className='text-2xl'>logo:</p>
    </div>
  )
}
