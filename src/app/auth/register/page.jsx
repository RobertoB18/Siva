"use client"
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation'
import { useState } from "react";

export default function Page() {
    const {register, handleSubmit, formState: {errors}} = useForm();
    const router = useRouter();
    
    const [passwordError, setPasswordError] = useState(null);
    const [registerError, setRegisterError] = useState(null);

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.\-\/\\])[A-Za-z\d@$!%*?&.\-\/\\]{8,}$/;

    const onSubmit = handleSubmit( async data => {
      console.log(data);

      if(data.password !== data.confpassword)
        return setPasswordError("Las contraseñas no tienen relacion")
      else
        setPasswordError(null);

      const resp = await fetch("/api/auth/register", {
          method:"POST",
          body:JSON.stringify(data),
          headers: {
              "Content-Type": "application/json"
          }
      })
      if(resp.ok){
        setRegisterError(null);
        router.push("/auth/login");
      }
      else if(resp.status =="400"){
        setRegisterError("El correo ya esta registrado");
      }
      else {
        setRegisterError("Problemas al hacer el registro, Por favor intente mas tarde")
      }
      console.log(resp);
    })
    console.log(errors);
  return (
    <div className="flex justify-center mt-10">
      <form className="shadow-xl shadow-black p-10 w-[500px] h-[750px] rounded-xl" onSubmit={onSubmit}>
        <h2 className="font-bold text-4xl text-center mb-5">Registro</h2>

        <label htmlFor="name">Nombre Completo</label>
        <input id="userName" type="text" className={`border rounded-md p-2 mb-4 w-full text-black ${errors.userName ? "border-red-400 border-4": "border-gray-500"}`} placeholder="Ej. Juan" {...(register("userName", {required: true} ))}/>

        <label htmlFor="email">Correo</label>
        <input id="email" type="text" className={`border rounded-md p-2 mb-4 w-full text-black ${errors.email ? "border-red-400 border-4": "border-gray-500"}`} placeholder="example1@gmail.com" {...(register("email", {required: true,} ))}/>
        
        <label htmlFor="password">Contraseña</label>
        <input id="password" type="password" className={`border rounded-md p-2 mb-4 w-full text-black ${errors.password ? "border-red-400 border-4": "border-gray-500"}`} placeholder="*******" {...register("password", {required: true, pattern: {value: passwordRegex, message: "Debe contener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (@$!%*?/.-&)"}})}/>
        
        {errors.password && <p className="text-red-500 text-lg mb-4">{errors.password.message}</p>}

        <label htmlFor="confpassword">Confirmar Contraseña</label>
        <input id="confpassword" type="password" className={`border rounded-md p-2 mb-4 w-full text-black ${errors.confpassword ? "border-red-400 border-4": "border-gray-500"}`} placeholder="*******" {...(register("confpassword", {required: true}))}/>
        
        {passwordError && <p className="text-red-500 text-lg mb-4">{passwordError}</p>}

        <label htmlFor="code">Codigo</label>
        <input id="code" type="text" className={`border rounded-md p-2 mb-4 w-full text-black ${errors.code ? "border-red-400 border-4": "border-gray-500"}`} {...(register("code", {required: true,} ))}/>
        
        {registerError && <p className="text-red-500 text-lg mb-4">{registerError}</p>}

        <button className="bg-black text-white rounded-2xl w-[170px] h-[40px] text-2xl hover:bg-gradient-to-r from-black to-slate-400">Registrar</button>
      </form>
    </div>
  )
}
