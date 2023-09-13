import { RouterProvider } from 'react-router-dom';
import './App.css';
import routers from './routers';
import "react-loading-skeleton/dist/skeleton.css";
import { ChakraProvider } from '@chakra-ui/react';
import ChatProvider from './context/ChatProvider';

function App() {
  return (
    <>
      <ChatProvider>
        <ChakraProvider>
          <RouterProvider router={routers} />
        </ChakraProvider>
      </ChatProvider>
    </>
  );
}

export default App;
