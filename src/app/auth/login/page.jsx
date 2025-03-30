"use client"
import { useForm } from "react-hook-form"
import {signIn} from "next-auth/react"
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function login() {

  const { data: session } = useSession();

  const {register, handleSubmit, formState: {errors}} = useForm();

  const [loginError, setLoginError] = useState(null);
  const route = useRouter();

  if (session) {
    console.log("Usuario autenticado:", session.user);
    route.push("/dashboard");
  } else {
    console.log("No autenticado");
  }
  
  const onSubmit = handleSubmit(async data => {
    const resp = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })
    console.log(resp);
    if(!resp.ok){
      setLoginError(resp.error)
    }
    else {
      setLoginError(null);
      route.push("/dashboard");
    }
    console.log(resp);
  })

  return (
    <div className="flex justify-center items-center h-screen">
      <form className="shadow-lg shadow-black p-10 w-[500px] h-[550px] rounded-xl" onSubmit={onSubmit}>
        <h2 className="font-bold text-4xl text-center mb-5">Inicio de sesion</h2>

        <label htmlFor="email">Email</label>
        <input id="email" type="text" className={`border rounded-md p-2 mb-4 w-full text-black ${errors.email ? "border-red-400 border-[3px]": "border-gray-500"}`} placeholder="example1@gmail.com" {...(register("email", {required: true,} ))}/>
        
        <label htmlFor="password">Password</label>
        <input id="password" type="password" className={`border rounded-md p-2 mb-4 w-full text-black ${errors.password ? "border-red-400 border-[3px]": "border-gray-500"}`} placeholder="*******" {...(register("password", {required: true,} ))}/>
      
        <Link href="./register" className="text-center items-center text-blue-700 mb-10 hover:text-blue-400">Registrarse</Link>
        
        {loginError && <p className="text-red-500 text-lg mt-4">{loginError}</p>}
        <button className="bg-black text-white rounded-2xl w-full h-[40px] text-2xl hover:bg-gradient-to-r from-black to-slate-400 my-4">Iniciar sesion</button>

        <button type="button" onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="bg-slate-200 font-bold rounded-2xl w-full h-[40px] mt-5 text-2xl hover:bg-slate-300 mb-5 flex items-center justify-center gap-2">
          <Image src={"/google.png"} width={30} height={30} alt="Google Logo" />
          <span>Iniciar con Google</span>
        </button>
      </form>
    </div>
  )
}
