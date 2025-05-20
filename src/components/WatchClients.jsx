"use client"
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import Image from "next/image";

export default function WacthClients({client}) {
  console.log(client);
  return (
    <tbody>
        <tr className={`${client.status? "bg-white": "bg-slate-200"}`}>
            <td className="border border-gray-300 px-4 py-2 ">{client.rfc}</td>
            <td className="border border-gray-300 px-4 py-2 ">{client.name}</td>
            <td className="border border-gray-300 px-4 py-2">{client.phone}</td>
            <td className="border border-gray-300 px-4 py-2">{client.email}</td>
            <td className="border border-gray-300 px-4 py-2">{client.address}</td>
            <td className='border border-gray-300 px-4 py-2 items-center justify-center flex'>
              <Link href={"./clientes/"+client.id}>
                <Image className="hover:border-green-400" src={"/editar.png"} width={30} height={30} alt="Editar" />
              </Link>
            </td>
        </tr>
        
    </tbody>
  )
}
