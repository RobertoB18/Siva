'use client'
import Router from "next/navigation"
import Link from "next/link"

export default function Compra() {
  const recolect =  async (e) => {
    e.preventDefault()
    const name = e.target.name.value
    const cantidad = e.target.cantidad.value
    const res = await fetch("api/compra", {
      method: "POST",
      body: JSON.stringify({ name, cantidad }),
      headers: {
        "Content-Type": "application/json"
      } 
    })
    const data = await res.json();
    console.log(data)
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <form className="bg-slate-800 p-10 w-2/4" onSubmit={recolect}>
        <label htmlFor="name">Nombre del producto</label>

        <input id="name" type="text" className="border border-gray-500 p-2 mb-4 w-full text-black" placeholder="Name" />
        <input id="cantidad" type="number" className="border border-gray-500 p-2 mb-4 w-full text-black" placeholder="Cantidad" />
        
        <button className="bg-black text-white rounded-2xl w-[100px] h-auto text-2xl">Crear</button>
      </form>
      <Link href="/dashboard/compras/compra">Registrar Compra</Link>
    </div>
  )
}
