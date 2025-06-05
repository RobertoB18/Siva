"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { sendVerificationEmail } from "@/app/Hooks/sendEmail";
import toast, { Toaster } from "react-hot-toast";

export default function Page() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();
  
  const [passwordError, setPasswordError] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [verificationCode, setVerificationCode] = useState(null);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [userInputCode, setUserInputCode] = useState("");

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.\-\/\\])[A-Za-z\d@$!%*?&.\-\/\\]{8,}$/;

  const handleSendCode = async (email, userName) => {
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(generatedCode);
    const realCode = generatedCode;
    
    toast.promise(
      sendVerificationEmail(email, userName, realCode),
      {
        loading: "Enviando código, Esto puede tardar un poco...",
        success: "Código enviado exitosamente",
        error: "Error al enviar el código. Intente de nuevo o verifique su correo",
      }
    ).then(() => {
      setIsCodeSent(true);
      setRegisterError("");
    }).catch((error) => {
      console.error("Error enviando código:", error);
      setRegisterError("No se pudo enviar el código. Intente de nuevo.");
    });
  };

  
  const onSubmit = handleSubmit(async (data) => {
    if(data.userName.length < 3 || data.userName.length > 50) {
      return setRegisterError("El nombre de usuario debe tener al menos 3 caracteres y maximo 50.");
    }
    if (data.password !== data.confpassword) {
      return setPasswordError("Las contraseñas no coinciden.");
    } else {
      setPasswordError(null);
    }

    // Validar que el código ingresado sea correcto antes de registrar al usuario
    if (userInputCode !== verificationCode) {
      return setRegisterError("El código ingresado es incorrecto.");
    }
    const toastId = toast.loading("Registrando usuario...");

    const resp = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (resp.ok) {
      setRegisterError(null);
      toast.success("Registro exitoso", { id: toastId });
      router.push("/auth/login");
    } else if (resp.status === 400) {
      toast.error("Problema en el registro", { id: toastId });
      setRegisterError("El correo ya está registrado.");
    } else {
      toast.error("Problema en el registro", { id: toastId });
      setRegisterError("Hubo un problema en el registro. Intente más tarde.");
    }
  });

  return (
    <div className="flex justify-center mt-10">
      <form id="form" className="shadow-xl shadow-black p-10 w-[500px] h-auto rounded-xl" onSubmit={onSubmit}>
        <h2 className="font-bold text-4xl text-center mb-5">Registro</h2>

        <label htmlFor="userName">Nombre Completo</label>
        <input id="userName" type="text" className={`border rounded-md p-2 mb-4 w-full text-black ${errors.userName ? "border-red-400 border-4": "border-gray-500"}`} placeholder="Ej. Juan" {...register("userName", { required: true })}/>

        <label htmlFor="email">Correo</label>
        <input 
          disabled={isCodeSent}
          id="email" 
          type="text" 
          className={`border rounded-md p-2 mb-4 w-full text-black ${errors.email ? "border-red-400 border-4": "border-gray-500"}`} 
          placeholder="example1@gmail.com" 
          {...register("email", { required: true })} 
        />

        <label htmlFor="password">Contraseña</label>
        <input id="password" type="password" className={`border rounded-md p-2 mb-4 w-full text-black ${errors.password ? "border-red-400 border-4": "border-gray-500"}`} placeholder="*******" {...register("password", { required: true, pattern: { value: passwordRegex, message: "Debe contener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (@$!%*?/.-&)"}})}/>
        
        {errors.password && <p className="text-red-500 text-lg mb-4">{errors.password.message}</p>}

        <label htmlFor="confpassword">Confirmar Contraseña</label>
        <input id="confpassword" type="password" className={`border rounded-md p-2 mb-4 w-full text-black ${errors.confpassword ? "border-red-400 border-4": "border-gray-500"}`} placeholder="*******" {...register("confpassword", { required: true })}/>
        
        
        <button 
          type="button" 
          onClick={() => handleSendCode(document.getElementById("email").value, document.getElementById("userName").value)} 
          className="text-blue-500 py-2"
        >
          Enviar Código
        </button>
        <br />
        {isCodeSent && (
          <>
            <label htmlFor="code">Código de Verificación</label>
            
            <input 
              id="code" 
              type="text" 
              className={`border rounded-md p-2 mb-4 w-full text-black ${errors.code ? "border-red-400 border-4": "border-gray-500"}`} 
              value={userInputCode}
              onChange={(e) => setUserInputCode(e.target.value)}
              required
            />
          </>
        )}

        {passwordError && <p className="text-red-500 text-lg mb-4">{passwordError}</p>}

        {registerError && <p className="text-red-500 text-lg mb-4">{registerError}</p>}
        <br />
        <button disabled={!isCodeSent} type="submit" className={isCodeSent ? `bg-black text-white rounded-xl w-[170px] h-[40px] text-2xl mt-2 hover:bg-gradient-to-r from-black to-slate-400` : `text-gray-200 rounded-xl w-[170px] h-[40px] text-2xl mt-2 bg-gray-300`}>Registrar</button>
      </form>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
