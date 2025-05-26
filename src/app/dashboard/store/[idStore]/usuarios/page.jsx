"use client"
import { useEffect, useState } from "react"
import { useStore } from "@/Context/newStoreContext"
import toast from "react-hot-toast"

const PERMISOS = ["Ventas", "Compras", "Contabilidad", "Almacen", "Empleado"]

export default function UsuariosConPermisos() {
  const { selectedStore } = useStore()
  const [usuarios, setUsuarios] = useState([])
  const [usuarioActivo, setUsuarioActivo] = useState(null)
  const [newUser, setNewUser] = useState(false)
  const [newUserData, setNewUserData] = useState(null)

  const cargarUsuarios = () => {
    fetch(`/api/store?idStore=${selectedStore}`)
      .then(res => res.json())
      .then(data => {
        const usuariosFormateados = data.map(u => ({
          userId: u.userId,
          permisos: u.permissions || [],
          userRef: {
            userName: u.userRef?.userName || "Sin nombre",
            email: u.userRef?.email || "Sin correo"
          }
        }));
        setUsuarios(usuariosFormateados);
      });
  };

  // Usar useEffect para la carga inicial
  useEffect(() => {
    if (selectedStore) {
      cargarUsuarios();
    }
  }, [selectedStore]);

  const togglePermiso = (permiso) => {
    if (!usuarioActivo) return
    const yaTiene = usuarioActivo.permisos.includes(permiso)
    setUsuarioActivo({
      ...usuarioActivo,
      permisos: yaTiene
        ? usuarioActivo.permisos.filter(p => p !== permiso)
        : [...usuarioActivo.permisos, permiso]
    })
  }

  const guardarPermisos = async () => {
    try {
      await fetch("/api/store", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: usuarioActivo.userId,
          storeId: selectedStore,
          permissions: usuarioActivo.permisos
        })
      })
      alert("Permisos actualizados")
      setUsuarioActivo(null)
      cargarUsuarios()
    } catch (error) {
      console.error("Error al guardar permisos:", error)
      alert("Error al guardar permisos")
      return
    }
  }

  const addUser = async () => {
    const toastId = toast.loading("Añadiendo usuario...")
    try {
      await fetch("/api/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: newUserData,
          storeId: selectedStore,
        })
      })
      setNewUserData(null)
      setNewUser(false)
      cargarUsuarios()
      toast.success("Usuario añadido correctamente", {id: toastId})
    } catch (error) {
      toast.error("Error al añadir usuario", {id: toastId})
    }
  }

  const eliminarUsuario = async () => {
    console.log("Eliminando usuario:", usuarioActivo)
    try {
      await fetch("/api/store", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: usuarioActivo.userId,
        storeId: selectedStore,
      })
    })
    setUsuarios(prev => prev.filter(u => u.id !== usuarioActivo.id))
    alert("Usuario eliminado")
    setUsuarioActivo(null)
    cargarUsuarios()
    } catch (error) {
      console.error("Error al eliminar usuario:", error)
      alert("Error al eliminar usuario")
      return
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Usuarios con permisos</h1>
      
      <ul className="space-y-2">
        <button className="bg-slate-800 hover:bg-slate-600 text-white px-4 py-1 rounded" onClick={() => setNewUser(!newUser)}>Añadir empleado</button>
        { newUser && (
          <div className=" flex flex-col mt-4 p-4 border rounded bg-gray-50">
            <h2 className="text-xl font-semibold mb-2">Añadir nuevo empleado</h2>
            <input type="text" className="border rounded-sm w-full my-5" placeholder="Introduce el correo de el nuevo empleado" onChange={(e) => setNewUserData(e.target.value)}/>
            <button className="bg-slate-800 hover:bg-slate-600 text-white px-4 py-1 rounded" onClick={addUser}>Añadirlo</button>
          </div>
      )

        }
        {usuarios.map(u => (
          <li key={u.userId} className="flex justify-between items-center border p-4 rounded">
            <span>
              <strong>{u.userRef.userName}</strong> ({u.userRef.email})
            </span>
            <button className="bg-blue-600 text-white px-4 py-1 rounded" onClick={() => setUsuarioActivo(u)}>
              Configurar
            </button>
          </li>
        ))}
      </ul>

      {usuarioActivo && (
      <div className="mt-6 p-4 border rounded bg-gray-50">
        <h2 className="text-xl font-semibold mb-2">
          Configurando: {usuarioActivo.userRef.userName}
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {PERMISOS.map(p => (
            <label key={p} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={usuarioActivo.permisos.includes(p)}
                onChange={() => togglePermiso(p)}
              />
              {p}
            </label>
          ))}
        </div>
        <div className="flex gap-4">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={guardarPermisos}
          >
            Guardar Permisos
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={eliminarUsuario}
          >
            Eliminar Usuario
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => setUsuarioActivo(null)}
          >
            Cancelar
          </button>
        </div>
      </div>
    )}
    </div>
  )
}
