'use client';

import { useEffect, useState } from 'react';
import {LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid} from 'recharts';

export default function GraficaStore({ idStore }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`/api/grafica?idStore=`)
      .then((res) => res.json())
      .then(({ ventas, compras }) => {
        const agrupado = {};

        [...ventas, ...compras].forEach((item) => {
          const fecha = item.date.split('T')[0];

          if (!agrupado[fecha]) {
            agrupado[fecha] = { fecha, ventas: 0, compras: 0 };
          }

          if (ventas.includes(item)) {
            agrupado[fecha].ventas += item.total;
          }

          if (compras.includes(item)) {
            agrupado[fecha].compras += item.total;
          }
        });

        const resultado = Object.values(agrupado).sort((a, b) =>
          a.fecha.localeCompare(b.fecha)
        );
        setData(resultado);
      });
  }, [idStore]);

  return (
    <div className="w-full max-w-3xl mt-10">
      <h2 className="text-xl font-semibold mb-4">Ventas y Compras por Fecha</h2>
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="fecha" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="ventas" stroke="#82ca9d" />
        <Line type="monotone" dataKey="compras" stroke="#ff6b6b" />
      </LineChart>
    </div>
  );
}
