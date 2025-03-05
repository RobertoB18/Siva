"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Page() {
    const router = new useRouter();
    const onSubmit =  async (e) => {
        e.preventDefault()  
        const name = e.target.name.value
        const quantity = parseInt(e.target.cantidad.value)
        const priceMen = parseFloat(e.target.precioMen.value)
        const priceMay = parseFloat(e.target.precioMay.value)
        console.log(name, priceMen, priceMay, quantity)
        try {
            const res = await fetch('/api/productos',{
                method: 'POST',
                body:JSON.stringify({ name, priceMen, priceMay, quantity, total}),
                headers: {
                    "Content-Type":"application/json"
                } 
                })
            
                const data = await res.json();
                console.log(data)
                
                router.push("/compras/compra/productos"); 
        } catch (e) {
            console.log("Valio vrg scooby " + e)
        }
        
    }
  return (
    <>
    <Link href="/compras/compra/productos"> <img src="logo"/></Link>
    <div className="h-screen flex flex-col justify-center items-center">
        <form className="bg-slate-800 p-10 w-2/4 h-3/4 rounded-2xl bg-gradient-to-t from-gray-400 to-gray-900"
        onSubmit={onSubmit}>

        <label className='text-white' htmlFor="name">Nombre del producto</label>
        <input id="name" type="text" className="border border-gray-500 p-2 mb-4 w-full text-black rounded-lg" placeholder="Name"/>
        <label className='text-white' htmlFor="cantidad">Cantidad</label>
        <input id="cantidad" type="number" className="border border-gray-500 p-2 mb-4 w-full text-black rounded-lg" placeholder="Cantidad" />
        <label className='text-white' htmlFor="precioMen">Precio Minorista</label>
        <input id="precioMen" type="number" className="border border-gray-500 p-2 mb-4 w-full text-black rounded-lg" placeholder="Precio Minorista" />
        <label className='text-white' htmlFor="precioMay">Precio Mayoreo</label>
        <input id="precioMay" type="number" className="border border-gray-500 p-2 mb-4 w-full text-black rounded-lg" placeholder="Precio Mayoreo" /> 
        
        <button className="bg-black text-white rounded-2xl w-[100px] h-auto text-2xl">Crear</button>
        </form>

    </div>
    </>
    
  )
}
