const headerCats = document.getElementById('header-cats');
headerCats.classList.add('selected');
// Cat display element
const adoptButtons = Array.from(document.getElementsByClassName('cat-btn'));

// Cat adoption elements
const form = document.querySelector('form');
const catIdInput = document.getElementsByName('cat_id')[0];
const screenCover = document.getElementById('screen-cover');
const cancel = document.getElementById('cancel');
const fields = Array.from(form.querySelectorAll('input, textarea'));
const error = document.getElementById('error-msg');

// Adoption section
// Open an adoption form for that specific cat
adoptButtons.forEach((button) => {
	button.addEventListener('click', (e) => {
		const catId = e.target.id;
		catIdInput.value = catId;
		screenCover.classList.remove('hidden');
		form.classList.remove('hidden');
	});
});

// Close the adoption form and clear the fields
cancel.addEventListener('click', () => {
	form.id = 'none';
	error.textContent = '';
	form.classList.add('hidden');
	screenCover.classList.add('hidden');
	fields.forEach((field) => {
		if (field.type !== 'submit') {
			field.value = '';
		}
	});
});

if (form.id === 'exists') {
	form.classList.remove('hidden');
}
