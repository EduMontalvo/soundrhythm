import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./Layout/Layout";
import About from "./views/About";
import Contact from "./views/Contact";
import Home from "./views/Home";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "about",
                element: <About />,
            },
            {
                path: "contact",
                element: <Contact />,
            },
            {
                path: "*",
                element: <Navigate to="/" replace />,
            },
        ],
    },
]);
