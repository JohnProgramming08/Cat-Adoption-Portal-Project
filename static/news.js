const headerNews = document.getElementById('header-news');
headerNews.classList.add('selected');
// News display elements
const editBtns = Array.from(document.getElementsByClassName('edit-btn'));
const newBtn = document.getElementById('new-btn');
const deleteBtns = Array.from(document.getElementsByClassName('delete-btn'));

// Form display elements
const form = document.getElementById('form');
const idEntry = document.getElementsByName('id')[0];
const headlineEntry = document.getElementsByName('headline')[0];
const descriptionEntry = document.getElementsByName('description')[0];
const screenCover = document.getElementById('screen-cover');
const cancelBtn = document.getElementById('cancel');
const error = document.getElementById('error');

// News display section
async function getNews(id) {
	const response = await fetch(`/get_news/${id}`);
	const data = await response.json();
	return data;
}

//  Add the news info to the input fields
editBtns.forEach((btn) => {
	btn.addEventListener('click', (e) => {
		getNews(e.target.id).then((data) => {
			headlineEntry.value = data.headline;
			descriptionEntry.value = data.description;
			idEntry.value = data.id;
		});
		form.style.display = 'flex';
		screenCover.classList.remove('hidden');
	});
});

// Display a form for creating a new article
newBtn.addEventListener('click', () => {
	form.style.display = 'flex';
	screenCover.classList.remove('hidden');
	headlineEntry.value = '';
	descriptionEntry.value = '';
	idEntry.value = 0;
});

async function deleteNews(id) {
	await fetch(`/delete_news/${id}`);
	window.location.reload();
}

deleteBtns.forEach((btn) => {
	btn.addEventListener('click', (e) => {
		deleteNews(e.target.id);
	});
});

// News form section
cancelBtn.addEventListener('click', () => {
	form.style.display = 'none';
	screenCover.classList.add('hidden');
});

if (error.classList.contains('exists')) {
	error.classList.remove('hidden');
	form.style.display = 'flex';
}
