import React, { useState } from 'react'
import { Button } from "@chakra-ui/button"
import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input"
import { VStack } from "@chakra-ui/layout"
import { useToast } from '@chakra-ui/react'
import { useNavigate } from "react-router"
import axios from 'axios'
import { isPasswordValid } from './Checks'

const Login = () => {
  const navigate = useNavigate()
  const toast = useToast()

  //defining states for inputing the data
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()

  //defining loading and show states
  const [loginLoading, setLoginLoading] = useState(false)
  const [show, setShow] = useState(false)
  const showHidePassword = () => {
    setShow(!show)
  }

  const submitHandlerPost = async () => {
    setLoginLoading(true)
    if (!username || !password) {
      toast({
        title: "please enter both fields",
        status: "warning",
        duration: 3000,
        isclosable: true,
        posiiton: "bottom"
      })
      setLoginLoading(false)
      return
    }
    const validPassword = isPasswordValid(password)
    if(validPassword !== true){
      toast({
        title:validPassword,
        status:"warning",
        duration:3000,
        isclosable:true,
        posiiton:"bottom"
      }) 
      setLoginLoading(false)
      return 
    }

    let response
    try {
      const config = {
        header: { 
          "content-type": "application/json"
        }
      }
      const postData = {
        username : username,
        password: password
      }
      console.log(postData)
      response = await axios.post("http://127.0.0.1:8080/api/v1/user/login",postData, config)
    } catch (error) {}
    if (!response) {
      toast({
        title: "request failed",
        status:"error",
        duration: 3000,
        isclosable:true,
        position:"bottom"        
      })
      setLoginLoading(false)
      return
    }
    //handle response later 
    //then navigate
    const accessToken = response.data.accessToken
    document.cookie = `accessToken=${response.data.accessToken}; path=/`
    navigate("/chats")
  }

  return (
    <VStack spacing="10px">
      <FormControl id="text" isRequired>
        <FormLabel>username</FormLabel>
        <Input
          value={username}
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setUsername(e.target.value)}
        />
      </FormControl>
      <FormControl id="loginpassword" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Enter password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={showHidePassword}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandlerPost}
        isLoading={loginLoading}
      >
        Login
      </Button>
    </VStack>
  )
}

export default Login
