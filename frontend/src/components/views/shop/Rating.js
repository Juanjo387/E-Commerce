/* eslint-disable no-unused-vars */
import React from "react";
import "./Rating.css";
import emptyIcon from "../../../assets/empty.svg";

const RatingSymbol = () => (
	<img
		src={emptyIcon}
		className="rating-image"
		data-testid="rating-icon"
		alt="Rate"
	/>
);

const Rating = (props) => {
	// - `value` represents the current rating value.
	// - `steps` controls the granularity of ratings; 1 for whole numbers or 0.5 for half values.
	// - `onRatingChange` is a callback function to manage and update the rating value.
	const { value, steps = 1, onRatingChange } = props;

	//Use this to manage mouse hovering state in case when half ratings is allowed
	const isLessThanHalf = (event) => {
		const { target } = event;
		const boundingClientRect = target.getBoundingClientRect();
		let mouseAt = event.clientX - boundingClientRect.left;
		mouseAt = Math.round(Math.abs(mouseAt));
		return mouseAt <= boundingClientRect.width / 2;
	};

	// Function to render the rating symbols.
	const renderSymbols = () => {
		return <RatingSymbol />;
	};

	return (
		<div
			tabIndex="0"
			className="star-rating"
			data-testid="star-rating-container"
		>
			Rate the product:
			{renderSymbols()}
		</div>
	);
};

export default Rating;
