import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    IconButton,
    Box,
    FormControl,
    Input,
    useToast,
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { ChatState } from '../../context/ChatProvider'
import UserBadItem from '../UserBadItem'
import axios from 'axios'
const UpdateGroupChat = ({ fetchAgain, setFetchAgain,fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { selectedChat, setSelectedChat } = ChatState();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
    const toast = useToast()
    const handleRename = async () => {
        const token = JSON.parse(localStorage.getItem('token'))
        if (!groupChatName) {
            return
        }
        try {
            setRenameLoading(true)
            const { data } = await axios.patch('https://chat-app-poly.onrender.com/api/rename', {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setSelectedChat(data.updatedChat)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
        }
        catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            setRenameLoading(false)
        }
        setGroupChatName("");
    }
    const handleSearch = (value) => {
        console.log(value);
    }
    const handleRemove = () => {

    }
    return (
        <>
            <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody className='flex' flexDir="column" alignItems="center">
                        <Box w="100%" className='flex' flexWrap="wrap" pb={3}>
                            {selectedChat.users.map(item => {
                                return <UserBadItem key={item._id} user={item} />
                            })}
                            <FormControl className='flex'>
                                <Input
                                    placeholder="Chat Name"
                                    mb={3}
                                    value={groupChatName}
                                    onChange={(e) => setGroupChatName(e.target.value)}
                                />
                                <Button
                                    variant="solid"
                                    colorScheme="teal"
                                    ml={1}
                                    isLoading={renameloading}
                                    onClick={handleRename}
                                >
                                    Update
                                </Button>
                            </FormControl>
                            <FormControl>
                                <Input
                                    placeholder="Add User to group"
                                    mb={1}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </FormControl>
                        </Box>
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={() => handleRemove(user)} colorScheme="red">
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChat