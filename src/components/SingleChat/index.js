import React, { useEffect, useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import { Box, Text } from '@chakra-ui/layout'
import { FormControl, IconButton, Input, Spinner, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../../config/ChatLogics'
import ProfileModal from '../Modal/ProfileModal'
import UpdateGroupChat from '../UpdateGroupChat'
import Lottie from 'lottie-react'
import animationData from "../../animations/typing.json";
import axios from 'axios'
import ScrollableChat from '../ScrollableChat'
const loggedUser = JSON.parse(localStorage.getItem('user'))
const token = JSON.parse(localStorage.getItem('token'))
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat, setSelectedChat } = ChatState()
    const [isLoading, setIsLoading] = useState(false)
    const [istyping, setIsTyping] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([])
    const fetchMessages = async () => {
        if (!selectedChat) return
        try {
            setIsLoading(true)
            const { data } = await axios.get(`https://chat-app-poly.onrender.com/api/sendMessage/${selectedChat._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setMessages(data)
            setIsLoading(false)
        }
        catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    }
    useEffect(() => {
        fetchMessages()
    }, [selectedChat])
    const typingHandler = (event) => {
        setNewMessage(event.target.value)
    }
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const toast = useToast()
    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            try {
                setNewMessage("")
                const { data } = await axios.post('https://chat-app-poly.onrender.com/api/sendMessage', {
                    content: newMessage,
                    chatId: selectedChat._id
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setMessages([...messages, data])
            }
            catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    }
    return (
        <>
            {selectedChat ? <>
                <Text fontSize={{ base: "28px", md: "30px" }}
                    pb={3}
                    px={2}
                    w="100%"
                    fontFamily="Work sans"
                    className='flex'
                    justifyContent={{ base: "space-between" }}
                    alignItems="center">
                    <IconButton
                        d={{ base: "flex", md: "none" }}
                        icon={<ArrowBackIcon />}
                        onClick={() => setSelectedChat("")}
                    />
                    {selectedChat.isGroupChat ? <>
                        {selectedChat.chatName.toUpperCase()}
                        <UpdateGroupChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
                    </> : <>
                        {getSender(loggedUser, selectedChat.users)}
                        <ProfileModal user={getSenderFull(loggedUser, selectedChat.users)} />
                    </>}
                </Text>
                <Box className='flex'
                    flexDir="column"
                    justifyContent="flex-end"
                    p={3}
                    bg="#E8E8E8"
                    w="100%"
                    h="100%"
                    borderRadius="lg"
                    overflowY="hidden">
                    {isLoading ? <Spinner size="xl"
                        w={20}
                        h={20}
                        alignSelf="center"
                        margin="auto" /> : <div style={{display:'flex',flexDirection:'column',overflowY:'scroll',scrollbarWidth:'none'}}>
                             <ScrollableChat messages={messages}/>
                    </div>}
                    <FormControl
                        id="first-name"
                        isRequired
                        mt={3}
                        onKeyDown={sendMessage}
                    >
                        {istyping ? (
                            <div>
                                <Lottie
                                    options={defaultOptions}
                                    width={70}
                                    style={{ marginBottom: 15, marginLeft: 0 }}
                                />
                            </div>
                        ) : (
                            <></>
                        )}
                        <Input
                            variant="filled"
                            bg="#E0E0E0"
                            placeholder="Enter a message.."
                            value={newMessage}
                            onChange={typingHandler}
                        />
                    </FormControl>
                </Box>
            </> : <Box d="flex" alignItems="center" justifyContent="center" h="100%">
                <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                    Click on a user to start chatting
                </Text>
            </Box>}
        </>
    )
}

export default SingleChat