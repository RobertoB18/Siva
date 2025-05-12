"use client"
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import Image from "next/image";

export default function WatchProducts({buy}) {
    if(!buy) return null
    const fechaLocal = new Date(buy.date).toLocaleString('es-MX', {
        timeZone: "America/Mexico_City",
    });
  return (
    <tbody>
        <tr>
            <td className="border border-gray-300 px-4 py-2 ">{fechaLocal}</td>
            <td className="border border-gray-300 px-4 py-2 ">{buy.provider?.name}</td>
            <td className="border border-gray-300 px-4 py-2">$ {buy.total}</td>
            <td className="border border-gray-300 px-4 py-2">{buy.codeFactura}</td>
            <td className='border border-gray-300 px-4 py-2 items-center justify-center flex'>
              <Link href={"./compras/"+buy.id}>
                <Image className="hover:border-green-400" src={"/editar.png"} width={30} height={30} alt="Editar" />
              </Link>
            </td>
        </tr>
        
    </tbody>
  )
}
