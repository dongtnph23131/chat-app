import { Box } from "@chakra-ui/layout"
import Header from "../components/Headers"
import MyChat from "../components/MyChat"
import ChatBox from "../components/ChatBox"

const HomePage = () => {
  return (
    <div className='w-full'>
      <Header />
      <Box className="flex w-full h-[91.5vh] justify-between p-[10px]">
        <MyChat />
        <ChatBox />
      </Box>
    </div>
  )
}

export default HomePage