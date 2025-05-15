import { useState, useEffect, useMemo} from "react"

export function useSale() {
    
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

    function addtoSale(item){
        const itemexist = cart.findIndex(product => product.id === item.id)
        //console.log("item", item)
        if(itemexist >= 0 ){
            const updateCart = [...cart]
            updateCart[itemexist].quantity++
            console.log(updateCart[itemexist].quantity)
            updateCart[itemexist].total = getUnitPrice(updateCart[itemexist]) * (updateCart[itemexist].quantity)
            updateCart[itemexist].price = getUnitPrice(updateCart[itemexist])
            setCart(updateCart)
        }else{
            const total = item.priceMen
            item.total = total;
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
    const isEmpty = useMemo( ()=> cart.length ===0, [cart]) 
    const totalCart = useMemo(() => cart.reduce((total, item) => total + item.total,0), [cart])

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
                total: Number(totalCart),
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

    return {
        cart,
        setCart,
        updateSale,
        validateQuantity,
        updateCartQuantity,
        clearCart,
        removeFromCart,
        addtoSale,
        finishSale,
        isEmpty,
        totalCart
    }
}