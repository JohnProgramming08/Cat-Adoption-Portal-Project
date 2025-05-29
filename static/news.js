const editBtns = Array.from(document.getElementsByClassName('edit-btn'));
const form = document.getElementById('form');
const screenCover = document.getElementById('screen-cover');

editBtns.forEach((btn) => {
	btn.addEventListener('click', () => {
		form.style.display = 'block';
		screenCover.style.display = 'block';
	});
});

// ADD A WAY TO GET RID OF FORM AFTER SHOWS UP