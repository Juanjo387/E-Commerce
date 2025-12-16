import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { generateBaseURL } from "../../../utils";
import toast from "react-hot-toast";
import "./Review.css";

const Review = ({ userId, username }) => {
	let productId = useParams();
	productId = productId.id;
	const [comment, setComment] = useState("");
	const [option, setOption] = useState("");
	const [photo, setPhoto] = useState("");
	const [existingReview, setExistingReview] = useState(null);
	const [averageReview, setAverageReview] = useState("not rated yet");
	const [isEditing, setIsEditing] = useState(false);

	const fetchReview = async () => {
		try {
			const baseURL = generateBaseURL();
			const response = await fetch(
				`${baseURL}/api/reviews/user/${userId}/product/${productId}`,
			);

			if (response.ok) {
				const reviewData = await response.json();
				setExistingReview(reviewData);
				setComment(reviewData.comment);
				setOption(reviewData.option);
				setPhoto(reviewData.photo);
			}
		} catch (error) {
			console.error("Error fetching review:", error);
		}
	};

	const fetchAverageReview = async () => {
		try {
			const baseURL = generateBaseURL();
			const response = await fetch(
				`${baseURL}/api/reviews/average/${productId}`,
			);

			if (response.ok) {
				const { averageReview } = await response.json();
				setAverageReview(averageReview);
			}
		} catch (error) {
			console.error("Error fetching average review:", error);
		}
	};

	useEffect(() => {
		fetchReview();
		fetchAverageReview();
	}, [userId, productId]);

	const handleSubmit = async () => {
		try {
			const baseURL = generateBaseURL();
			const response = await fetch(`${baseURL}/api/reviews`, {
				method: existingReview ? "PUT" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userId,
					username,
					productId,
					comment,
					option,
					photo,
				}),
			});

			if (response.ok) {
				toast.success("Review submitted successfully!");
				const reviewData = await response.json();
				setExistingReview(reviewData);
				setComment(reviewData.comment);
				setOption(reviewData.option);
				setPhoto(reviewData.photo);
				setIsEditing(false);

				await fetchAverageReview();
				await fetchReview();
			} else {
				toast.error("Failed to submit review.");
			}
		} catch (error) {
			console.error("Error submitting review:", error);
		}
	};

	const handleDelete = async () => {
		try {
			const baseURL = generateBaseURL();
			const response = await fetch(`${baseURL}/api/reviews`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId, productId }),
			});

			if (response.ok) {
				toast.success("Review deleted successfully!");
				setExistingReview(null);
				setIsEditing(false);
				setComment("");
				setOption("not rated yet");
				setPhoto("");

				await fetchReview();
				await fetchAverageReview();
			} else {
				toast.error("Failed to delete review.");
			}
		} catch (error) {
			console.error("Error deleting review:", error);
			toast.error("Error deleting review.");
		}
	};

	const handleEdit = () => {
		setIsEditing(true);
	};

	return (
		<div className="review-container">
			<h3>Review</h3>
			<p>The product is {averageReview} (as per purchased users)</p>
			{existingReview ? (
				<div>
					<div className="reviews">
						<p>
							<b>{username}</b>
						</p>
						<p>Category: {existingReview.option}</p>
						<p>{existingReview.comment}</p>
						{existingReview.photo && (
							<img src={existingReview.photo} alt="Review" />
						)}
					</div>
					<div>
						<button onClick={handleEdit}>Edit Review</button>
						<button onClick={handleDelete}>Delete Review</button>
					</div>
				</div>
			) : (
				<div>
					<textarea
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						placeholder="Write your review"
					/>
					<select
						value={option}
						onChange={(e) => setOption(e.target.value)}
					>
						<option value="" disabled>
							Product Review
						</option>
						<option value="worst">Worst</option>
						<option value="not good">Not Good</option>
						<option value="average">Average</option>
						<option value="good">Good</option>
						<option value="great">Great</option>
					</select>
					<input
						type="text"
						value={photo}
						onChange={(e) => setPhoto(e.target.value)}
						placeholder="Photo URL (optional)"
					/>
					<button onClick={handleSubmit}>
						{existingReview ? "Update" : "Submit"} Review
					</button>
				</div>
			)}
			{isEditing && (
				<div>
					<textarea
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						placeholder="Write your review"
					/>
					<select
						value={option}
						onChange={(e) => setOption(e.target.value)}
					>
						<option value="worst">Worst</option>
						<option value="not good">Not Good</option>
						<option value="average">Average</option>
						<option value="good">Good</option>
						<option value="great">Great</option>
					</select>
					<input
						type="text"
						value={photo}
						onChange={(e) => setPhoto(e.target.value)}
						placeholder="Photo URL (optional)"
					/>
					<button onClick={handleSubmit}>Save Changes</button>
				</div>
			)}
		</div>
	);
};

export default Review;
