"use client"
import { useForm } from "react-hook-form"
import {signIn} from "next-auth/react"
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function login() {

  const { data: session } = useSession();

  const {register, handleSubmit, formState: {errors}} = useForm();

  const [loginError, setLoginError] = useState(null);
  const route = useRouter();

  if (session) {
    console.log("Usuario autenticado:", session.user);
    //route.push("/dashboard")
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
    <div className="flex justify-center mt-10">
      <form className="shadow-lg shadow-black p-10 w-[500px] h-[650px] rounded-xl" onSubmit={onSubmit}>
        <h2 className="font-bold text-4xl text-center mb-5">Inicio de sesion</h2>

        <label htmlFor="email">Email</label>
        <input id="email" type="text" className={`border rounded-md p-2 mb-4 w-full text-black ${errors.email ? "border-red-400 border-[3px]": "border-gray-500"}`} placeholder="example1@gmail.com" {...(register("email", {required: true,} ))}/>
        
        <label htmlFor="password">Password</label>
        <input id="password" type="password" className={`border rounded-md p-2 mb-4 w-full text-black ${errors.password ? "border-red-400 border-[3px]": "border-gray-500"}`} placeholder="*******" {...(register("password", {required: true,} ))}/>
        
        {loginError && <p className="text-red-500 text-lg mb-4">{loginError}</p>}
        <button className="bg-black text-white rounded-2xl w-[170px] h-[40px] text-2xl hover:bg-gradient-to-r from-black to-slate-400 mb-5">Registrar</button>
        <br></br>
        <Link href="./register" className="text-center items-center text-blue-700 hover:text-blue-400">Registrarse</Link>
        <br></br>
        <button type="button" onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="bg-red-500 text-white rounded-2xl w-[300px] h-[50px] mt-7 text-2xl hover:bg-red-600 mb-5">Iniciar con Google</button>
      </form>
    </div>
  )
}
