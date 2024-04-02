const isPasswordValid = (password) => {
  if (password.length < 8) return "password should be atleast 8 char long";
  if (password.length > 12) return "password should not be more than 12 char";
  if (password.search(/[a-z]/) < 0) return "password should contain a char";
  if (password.search(/[0-9]/) < 0) return "password chould contain a numeric";
  // if(password.search(/[A-Z]/)) return "password should contain atleast one capital char";
  // const specialChar = /[#@!]/;
  // if(!specialChar.test(password)) return "password should contain  ! or @ or #"; 
  return true
}

const isEmailValid = (email) => {
  return true
  //will do later
}

export {
  isPasswordValid,
  isEmailValid
}