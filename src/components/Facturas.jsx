"use client"
import Link from 'next/link';
import { Edit } from 'lucide-react';

export default function WacthFacturas({factura}) {
    const fechaLocal = new Date(factura.date).toLocaleString('es-MX', {
        timeZone: "America/Mexico_City",
    });
  return (
    <tbody>
        <tr>
            <td className="border border-gray-300 px-4 py-2 ">{factura.clientes.rfc}</td>
            <td className="border border-gray-300 px-4 py-2 ">{factura.clientes.razonSocial}</td>
            <td className="border border-gray-300 px-4 py-2">{factura.clientes.phone}</td>
            <td className="border border-gray-300 px-4 py-2">{factura.clientes.email}</td>
            <td className="border border-gray-300 px-4 py-2">{fechaLocal}</td>
            <td className='border border-gray-300 px-2 py-1 text-center align-middle'>
              <Link href={"./contabilidad/"+factura.id}>
                <Edit size={30} />
              </Link>
            </td>
        </tr>
        
    </tbody>
  )
}
