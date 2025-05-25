import { useState, useEffect, useMemo, use} from "react"
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function useSale() {

    const [maxDescuento, setMaxDescuento] = useState(null) 
    const [store, setStore] = useState(null)
    const [descuento, setDescuento] = useState(0)
    const [cart, setCart] = useState(() => {
        if (typeof window !== "undefined") {
            const localStorageCart = localStorage.getItem("cart");
            return localStorageCart ? JSON.parse(localStorageCart) : [];
        }
        return [];
    });
    
    useEffect(() => {
        if (store) {
        fetch(`/api/${store}`) // Ajusta la ruta según tu backend
            .then((response) => response.json())
            .then((data) => {
            setMaxDescuento(data.descuento); // ✅ Guarda en el estado
            })
            .catch((err) => {
            console.error("Error al obtener el descuento máximo:", err);
            setMaxDescuento(null);
            });
        }
    }, [store]);


    function addtoSale(item){
        const itemexist = cart.findIndex(product => product.id === item.id)
        if(itemexist >= 0 ){

            const updateCart = [...cart]
            const currentQuantity = updateCart[itemexist].quantity;

            if(currentQuantity < updateCart[itemexist].stock){
                updateCart[itemexist].quantity++
                updateCart[itemexist].total = getUnitPrice(updateCart[itemexist]) * (updateCart[itemexist].quantity)
                updateCart[itemexist].price = getUnitPrice(updateCart[itemexist])
                const priceIva = Number(updateCart[itemexist].price) / 1.16
                console.log(priceIva)
                updateCart[itemexist].priceIva = (Number(updateCart[itemexist].price) / 1.16).toFixed(2)
                setCart(updateCart)
            }
            
        }else{
            const total = item.priceMen
            const priceIva = Number(item.priceMen) / 1.16
            item.total = total;
            item.priceIva = priceIva.toFixed(2);
            item.quantity = 1;
            item.price = item.priceMen
            setCart([...cart ,item])
        }
    }
    function removeFromCart(id){
        setCart(prevCart => prevCart.filter(item => item.id !== id))
    }
    function updateCartQuantity(id, quantity) {
        console.log("id", id)
        const updatedCart = cart.map(item => {
            if (item.id === id) {
                
                return {
                    ...item,
                    quantity: quantity,
                };
            }
            return item;
        });
        setCart(updatedCart);
    }

    function validateQuantity(id, quantity) {
        const updatedCart = cart.map(item => {
            if (item.id === id) {
            let finalQuantity = Number(quantity);
        
            if (isNaN(finalQuantity) || finalQuantity < 1) finalQuantity = 1;
            if (finalQuantity > item.stock) finalQuantity = item.stock;
            
            const total = getUnitPrice(item) * (finalQuantity);
            return {
                ...item,
                total: total,
                price: getUnitPrice(item),
                priceIva: (Number(getUnitPrice(item)) / 1.16).toFixed(2),
                quantity: finalQuantity
            };
            }
            return item;
        });
        setCart(updatedCart);
    }

    function getUnitPrice(item) {
        console.log(item);
        if (item.quantity >= item.mayQuantity && item.mayQuantity > 0) {
            return item.priceMay;
        }
        return item.priceMen;
    }
      
    function clearCart(){
        setCart([])
    }


    // Subtotal sin IVA
    const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.priceIva * item.quantity), 0);
    }, [cart]);

    // Subtotal con descuento aplicado
    const subtotalConDescuento = useMemo(() => {
    const descuentoValido = descuento > maxDescuento ? 0 : descuento;
    return subtotal - (subtotal * descuentoValido) / 100;
    }, [subtotal, descuento, maxDescuento]);

    // IVA (por ejemplo, 16%)
    const tasaIva = 0.16; // Puedes cambiarlo si es diferente

    // IVA calculado sobre subtotal con descuento
    const iva = useMemo(() => {
    return subtotalConDescuento * tasaIva;
    }, [subtotalConDescuento]);

    // Total final con IVA incluido
    const totalCart = useMemo(() => {
    return subtotalConDescuento + iva;
    }, [subtotalConDescuento, iva]);

    async function updateSale(storeId, clienteId, sale){
        try {
            const payload = {
                storeId: Number(storeId),
                cliente: clienteId,
                total: Number(totalCart),
                productos: cart, 
            }

            console.log(payload)
            const response = await fetch("/api/sales/"+sale, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Error al actualizar la venta")
            }
            return {
                success: true
            }
        } catch (error) {
            console.log(error)
            return {
                success: false
            }
        }
    }
    async function finishSale(storeId, clienteId){
        try {
            const payload = {
                storeId: Number(storeId),
                cliente: clienteId,
                total: Number(totalConDescuento),
                productos: cart 
            }

            const response = await fetch("/api/sales", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Error al crear la venta")
            }

            return {
                success: true
            }
        } catch (error) {
            console.log(error)
            return {
                success: false
            }
        }
    }
    async function generatePdf(idStore) {
        try {
            const storeInfo = await fetch("/api/"+idStore)
            .then(res => res.json())

            console.log(storeInfo)
            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.text("COTIZACIÓN", 105, 20, { align: "center" });

            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            const date = new Date().toLocaleDateString();

            // --- Datos de la tienda ---
            doc.text(`Fecha: ${date}`, 14, 30);
            doc.text(`Tienda: ${storeInfo.name}`, 14, 36);
            doc.text(`Dirección: ${storeInfo.address}`, 14, 42);
            if (storeInfo.rfc) {
                doc.text(`RFC: ${storeInfo.rfc}`, 14, 48);
                doc.text(`Tel: ${storeInfo.phone}`, 14, 54);
            } else {
                doc.text(`Tel: ${storeInfo.phone}`, 14, 48);
            }
            doc.text(`Email: ${storeInfo.email}`, 14, 54);

            const startY = storeInfo.email ? 65 : 60;
            // --- Tabla de productos ---
            const tableData = cart.map(item => ([
                item.quantity,
                item.unityCode || item.unidadCode || "Pza",
                item.name || item.nombre || "Producto",
                `$${item.price.toFixed(2)}`,
                `$${item.total.toFixed(2)}`
            ]));

            autoTable(doc, {
                head: [["Cantidad", "U. Medida", "Producto", "Precio Unitario", "Total"]],
                body: tableData,
                startY: startY,
                styles: { fontSize: 10 },
                headStyles: { fillColor: [41, 128, 185] }, // Azul profesional
            });

            const finalY = doc.lastAutoTable.finalY + 10;

            // --- Subtotal y total ---
            doc.setFontSize(12);
            doc.text(`Subtotal: $${totalIva}`, 140, finalY);
            doc.text(`Total: $${totalCart.toFixed(2)}`, 140, finalY + 6);

            // --- Pie de página ---
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text("Gracias por su preferencia.", 14, 285);
            //doc.text("Esta cotización es válida por 5 días hábiles.", 14, 290);

            // --- Guardar PDF ---
            doc.save("Cotizacion.pdf");
    
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
        
    }



    return {
        cart,
        descuento,
        subtotalConDescuento,
        iva,
        setStore,
        setDescuento,
        setCart,
        updateSale,
        validateQuantity,
        updateCartQuantity,
        clearCart,
        removeFromCart,
        addtoSale,
        finishSale,
        generatePdf,
        subtotal,
        totalCart
    }
}