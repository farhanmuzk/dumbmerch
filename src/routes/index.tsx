    import { Outlet, RouteObject } from "react-router-dom";
    import { Navigate } from "react-router-dom";
    import RootLayouts from "../layouts/root-layouts";
    import ProtectedRoute from "./protected-route";
    import Dashboard from "../pages/admin/dashboard";
    import Login from "../pages/auth/login-page";
    import Home from "../pages/user/home";
    import Register from "../pages/auth/register-page";
    import { Complain } from "../pages/user/complain";
    import Profile from "../pages/user/profile";
    import Product from "../pages/user/product";
    import Whishlist from "../pages/user/whishlist";
    import Cart from "../pages/user/cart";
    import ListProduct from "../pages/admin/list-product";
    import ListCategory from "../pages/admin/list-category";
    import ListTransaction from "../pages/admin/list-transaction";
    import Checkout from "../pages/user/checkout";

    export const routes: RouteObject[] = [
        { path: '/', element: <Navigate to="/auth/login" /> },

        {
            path: '/auth',
            children: [
                { path: 'login', element: <Login /> },
                { path: 'register', element: <Register /> },
            ]
        },
        {
            element: (
                <ProtectedRoute allowedRoles={['USER']}>
                    <RootLayouts />
                </ProtectedRoute>
            ),
            children: [
                // Routes for User
                {
                    path: 'user',
                    children: [
                        { index: true, path: 'home', element: <Home /> }, // Index route for home
                        { path: 'complain', element: <Complain /> }, // Shared route
                        { path: 'profile', element: <Profile /> }, // Shared route
                        { path: 'product/:id', element: <Product /> }, // Using :id for dynamic route
                        { path: 'whishlist', element: <Whishlist /> },
                        { path: 'cart', element: <Cart /> }, // Using :id for dynamic route
                        { path: 'checkout/:id', element: <Checkout  /> },
                    ]
                }
            ]
        },
        {
            element: (
                <ProtectedRoute allowedRoles={['ADMIN']}>
                <Outlet />
                </ProtectedRoute>
            ),
            children: [
                // Routes for Admin
                {
                    path: 'admin',
                    children: [
                        { index: true, path: 'dashboard', element: <Dashboard /> }, // Index route for dashboard
                        { path: 'complain', element: <Complain /> }, // Shared route
                        { path: 'profile', element: <Profile /> }, // Shared route
                        { path: 'product', element: <ListProduct /> },
                        { path: 'category', element: <ListCategory /> },
                        { path: 'transaction', element: <ListTransaction /> },
                    ]
                }
            ]
        },
        // Catch-all route for not found pages
        { path: '*', element: <div>404 - Page Not Found</div> }
    ];
