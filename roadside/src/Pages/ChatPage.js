import React, {useEffect, useState} from 'react'
import axios from "axios"

const ChatPage = () => {

  const [chats, setChats] = useState([]); 

  //getting the chat data and storing in a state "chats" then mapping over it to get the chatName below in the jsx
  // const fetchChats = async () => {
  //   const data = await axios.get("/api/v1/chat");
  //   setChats(data);
  // };

  // useEffect(()=>{
  //   fetchChats();
  // },[]);




  return (
    <div>
      {/* {chats.map((chat)=>{
        <div>{chat.name}</div>
      })} */}
      Welcome to paara paara sa chatpage
    </div>
  )
}

export default ChatPage
