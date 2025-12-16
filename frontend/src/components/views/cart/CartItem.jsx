import React, { useContext } from "react";
import { ShopContext } from "../../../contexts/shopContext.js";
import { useCurrency } from "../../../contexts/currencyContext";

export const CartItem = (props) => {
	const { sNo, name, price } = props.data;
	const { cartItems, addToCart, removeFromCart, updateCartItemCount } =
		useContext(ShopContext);
	const { convertPrice } = useCurrency();

	return (
		<div className="cartItem">
			<div className="cart-item-img">
				<img src={`/products/${name}.png`} onError={(e) => e.target.src = '/products/placeholder.jpeg'}/>
			</div>
			<div className="description">
				<p>
					<b>{name}</b>
				</p>
				<p> Price: ${convertPrice(price)}</p>
				<div className="countHandler">
					<button onClick={() => removeFromCart(sNo)}> - </button>
					<input
						value={cartItems[sNo]}
						onChange={(e) =>
							updateCartItemCount(Number(e.target.value), sNo)
						}
					/>
					<button onClick={() => addToCart(sNo)}> + </button>
				</div>
			</div>
		</div>
	);
};
