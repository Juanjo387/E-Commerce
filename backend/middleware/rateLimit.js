import rateLimit from "express-rate-limit";

export const orderRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 3, 
    message: "Too many requests from this IP, please try again later.",
});

export const productRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 3, 
    message: "Too many requests from this IP, please try again later.",
});
