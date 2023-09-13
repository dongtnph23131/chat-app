import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Box, Stack, Text } from '@chakra-ui/layout'
import { Avatar, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuItem, MenuList, Skeleton, Spinner, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import ProfileModal from '../Modal/ProfileModal'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import UserListSearchItem from '../User/UserListSearchItem'
import { ChatState } from '../../context/ChatProvider'
const Header = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
    const [data, setData] = useState([])
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState()
    const navigate = useNavigate()
    const [loadingChat, setLoadingChat] = useState(false);
    const {
        setSelectedChat,
        notification,
        setNotification,
        chats,
        setChats,
    } = ChatState();
    const logout = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        setUser()
        setChats([])
        navigate('/login')
        setSelectedChat()
    }
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const onSubmitSearch = async () => {
        if (!search) {
            toast({
                title: "Mời nhập tên",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }
        try {
            setIsLoading(true)
            await axios.get(`https://chat-app-poly.onrender.com/api/search/user?search=${search}`).then(response => {
                setData(response.data.data);
                setIsLoading(false)
            })
        }
        catch (error) {
            setIsLoading(false)
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
    const accessChat = async (userId) => {
        try {
            setLoadingChat(true)
            const token = JSON.parse(localStorage.getItem('token'))
            const { data } = await axios.post('https://chat-app-poly.onrender.com/api/accessChat', { userId }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setLoadingChat(false)
            const isChatItem = chats?.find(item => item._id === data._id)
            if (!isChatItem) {
                setChats([...chats, data])
            }
            onClose()
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
    return (
        <>
            <Box className='flex justify-between bg-white w-full' p="5px 10px 5px 10px" borderWidth="5px">
                <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
                    <Button variant="ghost" onClick={onOpen}>
                        <i className="fas fa-search"></i>
                        <Text d={{ base: "none", md: "flex" }} px={4}>
                            Search User
                        </Text>
                    </Button>
                </Tooltip>
                <a href='/'>  <img src='https://i.imgur.com/SfVMNiF.png' className='w-[50px]' /></a>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <BellIcon className='text-2xl' m={1} />
                        </MenuButton>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size="sm" cursor="pointer" name={user.name} src={user.avatar} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>Profile</MenuItem>
                            </ProfileModal>
                            <MenuItem onClick={logout}>Log out</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer placement="left" onClose={() => {
                onClose()
                setSearch("")
                setData([])
            }} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box className='flex' pb={2}>
                            <Input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search by name"
                                mr={2}

                            />
                            <Button onClick={onSubmitSearch}>Go</Button>
                        </Box>
                        {isLoading ? <Stack>
                            <Skeleton className='h-[4rem]' />
                            <Skeleton className='h-[4rem]' />
                            <Skeleton className='h-[4rem]' />
                            <Skeleton className='h-[4rem]' />
                            <Skeleton className='h-[4rem]' />
                        </Stack> : <>
                            {data?.map((item) => {
                                return <UserListSearchItem onClick={() => accessChat(item._id)} user={item} key={item._id} />
                            })}
                            {loadingChat && <Spinner ml="auto" d="flex" />}
                        </>}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default Header