import { RouterProvider } from 'react-router-dom';
import './App.css';
import routers from './routers';
import "react-loading-skeleton/dist/skeleton.css";

function App() {
  return (
    <>
       <RouterProvider router={routers}/>
    </>
  );
}

export default App;
