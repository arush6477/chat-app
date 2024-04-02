import React, { useEffect } from 'react'
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { isPasswordValid } from './Checks';

const Register = () => {
  const navigate = useNavigate()
  const toast = useToast()

  //defining states for getting the input value
  const [username, setUsername] = useState()
  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [confirmPassword, setConfirmPassword] = useState()
  const [avatar, setAvatar] = useState()

  //states for basic functionalities like loading and show
  const [registerLoading, setRegisterLoading] = useState(false)
  const [show, setShow] = useState(false);
  const showHidePassword = () => {
    setShow(!show)
  }

  const submitHandlerPost = async () => {
    setRegisterLoading(true)
    if (!username || !name || !email || !password || !confirmPassword){
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
      setRegisterLoading(false)
      return
    }

    //email Check
    // if(isEmailValid !== true){
    //   toast({
    //     title: "Enter valid email",
    //     status: "warning",
    //     duration: 5000,
    //     isClosable: true,
    //     position: "bottom",
    //   })
    //   setRegisterLoading(false)
    //   return
    // }

    //password checks
    const passwordValid = isPasswordValid(password)
    if(passwordValid !== true){
      toast({
        title: passwordValid,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
      setRegisterLoading(false)
      return
    }
    if(password !== confirmPassword){
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
      setRegisterLoading(false)
      return
    }

    //posting to the backend
    try {
      const config = {
        headers:{
          "content-type": "multipart/form-data"
        },
      }
      
      //making a FormData to send file along with json data
      //eariler the problem was due to the content-type being set to app/json 
      //rather than multipart/form-data
      const postData = new FormData()
      postData.append("avatar",avatar)
      postData.append("fullName",name)
      postData.append("username",username)
      postData.append("email",email)
      postData.append("password",password)
      
      let response
      try {        
        response = await axios.post("http://127.0.0.1:8080/api/v1/user/register",postData,config)
        toast({
          title: "Registration successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom"
        })
      } catch (error) {}

      //in case is req fails and doesnot gets response
      if(!response){
        toast({
          title: "request failed",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom"
        })
        setRegisterLoading(false)
        return 
      }


      //will handle the responses from the server later.....
      document.cookie = `accessToken=${response.data.accessToken}; path=/`

      localStorage.setItem("userInfo", JSON.stringify(response))
      navigate("/chats")
    } catch (error) {
      toast({
        title: "Error Occured!",
        desccription: error.message,
        status: "error",
        duration: 5000,
        inclosable: true,
        position: "bottom"
      })
    }
    setRegisterLoading(false)
    return
  }

  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      <FormControl id="username" isRequired>
        <FormLabel>username</FormLabel>
        <Input
          type="text"
          placeholder="Enter Your username"
          onChange={(e) => setUsername(e.target.value)}
        />
      </FormControl>
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button 
              h="1.75rem" 
              size="sm" 
              onClick={showHidePassword}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirmPassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button 
              h="1.75rem" 
              size="sm" 
              onClick={showHidePassword}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="avatar">
        <FormLabel>Upload your avatar</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandlerPost}
        isLoading={registerLoading}
      >
        register
      </Button>
    </VStack>
  )
}

export default Register
