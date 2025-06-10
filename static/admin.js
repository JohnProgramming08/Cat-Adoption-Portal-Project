const cancel = Array.from(document.getElementsByClassName('form-cancel'))[0];
const formSection = document.getElementById('form-review-section');
const adoptionForms = Array.from(document.getElementsByClassName('form-link'));
const screenCover = document.getElementById('screen-cover');
const formIdInput = Array.from(document.getElementsByName('form_id'))[0];
const reasonInput = document.querySelector('textarea');


const formDisplays = [
    { element: document.getElementById('username'), key: 'username', foretext: 'Username: '},
    { element: document.getElementById('user-id'), key: 'user_id', foretext: 'User ID: ' },
    { element: document.getElementById('user-address'), key: 'address', foretext: 'User Address: ' },
    { element: document.getElementById('other-pets'), key: 'other_pets', foretext: 'Other Pets: ' },
    { element: document.getElementById('reason'), key: 'reason', foretext: '' },
    { element: document.getElementById('cat-id'), key: 'cat_id', foretext: 'Cat ID: ' },
    { element: document.getElementById('cat-name'), key: 'cat_name', foretext: 'Cat Name: ' },
    { element: document.getElementById('cat-bio'), key: 'cat_bio', foretext: '' }
];

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
			formIdInput.value = data.id;
			reasonInput.value = '';
			formSection.style.display = 'flex';
			screenCover.style.display = 'block';
		});
	});
});

cancel.addEventListener('click', () => {
	formSection.style.display = 'none';
	screenCover.style.display = 'none';
});