const wrongDetails = document.getElementsByClassName('wrong-details');
const existingUsername = document.getElementsByClassName('existing-username');
const errorMessage = document.getElementById('error');

if (wrongDetails.length > 0) {
	errorMessage.textContent = 'The login details you provided are incorrect.';
} else if (existingUsername.length > 0) {
	errorMessage.textContent = 'A user with that username already exists.';
}