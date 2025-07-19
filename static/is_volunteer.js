const main = document.querySelector('main');
const pageHeader = document.getElementById('header-volunteer');
pageHeader.classList.add('selected');
// Cats for delivery elements
const catDeliveries = Array.from(
	document.getElementsByClassName('cat-delivery')
);

// Start delivery elements
const catNameDisplay = document.getElementById('cat-name');
const catRoomDisplay = document.getElementById('cat-room');
const catDestinationDisplay = document.getElementById('cat-destination');
const catInfoDisplays = [
	{ cat_element: catNameDisplay, key: 'cat_name', foretext: 'Name: ' },
	{ cat_element: catRoomDisplay, key: 'room', foretext: 'Room: ' },
	{
		cat_element: catDestinationDisplay,
		key: 'address',
		foretext: 'Destination: ',
	},
];
const startDeliveryBtn = document.getElementById('start-delivery');

// Cat delivery elements
const nextStageBtn = document.getElementById('next-stage-btn');
const currentDivs = Array.from(document.getElementsByClassName('current-div'));
const cancelBtn = document.getElementById('cancel');
const cancelStage = document.getElementById('cancel-stage');
const yesBtn = document.getElementById('yes-btn');
const returnBtn = document.getElementById('return-btn');

const stages = ['pickup', 'delivery', 'confirm'];

// Cats for delivery section
async function getData(id, type) {
	const response = await fetch(`/find_form/${id}/${type}`);
	const data = await response.json();
	return data;
}

async function displayCatData(id) {
	const data = await getData(id, 'cat');
	catInfoDisplays.forEach(({ cat_element, key, foretext }) => {
		cat_element.dataset.value = data[key];
		cat_element.textContent = foretext
			? `${foretext} ${data[key]}`
			: data[key];
	});
	startDeliveryBtn.dataset.cat = data['cat_id'];
}

// Display a start delivery screen when available deliveries are clicked
catDeliveries.forEach((element) => {
	element.addEventListener('click', (e) => {
		if (document.querySelector('main').dataset.transport === 'True') {
			return '';
		}

		const formId = e.target.id;
		displayCatData(formId).then(() => {
			startDeliveryBtn.style.display = 'flex';
			catDeliveries.forEach((ele) => {
				ele.parentElement.classList.remove('clicked');
			});
			e.target.parentElement.classList.add('clicked');
		});
	});
});

// Start delivery section
async function startTransport(cat_id, user_id) {
	const response = await fetch(`/start_transport/${user_id}/${cat_id}`);
	const data = await response.json();
	return data;
}

// Fill in the gaps for the delivery stages
function fillDeliveryGaps() {
	const catLocation = catRoomDisplay.dataset.value;
	const catName = catNameDisplay.dataset.value;
	const catDestination = catDestinationDisplay.dataset.value;
	const templateText = [
		[`Pickup ${catName} from the following room:`, catLocation],
		[`Take ${catName} to the following address:`, catDestination],
	];

	for (let i = 0; i < 2; i++) {
		const highlightDiv = currentDivs[i];
		const stageTask = highlightDiv.querySelector('.stage-task');
		const location = highlightDiv.querySelector('.location');
		stageTask.textContent = templateText[i][0];
		location.textContent = templateText[i][1];
	}
}

// Cover all stages in a light blue
function stageCover(e) {
	e.target.style.display = 'none';
	currentDivs.forEach((div) => {
		div.style.overflow = 'hidden';
		div.style.display = 'flex';
		div.classList.remove('current-stage');
		div.querySelector('.current-div-shadow').style.display = 'flex';
	});
	nextStageBtn.style.display = 'flex';
	cancelBtn.style.display = 'flex';
}

// Start the transport and highlight the current stage
startDeliveryBtn.addEventListener('click', (e) => {
	stageCover(e);
	const user_id = parseInt(main.id);
	const cat_id = parseInt(startDeliveryBtn.dataset.cat);
	startTransport(cat_id, user_id).then((data) => {
		let divIndex;
		if (data['transport'] === 'exists') {
			divIndex = stages.indexOf(data['stage']);
		} else {
			divIndex = 0;
		}
		const currentDiv = currentDivs[divIndex];
		currentDiv.querySelector('.current-div-shadow').style.display = 'none';
		currentDiv.classList.add('current-stage');
		currentDiv.classList.remove('next-stage');

		main.dataset.id = data['id'];
	});
	fillDeliveryGaps();
});

