const form = document.getElementById('username-form');
const editBtn = document.getElementById('edit');
const usernameDisplay = document.getElementById('username-show');
const cancelBtn = document.getElementById('cancel');
const userEntry = document.getElementsByName('username')[0];
const errorMessage = document.getElementById('error');
const news = document.getElementById('newest-news');
const headline = news.querySelector('h3');
const author = news.querySelector('h4');

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
});

if (author.textContent.length > 20) {
	author.textContent = author.textContent.slice(0, 15) + '...';
} if (headline.textContent.length > 15) {
	headline.textContent = headline.textContent.slice(0, 15) + '...';
}