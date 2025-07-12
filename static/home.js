const headerHome = document.getElementById('header-home');
headerHome.classList.add('selected');
// Username form elements
const form = document.getElementById('username-form');
const editBtn = document.getElementById('edit');
const cancelBtn = document.getElementById('cancel');
const userEntry = document.getElementsByName('username')[0];
const errorMessage = document.getElementById('error');
const usernameDisplay = document.getElementById('username-show');

// News display elements
const news = document.getElementById('newest-news');
const headline = news.querySelector('h3');
const author = news.querySelector('h4');

// Users adoption form elements
const adoptionForms = Array.from(document.getElementsByClassName('cat-adoption'));
const screenCover = document.getElementById('screen-cover');
const formSection = document.getElementById('form-show');
const cancelCat = document.getElementById('cancel-cat');
const formDisplays = [
    { element: document.getElementById('user-address'), key: 'address', foretext: 'User Address: ' },
    { element: document.getElementById('other-pets'), key: 'other_pets', foretext: 'Other Pets: ' },
    { element: document.getElementById('reason'), key: 'reason', foretext: '' },
    { element: document.getElementById('cat-id'), key: 'cat_id', foretext: 'Cat ID: ' },
    { element: document.getElementById('cat-name'), key: 'cat_name', foretext: 'Cat Name: ' },
    { element: document.getElementById('cat-bio'), key: 'cat_bio', foretext: '' }
];

// Adopted cat delivery elements
const deliverySection = document.getElementById('delivery-show');
const cancelDelivery = document.getElementById('cancel-delivery');
const confirmDiv = document.getElementById('confirm-div');
const confirmHeader = document.getElementById('confirm-header');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const deliveryDisplays = [
	{ element: document.getElementById('volunteer-name'), key: 'name' },
	{ element: document.getElementById('delivery-stage'), key: 'display' }
]

// Users volunteer application elements
const applicationForms = Array.from(document.getElementsByClassName('application-link'));
const applicationSection = document.getElementById('application-show');
const cancelVolunteer = document.getElementById('cancel-volunteer');
const acceptedAdoptions = Array.from(document.getElementsByClassName('accepted'));
const applicantDisplays = [
	{ element: document.getElementById('applicant-first-name'), key: 'first_name', foretext: 'First Name: ' },
	{ element: document.getElementById('applicant-last-name'), key: 'last_name', foretext: 'Last Name: ' },
	{ element: document.getElementById('applicant-address'), key: 'address', foretext: 'Address: ' },
	{ element: document.getElementById('applicant-reason'), key: 'reason', foretext: '' },
	{ element: document.getElementById('applicant-age'), key: 'age', foretext: 'Age: '}
];

// Profile section
// Allow the user to input a username to change their current one
editBtn.addEventListener('click', () => {
	editBtn.classList.add('hidden');
	usernameDisplay.classList.add('hidden');
	form.classList.remove('hidden');
	userEntry.value = usernameDisplay.textContent.slice(10).trim();
	if (errorMessage.classList.contains('exists')) {
		errorMessage.textContent = 'That username is already taken.';
	}
});

cancelBtn.addEventListener('click', () => {
	form.classList.add('hidden');
	editBtn.classList.remove('hidden');
	usernameDisplay.classList.remove('hidden');
	errorMessage.textContent = '';
});

// News section
if (author.textContent.length > 20) {
	author.textContent = author.textContent.slice(0, 15) + '...';
} if (headline.textContent.length > 15) {
	headline.textContent = headline.textContent.slice(0, 15) + '...';
}

// Cat adoption section
async function getForm(id, type) {
	const response = await fetch(`/find_form/${id}/${type}`);
	const data = await response.json();
	return data;
}

function displayAdoptionFormInfo(event) {
	const formId = event.target.id;
	getForm(formId, "cat").then(data => {
		formDisplays.forEach(({element, key, foretext}) => {
			element.textContent = foretext ? `${foretext} ${data[key]}` : data[key];
		});
		formSection.style.display = 'flex';
		screenCover.style.display = 'block';
	}); 
}

adoptionForms.forEach(form => {
	form.addEventListener('click', e => {
		displayAdoptionFormInfo(e);
	});
});

cancelCat.addEventListener('click', () => {
	formSection.style.display = 'none';
	screenCover.style.display = 'none';
});

// Cat delivery info section
async function getDelivery(id) {
	const response = await fetch(`/get_delivery/${id}`);
	const data = await response.json();
	return data;
}

function displayDeliveryInfo(data) {
	// If the cat is being transported
	if (data['transport']) {
		deliverySection.style.display = 'flex';
		screenCover.style.display = 'block';
		deliveryDisplays.forEach(({element, key}) => {
			element.textContent = data[key];
		});

		// Ask the user if the cat has been delivered
		if (data['stage'] === 'confirm') {
			confirmDiv.style.display = 'flex';
			confirmHeader.style.display = 'block';
		}
		yesBtn.dataset.transport = data["id"];
		noBtn.dataset.transport = data["id"];
	} else {
		return '';
	}
}

// Display delivery info to the user
acceptedAdoptions.forEach(adoption => {
	adoption.addEventListener('click', e => {
		const parent = e.target.parentElement;
		const adoptionId = parseInt(parent.querySelector('.cat-adoption').id);
		getDelivery(adoptionId).then(data => {
			displayDeliveryInfo(data);
		});
	});
});

cancelDelivery.addEventListener('click', e => {
	screenCover.style.display = 'none';
	deliverySection.style.display = 'none';
});

async function confirmDelivery(button) {
	const transportId = parseInt(button.dataset.transport);
	if (button.textContent === 'Yes') { // Successful delivery
		await fetch(`/confirm_delivery/${transportId}/${1}`);
	} else { // Unsuccessful delivery
		await fetch(`/confirm_delivery/${transportId}/${0}`);
	}
	location.reload(true);
}

yesBtn.addEventListener('click', e => {
	confirmDelivery(e.target);
});

noBtn.addEventListener('click', e => {
	confirmDelivery(e.target);
})

// Volunteer applications section
function displayApplicationInfo(event) {
	const formId = event.target.id;
	getForm(formId, "volunteer").then(data => {
		applicantDisplays.forEach(({element, key, foretext}) => {
			element.textContent = foretext ? `${foretext} ${data[key]}` : data[key];
		});
		applicationSection.style.display = 'flex';
		screenCover.style.display = 'block';
	}); 
}

applicationForms.forEach(form => {
	form.addEventListener('click', e => {
		displayApplicationInfo(e);
	});
});

cancelVolunteer.addEventListener('click', () => {
	applicationSection.style.display = 'none';
	screenCover.style.display = 'none';
});