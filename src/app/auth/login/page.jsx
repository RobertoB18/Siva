"use client"
import { useForm } from "react-hook-form"
import {signIn} from "next-auth/react"
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function login() {

  const {register, handleSubmit, formState: {errors}} = useForm();
  const route = useRouter();

  const onSubmit = handleSubmit(async data => {
    const resp = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })
    if(!resp.ok){
      alert(resp.error)
    }
    else {
      route.push("/dashboard");
    }
    console.log(resp);
  })
  return (
    <div className="flex justify-center mt-10">
      <form className="shadow-xl shadow-black p-10 w-[500px] h-[650px] rounded-xl" onSubmit={onSubmit}>
        <h2 className="font-bold text-4xl text-center mb-5">Registo</h2>

        <label htmlFor="email">Email</label>
        <input id="email" type="text" className={`border rounded-md p-2 mb-4 w-full text-black ${errors.email ? "border-red-400 border-4": "border-gray-500"}`} placeholder="example1@gmail.com" {...(register("email", {required: true,} ))}/>
        
        <label htmlFor="password">Password</label>
        <input id="password" type="password" className={`border rounded-md p-2 mb-4 w-full text-black ${errors.password ? "border-red-400 border-4": "border-gray-500"}`} placeholder="*******" {...(register("password", {required: true,} ))}/>

        <button className="bg-black text-white rounded-2xl w-[170px] h-[40px] text-2xl hover:bg-gradient-to-r from-black to-slate-400">Registrar</button>
      </form>
      <Link href="./register">Registrarse</Link>
    </div>
  )
}
