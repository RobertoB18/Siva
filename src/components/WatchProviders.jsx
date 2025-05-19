"use client"
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import Image from "next/image";

export default function WacthProviders({provider}) {
  console.log(provider);
  return (
    <tbody>
        <tr>
            <td className="border border-gray-300 px-4 py-2 ">{provider.rfc}</td>
            <td className="border border-gray-300 px-4 py-2 ">{provider.name}</td>
            <td className="border border-gray-300 px-4 py-2">{provider.phone}</td>
            <td className="border border-gray-300 px-4 py-2">{provider.email}</td>
            <td className="border border-gray-300 px-4 py-2">{provider.address}</td>
            <td className='border border-gray-300 px-4 py-2 items-center justify-center flex'>
              <Link href={"./proveedores/"+provider.id}>
                <Image className="hover:border-green-400" src={"/editar.png"} width={30} height={30} alt="Editar" />
              </Link>
            </td>
        </tr>
        
    </tbody>
  )
}
