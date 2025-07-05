const form = document.getElementById('username-form');
const editBtn = document.getElementById('edit');
const usernameDisplay = document.getElementById('username-show');
const cancelBtn = document.getElementById('cancel');
const userEntry = document.getElementsByName('username')[0];
const errorMessage = document.getElementById('error');
const news = document.getElementById('newest-news');
const headline = news.querySelector('h3');
const author = news.querySelector('h4');
const adoptionForms = Array.from(document.getElementsByClassName('cat-adoption'));
const screenCover = document.getElementById('screen-cover');
const formSection = document.getElementById('form-show');
const cancelCat = document.getElementById('cancel-cat');
const applicationForms = Array.from(document.getElementsByClassName('application-link'));
const applicationSection = document.getElementById('application-show');
const cancelVolunteer = document.getElementById('cancel-volunteer');
const acceptedAdoptions = Array.from(document.getElementsByClassName('accepted'));
const deliverySection = document.getElementById('delivery-show');
const cancelDelivery = document.getElementById('cancel-delivery');
const confirmDiv = document.getElementById('confirm-div');
const confirmHeader = document.getElementById('confirm-header');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const formDisplays = [
    { element: document.getElementById('user-address'), key: 'address', foretext: 'User Address: ' },
    { element: document.getElementById('other-pets'), key: 'other_pets', foretext: 'Other Pets: ' },
    { element: document.getElementById('reason'), key: 'reason', foretext: '' },
    { element: document.getElementById('cat-id'), key: 'cat_id', foretext: 'Cat ID: ' },
    { element: document.getElementById('cat-name'), key: 'cat_name', foretext: 'Cat Name: ' },
    { element: document.getElementById('cat-bio'), key: 'cat_bio', foretext: '' }
];
const headerHome = document.getElementById('header-home');
headerHome.classList.add('selected');

const applicantDisplays = [
	{ element: document.getElementById('applicant-first-name'), key: 'first_name', foretext: 'First Name: ' },
	{ element: document.getElementById('applicant-last-name'), key: 'last_name', foretext: 'Last Name: ' },
	{ element: document.getElementById('applicant-address'), key: 'address', foretext: 'Address: ' },
	{ element: document.getElementById('applicant-reason'), key: 'reason', foretext: '' },
	{ element: document.getElementById('applicant-age'), key: 'age', foretext: 'Age: '}
];

const deliveryDisplays = [
	{ element: document.getElementById('volunteer-name'), key: 'name' },
	{ element: document.getElementById('delivery-stage'), key: 'display' }
]

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


if (author.textContent.length > 20) {
	author.textContent = author.textContent.slice(0, 15) + '...';
} if (headline.textContent.length > 15) {
	headline.textContent = headline.textContent.slice(0, 15) + '...';
}


async function get_form(id, type) {
	const response = await fetch(`/find_form/${id}/${type}`);
	const data = await response.json();
	return data;
}


adoptionForms.forEach(form => {
	form.addEventListener('click', e => {
		const formId = e.target.id;
		get_form(formId, "cat").then(data => {
			formDisplays.forEach(({element, key, foretext}) => {
				element.textContent = foretext ? `${foretext} ${data[key]}` : data[key];
			});
			formSection.style.display = 'flex';
			screenCover.style.display = 'block';
		}); 
	});
});

applicationForms.forEach(form => {
	form.addEventListener('click', e => {
		const formId = e.target.id;
		get_form(formId, "volunteer").then(data => {
			applicantDisplays.forEach(({element, key, foretext}) => {
				element.textContent = foretext ? `${foretext} ${data[key]}` : data[key];
			});
			applicationSection.style.display = 'flex';
			screenCover.style.display = 'block';
		}); 
	});
});


cancelCat.addEventListener('click', () => {
	formSection.style.display = 'none';
	screenCover.style.display = 'none';
});

cancelVolunteer.addEventListener('click', () => {
	applicationSection.style.display = 'none';
	screenCover.style.display = 'none';
});


async function getDelivery(id) {
	const response = await fetch(`/get_delivery/${id}`);
	const data = await response.json();
	return data;
}

acceptedAdoptions.forEach(adoption => {
	adoption.addEventListener('click', e => {
		const adoptionId = parseInt(e.target.parentElement.querySelector('.cat-adoption').id);
		getDelivery(adoptionId).then(data => {
			if (data['transport']) {
				deliveryDisplays.forEach(({element, key}) => {
					element.textContent = data[key];
				});
				try {
				if (data['stage'] === 'confirm') {
					confirmDiv.style.display = 'flex';
					confirmHeader.style.display = 'block';
				}
				yesBtn.dataset.transport = data["id"];
				noBtn.dataset.transport = data["id"];
				deliverySection.style.display = 'flex';
				screenCover.style.display = 'block';
				} catch(ex) {
					headline.textContent = ex;
				}
			} else {
				return '';
			}

		});
	});
});

cancelDelivery.addEventListener('click', e => {
	screenCover.style.display = 'none';
	deliverySection.style.display = 'none';
});


// ADD EVENT LISTNENER TO BUTTONS TO USE API
async function confirmDelivery(button) {
	const user_id = parseInt(document.querySelector('main').id);
	const transport_id = parseInt(button.dataset.transport);
	if (button.textContent === 'Yes') {
		const response = await fetch(`/confirm_delivery/${transport_id}/${1}`);
	} else {
		const response = await fetch(`/confirm_delivery/${transport_id}/${0}`);
	}
	location.reload(true);
}

yesBtn.addEventListener('click', e => {
	confirmDelivery(e.target);
});

noBtn.addEventListener('click', e => {
	confirmDelivery(e.target);
})

