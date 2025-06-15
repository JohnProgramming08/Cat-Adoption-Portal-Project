const cancel = Array.from(document.getElementsByClassName('form-cancel'))[0];
const formSection = document.getElementById('form-review-section');
const adoptionForms = Array.from(document.getElementsByClassName('form-link'));
const screenCover = document.getElementById('screen-cover');
const formIdInput = Array.from(document.getElementsByName('form_id'))[0];
const reasonInput = document.querySelector('textarea');
const headerAdmin = document.getElementById('header-admin');
const typeInput = Array.from(document.getElementsByName('type'))[0];
const volunteerForms = Array.from(document.getElementsByClassName('volunteer-form'));
const userDetails = document.getElementById('user-details');
const catDetails = document.getElementById('cat-details');
const volunteerDetails = document.getElementById('volunteer-details')
headerAdmin.classList.add('selected');



const adoptionFormDisplays = [
    { element: document.getElementById('username'), key: 'username', foretext: 'Username: '},
    { element: document.getElementById('user-id'), key: 'user_id', foretext: 'User ID: ' },
    { element: document.getElementById('user-address'), key: 'address', foretext: 'User Address: ' },
    { element: document.getElementById('other-pets'), key: 'other_pets', foretext: 'Other Pets: ' },
    { element: document.getElementById('reason'), key: 'reason', foretext: '' },
    { element: document.getElementById('cat-id'), key: 'cat_id', foretext: 'Cat ID: ' },
    { element: document.getElementById('cat-name'), key: 'cat_name', foretext: 'Cat Name: ' },
    { element: document.getElementById('cat-bio'), key: 'cat_bio', foretext: '' }
];

const volunteerFormDisplays = [
	{ element: document.getElementById('volunteer-username'), key: 'username', foretext: 'Username: ' },
	{ element: document.getElementById('volunteer-id'), key: 'user_id', foretext: 'User ID: ' },
	{ element: document.getElementById('volunteer-address'), key: 'address', foretext: 'User Address: ' },
	{ element: document.getElementById('volunteer-reason'), key: 'reason', foretext: '' },
	{ element: document.getElementById('first-name'), key: 'first_name', foretext: 'First Name: ' },
	{ element: document.getElementById('last-name'), key: 'last_name', foretext: 'Last Name: ' },
	{ element: document.getElementById('age'), key: 'age', foretext: 'Age: '}
]

async function get_form(id, type) {
	const response = await fetch(`/find_form/${id}/${type}`);
	const data = await response.json();
	return data;
}

try {
adoptionForms.forEach(form => {
	form.addEventListener('click', e => {
		const formId = e.target.id;
		volunteer = e.target.parentElement.classList.contains('volunteer-form');
		let type = '';
		if (volunteer) {
			type = 'volunteer';			
		} else {
			type = 'cat';
		}
		get_form(formId, type).then(data => {
			if (volunteer) {
				volunteerFormDisplays.forEach(({element, key, foretext}) => {
					element.textContent = foretext ? `${foretext} ${data[key]}` : data[key];
				});
				typeInput.value = 'volunteer';
				volunteerDetails.style.display = 'flex';
			} else {
				adoptionFormDisplays.forEach(({element, key, foretext}) => {
					element.textContent = foretext ? `${foretext} ${data[key]}` : data[key];
				});
				typeInput.value = 'cat';
				userDetails.style.display = 'flex';
				catDetails.style.display = 'flex';
			}
			formIdInput.value = data.id;
			reasonInput.value = '';
			formSection.style.display = 'flex';
			screenCover.style.display = 'block';
		});
	});
});
} catch (ex) {
	screenCover.textContent = ex;
	screenCover.style.display = 'block';
}

cancel.addEventListener('click', () => {
	formSection.style.display = 'none';
	screenCover.style.display = 'none';
	userDetails.style.display = 'none';
	catDetails.style.display = 'none';
	volunteerDetails.style.display = 'none';
});