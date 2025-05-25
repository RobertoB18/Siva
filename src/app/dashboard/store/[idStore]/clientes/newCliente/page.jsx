"use client"
import Link from 'next/link'
import AsyncSelect from 'react-select/async'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from "react-hook-form"
import toast from 'react-hot-toast'
import { useStore } from '@/Context/newStoreContext'

export default function NewCliente() {
  const { register, handleSubmit, setValue, formState: { errors }} = useForm();
  const params = useParams();
  const router = useRouter();
  const { selectedStore } = useStore();
  const [regimenes, setRegimenes] = useState([]);
  const [regimen, setRegimen] = useState(null);

  useEffect(() => {
    if (params.idCliente) {
      const toastId = toast.loading("Cargando...");
      fetch(`/api/clientes/${params.idCliente}`)
        .then(res => res.json())
        .then(async data => {
            console.log(data);
          setValue("name", data.name);
          setValue("rfc", data.rfc);
          setValue("razon", data.razonSocial);
          setValue("phone", data.phone);
          setValue("email", data.email);
          setValue("address", data.address);
          setValue("status", data.status);
          if(regimenes.length > 0){
            setRegimen({
            value: data.regimenFiscal,
            label: regimenes.find(r => r.code === data.regimenFiscal)?.name || data.regimenFiscal
            });
            console.log("Regimen:", regimen);
          }
            
          toast.success("Cliente cargado", { id: toastId });
        })
        .catch(error => toast.error("Error al cargar el cliente", { id: toastId }));
    }
  }, [params.idCliente, setValue, regimenes]);

  useEffect(() => {
    fetch("/regimenFiscal.json")
      .then(res => res.json())
      .then(data => setRegimenes(data))
      .catch(err => console.error("Error cargando régimenes fiscales:", err));
  }, [selectedStore]);

  const fetchRegimenes = async (inputValue) => {
    return regimenes.filter(regimen => regimen.name.toLowerCase().includes(inputValue.toLowerCase())).map(regimen => ({
      value: regimen.code, // o cualquier identificador único
      label: regimen.name
    }))};

    const handleChange = (e) => {
        setRegimen(e)
    }

  const onSubmit = handleSubmit(async (data) => { 
    const toastId = toast.loading("Registrando...");

    if (data.phone.length !== 10) {
      toast.error("El numero telefonico debe ser de 10 digitos", { id: toastId });
      return;
    }
    const regexRFC = /^[A-ZÑ&]{3,4}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[A-Z\d]{2}[A\d]$/;
    if (!regexRFC.test(data.rfc)) {
      toast.error("El RFC es invalido", { id: toastId });
      return;
    }
    if(data.address.length !== 5){
      toast.error("El codigo postal debe ser de 5 digitos", { id: toastId });
      return;
    }
 
    const payload = {
      name: data.name,
      rfc: data.rfc,
      razonSocial: data.razon,
      regimenFiscal: regimen.value,
      phone: data.phone,
      email: data.email,
      address: data.address,
      status: data.status,
      storeId: Number(selectedStore),
    };
    //console.log("Payload:", payload);

    try {
      if (params.idCliente) {
        await fetch(`/api/clientes/${params.idCliente}`, {
          method: 'PUT',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        toast.success("Cliente actualizado", { id: toastId });
      } else {
        const res = await fetch('/api/clientes', {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if(!res.ok) throw new Error("Error al crear al cliente");
        toast.success("Cliente registrado", { id: toastId });
      }
      router.refresh();
      router.push("../clientes");
    } catch (e) {
        toast.error("Error al registrar al cliente", { id: toastId });
        console.error("Error:", e);
    }
  });

  return (
    <div className="flex flex-col mt-5 justify-center items-center h-screen">
      <div className="flex p-10 w-full h-[50px]">
        <Link href="../clientes" className=''>
        <img src="/volver.png" width={30} height={30} alt="Regresar" />
        </Link>
      </div>
      
      <div className="flex justify-center items-center h-screen">
        <form onSubmit={onSubmit} className="p-6 w-full h-auto">
          <div className="bg-gray-200 flex flex-col justify-center border-2 rounded-lg w-[500px] m-4">
            
            <div className=" w-[450px] m-4">
              <h2 className="font-bold text-xl mb-6">Nuevo Cliente</h2>
              
              <label htmlFor="name">Nombre:</label>
              <input id="name" type='text'{...register("name", { required: true })} className={`border p-2 mb-4 w-full rounded-lg ${errors.name ? "border-red-400 border-2" : "border-gray-500"}`} placeholder="Ej. EcoBolsa" />
              
              <p className="text-sm text-gray-600 italic mb-4">Nota: Este nombre sera por el cual lo reconoceras y no por el que se facturara</p>

              <label htmlFor="rfc"><span>RFC Cliente</span>
              <input id="rfc" type="text" {...register("rfc", { required: true })} 
                onBlur={(e) => {
                const upper = e.target.value.toUpperCase(); // Convierte a mayúsculas
                setValue("rfc", upper); // Actualiza el valor en el formulario
                }} 
              className={`border p-2 mb-4 w-full text-black rounded-lg ${errors.rfc ? "border-red-400 border-2" : "border-gray-500"}`} placeholder="SAMNXXXXXXXXX" />
              
              <label htmlFor="razon">Razon social</label>
              <input id="razon" type="text" {...register("razon", {required: true})} className={`border mb-4 p-2 w-full text-black rounded-lg ${errors.razon ? "border-red-400 border-2" : "border-gray-500"}`} placeholder="Coca Cola"/>
              
              </label> 
                <label htmlFor="regimen">Regimen Fiscal</label>
              <AsyncSelect className='border w-full text-black rounded-lg' onChange={handleChange} loadOptions={fetchRegimenes} placeholder="Buscar regimen..." value={regimen} defaultOptions cacheOptions> </AsyncSelect>
              
              <label htmlFor="description">Telefono</label>
              <input id="phone" type='tel' {...register("phone", {required: true})} className={`border p-2 mb-4 w-full text-black rounded-lg ${errors.phone ? "border-red-400 border-2" : "border-gray-500"}`} placeholder="33-XXXX-XXXX"/>
              
              <label htmlFor="email">Correo electronico</label>
              <input id="email" type="text" {...register("email", { required: true })} className={`border p-2 mb-4 w-full text-black rounded-lg ${errors.email ? "border-red-400 border-2" : "border-gray-500"}`} placeholder="example1@gmail.com" />
              
              <label htmlFor="address">Codigo Postal</label>
              <input id="address" type="number" {...register("address", { required: true })} className={`border p-2 mb-4 w-full text-black rounded-lg ${errors.address ? "border-red-400 border-2" : "border-gray-500"}`} placeholder="45500"/>
 
              <label htmlFor="status" className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium">Habilitado:</span>
                <div className="relative inline-block w-12 h-6">
                  <input id="status" type="checkbox" {...register("status")} defaultChecked className="peer sr-only"/>
                  <div className="w-full h-full hover:cursor-pointer bg-gray-300 rounded-full peer-checked:bg-green-500 transition-colors duration-300"></div>
                  <div className="absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 peer-checked:translate-x-6"></div>
                </div>
              </label>
              <button type="submit" className="bg-black hover:bg-slate-500 text-white rounded-xl w-full h-auto text-2xl">Guardar</button>
            </div>
              </div>
        </form>
      </div>
    </div>
  );
}
