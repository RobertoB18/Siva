"use client"
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import Image from "next/image";

export default function WacthProducts({producto}) {
  return (
    <tbody>
        <tr className={`${producto.status? "bg-white": "bg-slate-200"}`} >
            <td className="border border-gray-300 px-4 py-2 ">{producto.name}</td>
            <td className="border border-gray-300 px-4 py-2 ">$ {producto.priceCost}</td>
            <td className="border border-gray-300 px-4 py-2">$ {producto.priceMen}</td>
            <td className="border border-gray-300 px-4 py-2">{producto.stock}</td>
            <td className="border border-gray-300 px-4 py-2">$ {producto.priceMay}</td>
            <td className="border border-gray-300 px-4 py-2">{producto.mayQuantity}</td>
            <td className='border border-gray-300 px-4 py-2 items-center justify-center flex'>
              <Link href={"./almacen/"+producto.id}>
                <Image className="hover:border-green-400" src={"/editar.png"} width={30} height={30} alt="Editar" />
              </Link>
            </td>
        </tr>
        
    </tbody>
  )
}
