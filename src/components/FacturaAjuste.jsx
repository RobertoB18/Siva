"use client";
import { useState, useEffect } from "react";
import AsyncSelect from 'react-select/async'
import toast from 'react-hot-toast'
import { useStore } from '@/Context/newStoreContext'
import { useParams, useRouter } from 'next/navigation'

export default function CrearOrganizacion() {
  const params = useParams();
  const router = useRouter();

  const { selectedStore } = useStore();
  const [regimenes, setRegimenes] = useState([]);
  const [regimen, setRegimen] = useState(null);
  const [store, setStore] = useState(null);

  const [form, setForm] = useState({
    id:"",
    name: "Roberto",
    legal_name: "",
    zip: "",
    email: "",
    tax_system: "",
    csd_password: "",
    organizationId: "",
  });

  const [csdFiles, setCsdFiles] = useState({ cer: null, key: null });

  useEffect(() => {
    if (params.idStore) {
        fetch(`/api/${params.idStore}`)
        .then((res) => {
            if (!res.ok) throw new Error("Error en la petición");
            return res.json();
        })
        .then((data) => {
          setStore(data);
          setForm({
            id: data.id,
            name: data.name,
            legal_name: data.razonSocial,
            email: data.email, 
            zip: data.address,
            idApi: data.idApi,
            tax_system: data.regimenFiscal
          })
          if(regimenes.length > 0){
            setRegimen({
            value: data.regimenFiscal,
            label: regimenes.find(r => r.code === data.regimenFiscal)?.name || data.regimenFiscal
            });
            console.log("Regimen:", regimen);
          }
          console.log(store)
        })
        .catch(error => console.error("Error al obtener el producto:", error));
    }
  }, [params.idStore, regimenes]); 

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

  const handleRegimen = (e) => {
    setRegimen(e)
    setForm({...form, tax_system: e.value});
  }

  const handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    // Convertir a mayúsculas solo ciertos campos
    if (["legal_name"].includes(name)) {
      value = value.toUpperCase();
    }

    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setCsdFiles({ ...csdFiles, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const idToast = toast.loading("Actualizando los datos...")
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append("cer", csdFiles.cer);
    formData.append("key", csdFiles.key);

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    try {
      const res = await fetch("/api/factuData", {
        method: "PUT",
        body: formData
      });
      const data = await res.json();
      console.log(data);
      if(!res.ok) return toast.error(data.error, {duration: 3000, id: idToast});
      toast.success(data.message, {id: idToast});
    } catch (error) {
      toast.error("Error al actualizar los datos", {id: idToast})
    }
  
    
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Ajustes para Facturacion Electrónica
      </h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre legal</label>
          <input name="legal_name" onChange={handleChange} value={form.legal_name} required className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Ej. EMPRESA S.A. DE C.V."/>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Codigo Postal</label>
          <input name="zip" maxLength="5" onChange={handleChange} value={form.zip} required className="w-full mt-1 p-2 border border-gray-300 rounded-md" placeholder="Ej. 44XXX"/>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md" placeholder="empresa@correo.com"/>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Régimen fiscal</label>
          <AsyncSelect className='border w-full text-black rounded-lg' onChange={handleRegimen} loadOptions={fetchRegimenes} placeholder="Buscar regimen..." value={regimen} defaultOptions cacheOptions> </AsyncSelect> 
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contraseña CSD</label>
          <input name="csd_password" type="password" value={form.csd_password} onChange={handleChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md" placeholder="********"/>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Archivo .cer</label>
          <input name="cer" type="file" accept=".cer" onChange={handleFileChange} required className="mt-1 block w-full text-sm text-gray-700"/>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Archivo .key</label>
          <input name="key" type="file" accept=".key" onChange={handleFileChange} required className="mt-1 block w-full text-sm text-gray-700" />
        </div>

        <button type="submit" className="w-full bg-slate-600 text-white py-2 rounded-md hover:bg-slate-700 transition">
          Crear organización
        </button>
      </form>
    </div>
  );
}
