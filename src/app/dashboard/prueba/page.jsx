"use client";
import { Tab } from "@headlessui/react";
import UsuariosConPermisos from "@/components/UserPermisos";
import AjusteStore from "@/components/AjusteStore";

export default function TabsComponent() {
    
  return (
    <Tab.Group>
      <Tab.List className="flex space-x-2 border-b">
        <Tab className={({ selected }) =>
          `px-4 py-2 ${selected ? "border-b-2 border-blue-500 font-bold" : ""}`
        }>
          General
        </Tab>
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
      </Tab.List>

      <Tab.Panels className="mt-4">
        <Tab.Panel><AjusteStore/></Tab.Panel>
        <Tab.Panel><UsuariosConPermisos/></Tab.Panel>
        <Tab.Panel>Contenido de ajustes</Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}
