import { useState, useEffect, useMemo} from "react"
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function useSaleMay() {
    const [maxDescuento, setMaxDescuento] = useState(null) 
    const [store, setStore] = useState(null)
    const [descuento, setDescuento] = useState(0)
    const [message, setMessage] = useState(true);

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

    useEffect(()=>{
        if (typeof window !== "undefined") {
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }, [cart])

    function addtoSale(item) {
        const itemexist = cart.findIndex(product => product.id === item.id);
        
        if (itemexist >= 0) {
            const updateCart = [...cart];
            const currentQuantity = updateCart[itemexist].quantity;

            if (currentQuantity < updateCart[itemexist].stock) {
                updateCart[itemexist].quantity++;
                updateCart[itemexist].total = getUnitPrice(updateCart[itemexist]) * updateCart[itemexist].quantity;
                updateCart[itemexist].price = getUnitPrice(updateCart[itemexist]);
                updateCart[itemexist].priceIva = (updateCart[itemexist].price / 1.16).toFixed(2);
                setCart(updateCart);
            }
        } else {
            const unitPrice = getUnitPrice(item);
            item.total = unitPrice;
            item.priceIva = (unitPrice / 1.16).toFixed(2);
            item.quantity = 1;
            item.price = unitPrice;
            setCart([...cart, item]);
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
        if (item.priceMay && item.priceMay > 0) {
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

    async function finishSale(storeId, clienteId){
        try {
            const payload = {
                storeId: Number(storeId),
                cliente: clienteId,
                total: Number(totalCart),
                productos: cart,
                subtotal: Number(subtotalConDescuento),
                descuento: Number(descuento),
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
    
    return {
        cart,
        descuento,
        setDescuento,
        setStore,
        setDescuento,
        setCart,
        validateQuantity,
        updateCartQuantity,
        clearCart,
        removeFromCart,
        addtoSale,
        finishSale,
        subtotal,
        message,
        totalSinDescuento,
        iva,
        totalCart
    }
}