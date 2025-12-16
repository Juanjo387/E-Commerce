import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./shop.css";
import Rating from "./Rating";
import { ShopContext } from "../../../contexts/shopContext";
import { useAuth } from "../../../contexts/onAuth";
import { generateBaseURL } from "../../../utils";
import { FaHeart } from "react-icons/fa";
import Review from "./Review";
import { useCurrency } from "../../../contexts/currencyContext";

function ProductDetail() {
	const { id } = useParams();
	const { addToCart, cartItems } = useContext(ShopContext);
	const [product, setProduct] = useState(null);
	const navigate = useNavigate();
	const [selectedVariant, setSelectedVariant] = useState("");
	const [auth] = useAuth();
	const userId = auth.user?.id;
	const username = auth.user?.username;

	const [userRating, setUserRating] = useState(null);
	const [ratingFetched, setRatingFetched] = useState(false);
	const [liked, setLiked] = useState(false);
	const { convertPrice } = useCurrency();

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const baseURL = generateBaseURL();
				const response = await fetch(
					`${baseURL}/api/products/detail/${id}`,
				);

				if (!response.ok) {
					throw new Error(
						`Failed to fetch product data: ${response.statusText}`,
					);
				}

				const productData = await response.json();
				setProduct(productData);
				setLiked(productData.liked || false);
			} catch (error) {
				console.error("Error retrieving product:", error);
			}
		};

		fetchProduct();
	}, [id]);

	useEffect(() => {
		const fetchUserRating = async () => {
			try {
				const baseURL = generateBaseURL();
				const response = await fetch(
					`${baseURL}/api/ratings/user/${userId}/product/${id}`,
				);

				if (!response.ok) {
					console.error(
						"Error retrieving user rating:",
						response.statusText,
					);
					setRatingFetched(true);
					return;
				}

				const ratingData = await response.json();
				setUserRating(ratingData.ratingValue);
				setRatingFetched(true);
			} catch (error) {
				console.error("Error retrieving user rating:", error);
				setRatingFetched(true);
			}
		};

		fetchUserRating();
	}, [userId, id]);

	const submitRating = async (ratingValue) => {
		try {
			const baseURL = generateBaseURL();

			// Check if the user has purchased the product
			const hasPurchased = userRating !== null;
			if (hasPurchased) {
				// Retrieve the product
				const productResponse = await fetch(
					`${baseURL}/api/products/detail/${id}`,
				);
				const product = await productResponse.json();

				if (!product) {
					console.error("Product not found");
					return;
				}

				const ratingResponse = await fetch(`${baseURL}/api/ratings`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						userId: userId,
						productId: id,
						ratingValue: ratingValue,
					}),
				});
				// Display a toast notification to provide feedback on the rating process.
				if (ratingResponse.ok) {
					const ratingData = await ratingResponse.json();
					console.log("Rating submitted successfully:", ratingData);
					toast.success("Thank you for rating!");
				} else {
					console.error(
						"Error submitting rating:",
						ratingResponse.statusText,
					);
				}
			} else {
				toast.error("Please purchase the product to rate it.");
			}
		} catch (error) {
			console.error("Error submitting rating:", error);
		}
	};

	const handleRatingChange = (newValue) => {
		submitRating(newValue);
	};

	const cartItemCount = cartItems[product?.sNo];

	const handleAddToBag = () => {
		if (product.stockStatus === "Out of Stock") {
			toast.error("Product is out of stock");
			return;
		}
		addToCart(product?.sNo);
	};

	const handleLikeToggle = () => {
		try {
			const likedProducts =
				JSON.parse(localStorage.getItem("likedProducts")) || [];
			const updatedLikedProducts = liked
				? likedProducts.filter((productId) => productId !== id)
				: likedProducts.concat(id);

			localStorage.setItem(
				"likedProducts",
				JSON.stringify(updatedLikedProducts),
			);
			setLiked(!liked);
		} catch (error) {
			console.error("Error handling like toggle:", error);
		}
	};

	const handleVariantChange = (e) => {
		setSelectedVariant(e.target.value);
	};

	const handleViewFAQs = () => {
		navigate(`/products/faqs/${id}`);
	};

	if (!ratingFetched || !product) {
		return <div>Loading...</div>; // Display loading indicator while rating and product are being fetched
	}

	return (
		<div>
			<div className="product-detail">
				<div className="product-image-card">
					<div className="product-image">
						<img src={`/products/${product.name}.png`} alt="Product" onError={(e) => e.target.src = '/products/placeholder.jpeg'}/>
					</div>
				</div>
				<div className="product-line"></div>
				<div className="product-detail-content">
					<div className="product-details">
						<div className="product-details-basic">
							<p className="product-name">{product.name}</p>
							<p className="product-description">
								{product.description}
							</p>
							<p className="product-price">
								Tags: {product.tags}
							</p>
							<p className="product-stock-status">
								Stock Status: {product.stockStatus}
								<button className="faq-link" onClick={handleViewFAQs}> View FAQs</button>
							</p>
							<button
								className={`like-button ${
									liked ? "liked" : ""
								}`}
								onClick={handleLikeToggle}
							>
								<FaHeart className="heart-icon" />
								{liked ? "Unlike" : "Like"}
							</button>
							{product?.variants?.length > 0 && (
								<select
									className="variant-select"
									onChange={handleVariantChange}
									value={selectedVariant}
								>
									<option value="">Select Variant</option>
									{product.variants.map((variant, index) => (
										<option key={index} value={variant}>
											{variant}
										</option>
									))}
								</select>
							)}
						</div>
						<div className="product-line-content"></div>
						<div className="price-container">
							<p className="product-price">
								Price: ${convertPrice(product.price)}
							</p>
							<button
								className="addToCartBttn"
								data-testid="add-to-cart-button"
								onClick={handleAddToBag}
							>
								Add To Cart{" "}
								{cartItemCount > 0 && <> ({cartItemCount})</>}
							</button>
						</div>
					</div>
					<div className="product-line-content"></div>
					{userId && (
						<Rating
							// Pass the user's rating value (if available) or default to 0.
							value={userRating !== null ? userRating : 0}
							// Provide a callback function to handle changes in the user's rating.
							onRatingChange={handleRatingChange}
						/>
					)}
					<div className="product-actions">
						<button
							className="addToCartBttn"
							onClick={() => navigate("/")}
						>
							Continue Shopping
						</button>
						<button
							className="addToCartBttn"
							data-testid="go-to-cart-button"
							onClick={() => navigate("/cart")}
						>
							Go to Cart
						</button>
					</div>
				</div>
			</div>
			<Review userId={userId} username={username} />
		</div>
	);
}

export default ProductDetail;
