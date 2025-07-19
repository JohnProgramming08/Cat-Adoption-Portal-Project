const headerAdmin = document.getElementById('header-admin');
headerAdmin.classList.add('selected');
const userForms = Array.from(document.getElementsByClassName('form-link'));
// Adoption form elements
const catDetails = document.getElementById('cat-details');
const adoptionFormDisplays = [
	{
		element: document.getElementById('username'),
		key: 'username',
		foretext: 'Username: ',
	},
	{
		element: document.getElementById('user-id'),
		key: 'user_id',
		foretext: 'User ID: ',
	},
	{
		element: document.getElementById('user-address'),
		key: 'address',
		foretext: 'User Address: ',
	},
	{
		element: document.getElementById('other-pets'),
		key: 'other_pets',
		foretext: 'Other Pets: ',
	},
	{ element: document.getElementById('reason'), key: 'reason', foretext: '' },
	{
		element: document.getElementById('cat-id'),
		key: 'cat_id',
		foretext: 'Cat ID: ',
	},
	{
		element: document.getElementById('cat-name'),
		key: 'cat_name',
		foretext: 'Cat Name: ',
	},
	{
		element: document.getElementById('cat-bio'),
		key: 'cat_bio',
		foretext: '',
	},
];

// Volunteer form elements
const volunteerDetails = document.getElementById('volunteer-details');
const volunteerFormDisplays = [
	{
		element: document.getElementById('volunteer-username'),
		key: 'username',
		foretext: 'Username: ',
	},
	{
		element: document.getElementById('volunteer-id'),
		key: 'user_id',
		foretext: 'User ID: ',
	},
	{
		element: document.getElementById('volunteer-address'),
		key: 'address',
		foretext: 'User Address: ',
	},
	{
		element: document.getElementById('volunteer-reason'),
		key: 'reason',
		foretext: '',
	},
	{
		element: document.getElementById('first-name'),
		key: 'first_name',
		foretext: 'First Name: ',
	},
	{
		element: document.getElementById('last-name'),
		key: 'last_name',
		foretext: 'Last Name: ',
	},
	{ element: document.getElementById('age'), key: 'age', foretext: 'Age: ' },
];

// General form review elements
const userDetails = document.getElementById('user-details');
const formIdInput = Array.from(document.getElementsByName('form_id'))[0];
const reasonInput = document.querySelector('textarea');
const typeInput = Array.from(document.getElementsByName('type'))[0];
const cancel = Array.from(document.getElementsByClassName('form-cancel'))[0];
const formSection = document.getElementById('form-review-section');
const screenCover = document.getElementById('screen-cover');

// Form review section
async function get_form(id, type) {
	const response = await fetch(`/find_form/${id}/${type}`);
	const data = await response.json();
	return data;
}

function display_form(data, volunteer) {
	// Display the volunteer / adoption form
	if (volunteer) {
		volunteerFormDisplays.forEach(({ element, key, foretext }) => {
			element.textContent = foretext
				? `${foretext} ${data[key]}`
				: data[key];
		});
		typeInput.value = 'volunteer';
		volunteerDetails.style.display = 'flex';
	} else {
		adoptionFormDisplays.forEach(({ element, key, foretext }) => {
			element.textContent = foretext
				? `${foretext} ${data[key]}`
				: data[key];
		});
		typeInput.value = 'cat';
		userDetails.style.display = 'flex';
		catDetails.style.display = 'flex';
	}

	formIdInput.value = data.id;
	reasonInput.value = '';
	formSection.style.display = 'flex';
	screenCover.style.display = 'block';
}

// Display the form info whenever a users form is clicked
userForms.forEach((form) => {
	form.addEventListener('click', (e) => {
		const formId = e.target.id;
		const volunteer =
			e.target.parentElement.classList.contains('volunteer-form');
		let type = '';
		if (volunteer) {
			type = 'volunteer';
		} else {
			type = 'cat';
		}
		get_form(formId, type).then((data) => {
			display_form(data, volunteer);
		});
	});
});

// Close the form review
cancel.addEventListener('click', () => {
	formSection.style.display = 'none';
	screenCover.style.display = 'none';
	userDetails.style.display = 'none';
	catDetails.style.display = 'none';
	volunteerDetails.style.display = 'none';
});
