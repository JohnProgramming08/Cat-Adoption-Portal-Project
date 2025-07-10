const catDeliveries = Array.from(document.getElementsByClassName('cat-delivery'));
const catNameDisplay = document.getElementById('cat-name');
const catRoomDisplay = document.getElementById('cat-room');
const catDestinationDisplay = document.getElementById('cat-destination');
const nextStageBtn = document.getElementById('next-stage-btn');
const startDeliveryBtn = document.getElementById('start-delivery');
const currentDivs = Array.from(document.getElementsByClassName('current-div'));
const cancelBtn = document.getElementById('cancel');
const cancelStage = document.getElementById('cancel-stage');
const yesBtn = document.getElementById('yes-btn');
const returnBtn = document.getElementById('return-btn');
const pageHeader = document.getElementById('header-volunteer');
pageHeader.classList.add('selected');
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
		if (document.querySelector('main').dataset.transport === "True") {
			return '';
		}


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
	cancelBtn.style.display = 'flex';

	const user_id = parseInt(document.querySelector('main').id)
	const cat_id = parseInt(startDeliveryBtn.dataset.cat)
	startTransport(cat_id, user_id).then(data => {
		let divIndex;
		if (data['transport'] === 'exists') {
			divIndex = stages.indexOf(data['stage']);
		} else {
			divIndex = 0;
		}
		const currentDiv = currentDivs[divIndex];
		currentDiv.querySelector('.current-div-shadow').style.display = 'none';
		currentDiv.classList.add('current-stage');
		
		const catLocation = catRoomDisplay.dataset.value;
		const catName = catNameDisplay.dataset.value;
		const catDestination = catDestinationDisplay.dataset.value;
		const templateText = [[`Pickup ${catName} from the following room:`, catLocation],
		[`Take ${catName} to the following address:`, catDestination]];

		for (let i = 0; i < 2; i++) {
			const highlightDiv = currentDivs[i];
			const stageTask = highlightDiv.querySelector('.stage-task');
			const location = highlightDiv.querySelector('.location');
			stageTask.textContent = templateText[i][0];
			location.textContent = templateText[i][1];
		}
		document.querySelector('main').dataset.id = data['id'];

	});

});

async function nextStage(cat_id, user_id) {
	const response = await fetch(`/next_stage/${user_id}/${cat_id}`);
	const data = await response.json();
	return data;
}


nextStageBtn.addEventListener('click', e => {
	try {
		const cat_id = parseInt(startDeliveryBtn.dataset.cat);
		const user_id = parseInt(document.querySelector('main').id);
		nextStage(cat_id, user_id).then(data => {
			console.log('Response received:', data);
			location.reload(true);
		}).catch(error => {
			console.error('Error in nextStage:', error);
			e.target.textContent = `Error: ${error.message}`;
		});
	} catch(ex) {
		console.error('Exception caught:', ex);
		e.target.textContent = ex;
	}
});



async function checkTransports() {
    const mainTransport = document.querySelector('main').dataset.transport;
    if (mainTransport === "True") {
        const formId = parseInt(document.querySelector('main').dataset.form);
        const mainCatId = parseInt(document.querySelector('main').dataset.cat);
        await getData(formId, "cat").then(data => {
            catInfoDisplays.forEach(({cat_element, key, foretext}) => {
                cat_element.dataset.value = data[key];
                cat_element.textContent = foretext ? `${foretext} ${data[key]}` : data[key];
            });
            startDeliveryBtn.dataset.cat = data['cat_id'];
        });

        catDeliveries.forEach(ele => {
            ele.parentElement.classList.remove('clicked');
            if (parseInt(ele.id) === formId) {
                ele.parentElement.classList.add('clicked');
                ele.parentElement.classList.remove('next-stage');
            }
        });

        currentDivs.forEach(div => {
            div.style.overflow = 'hidden';
            div.style.display = 'flex';
            div.classList.remove('current-stage');
            div.querySelector('.current-div-shadow').style.display = 'flex';
        });
        
        const userId = parseInt(document.querySelector('main').id);
        await startTransport(mainCatId, userId).then(data => {
            let divIndex;
            if (data['transport'] === 'exists' && data['status'] === 'Unsuccessful: Being Delivered') {
                divIndex = stages.indexOf(data['stage']);
                alert('The user has not received their cat.\nPlease cancel or fulfill the delivery.')
            } else if (data['transport'] === 'exists') {
                divIndex = stages.indexOf(data['stage']);
            }
            else {
                divIndex = 0;
            }
            if (divIndex < 2) {
                nextStageBtn.style.display = 'flex';
                cancelBtn.style.display = 'flex';
            }
            
            const currentDiv = currentDivs[divIndex];
            currentDiv.querySelector('.current-div-shadow').style.display = 'none';
            currentDiv.classList.add('current-stage');
            currentDiv.classList.remove('next-stage');
            
            // Move the template text logic inside the promise
            const catLocation = catRoomDisplay.dataset.value;
            const catName = catNameDisplay.dataset.value;
            const catDestination = catDestinationDisplay.dataset.value;
            const templateText = [[`Pickup ${catName} from the following room:`, catLocation],
            [`Take ${catName} to the following address:`, catDestination]];

            for (let i = 0; i < 2; i++) {
                const highlightDiv = currentDivs[i];
                const stageTask = highlightDiv.querySelector('.stage-task');
                const location = highlightDiv.querySelector('.location');
                stageTask.textContent = templateText[i][0];
                location.textContent = templateText[i][1];
            }
			document.querySelector('main').dataset.id = data['id'];
        });
    }
}

cancelBtn.addEventListener('click', e => {
	currentDivs.forEach(div => {
		div.style.display = 'none';
	});
	cancelBtn.style.display = 'none';
	nextStageBtn.style.display = 'none';
	cancelStage.style.display = 'flex';
	returnBtn.style.display = 'block';
	yesBtn.style.display = 'block';
});

returnBtn.addEventListener('click', e => {
	location.reload(true);
});

async function cancelTransport(transport_id) {
	const response = await fetch(`/cancel_transport/${transport_id}`);
	const data = await response.json();
	location.reload(true);
}

yesBtn.addEventListener('click', e => {
	const transportId = document.querySelector('main').dataset.id;
	cancelTransport(transportId);
});

checkTransports();