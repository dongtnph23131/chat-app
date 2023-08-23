import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";

const routers = createBrowserRouter([
    { path: '', element: <HomePage /> },
    { path: 'signup', element: <SignupPage /> },
    { path: 'login', element: <LoginPage /> }
])

export default routers