"use client"
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import Image from "next/image";

export default function WacthBuys({sale}) {
  const fechaLocal = new Date(sale.date).toLocaleString('es-MX', {
    timeZone: "America/Mexico_City",
  });
  return (
    <tbody>
        <tr>
            <td className="border border-gray-300 px-4 py-2 ">{fechaLocal}</td>
            <td className="border border-gray-300 px-4 py-2">$ {sale.total.toFixed(2)}</td>
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