async function nextStage(cat_id, user_id) {
	const response = await fetch(`/next_stage/${user_id}/${cat_id}`);
	const data = await response.json();
	return data;
}

// Progress the transport to the next stage
nextStageBtn.addEventListener('click', (e) => {
	const cat_id = parseInt(startDeliveryBtn.dataset.cat);
	const user_id = parseInt(document.querySelector('main').id);
	nextStage(cat_id, user_id).then((data) => {
		location.reload(true);
	});
});

// Display a screen prompting the user if they have returned the cat
cancelBtn.addEventListener('click', (e) => {
	currentDivs.forEach((div) => {
		div.style.display = 'none';
	});
	cancelBtn.style.display = 'none';
	nextStageBtn.style.display = 'none';
	cancelStage.style.display = 'flex';
	returnBtn.style.display = 'block';
	yesBtn.style.display = 'block';
});

// Return to delivering the cat
returnBtn.addEventListener('click', (e) => {
	location.reload(true);
});

async function cancelTransport(transport_id) {
	const response = await fetch(`/cancel_transport/${transport_id}`);
	const data = await response.json(); // Delete this
	location.reload(true);
}

// Cancel the transport
yesBtn.addEventListener('click', (e) => {
	const transportId = main.dataset.id;
	cancelTransport(transportId);
});

// On page load
function getDivIndex(data) {
	let divIndex;
	if (
		data['transport'] === 'exists' &&
		data['status'] === 'Unsuccessful: Being Delivered'
	) {
		divIndex = stages.indexOf(data['stage']);
		alert(
			'The user has not received their cat.\nPlease cancel or fulfill the delivery.'
		);
	} else if (data['transport'] === 'exists') {
		divIndex = stages.indexOf(data['stage']);
	} else {
		divIndex = 0;
	}
	if (divIndex < 2) {
		nextStageBtn.style.display = 'flex';
		cancelBtn.style.display = 'flex';
	}
	return divIndex;
}

async function removeCover() {
	const userId = parseInt(main.id);
	const mainCatId = parseInt(main.dataset.cat);
	await startTransport(mainCatId, userId).then((data) => {
		// Remove the cover from the current stage
		const divIndex = getDivIndex(data);
		const currentDiv = currentDivs[divIndex];
		const shadow = currentDiv.querySelector('.current-div-shadow');
		shadow.style.display = 'none';
		currentDiv.classList.add('current-stage');
		currentDiv.classList.remove('next-stage');

		main.dataset.id = data['id'];
	});
}

// Display the current delivery if there is one
async function checkTransports() {
	const mainTransport = main.dataset.transport;
	if (mainTransport === 'True') {
		const formId = parseInt(main.dataset.form);
		await displayCatData(formId);
		// Highlight the current delivery
		catDeliveries.forEach((ele) => {
			ele.parentElement.classList.remove('clicked');
			if (parseInt(ele.id) === formId) {
				ele.parentElement.classList.add('clicked');
				ele.parentElement.classList.remove('next-stage');
			}
		});

		// Apply a cover to all stages
		currentDivs.forEach((div) => {
			div.style.overflow = 'hidden';
			div.style.display = 'flex';
			div.classList.remove('current-stage');
			div.querySelector('.current-div-shadow').style.display = 'flex';
		});
		await removeCover();
	}
}

checkTransports().then(() => {
	// Highlight the selected one from the home page
	try {
		catDeliveries.forEach((delivery) => {
			if (delivery.id === main.dataset.clicked) {
				delivery.parentElement.classList.add('clicked');
				displayCatData(delivery.id);
				startDeliveryBtn.style.display = 'flex';
			}
		});
	} catch (e) {
		console.log(e);
	}
	fillDeliveryGaps();
});
