"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useSale } from "@/app/Hooks/useSale";

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null); // Nueva tienda seleccionada

  const {clearCart} = useSale()

  // Obtener las tiendas del usuario
  async function fetchStores() {
    try {
      const response = await fetch("/api/user-store");
      if (!response.ok) throw new Error("Error al obtener tiendas");
      
      const data = await response.json();
      setStores(data);
      const savedStoreId = localStorage.getItem("selectedStoreId");
      if (savedStoreId) {
        setSelectedStore(savedStoreId); 
      }
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  // Agregar una tienda y actualizar la lista
  async function addStore(newStoreData) {
    try {
      const response = await fetch("/api/user-store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStoreData),
      });

      if (!response.ok) throw new Error("Error al crear la tienda");

      const createdStore = await response.json();

      // Agregar la nueva tienda al estado
      setStores((prevStores) => [...prevStores, createdStore]);

      // Regresa al menu principal
      setSelectedStore(null); // Reiniciar la tienda seleccionada
      
    } catch (error) {
      console.error("Error al agregar la tienda:", error);
    }
  }
  async function updateStore(StoreData) {
    try {
      const response = await fetch("/api/"+StoreData.storeId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(StoreData),
      });

      if (!response.ok) throw new Error("Error al actualizar la tienda");

      const createdStore = await response.json();

      // Agregar la nueva tienda al estado
      fetchStores();
      // Regresa al menu principal
      setSelectedStore(null); // Reiniciar la tienda seleccionada
    } catch (error) {
      console.error("Error al agregar la tienda:", error);
    }
  }
  // Función para cambiar la tienda seleccionada
  function selectStore(store) {
    console.log("Tienda seleccionada:", store);
    setSelectedStore(store);
    clearCart() // Limpiar el carrito al cambiar de tienda
    if (store) {
      localStorage.setItem("selectedStoreId", store);

    } else {
      localStorage.removeItem("selectedStoreId");
    }
  }

  useEffect(() => {
    fetchStores();
  }, []);


  return (
    <StoreContext.Provider value={{ stores, loading, selectedStore, selectStore, addStore, updateStore }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
