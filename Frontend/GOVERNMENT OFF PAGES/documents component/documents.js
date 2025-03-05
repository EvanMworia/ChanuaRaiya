async function fetchDocuments() {
	try {
		let response = await fetch('http://localhost:5000/documents/all-documents');
		if (!response.ok) {
			throw new Error('Failed to fetch documents');
		}
		let documents = await response.json();
		displayDocuments(documents);
	} catch (error) {
		console.error('Error:', error);
		document.getElementById('documents-container').innerHTML = `
            <p class="text-red-500">Failed to load documents.</p>`;
	}
}

function displayDocuments(documents) {
	let container = document.getElementById('documents-container');
	container.innerHTML = ''; // Clear previous content

	documents.forEach((doc) => {
		let documentCard = `
            <div class="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                <!-- Document Title -->
                <h2 class="text-lg font-semibold text-gray-800">${doc.Title}</h2>

                <!-- Document Description -->
                <p class="text-sm text-gray-600 mt-1">${doc.Description}</p>

                <!-- View/Download Button -->
                <div class="mt-4">
                    <a href="${JSON.parse(doc.DocumentURL)}" target="_blank">
                        <button class="bg-[#006B1A] text-white px-4 py-2 rounded hover:bg-green-700 transition">
                            View Document
                        </button>
                    </a>
                </div>
            </div>
        `;

		container.innerHTML += documentCard;
	});
}

// Fetch documents when the page loads
fetchDocuments();
