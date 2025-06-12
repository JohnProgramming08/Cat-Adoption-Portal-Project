const form = document.getElementById('username-form');
const editBtn = document.getElementById('edit');
const usernameDisplay = document.getElementById('username-show');
const cancelBtn = document.getElementById('cancel');
const userEntry = document.getElementsByName('username')[0];
const errorMessage = document.getElementById('error');
const news = document.getElementById('newest-news');
const headline = news.querySelector('h3');
const author = news.querySelector('h4');
const adoptionForms = Array.from(document.getElementsByClassName('form-link'));
const screenCover = document.getElementById('screen-cover');
const formSection = document.getElementById('form-show');
const cancel = document.getElementById('cancel');
const formDisplays = [
    { element: document.getElementById('user-address'), key: 'address', foretext: 'User Address: ' },
    { element: document.getElementById('other-pets'), key: 'other_pets', foretext: 'Other Pets: ' },
    { element: document.getElementById('reason'), key: 'reason', foretext: '' },
    { element: document.getElementById('cat-id'), key: 'cat_id', foretext: 'Cat ID: ' },
    { element: document.getElementById('cat-name'), key: 'cat_name', foretext: 'Cat Name: ' },
    { element: document.getElementById('cat-bio'), key: 'cat_bio', foretext: '' }
];
const headerHome = document.getElementById('header-home');
headerHome.classList.add('selected');

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

async function get_form(id) {
	const response = await fetch(`/find_form/${id}`);
	const data = await response.json();
	return data;
}

adoptionForms.forEach(form => {
	form.addEventListener('click', e => {
		const formId = e.target.id;
		get_form(formId).then(data => {
			formDisplays.forEach(({element, key, foretext}) => {
				element.textContent = foretext ? `${foretext} ${data[key]}` : data[key];
			});
			formSection.style.display = 'flex';
			screenCover.style.display = 'block';
		});
	});
});

cancel.addEventListener('click', () => {
	formSection.style.display = 'none';
	screenCover.style.display = 'none';
})