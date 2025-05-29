const editBtns = Array.from(document.getElementsByClassName('edit-btn'));
const form = document.getElementById('form');
const idEntry = document.getElementsByName('id')[0];
const headlineEntry = document.getElementsByName('headline')[0];
const descriptionEntry = document.getElementsByName('description')[0];
const screenCover = document.getElementById('screen-cover');
const cancelBtn = document.getElementById('cancel');

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
})

