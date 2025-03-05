const topicsList = document.getElementById('topicsList');
const viewsModal = document.getElementById('viewsModal');
const viewsList = document.getElementById('viewsList');
const closeModal = document.getElementById('closeModal');
const addViewModal = document.getElementById('addViewModal');
const viewForm = document.getElementById('viewForm');
const opinionText = document.getElementById('opinionText');
const closeViewModal = document.getElementById('closeViewModal');
let selectedTopicId = null;

// 🔹 Function to Parse JWT & Extract User ID
function parseJwt(token) {
	try {
		const base64Url = token.split('.')[1]; // Extract payload
		const jsonPayload = atob(base64Url);
		return JSON.parse(jsonPayload) || {}; // Always return an object
	} catch (error) {
		console.error('Invalid token:', error);
		return {}; // Return empty object to prevent errors
	}
}

// 🔹 Retrieve Token & User ID from Local Storage
const token = localStorage.getItem('token'); // Ensure token is stored after login
const tokenData = parseJwt(token);
const userId = tokenData.userId || null; // Fallback to null if not found

if (!userId) {
	console.error('User ID not found in token. Ensure you are logged in.');
}

// 🔹 Fetch Topics Created by Admin
async function fetchTopics() {
	try {
		const response = await fetch('http://localhost:5000/topics/get-all-topics');
		const topics = await response.json();
		topicsList.innerHTML = ''; // Clear list
		topics.forEach((topic) => addTopicToList(topic.TopicId, topic.Title, topic.Context));
	} catch (error) {
		console.error('Error fetching topics:', error);
	}
}

// 🔹 Add Topics to the UI
function addTopicToList(topicId, title, context) {
	const li = document.createElement('li');
	li.className = 'p-4 bg-gray-100 rounded-md shadow';
	li.innerHTML = `
        <div class="flex justify-between items-center">
            <span class="text-lg font-semibold">${title}</span>
			
            <div class="space-x-2">
                <button class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 view-opinions" data-id="${topicId}">View Opinions</button>
                <button class="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 add-opinion" data-id="${topicId}">Add Opinion</button>
            </div>
        </div>
		<div>${context}</div>
    `;
	topicsList.appendChild(li);

	li.querySelector('.view-opinions').addEventListener('click', () => openViewsModal(topicId));
	li.querySelector('.add-opinion').addEventListener('click', () => openAddViewModal(topicId));
}

// 🔹 Fetch & Display Opinions for a Topic
async function openViewsModal(topicId) {
	try {
		const response = await fetch(`http://localhost:5000/views/topic-views/${topicId}`);
		const opinions = await response.json();
		viewsList.innerHTML = '';

		if (opinions.length === 0) {
			viewsList.innerHTML = '<li class="text-gray-500">No opinions yet.</li>';
		} else {
			opinions.forEach((opinion) => {
				const li = document.createElement('li');
				li.className = 'p-2 bg-gray-200 rounded-md shadow';
				li.textContent = opinion.Opinion;
				viewsList.appendChild(li);
			});
		}

		viewsModal.classList.remove('hidden');
	} catch (error) {
		console.error('Error fetching opinions:', error);
	}
}

// 🔹 Open Modal for Adding a View
function openAddViewModal(topicId) {
	selectedTopicId = topicId;
	addViewModal.classList.remove('hidden');
}

// 🔹 Add Opinion to a Topic
viewForm.addEventListener('submit', async function (e) {
	e.preventDefault();
	const opinion = opinionText.value.trim();

	if (!opinion) return alert('Opinion cannot be empty!');
	if (!selectedTopicId) return alert('No topic selected!');
	if (!userId) return alert('User ID is missing. Please log in again.');

	try {
		const response = await fetch('http://localhost:5000/views/create-view', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`, // 🔹 Ensure Authorization Header
			},
			body: JSON.stringify({ Opinion: opinion, TopicId: selectedTopicId, UserId: userId }),
		});

		if (!response.ok) throw new Error(`Failed to submit opinion. Server responded with ${response.status}`);

		opinionText.value = ''; // Clear input
		addViewModal.classList.add('hidden');
		alert('Opinion added successfully!');
	} catch (error) {
		console.error('Error adding opinion:', error);
		alert('Could not submit opinion. Check your network or server status.');
	}
});

// 🔹 Close Modals
closeModal.addEventListener('click', () => viewsModal.classList.add('hidden'));
closeViewModal.addEventListener('click', () => addViewModal.classList.add('hidden'));

// 🔹 Fetch topics on page load
fetchTopics();
