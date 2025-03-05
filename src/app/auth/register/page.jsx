"use client"
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation'

export default function Page() {
    const {register, handleSubmit, formState: {errors}} = useForm();
    const router = useRouter();
    
    const onSubmit = handleSubmit( async data => {
      console.log(data);
        if(data.password !== data.confpassword)
            return alert("Password do not match")

        const resp = await fetch("/api/auth/register", {
            method:"POST",
            body:JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
        if(resp.ok){
          router.push("/auth/login");
        }
        console.log(resp);
    })
    console.log(errors);
  return (
    <div className="flex justify-center mt-10">
      <form className="shadow-xl shadow-black p-10 w-[500px] h-[650px] rounded-xl" onSubmit={onSubmit}>
        <h2 className="font-bold text-4xl text-center mb-5">Registo</h2>

        <label htmlFor="name">Nombre del producto</label>
        <input id="userName" type="text" className={`border rounded-md p-2 mb-4 w-full text-black ${errors.userName ? "border-red-400 border-4": "border-gray-500"}`} placeholder="Ej. Juan" {...(register("userName", {required: true} ))}/>

        <label htmlFor="email">Email</label>
        <input id="email" type="text" className={`border rounded-md p-2 mb-4 w-full text-black ${errors.email ? "border-red-400 border-4": "border-gray-500"}`} placeholder="example1@gmail.com" {...(register("email", {required: true,} ))}/>
        
        <label htmlFor="password">Password</label>
        <input id="password" type="password" className={`border rounded-md p-2 mb-4 w-full text-black ${errors.password ? "border-red-400 border-4": "border-gray-500"}`} placeholder="*******" {...(register("password", {required: true,} ))}/>
        
        <label htmlFor="confpassword">Confirm Password</label>
        <input id="confpassword" type="password" className={`border rounded-md p-2 mb-4 w-full text-black ${errors.confpassword ? "border-red-400 border-4": "border-gray-500"}`} placeholder="*******"{...(register("confpassword", {required: true,} ))}/>
        

        <button className="bg-black text-white rounded-2xl w-[170px] h-[40px] text-2xl hover:bg-gradient-to-r from-black to-slate-400">Registrar</button>
      </form>
    </div>
  )
}
