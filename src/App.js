import { RouterProvider } from 'react-router-dom';
import './App.css';
import routers from './routers';
import "react-loading-skeleton/dist/skeleton.css";
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  return (
    <>
      <ChakraProvider>
        <RouterProvider router={routers} />
      </ChakraProvider>
    </>
  );
}

export default App;
