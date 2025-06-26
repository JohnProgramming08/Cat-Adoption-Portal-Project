const adoptButtons = Array.from(document.getElementsByClassName('cat-btn'));
const form = document.querySelector('form');
const catIdInput = document.getElementsByName('cat_id')[0];
const screenCover = document.getElementById('screen-cover');
const cancel = document.getElementById('cancel');
const fields = Array.from(form.querySelectorAll('input, textarea'));
const headerCats = document.getElementById('header-cats');
const error = document.getElementById('error-msg');
headerCats.classList.add('selected');

adoptButtons.forEach(button => {
	button.addEventListener('click', e => {
		const catId = e.target.id;
		catIdInput.value = catId;
		screenCover.classList.remove('hidden');
		form.classList.remove('hidden');
	});
});

cancel.addEventListener('click', () => {
	form.id = "none";
	error.textContent = '';
	form.classList.add('hidden');
	screenCover.classList.add('hidden');
	fields.forEach(field => {
		if (field.type !== 'submit') {
			field.value = '';
		}
	})
});

if (form.id === 'exists') {
	form.classList.remove('hidden');
}