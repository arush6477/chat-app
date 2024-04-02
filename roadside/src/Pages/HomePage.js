import React , { useEffect } from 'react'
import { Container, Box, Text, Tab, Tabs, TabList, TabPanel, TabPanels } from "@chakra-ui/react"
import Register from "../Components/Authorization/Register"
import Login from '../Components/Authorization/Login'
import axios from 'axios'
import { useNavigate } from "react-router"

const HomePage = () => {
  const navigate = useNavigate()  
  
  const tokenAccess = async () => {
    const accessToken = document.cookie.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
        acc[name] = decodeURIComponent(value);
        return acc;
      }, {});
      if(!accessToken) return;
      
      const config = {
        headers: {
          "content-type": "application/json"
        }
      }
      
      let response
      try {
        response = await axios.post("http://127.0.0.1:8080/api/v1/user/direct",{ 
          message: "Token ha access do", 
          cookie: accessToken
        }, config)
        console.log(response)
      } catch (error) {
        console.log(error.message)
        return
      }
      if (!response) return;
      navigate("/chats")
    }

    //getting executed twice
    tokenAccess()

    return (
      <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Register</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Register />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage
