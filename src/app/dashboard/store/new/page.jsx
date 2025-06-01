"use client";
import { Tab } from "@headlessui/react";
import UsuariosConPermisos from "@/components/UserPermisos";
import AjusteStore from "@/components/AjusteStore";
import CrearOrganizacion from "@/components/FacturaAjuste";
import { useRouter, useParams } from 'next/navigation'
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react";
import { useStore } from "@/Context/newStoreContext";
import toast from "react-hot-toast";

export default function TabsComponent() {
  const { selectedStore } = useStore();
  const params = useParams();
  const [access, setAccess] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        if(!params.idStore) return setAccess(true)
        if(!session || !selectedStore) return;
        
        const response = await fetch(`/api/userPermisos?idStore=${selectedStore}&idUser=${session.user.id}`);
        if (!response.ok) throw new Error("Error al verificar acceso");
        const data = await response.json();
        console.log("Permisos del usuario:", data.permissions);
        if (data.permissions.includes("Administrador")) {
          setAccess(true);
        } else {
          toast.error("No tienes acceso a los ajustes de la tienda");
          router.push(`/dashboard/store/${selectedStore}/inicio`);
        }
      } catch (error) {
        console.error("Error al verificar acceso:", error);
      }
    };
    checkAccess();
  }, [session, selectedStore]);

  
  if(access === false && params.idStore) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl">Cargando...</p>
      </div>
    )
  }
    
  return (
    <Tab.Group>
      <Tab.List className="flex space-x-2 border-b">
        <Tab className={({ selected }) =>
          `px-4 py-2 ${selected ? "border-b-2 border-blue-500 font-bold" : ""}`
        }>
          General
        </Tab>
        {params.idStore && (
          <div>
            <Tab className={({ selected }) =>
              `px-4 py-2 ${selected ? "border-b-2 border-blue-500 font-bold" : ""}`
            }>
              Usuarios
            </Tab>
            <Tab className={({ selected }) =>
              `px-4 py-2 ${selected ? "border-b-2 border-blue-500 font-bold" : ""}`
            }>
              Facturacion
            </Tab>
          </div>
        )}
        
      </Tab.List>

      <Tab.Panels className="mt-4">
        <Tab.Panel><AjusteStore/></Tab.Panel>
        {params.idStore && (
          <div>
            <Tab.Panel><UsuariosConPermisos/></Tab.Panel>
            <Tab.Panel><CrearOrganizacion/></Tab.Panel>
          </div>
        )}
      </Tab.Panels>
    </Tab.Group>
  );
}
