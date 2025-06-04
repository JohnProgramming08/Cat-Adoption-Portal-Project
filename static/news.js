const editBtns = Array.from(document.getElementsByClassName('edit-btn'));
const form = document.getElementById('form');
const idEntry = document.getElementsByName('id')[0];
const headlineEntry = document.getElementsByName('headline')[0];
const descriptionEntry = document.getElementsByName('description')[0];
const screenCover = document.getElementById('screen-cover');
const cancelBtn = document.getElementById('cancel');
const newBtn = document.getElementById('new-btn');
const deleteBtns = Array.from(document.getElementsByClassName('delete-btn'));
const error = document.getElementById('error');


async function getNews(id) {
	const response = await fetch(`/get_news/${id}`);
	const data = await response.json();
	return data;
}

editBtns.forEach((btn) => {
	btn.addEventListener('click', (e) => {
		getNews(e.target.id).then(data => {
			headlineEntry.value = data.headline;
			descriptionEntry.value = data.description;
			idEntry.value = data.id;
		});
		form.classList.remove('hidden');
		screenCover.classList.remove('hidden');
	});
});

cancelBtn.addEventListener('click', () => {
	form.classList.add('hidden');
	screenCover.classList.add('hidden');
});

newBtn.addEventListener('click', () => {
	form.classList.remove('hidden');
	screenCover.classList.remove('hidden');
	headlineEntry.value = '';
	descriptionEntry.value= '';
	idEntry.value = 0;
});

async function deleteNews(id) {
	await fetch(`/delete_news/${id}`);
	window.location.reload();
}

deleteBtns.forEach(btn => {
	btn.addEventListener('click', e => {
		deleteNews(e.target.id);
	});
});

if (error.classList.contains('exists')) {
	error.classList.remove('hidden');
	form.classList.remove('hidden');
}