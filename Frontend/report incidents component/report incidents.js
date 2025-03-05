// let location = document.getElementById('incident-location').value;
// let description = document.getElementById('incident-description').value;
// let media = document.getElementById('incident-media').value;

// let cancelIncident = document.getElementById('cancel-incident');
// let reportIncident = document.getElementById('report-incident');

document.getElementById('report-incident').addEventListener('click', async (event) => {
	event.preventDefault();

	// let title = document.getElementById('incident-title').value.trim();
	let description = document.getElementById('incident-description').value.trim();
	let location = document.getElementById('incident-location').value.trim();
	let media = document.getElementById('incident-media').files[0];

	// Ensure required fields are filled
	if (!description || !location) {
		alert('Please fill in all required fields.');
		return;
	}

	let formData = new FormData();

	formData.append('Location', location);
	formData.append('Description', description);
	if (media) {
		formData.append('images', media); // Only append if a file is uploaded
	}

	try {
		let response = await fetch('http://localhost:5000/incidents/new-incident', {
			method: 'POST',
			body: formData,
		});
		console.log('reached here');
		let data = await response.json();

		if (response.ok) {
			alert('Incident reported successfully!');
			document.getElementById('incident-form').reset();
		} else {
			alert(`Error: ${data.message}`);
		}
	} catch (error) {
		console.error('Error:', error);
		alert('Failed to report incident. Please try again.');
	}
});

document.getElementById('cancel-incident').addEventListener('click', () => {
	document.getElementById('incident-form').reset();
});
