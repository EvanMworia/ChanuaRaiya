const contentArea = document.querySelector('main'); // Append incidents to the main section

async function getIncidents() {
	try {
		let response = await fetch('http://localhost:5000/incidents/all-incidents');
		let incidents = await response.json();

		contentArea.innerHTML = ''; // Clear content before populating

		let gridContainer = document.createElement('div');
		gridContainer.className = 'grid grid-cols-1 md:grid-cols-2 gap-6';

		incidents.forEach((incident) => {
			let media = incident.MediaURL;
			let incidentPictures = JSON.parse(media);

			let incidentCard = document.createElement('div');
			incidentCard.className = 'bg-white shadow-md rounded-lg p-4 border border-gray-200';
			incidentCard.setAttribute('data-id', incident.IncidentID);

			incidentCard.innerHTML = `
                <h1 class="text-lg font-semibold text-gray-800">${incident.Description}</h1>
                <h2 class="text-sm text-gray-600 mt-1">Happening in: 
                    <span class="font-medium text-black">${incident.Location}</span>
                </h2>
                <div class="mt-3">
                    <img class="w-full h-48 object-cover rounded-lg shadow-md" src="${incidentPictures}" alt="incident-media">
                </div>
                <button class="mt-3 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 delete-btn" data-id="${incident.IncidentId}">
                    🗑 Delete
                </button>
            `;

			gridContainer.appendChild(incidentCard);
		});

		contentArea.appendChild(gridContainer);
		attachDeleteListeners();
	} catch (error) {
		console.error('Error fetching incidents:', error);
	}
}

async function deleteIncident(incidentId) {
	try {
		let response = await fetch(`http://localhost:5000/incidents/incident/${incidentId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (response.ok) {
			console.log(`Incident ${incidentId} deleted successfully.`);
			document.querySelector(`div[data-id='${incidentId}']`).remove(); // Remove from UI
		} else {
			let errorMessage = await response.text();
			console.error('Failed to delete incident:', errorMessage);
		}
	} catch (error) {
		console.error('Error deleting incident:', error);
	}
}

function attachDeleteListeners() {
	document.querySelectorAll('.delete-btn').forEach((button) => {
		button.addEventListener('click', async (e) => {
			const incidentId = e.target.getAttribute('data-id');
			if (confirm('Are you sure you want to delete this incident?')) {
				await deleteIncident(incidentId);
				await getIncidents(); // Refresh the UI
			}
		});
	});
}

getIncidents();
