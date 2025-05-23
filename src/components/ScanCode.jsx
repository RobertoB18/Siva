"use client";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRef } from "react";
import { useStore } from "@/Context/newStoreContext";

export default function BarcodeScannerPage({setloadCodeBar, setValue, setMode, addtoSale}) {
  const { selectedStore } = useStore();
  const [code, setCode] = useState("");
  const hasScannedRef = useRef(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false
    );

    scanner.render(
      async (decodedText, decodedResult) => {
        if (hasScannedRef.current) return; // Ya se escaneó algo
    hasScannedRef.current = true; 
        if(setValue){
          setValue("codeBar", decodedText);
          setloadCodeBar(decodedText);
          setMode("generate");
        }
        if(addtoSale){
          
          try {
            const response = await fetch(`/api/productos?idStore=${selectedStore}&codeBar=${decodedText}`);
            if (!response.ok) {
              toast.error("Error al buscar el producto");
              throw new Error("Producto no encontrado");
            }
            toast.success("Producto encontrado");
            const data = await response.json();
            addtoSale(data);
            setMode(false);

          } catch (error) {
            
          }
        }
        setCode(decodedText);
      },
      (errorMessage) => {
        // Puedes ignorar errores o mostrarlos si deseas
        console.warn("Error de escaneo:", errorMessage);
      }
    );

     return () => {
      const readerElement = document.getElementById("reader");
      if (readerElement && readerElement.childNodes.length > 0) {
        scanner.clear().catch((error) => {
          console.error("Error al limpiar el escáner", error);
        });
      }
      };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Escáner de Códigos</h1>
      <div id="reader" className="w-full max-w-md" />
      {code && (
        <div className="mt-4 p-4 bg-white rounded shadow-md">
          <p className="font-semibold">Código detectado:</p>
          <p className="text-blue-700">{code}</p>
        </div>
      )}
    </div>
  );
}
