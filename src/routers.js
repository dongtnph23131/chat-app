import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";

const user = JSON.parse(localStorage.getItem('user'))

const PrivateRouter = ({ user }) => {
    return user ? <Outlet /> : <Navigate to={"/login"} />
}

const routers = createBrowserRouter([
    {
        path: '', element: <PrivateRouter user={user} />, children: [
            { index: true, element: <HomePage /> }
        ]
    },
    { path: 'signup', element: <SignupPage /> },
    { path: 'login', element: <LoginPage /> }
])

export default routers