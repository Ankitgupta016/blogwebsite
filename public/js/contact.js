

//   {{!-- Name validation  --}}
  const nameInput = document.getElementById('name');
var nameError = document.getElementById('name-error');
var nameSuccess = document.getElementById('name-success');

nameInput.addEventListener('input', validateName);

function validateName() {
  var namePattern = /^[A-Za-z\s]+$/;

  if (nameInput.value === '') {
    nameError.textContent = 'Please enter your Name.';
    nameSuccess.textContent = '';
    nameError.style.display = 'block';
    nameSuccess.style.display = 'none';
    formValid = false;
  } else if (!namePattern.test(nameInput.value)) {
    nameError.textContent = 'Invalid name. Only alphabetic characters and spaces are allowed.';
    nameSuccess.textContent = '';
    nameSuccess.style.display = 'none';
    nameError.style.display = 'block';
    formValid = false;
  } else {
    nameError.textContent = '';
    nameSuccess.textContent = 'Valid name.';
    nameSuccess.style.color = 'green';
    nameSuccess.style.display = 'block';
    nameError.style.display = 'none';
  }
}

//   {{!-- email validation --}}
    // Rest of the error message elements

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
    formValid = false;
  } else if (!emailPattern.test(emailInput.value)) {
    emailError.textContent = 'Invalid email. Please enter a valid email address.';
    emailSuccess.textContent = '';
    emailSuccess.style.display = 'none';
    emailError.style.display = 'block';
    formValid = false;
  } else {
    emailError.textContent = '';
    emailSuccess.textContent = 'Valid email.';
    emailSuccess.style.color = 'green';
    emailSuccess.style.display = 'block';
    emailError.style.display = 'none';
  }
}

document.getElementById('contactForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from submitting by default

  var nameInput = document.getElementById('name');
  var emailInput = document.getElementById('email');
  var subjectInput = document.getElementById('subject');
  var messageInput = document.getElementById('message');

  var nameError = document.getElementById('name-error');
  var emailError = document.getElementById('email-error');

  var subjectError = document.getElementById('subject-error');
  
  var messageError = document.getElementById('message-error');

  var formValid = true;

  if (nameInput.value === '') {
    nameError.textContent = 'Please enter your Name.';
    nameError.style.display = 'block';
    formValid = false;
  } else {
    nameError.style.display = 'none';
  }

  if (emailInput.value === '') {
    emailError.textContent = 'Please enter your email.';
    emailError.style.display = 'block';
    formValid = false;
  } else {
    emailError.style.display = 'none';
  }

  if (subjectInput.value === '') {
    subjectError.style.display = 'block';
    formValid = false;
  } else {
    subjectError.style.display = 'none';
  }

  if (messageInput.value === '') {
    messageError.style.display = 'block';
    formValid = false;
  } else {
    messageError.style.display = 'none';
  }

  // If all fields are valid, submit the form
  if (formValid) {
    event.target.submit(); // Submit the form
  }
});
