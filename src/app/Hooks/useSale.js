import { useState, useEffect, useMemo, use} from "react"
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function useSale() {

    const [maxDescuento, setMaxDescuento] = useState(70) 
    const [store, setStore] = useState(null)
    const [descuento, setDescuento] = useState(null)
    const [message, setMessage] = useState(true);

    const [cart, setCart] = useState(() => {
        if (typeof window !== "undefined") {
            const localStorageCart = localStorage.getItem("cart");
            return localStorageCart ? JSON.parse(localStorageCart) : [];
        }
        return [];
    });

    useEffect(()=>{
        if (typeof window !== "undefined") {
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }, [cart])
    
    useEffect(() => {
        if (store) {
        fetch(`/api/${store}`) // Ajusta la ruta según tu backend
            .then((response) => response.json())
            .then((data) => {
            setMaxDescuento(data.descuento); // ✅ Guarda en el estado
            console.log(data.descuento)
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


    // 1. Subtotal sin IVA
    const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.priceIva * item.quantity), 0);
    }, [cart]);

    // 2. IVA calculado sobre el subtotal
    const tasaIva = 0.16;
    const iva = useMemo(() => {
    return subtotal * tasaIva;
    }, [subtotal]);

    // 3. Total sin descuento: subtotal + IVA
    const totalSinDescuento = useMemo(() => {
    return subtotal + iva;
    }, [subtotal, iva]);

    // 4. Descuento aplicado al total con IVA
    const totalCart = useMemo(() => {
    let descuentoValido;
    if(descuento > maxDescuento){
        setMessage(false)
        descuentoValido = 0
    }
    else{
        setMessage(true);
        descuentoValido = descuento;
    }
    return totalSinDescuento * (1 - descuentoValido / 100);
    }, [totalSinDescuento, descuento, maxDescuento]);

    async function updateSale(data){
        try {
            const payload = {
                storeId: Number(data.storeId),
                cliente: Number(data.clienteId),
                total: Number(totalCart),
                productos: cart, 
                subtotal: Number(subtotal),
                descuento: Number(descuento),
                use: data.use, 
                pago: data.pago
            }

            console.log(payload)
            const response = await fetch("/api/sales/"+data.sale, {
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
                success: true,
            }
        } catch (error) {
            console.log(error)
            return {
                success: false
            }
        }
    }
    async function finishSale(data){
        try {
            const payload = {
                storeId: Number(data.storeId),
                cliente: data.clienteId,
                total: Number(totalCart),
                productos: cart,
                subtotal: Number(subtotal),
                descuento: Number(descuento),
                use: data.use, 
                pago: data.pago,
                status: data.status ?? false
            }
            console.log(payload)

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
            const dataSale = await response.json()
            console.log(dataSale);

            return {
                success: true,
                newSale: dataSale
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
            doc.text(`Subtotal: $${totalSinDescuento.toFixed(2)}`, 140, finalY);
            doc.text(`Descuento: ${descuento || "0"}%`, 140, finalY + 6);
            doc.text(`IVA: $${iva.toFixed(2)}`, 140, finalY + 12);
            doc.text(`Total: $${totalCart.toFixed(2)}`, 140, finalY + 18);

            // --- Pie de página ---
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text("Gracias por su preferencia.", 14, 285);
            doc.text("Este documento es una cotización y no es válido como factura.", 14, 290);

            doc.save("Cotizacion.pdf");
    
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
        
    }

    return {
        cart,
        descuento,
        totalSinDescuento,
        iva,
        message,
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