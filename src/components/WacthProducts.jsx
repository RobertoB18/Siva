"use client"
import { useRouter } from 'next/navigation'

export default function WacthProducts({producto}) {
    const router = new useRouter;
  return (
    <tbody>
        <tr className='' >
            <td className="border border-gray-300 px-4 py-2 cursor-pointer hover:bg-slate-100" onClick={() => {router.push("/dashboard/compras/compra/productos/"+producto.id)}}>{producto.name}</td>
            <td className="border border-gray-300 px-4 py-2">{producto.quantity}</td>
            <td className="border border-gray-300 px-4 py-2">$ {producto.priceMen}</td>
            <td className="border border-gray-300 px-4 py-2">$ {producto.priceMay}</td>
            <td className=''></td>
        </tr>
        
    </tbody>
  )
}
