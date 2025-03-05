const contentArea = document.querySelector('main');

// Function to create a topic
async function createTopic(event) {
	event.preventDefault();

	const topicData = {
		Title: document.getElementById('topic-title').value,
		Context: document.getElementById('topic-context').value,
	};

	try {
		const response = await fetch('http://localhost:5000/topics/create-topic', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(topicData),
		});

		if (!response.ok) throw new Error('Failed to create topic');

		// Refresh topic list after adding
		getTopics();
		document.getElementById('topic-form').reset();
	} catch (error) {
		console.error('Error creating topic:', error);
	}
}

// Function to fetch and display topics
async function getTopics() {
	try {
		const response = await fetch('http://localhost:5000/topics/get-all-topics');
		const topics = await response.json();

		let topicList = topics
			.map(
				(topic) => `
            <div class="p-4 bg-white border rounded-lg shadow-md flex justify-between items-center">
                <div>
                    <h3 class="text-lg font-semibold">${topic.Title}</h3>
                    <p class="text-sm text-gray-600">${topic.Context}</p>
                </div>
                <button class="delete-btn bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700" data-id="${topic.TopicId}">
                    Delete
                </button>
            </div>`
			)
			.join('');

		document.getElementById('topic-list').innerHTML = topicList;

		// Attach event listeners to delete buttons
		document.querySelectorAll('.delete-btn').forEach((button) => {
			button.addEventListener('click', async (e) => {
				const topicId = e.target.dataset.id;
				await deleteTopic(topicId);
			});
		});
	} catch (error) {
		console.error('Error fetching topics:', error);
	}
}

// Function to delete a topic
async function deleteTopic(topicId) {
	try {
		const response = await fetch(`http://localhost:5000/topics/delete-topic/${topicId}`, {
			method: 'DELETE',
		});

		if (!response.ok) throw new Error('Failed to delete topic');

		// Refresh topic list after deletion
		getTopics();
	} catch (error) {
		console.error('Error deleting topic:', error);
	}
}

// Inject form and topic list into the admin panel
contentArea.innerHTML = `
    <h1 class="text-2xl font-semibold mb-4">Admin Sikika</h1>
    <form id="topic-form" class="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 class="text-lg font-semibold mb-2">Create a Topic</h2>
        <input type="text" id="topic-title" placeholder="Enter topic title" class="w-full border p-2 rounded mb-2" required>
        <textarea id="topic-context" placeholder="Enter topic context" class="w-full border p-2 rounded mb-2" required></textarea>
        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Create Topic</button>
    </form>
    <div id="topic-list" class="space-y-4"></div>
`;

// Attach event listener to form
document.getElementById('topic-form').addEventListener('submit', createTopic);

// Load topics on page load
getTopics();
