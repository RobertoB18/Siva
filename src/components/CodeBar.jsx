import { useEffect, useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';
import BarcodeScannerPage from './ScanCode';

function aleatorioNum(){
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}

export default function CodeBar({ register, setValue, defaultValue }) {
    const svg = useRef(null);
    const [code, setCode] = useState("");

    const nuevoCodigo = () => {
        const nuevo = aleatorioNum();
        setCode(nuevo);
        setValue("codeBar", nuevo); // ← Aquí actualizamos el formulario
    }
    const cancelar = () => {
      setCode("");
      setValue("codeBar", ""); // ← Aquí actualizamos el formulario
    }
    useEffect(() => {
        if (svg.current && code) {
          JsBarcode(svg.current, code, {
            format: 'CODE128',
            lineColor: '#000',
            width: 2,
            height: 50,
            displayValue: true,
          });
        }
    }, [code]);

    useEffect(() => {
      if (defaultValue) {
        setCode(defaultValue);
        setValue("codeBar", defaultValue);
      }
    }, [defaultValue, setValue]);
    

    return (
        <div className='flex flex-col'>
            <h2 className='text-xl font-bold'>Código de Barras</h2>
            {code && <svg ref={svg} className='mt-4 h-20'></svg>}
            <div className='flex flex-grow '>
              <button type='button' onClick={nuevoCodigo} className='bg-blue-500 rounded-md text-white w-1/3 hover:bg-blue-700 mt-4'>
                Generar código
              </button>
              <button type='button' className="ms-5 bg-red-500 rounded-md text-white w-1/3 hover:bg-red-700 mt-4" onClick={cancelar}>Cancelar codigo</button>
            
            </div>

            {/* Campo oculto para enviar el código de barras */}
            <input type="hidden" {...register("codeBar")} />
        </div>
    )
}
