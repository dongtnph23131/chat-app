import React, { useState } from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../../config/ChatLogics'
import { Avatar, Tooltip } from '@chakra-ui/react'

const ScrollableChat = ({ messages }) => {
  const [loggedUser,setLoggedUser]=useState(JSON.parse(localStorage.getItem('user')))
  console.log(loggedUser);
  return (
    <ScrollableFeed>
      {messages && messages.map((message, index) => {
        return <div key={index + 1} className='flex'>
          {(isSameSender(messages, message, index, loggedUser._id) ||
            isLastMessage(messages, index, loggedUser._id)) && (
              <Tooltip label={message.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={message.sender.name}
                  src={message.sender.avatar}
                />
              </Tooltip>
            )}
          <span
            style={{
              backgroundColor: `${message.sender._id === loggedUser._id ? "#BEE3F8" : "#B9F5D0"
                }`,
              marginLeft: isSameSenderMargin(messages, message, index, loggedUser._id),
              marginTop: isSameUser(messages, message, index, loggedUser._id) ? 3 : 10,
              borderRadius: "20px",
              padding: "5px 15px",
              maxWidth: "75%",
            }}
          >
            {message.content}
          </span>
        </div>
      })}
    </ScrollableFeed>
  )
}

export default ScrollableChat