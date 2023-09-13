import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Skeleton, Stack, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import axios from 'axios'
import UserListSearchItem from '../User/UserListSearchItem'
import UserBadItem from '../UserBadItem'

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState("")
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()
    const { chats, setChats } = ChatState()
    const handleSearch = async (value) => {

        setSearch(value)
        if (!value) {
            setSearchResult([])
            return
        }
        try {
            const token = JSON.parse(localStorage.getItem('token'))
            setIsLoading(true)
            const { data } = await axios.get(`https://chat-app-poly.onrender.com/api/search/user?search=${search}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setIsLoading(false)
            setSearchResult(data?.data)
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
        }
    }
    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "Tên group để trống hoặc không có users nào",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }
        const token = JSON.parse(localStorage.getItem('token'))
        const {data} = await axios.post('https://chat-app-poly.onrender.com/api/group', { name: groupChatName, users: selectedUsers.map((item => item._id)) }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setChats([...chats, data])
        onClose()
        toast({
            title: "New Group Chat Created!",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
    }
    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);
    }
    const handleDelete = (userId) => {
        setSelectedUsers(selectedUsers.filter(item => item._id !== userId))
    }
    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={() => {
                onClose()
                setSearchResult([])
                setSelectedUsers([])
                setSearch("")
            }}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Group chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <Input placeholder='Chat Name' mb={3} onChange={(event) => setGroupChatName(event.target.value)} />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add Users eg: John, Piyush, Jane"
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box w="100%" d="flex" flexWrap="wrap">
                            {selectedUsers.map((user) => (
                                <UserBadItem
                                    key={user._id}
                                    user={user}
                                    onClick={() => handleDelete(user._id)}
                                />
                            ))}
                        </Box>
                        {isLoading ? <Stack>
                            <Skeleton className='h-[4rem]' />
                        </Stack> : <>
                            {searchResult?.map(item => {
                                return <UserListSearchItem onClick={() => handleGroup(item)} key={item._id} user={item} />
                            })}
                        </>}
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={handleSubmit} colorScheme="blue">
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal