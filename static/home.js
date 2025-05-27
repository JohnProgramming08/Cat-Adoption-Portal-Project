const form = document.getElementById('username-form');
const editBtn = document.getElementById('edit');
const usernameDisplay = document.getElementById('username-show');
const cancelBtn = document.getElementById('cancel');
const userEntry = document.getElementsByName('username')[0];
const errorMessage = document.getElementById('error');

editBtn.addEventListener('click', () => {
	editBtn.classList.add('hidden');
	usernameDisplay.classList.add('hidden');
	form.classList.remove('hidden');
	userEntry.value = usernameDisplay.textContent.slice(10).trim();
	if (errorMessage.classList.contains('exists')) {
		errorMessage.textContent = 'That username is already taken.';
	}
});

cancelBtn.addEventListener('click', () => {
	form.classList.add('hidden');
	editBtn.classList.remove('hidden');
	usernameDisplay.classList.remove('hidden');
	errorMessage.textContent = '';
})