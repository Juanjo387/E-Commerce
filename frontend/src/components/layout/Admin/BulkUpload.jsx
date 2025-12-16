import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { generateBaseURL } from "../../../utils.js";
import "./BulkUpload.css";

function BulkUpload() {
	const [csvFiles, setCsvFiles] = useState([]);
	const [selectedFile, setSelectedFile] = useState("");
	const navigate = useNavigate();
	const baseURL = generateBaseURL();

	useEffect(() => {
		// Fetch available CSV files from the backend
		async function fetchCsvFiles() {
			try {
				const response = await fetch(`${baseURL}/api/products/csv-files`);
				const files = await response.json();
				setCsvFiles(files);
			} catch (error) {
				console.error("Error fetching CSV files:", error);
			}
		}
		fetchCsvFiles();
	}, []);

	const handleUpload = async () => {
		try {
			const response = await fetch(`${baseURL}/api/products/bulk-upload`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ fileName: selectedFile }),
			});

			if (!response.ok) {
				throw new Error("Failed to upload products");
			}

			toast.success("Products uploaded successfully");
			navigate("/dashboard/admin/all-products");
		} catch (error) {
			console.error("Error uploading products:", error);
			toast.error("Failed to upload products");
		}
	};

	return (
		<div className="bulk-upload-container">
			<h1>Bulk Upload Products</h1>
			<p>Select a CSV file to upload products:</p>
			<select
				value={selectedFile}
				onChange={(e) => setSelectedFile(e.target.value)}
			>
				<option value="">Select a file</option>
				{csvFiles.length > 0 ? ( 
                    csvFiles.map((file) => (
                        <option key={file} value={file}>
                            {file}
                        </option>
                    ))
                ) : (
                    <option value="" disabled>No CSV files available</option> 
                )}
			</select>
			<button onClick={handleUpload}>Upload</button>
		</div>
	);
}

export default BulkUpload;
