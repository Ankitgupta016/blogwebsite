

//  preloader 
function myFunction() {
  const loader = document.getElementsByClassName("loader")[0];
  loader.style.display = "none";
}   

// {{!--Name validation--}}
const nameInput = document.getElementById('name');
const nameerrorMessage = document.getElementById('error');
const namesuccessMessage = document.getElementById('success');

nameInput.addEventListener('input', validateName);

function validateName() {
  var namePattern = /^[A-Za-z\s]+$/;

  if (nameInput.value === '') {
    nameerrorMessage.textContent = 'Please enter your Name.';
    namesuccessMessage.textContent = '';
    nameerrorMessage.style.display = 'block';
    namesuccessMessage.style.display = 'none';
    formValid = false;
  } else if (!namePattern.test(nameInput.value)) {
    nameerrorMessage.textContent = 'Invalid name. Only alphabetic characters and spaces are allowed.';
    namesuccessMessage.textContent = '';
    namesuccessMessage.style.display = 'none';
    nameerrorMessage.style.display = 'block';
    formValid = false;
  } else {
    nameerrorMessage.textContent = '';
    namesuccessMessage.textContent = 'Valid is name.';
    namesuccessMessage.style.color = 'green';
    namesuccessMessage.style.display = 'block';
    nameerrorMessage.style.display = 'none';
  }
}

// {{!--image file Name}}
function showFileName() {
  var input = document.getElementById('image');
  var fileName = input.value.split('\\').pop(); var fileNameSpan =
    document.getElementById('file-name'); if (fileName) {
      fileNameSpan.innerHTML = fileName;
    } else {
    fileNameSpan.innerHTML =
      'Upload profile picture';
  }
}


// {{!--!--number validate --}}


// Get the number input element
const numberInput = document.getElementById('number');
// Get the error and success message elements
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');

numberInput.addEventListener('input', validateNumber);
// Function to validate the number
function validateNumber() {
  const number = numberInput.value.trim();
  const numberpattern = /^\d{10}$/
  // Check if the number is valid
  if (number === "") {
    // Number is valid, display success message
    errorMessage.textContent=' Please enter a Number'
    successMessage.textContent = ' ';
   
  } else if(!numberpattern.test(number)) {
    // Number is invalid, display error message
    errorMessage.textContent = 'Invalid number. Please enter a 10-digit number.';
    successMessage.textContent = '';
  }else{
     successMessage.textContent = 'Number is valid.';
    errorMessage.textContent = '';
  }
}

// Add event listener for input event

var emailInput = document.getElementById('email');
var emailError = document.getElementById('email-error');
var emailSuccess = document.getElementById('email-success');

emailInput.addEventListener('input', validateEmail);

function validateEmail() {
var emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

if (emailInput.value === '') {
emailError.textContent = 'Please enter your email.';
emailSuccess.textContent = '';
emailSuccess.style.display = 'none';
emailError.style.display = 'block';
  emailError.style.color = "red";
    emailError.style.fontSize = "12px"
    emailError.style.fontFamily = " sans-serif"
formValid = false;
} else if (!emailPattern.test(emailInput.value)) {
emailError.textContent = 'Invalid email. Please enter a valid email address.';
emailSuccess.textContent = '';
emailSuccess.style.display = 'none';
emailError.style.display = 'block';
  emailError.style.color = "red";
    emailError.style.fontSize = "12px"
    emailError.style.fontFamily = " sans-serif"
formValid = false;
} else {
emailError.textContent = '';
emailSuccess.textContent = 'Valid is email.';
emailSuccess.style.color = 'green';
 
    emailSuccess.style.fontSize = "12px"
    emailSuccess.style.fontFamily = " sans-serif"
emailSuccess.style.display = 'block';
emailError.style.display = 'none';
}
}

// {{!--password validate--}}
var passwordInput = document.getElementById("password");
var passwordError = document.getElementById("password-error");
var passwordSuccess = document.getElementById("password-success");


function validatePassword() {
  var password = passwordInput.value;


  var passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

  if (password === '') {
    // Password is valid
    passwordError.textContent = "Please enter a password";
    passwordSuccess.textContent = "";
    passwordError.style.color = "red";
    passwordError.style.fontSize = "12px"
    passwordError.style.fontFamily = " sans-serif"
  } else if(!passwordPattern.test(password)) {
    // Password is invalid
    passwordSuccess.textContent = "";
    passwordError.textContent = "Password must contain at least one digit, one lowercase letter, one uppercase letter, and be at least 6 characters long";
    passwordError.style.color = "red";
    passwordError.style.fontSize = "10px"
    passwordError.style.fontFamily = " sans-serif"
  }else{
     passwordError.textContent = "";
    passwordSuccess.textContent = "Password is valid";
    passwordSuccess.style.color = "green";
    passwordSuccess.style.fontSize = "12px"
    passwordSuccess.style.fontFamily = " sans-serif"
  }
}

passwordInput.addEventListener("input", validatePassword);

