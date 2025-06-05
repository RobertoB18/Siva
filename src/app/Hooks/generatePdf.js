import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generarPDF = (facturas, desde, hasta) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Reporte de Facturación", 14, 20);
  doc.setFontSize(12);
  doc.text(`Desde: ${desde}  Hasta: ${hasta}`, 14, 30);

  // Calcula el total de todas las facturas
  const totalGeneral = facturas.reduce((acc, f) => acc + f.total, 0);

  // Construye las filas
  const body = facturas.map(f => [
    f.clientes.razonSocial,
    f.clientes.rfc,
    new Date(f.date).toLocaleDateString(),
    `$${f.total.toFixed(2)}`
  ]);

  // Agrega la fila de total al final
  body.push([
    { content: "TOTAL", colSpan: 3, styles: { halign: "right", fontStyle: "bold" } },
    { content: `$${totalGeneral.toFixed(2)}`, styles: { fontStyle: "bold" } }
  ]);

  autoTable(doc, {
    startY: 40,
    head: [["Cliente", "RFC", "Fecha", "Total"]],
    body,
  });

  doc.save("reporte_facturas.pdf");
};
