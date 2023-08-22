import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";

const routers=createBrowserRouter([
    {path:'',element:<HomePage/>},
    {path:'/signup',element:<SignupPage/>}
])

export default routers