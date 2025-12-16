import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./shop.css";
import { generateBaseURL } from "../../../utils";
import filledIcon from "../../../assets/filled.svg";
import { useCurrency } from "../../../contexts/currencyContext";

export const Product = (props) => {
	const { _id, name, price, description, isSaleActive } = props.data;
	const navigate = useNavigate();
	const { convertPrice } = useCurrency();

	const [averageRating, setAverageRating] = useState(0); 

	useEffect(() => {
		const fetchAverageRating = async () => {
			try {
				const baseUrl = generateBaseURL();
				const response = await fetch(
					`${baseUrl}/api/ratings/average/${_id}`,
				);

				if (!response.ok) {
					throw new Error("Failed to fetch average rating");
				}

				const { averageRating } = await response.json();
				setAverageRating(averageRating);
			} catch (error) {
				console.error("Error retrieving average rating:", error);
			}
		};

		fetchAverageRating();
	}, [_id]);

	const handleProductClick = () => {
		navigate(`/products/${_id}`);
	};

	const discountedPrice = (price * 0.7).toFixed(2);

	return (
		<div className="product-card" onClick={handleProductClick}>
			<div className="product-card__rating">
				<img
					src={filledIcon}
					alt="Filled Star"
					className="product-card__star"
				/>
				<span className="product-card__rating-number">
					{averageRating}
				</span>
			</div>
			<img
				src={`/products/${name}.png`}
				className="product-card__image"
				alt={name}
				onError={(e) => e.target.src = '/products/placeholder.jpeg'}
			/>
			<div className="product-card__description">
				<p className="product-card__name">
					<b>{name}</b>
				</p>
				<p className="product-card__description-text">
					<b>{description}</b>
				</p>
				<p className="product-card__price" data-testid="price">
					Price: ${isSaleActive ? convertPrice(discountedPrice) : convertPrice(price)}
				</p>
				{isSaleActive && <div data-testid="sale-tag" className="sale-tag">Sale</div>}
			</div>
		</div>
	);
};
