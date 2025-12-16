import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { generateBaseURL } from "../../../utils";

function FAQs() {
    const { id } = useParams();
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openIndex, setOpenIndex] = useState(null);

    const fetchFAQs = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${generateBaseURL()}/api/products/faqs/${id}`);
            const data = await response.json();
            setFaqs(data);
        } catch (error) {
            console.error("Error fetching FAQs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleShowFAQs = async () => {
        setLoading(true);
        try {
            await fetch(`${generateBaseURL()}/api/products/faqs/save`, { method: "POST" });
            fetchFAQs();
        } catch (error) {
            console.error("Error saving FAQs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFAQs();
    }, [id]);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="faq-container">
            <h1>FAQs</h1>
            {loading && <div>Loading...</div>}
            {faqs.length > 0 ? (
                faqs.map((faq, index) => (
                    <div key={index} className="faq-item" onClick={() => toggleFAQ(index)}>
                        <div className="faq-question">
                            <h5>{faq.question}</h5>
                        </div>
                        {openIndex === index && <p className="faq-answer">{faq.answer}</p>}
                    </div>
                ))
            ) : (
                <div>
                    <button onClick={handleShowFAQs}>Show FAQs</button>
                </div>
            )}
        </div>
    );
}

export default FAQs;