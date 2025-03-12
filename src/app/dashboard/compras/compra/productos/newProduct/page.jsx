"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function NewProduct() {

    const params = useParams();
    const router = useRouter();

    const [name , setName] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [priceMay, setPriceMay] = useState(0);
    const [priceMen, setPriceMen] = useState(0);

    useEffect(() => {
        if (params.idProduct) {
            fetch(`/api/productos/${params.idProduct}`)
                .then((res) => {
                    if (!res.ok) throw new Error("Error en la petición");
                    return res.json();
                })
                .then((data) => {
                    setName(data.name);
                    setQuantity(data.quantity),
                    setPriceMay(data.priceMay),
                    setPriceMen(data.priceMen)
                })
                .catch(error => console.error("Error al obtener el producto:", error));
        }
    }, []); 

    const onSubmit =  async (e) => {
        e.preventDefault()  
        try {
            if(params.idProduct){
                const res = await fetch(`/api/productos/${params.idProduct}`,{
                method: 'PUT',
                body:JSON.stringify({ name, 
                    priceMen: Number(priceMen), 
                    priceMay: Number(priceMay), 
                    quantity: Number(quantity)}),
                headers: {
                    "Content-Type":"application/json"
                } 
                })
                const data = await res.json();
                console.log("data")
            }
            else{
                const res = await fetch('/api/productos',{
                method: 'POST',
                body:JSON.stringify({ name, 
                    priceMen: Number(priceMen), 
                    priceMay: Number(priceMay), 
                    quantity: Number(quantity)}),
                headers: {
                    "Content-Type":"application/json"
                } 
                })
                const data = await res.json();
            }    
            router.refresh();
            router.push("/dashboard/compras/compra/productos"); 
        } catch (e) {
            console.log("Valio vrg scooby " + e)
        }
        
    }
  return (
    <>
    <Link href="/dashboard/compras/compra/productos"> <img src="logo"/></Link>
    <div className="h-screen flex flex-col justify-center items-center">
        <form className="bg-slate-800 p-10 w-2/4 h-3/4 rounded-2xl bg-gradient-to-t from-gray-400 to-gray-900"
            onSubmit={onSubmit}>

            <label className='text-white' htmlFor="name">Nombre del producto</label>
            <input id="name" type="text" className="border border-gray-500 p-2 mb-4 w-full text-black rounded-lg" placeholder="Name" onChange={e => setName(e.target.value)} value={name}/>
            <label className='text-white' htmlFor="cantidad">Cantidad</label>
            <input id="cantidad" type="number" className="border border-gray-500 p-2 mb-4 w-full text-black rounded-lg" placeholder="Cantidad"onChange={e => setQuantity(e.target.value)} value={quantity}/>
            <label className='text-white' htmlFor="precioMen">Precio Minorista</label>
            <input id="precioMen" type="number" className="border border-gray-500 p-2 mb-4 w-full text-black rounded-lg" placeholder="Precio Minorista" onChange={e => setPriceMen(e.target.value)} value={priceMen}/>
            <label className='text-white' htmlFor="precioMay">Precio Mayoreo</label>
            <input id="precioMay" type="number" className="border border-gray-500 p-2 mb-4 w-full text-black rounded-lg" placeholder="Precio Mayoreo" onChange={e => setPriceMay(e.target.value)} value={priceMay}/> 
            
            <div className='flex justify-between pt-10'>
                <button className="bg-black text-white rounded-xl w-[150px] h-auto text-2xl">Create</button>
                { params.idProduct && ( 
                    <button type='button' className='bg-red-500 hover:bg-red-700 text-white rounded-xl w-[150px] h-auto text-2xl' 
                    onClick={async () => {
                        const res = await fetch(`/api/productos/${params.idProduct}`,{
                            method: 'DELETE',}) 
                            router.refresh();
                            router.push("/dashboard/compras/compra/productos"); 
                    }}>Delete</button>
                )}
            </div>
        
        </form>

    </div>
    </>
    
  )
}
