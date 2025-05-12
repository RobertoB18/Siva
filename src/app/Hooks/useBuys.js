import { useState, useEffect, useMemo} from "react"

export function useBuys() {
    
    useEffect(() => {
        if (typeof window !== "undefined") {
            const localStorageCart = localStorage.getItem("buys");
            if (localStorageCart) {
            setCart(JSON.parse(localStorageCart));
            }
        }
    }, []);

    const[cart, setCart] = useState([]);
    
    useEffect(()=>{
        if (typeof window !== "undefined") {
            localStorage.setItem("buys", JSON.stringify(cart));
        }
    }, [cart])

    function addtoBuy(item){
        const itemexist = cart.findIndex(product => product.id === item.id)
        //console.log("item", item)
        if(itemexist >= 0 ){
            const updateCart = [...cart]
            updateCart[itemexist].quantity++
            console.log(updateCart[itemexist].quantity)
            updateCart[itemexist].total = (updateCart[itemexist].priceCost) * (updateCart[itemexist].quantity)
            setCart(updateCart)
        }else{
            const total = item.priceCost
            const priceIva = Number(item.priceCost) / 1.16
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
            
            const total = item.priceCost * (finalQuantity);
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
    const totalIva = useMemo(() => cart.reduce((total, item) => total + (item.priceIva * item.quantity), 0).toFixed(2), [cart])
    const isEmpty = useMemo( ()=> cart.length ===0, [cart]) 
    const totalCart = useMemo(() => cart.reduce((total, item) => total + item.total,0), [cart])

    async function updateBuy(storeId, clienteId, buy){
        try {
            const payload = {
                storeId: Number(storeId),
                cliente: clienteId,
                total: Number(totalCart),
                productos: cart, 
            }

            console.log(payload)
            const response = await fetch("/api/sales/"+buy, {
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
    async function finishBuy(storeId, providerId){
        try {
            const payload = {
                storeId: Number(storeId),
                providerId: providerId,
                total: Number(totalCart),
                productos: cart 
            }

            const response = await fetch("/api/buys", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Error al registar la compra")

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
        updateBuy,
        validateQuantity,
        updateCartQuantity,
        clearCart,
        removeFromCart,
        addtoBuy,
        finishBuy,
        isEmpty,
        totalCart,
        totalIva
    }
}