import React, { createContext, useState, useContext } from "react";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState("USD");
    const rates = {
        USD: 1,
        EUR: 0.90,
        INR: 80,
    };

    const convertPrice = (price) => {
        return (price * rates[currency]);
    };

    return (
        <CurrencyContext.Provider value={{ setCurrency, convertPrice }}> 
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    return useContext(CurrencyContext);
};