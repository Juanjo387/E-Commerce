import React , {useState} from "react";
import { Modal, Button } from "react-bootstrap";

const CurrencySelector = ({ show, handleClose }) => {
    const [currency, setCurrency] = useState("USD");

    const handleCurrencyChange = (currency) => {
        setCurrency(currency);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Select Currency</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Button className="currency-button" onClick={() => handleCurrencyChange("USD")}>USD</Button>
                <Button className="currency-button" onClick={() => handleCurrencyChange("EUR")}>EUR</Button>
                <Button className="currency-button" onClick={() => handleCurrencyChange("INR")}>INR</Button>
            </Modal.Body>
        </Modal>
    );
};

export default CurrencySelector;
