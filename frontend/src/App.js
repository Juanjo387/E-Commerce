import React, { useState } from "react";
import "./App.css";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { useAuth } from "./contexts/onAuth";
import { Toaster } from "react-hot-toast";
import { CurrencyProvider } from "./contexts/currencyContext.js";

//views imports
import { Shop } from "./components/views/shop/Shop.jsx";
import { Cart } from "./components/views/cart/Cart.jsx";
import Checkout from "./components/views/checkout/Checkout.jsx";
import Payment from "./components/views/payment/Payment.jsx";
import ProductDetail from "./components/views/shop/ProductDetail.jsx";
import FAQs from "./components/views/shop/FAQs";

//auth imports
import Navbar from "./components/Navbar/Navbar.jsx";
import Register from "./components/layout/Auth/Register.js";
import Login from "./components/layout/Auth/Login.js";
import AdminLogin from "./components/layout/Auth/AdminLogin.js";
import ForgotPassword from "./components/layout/Auth/ForgotPassword.js";
import AdminRoute from "./routes/AdminRoute.js";
import PrivateRoute from "./routes/Private.js";

//layout imports
//User
import Dashboard from "./components/layout/User/Dashboard.js";
import Profile from "./components/layout/User/Profile.js";
import Orders from "./components/layout/User/Orders.js";
import AddressManager from "./components/layout/User/AddressManager.js";
import ExchangeProduct from "./components/layout/User/ExchangeProduct.js";
import ProductComparison from "./components/layout/User/ProductComparison.js";

//Admin
import Product from "./components/layout/Admin/Product.jsx";
import OrderList from "./components/layout/Admin/OrderList.jsx";
import AllProducts from "./components/layout/Admin/AllProducts.jsx";
import EditProduct from "./components/layout/Admin/EditProduct.jsx";
import AdminDashboard from "./components/layout/Admin/AdminDashboard.js";
import Inventory from "./components/layout/Admin/Inventory.jsx";
import BulkUpload from "./components/layout/Admin/BulkUpload.jsx";
import UserQuotas from "./components/layout/Admin/UserQuotas.jsx";

function App() {
	const [auth] = useAuth();
	const [isSaleActive, setIsSaleActive] = useState(false);

	if (auth.isLoading) {
		return <div>Authenticating...</div>;
	}
	const isAuth = !!auth.user;
	return (
		<div className="App">
			<CurrencyProvider>
				<Router>
					<Toaster />
					<Navbar />
					<Routes>
						<Route path="/" element={<Shop />} />
						<Route path="/login" element={<Login />} />
						<Route path="/admin-login" element={<AdminLogin />} />
						<Route
							path="/forgot-password"
							element={<ForgotPassword />}
						/>
						<Route path="/register" element={<Register />} />
						<Route path="/cart" element={<Cart />} />
						<Route
							path="/checkout"
							element={
								isAuth ? (
									<Checkout />
								) : (
									<Navigate to="/login" replace />
								)
							}
						/>
						<Route
							path="/checkout/payment"
							element={
								isAuth ? (
									<Payment />
								) : (
									<Navigate to="/login" replace />
								)
							}
						/>

						<Route path="/dashboard" element={<PrivateRoute />}>
							<Route path="user" element={<Dashboard />} />
							<Route path="user/orders" element={<Orders />} />
							<Route path="user/profile" element={<Profile />} />
							<Route
								path="user/addresses"
								element={<AddressManager />}
							/>
							<Route path="user/exchange-product" element={<ExchangeProduct />} />
							<Route path="/dashboard/user/compare-products" element={<ProductComparison />} />
						</Route>

						<Route path="/dashboard" element={<AdminRoute />}>
							<Route path="admin" element={<AdminDashboard />} />
						</Route>
						<Route
							path="/dashboard/admin/create-product"
							element={<Product />}
						/>
						<Route
							path="dashboard/admin/orders"
							element={<OrderList />}
						/>
						<Route path="/register" element={<Register />} />
						<Route path="/checkout" element={<Checkout />} />
						<Route path="/login" element={<Login />} />
						<Route path="/payment" element={<Payment />} />
						<Route
							path="/dashboard/admin/create-product"
							element={<Product />}
						/>
						<Route
							path="/dashboard/admin/inventory"
							element={<Inventory />}
						/>
						<Route
							path="/dashboard/admin/bulk-upload"
							element={<BulkUpload />}
						/>
						<Route
							path="/products/:id"
							element={<ProductDetail />}
						/>
						<Route path="/products/faqs/:id" element={<FAQs />} />
						<Route path="/payment" element={<Payment />} />
						<Route
							path="dashboard/admin/orders"
							element={<OrderList />}
						/>
						<Route
							path="dashboard/admin/all-products"
							element={<AllProducts />}
						/>
						<Route
							path="/dashboard/all-products/edit-product/:productId"
							element={<EditProduct />}
						/>
						<Route
							path="/dashboard/admin/user-quotas"
							element={<UserQuotas />}
						/>
					</Routes>
					<Toaster />
				</Router>
			</CurrencyProvider>
		</div>
	);
}

export default App;
