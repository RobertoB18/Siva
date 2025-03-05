"use client"
import Link from "next/link"
import {signOut} from "next-auth/react"

export default function NavBar() {
  return (
    <>
    
    <aside className="sticky h-screen w-[190px] bg-black top-0 left-0">
        <ul className="px-2 items-center flex-col text-xl">
            <li className="mt-5 h-10 text-slate-300 rounded-sm w-full hover:bg-slate-400 hover:text-white transition-all duration-500">
            <Link href="/">Home</Link>
            </li>
            <li className="h-10 text-slate-300 rounded-sm w-full hover:bg-slate-400 hover:text-white transition-all duration-500">
            <Link href="/compras">Compra</Link>
            </li>
            <li className="h-10 text-slate-300 rounded-sm w-full hover:bg-slate-400 hover:text-white transition-all duration-500">
            <Link href="/ventas">Venta</Link>
            </li>
            <li className="h-10 text-slate-300 rounded-sm w-full hover:bg-slate-400 hover:text-white transition-all duration-500">
            <Link href="/almacen">Almacen</Link>
            </li>
            <li className="h-10 text-slate-300 rounded-sm w-full hover:bg-slate-400 hover:text-white transition-all duration-500">
            <Link href="/contabilidad">Contabilidad</Link>
            </li>
        </ul>
        <button className="text-slate-300" onClick={() => signOut()}>Salir sesion</button>
    </aside>
    </>
  )
}
