const contentArea = document.querySelector('#content');

async function getIncidents() {
	let response = await fetch('http://localhost:5000/incidents/all-incidents');
	let incidents = await response.json();
	console.log(incidents);

	incidents.forEach((incident) => {
		let media = incident.MediaURL;
		let incidentPictures = JSON.parse(media);
		console.log('media url for this incident', media);
		contentArea.innerHTML += `
    <div class="bg-white shadow-md rounded-lg p-4 w-full max-w-lg mx-auto mt-4 border border-gray-200">
        <!-- Incident Description -->
        <h1 class="text-lg font-semibold text-gray-800">${incident.Description}</h1>

        <!-- Incident Location -->
        <h2 class="text-sm text-gray-600 mt-1">Happening in: 
            <span class="font-medium text-black">${incident.Location}</span>
        </h2>

        <!-- Incident Media -->
        <div class="mt-3">
            <img class="w-full h-48 object-cover rounded-lg shadow-md" src="${incidentPictures}" alt="incident-media">
        </div>
    </div>`;
	});
}
getIncidents();
