/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
	transform: {
		"\\.[jt]s?$": "babel-jest",
	},
	reporters: ["default", "jest-junit"],
};
