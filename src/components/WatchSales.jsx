"use client"
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import Image from "next/image";

export default function WacthProducts({sale}) {
  return (
    <tbody>
        <tr>
            <td className="border border-gray-300 px-4 py-2 ">{sale.id}</td>
            <td className="border border-gray-300 px-4 py-2 ">{sale.date}</td>
            <td className="border border-gray-300 px-4 py-2">$ {sale.total}</td>
            <td className="border border-gray-300 px-4 py-2">{sale.clientes?.name || "Sin cliente"}</td>
            <td className='border border-gray-300 px-4 py-2 items-center justify-center flex'>
              <Link href={"./ventas/"+sale.id}>
                <Image className="hover:border-green-400" src={"/editar.png"} width={30} height={30} alt="Editar" />
              </Link>
            </td>
        </tr>
        
    </tbody>
  )
}
