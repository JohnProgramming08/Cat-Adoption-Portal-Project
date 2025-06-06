const adoptButtons = Array.from(document.getElementsByClassName('cat-btn'));
const form = document.querySelector('form');
const catIdInput = document.getElementsByName('cat_id')[0];
const screenCover = document.getElementById('screen-cover');
const cancel = document.getElementById('cancel');

adoptButtons.forEach(button => {
	button.addEventListener('click', e => {
		const catId = e.target.id;
		catIdInput.value = catId;
		screenCover.classList.remove('hidden');
		form.classList.remove('hidden');
	});
});

cancel.addEventListener('click', () => {
	form.classList.add('hidden');
	screenCover.classList.add('hidden');
})