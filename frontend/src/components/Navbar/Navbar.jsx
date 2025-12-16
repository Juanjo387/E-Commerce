//bootstrap imports
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import CurrencySelector from "./currencySelector";
import Modal from "react-bootstrap/Modal";

// react imports
import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

//internal imports
import "./navbar.css";
import { generateBaseURL } from "../../utils";
import { useAuth } from "../../contexts/onAuth";
import hackerrank_logo from "../../assets/hackerrank_logo.png";

const NavScrollExample = ({ setIsSaleActive }) => {
	const [auth, setAuth] = useAuth();
	const isAuth = auth && auth.token ? true : false;
	const role = auth?.user?.role;
	const navigate = useNavigate();
	const dropdownRef = useRef(null);
	const [userPoints, setUserPoints] = useState(0);
	const [showCurrencyModal, setShowCurrencyModal] = useState(false);
	const [showSaleModal, setShowSaleModal] = useState(false);

	useEffect(() => {
		const fetchUserPoints = async () => {
			try {
				const baseURL = generateBaseURL();
				const response = await fetch(`${baseURL}/api/discount/points`);
				const data = await response.json();
				setUserPoints(data.points);
				console.log(data.points);
			} catch (error) {
				console.error("Error fetching user points:", error);
			}
		};

		fetchUserPoints();

		const handlePointsUpdated = (event) => {
			setUserPoints(event.detail);
		};

		window.addEventListener("pointsUpdated", handlePointsUpdated);

		return () => {
			window.removeEventListener("pointsUpdated", handlePointsUpdated);
		};
	}, []);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener("click", handleClickOutside);

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, []);

	//Logout
	const handleLogout = () => {
		setAuth({
			...auth,
			user: null,
			token: "",
		});
		localStorage.removeItem("cartItems");
		localStorage.removeItem("auth");
		toast.success("Logout Successfully");
	};

	//search
	const [query, setQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const handleSearch = async (e) => {
		e.preventDefault();
		// Check if the query is empty, if so, do not perform the search
		if (!query.trim()) {
			return;
		}

		try {
			const baseURL = generateBaseURL();
			const response = await fetch(
				`${baseURL}/api/products/search?query=${query}`,
			);
			if (!response.ok) {
				throw new Error(`Failed to fetch data: ${response.statusText}`);
			}

			const searchResults = await response.json();
			if (searchResults.error === "No products found") {
				setSearchResults([]);
				setIsDropdownOpen(true);
			} else {
				setSearchResults(searchResults);
				setIsDropdownOpen(true);
			}
		} catch (error) {
			console.error("Error searching products:", error);
		}
	};

	const handleProductClick = (productId) => {
		navigate(`/products/${productId}`);
		setIsDropdownOpen(false);
		setQuery("");
	};

	const handleStartSale = () => {
		setIsSaleActive(true);
		setShowSaleModal(false);
		toast.success("Sale Incoming!");
	};

	const handleEndSale = () => {
		setIsSaleActive(false);
		setShowSaleModal(false);
		toast.success("Sale ended!");
	};

	return (
		<Navbar bg="light" expand="lg">
			<Container fluid>
				<Navbar.Brand className="brand" href="/">
					<img src={hackerrank_logo} alt="" />
					Ecommerce
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="navbarScroll" />
				<Navbar.Collapse id="navbarScroll">
					<Form className="d-flex">
						<Form.Control
							data-testid="search-bar"
							className="me-2"
							aria-label="Search"
							type="text"
							value={query}
							placeholder="Search products..."
							onChange={(e) => setQuery(e.target.value)}
							onKeyPress={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									handleSearch(e);
								}
							}}
						/>
						<Button
							onClick={handleSearch}
							variant="outline-success"
						>
							Search
						</Button>
					</Form>
					{searchResults.length > 0 && (
						<NavDropdown
							data-testid="navbar-search-results"
							show={isDropdownOpen}
							onClose={() => setIsDropdownOpen(false)}
							ref={dropdownRef}
						>
							{searchResults.map((product) => (
								<NavDropdown.Item
									onClick={() =>
										handleProductClick(product._id)
									}
									key={product._id}
								>
									{product.name}
								</NavDropdown.Item>
							))}
						</NavDropdown>
					)}
					{searchResults.length === 0 && (
						<NavDropdown
							id="navbar-search-results"
							show={isDropdownOpen}
							onClose={() => setIsDropdownOpen(false)}
							onClick={() => setIsDropdownOpen(false)}
							ref={dropdownRef}
						>
							<NavDropdown.Item>
								No products found
							</NavDropdown.Item>
						</NavDropdown>
					)}
					<Nav
						className="me-auto my-2 my-lg-0"
						style={{ maxHeight: "100px" }}
						navbarScroll
					>
						<Nav.Link href="/">Shop</Nav.Link>
						<Nav.Link as={Link} to="/cart">
							Cart
						</Nav.Link>
						<Nav.Link onClick={() => setShowCurrencyModal(true)}>
							Currency
						</Nav.Link>
						<CurrencySelector show={showCurrencyModal} />
						{auth?.role === "admin" && (
							<>
								<Nav.Link data-testid="sale-btn" onClick={() => setShowSaleModal(true)}>
									Sale
								</Nav.Link>
								<Modal show={showSaleModal} onHide={() => setShowSaleModal(false)}>
									<Modal.Header closeButton>
										<Modal.Title>Manage Flash Sale</Modal.Title>
									</Modal.Header>
									<Modal.Body>
										<Button data-testid="start-sale-btn" onClick={handleStartSale} className="sale-button">
											Start Sale
										</Button>
										<Button data-testid="end-sale-btn" onClick={handleEndSale} className="sale-button mt-2">
											End Sale
										</Button>
									</Modal.Body>
								</Modal>
							</>
						)}
						{isAuth && (
							<Nav.Link>
								Points: {userPoints}
							</Nav.Link>
						)}
						{role === "user" && (
							<Nav.Link href="/dashboard/user">
								Dashboard
							</Nav.Link>
						)}
						{role === "admin" && (
							<Nav.Link href="/dashboard/admin">
								Admin Dashboard
							</Nav.Link>
						)}
						{!isAuth ? (
							<>
								<Nav.Link href="/register">Register</Nav.Link>
								<Nav.Link href="/login">Login</Nav.Link>
							</>
						) : (
							<>
								<Nav.Link>{auth?.user?.username}</Nav.Link>
								<Nav.Link onClick={handleLogout} href="/login">
									Logout
								</Nav.Link>
							</>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default NavScrollExample;
