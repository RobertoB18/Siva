import Link from "next/link"
import {prisma} from "@/libs/prisma"
import WacthProducts from "@/components/WacthProducts";

async function getProductos(){
  return await prisma.products.findMany();
}

export default async function page() {
  const tableProduct = await getProductos();
  return (
    <>
      <div className="h-screen w-3/4 flex flex-row ms-16 mt-16">
        <table className="table-auto border-collapse border border-gray-300 w-full h-7">
          <thead>
            <tr className="bg-black text-white">
              <th className="border border-gray-300 px-4 py-2">Producto</th>
              <th className="border border-gray-300 px-4 py-2">Cantidad</th>
              <th className="border border-gray-300 px-4 py-2">Precio Menudeo</th>
              <th className="border border-gray-300 px-4 py-2">Precio Mayoreo</th>
            </tr>
          </thead>
          { tableProduct.map(producto => (
              <WacthProducts producto={producto} key={producto.id}/>
            ))
          }
        </table>
      <Link href="/almacen/producto" className="bg-black text-white h-16 rounded-xl w-auto">Generar Producto</Link>
      </div>
    </>
    
  )
}
