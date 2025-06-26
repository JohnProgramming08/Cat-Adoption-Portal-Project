const catDeliveries = Array.from(document.getElementsByClassName('cat-delivery'));
const catNameDisplay = document.getElementById('cat-name');
const catRoomDisplay = document.getElementById('cat-room');
const catDestinationDisplay = document.getElementById('cat-destination');
const nextStageBtn = document.getElementById('next-stage-btn');
const startDeliveryBtn = document.getElementById('start-delivery');
const currentDivs = Array.from(document.getElementsByClassName('current-div'));
const stages = ['pickup', 'delivery', 'confirm']
const catInfoDisplays = [
    { cat_element: catNameDisplay, key: 'cat_name', foretext: 'Name: ' },
    { cat_element: catRoomDisplay, key: 'room', foretext: 'Room: ' },
    { cat_element: catDestinationDisplay, key: 'address', foretext: 'Destination: ' }
];



async function getData(id, type) {
	const response = await fetch(`/find_form/${id}/${type}`);
	const data = await response.json();
	return data;
}


catDeliveries.forEach(element => {
	element.addEventListener('click', e => {
		const formId = e.target.id;
		getData(formId, "cat").then(data => {
			catInfoDisplays.forEach(({cat_element, key, foretext}) => {
				cat_element.dataset.value = data[key];
				cat_element.textContent = foretext ? `${foretext} ${data[key]}` : data[key];
			});
			startDeliveryBtn.dataset.cat = data['cat_id'];
		});
		startDeliveryBtn.style.display = 'flex';

		catDeliveries.forEach(ele => {
			ele.parentElement.classList.remove('clicked');
		});
		e.target.parentElement.classList.add('clicked');
	});
});

async function startTransport(cat_id, user_id) {
	const response = await fetch(`/start_transport/${user_id}/${cat_id}`);
	const data = await response.json();
	return data;
}


startDeliveryBtn.addEventListener('click', e => {
	e.target.style.display = 'none';
	currentDivs.forEach(div => {
		div.style.overflow = 'hidden';
		div.style.display = 'flex';
		div.classList.remove('current-stage');
		div.querySelector('.current-div-shadow').style.display = 'flex';
	});
	nextStageBtn.style.display = 'flex';

	const user_id = parseInt(document.querySelector('main').id)
	const cat_id = parseInt(startDeliveryBtn.dataset.cat)
	startTransport(user_id, cat_id).then(data => {
		let divIndex;
		if (data['transport'] === 'exists') {
			divIndex = stages.indexOf(data['stage']);
		} else {
			divIndex = 0;
		}
		const currentDiv = currentDivs[divIndex];
		currentDiv.querySelector('.current-div-shadow').style.display = 'none';
		currentDiv.classList.add('current-stage');
		divIndex++;
	});

});