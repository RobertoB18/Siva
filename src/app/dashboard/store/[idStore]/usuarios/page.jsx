"use client";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";

export default function BarcodeScannerPage() {
  const [code, setCode] = useState("");

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
      (decodedText, decodedResult) => {
        setCode(decodedText);
        scanner.clear(); // Detiene el escaneo tras una lectura exitosa
      },
      (errorMessage) => {
        // Puedes ignorar errores o mostrarlos si deseas
        console.warn("Error de escaneo:", errorMessage);
      }
    );

    return () => {
      scanner.clear().catch((error) => {
        console.error("Error al limpiar el escáner", error);
      });
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
