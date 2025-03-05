const pollForm = document.getElementById('pollForm');
const pollList = document.getElementById('pollList');
const optionModal = document.getElementById('optionModal');
const optionForm = document.getElementById('optionForm');
const optionsList = document.getElementById('optionsList');
const closeModal = document.getElementById('closeModal');

let selectedPollId = null; // Track the selected poll

// **1. Create Poll**
pollForm.addEventListener('submit', async function (e) {
	e.preventDefault();

	const question = document.getElementById('pollQuestion').value.trim();
	if (!question) return alert('Poll question cannot be empty!');

	try {
		const response = await fetch('http://localhost:5000/polls/create-poll', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ Question: question }),
		});

		if (!response.ok) throw new Error('Failed to create poll');

		const pollData = await response.json();
		addPollToList(pollData.PollId, pollData.Question);

		document.getElementById('pollQuestion').value = ''; // Clear input
	} catch (error) {
		console.error('Error creating poll:', error);
	}
});

// **2. Fetch & Display Polls**
async function fetchPolls() {
	try {
		const response = await fetch('http://localhost:5000/polls/all-polls');
		const polls = await response.json();
		pollList.innerHTML = ''; // Clear list

		polls.forEach((poll) => addPollToList(poll.PollId, poll.Question));
	} catch (error) {
		console.error('Error fetching polls:', error);
	}
}

// **3. Add Poll to List**
function addPollToList(pollId, question) {
	const li = document.createElement('li');
	li.className = 'flex justify-between items-center p-3 bg-gray-100 rounded-md shadow';
	li.innerHTML = `
        <span class="text-lg">${question}</span>
        <button class="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 add-option-btn" data-id="${pollId}">
            Add Options
        </button>
    `;
	pollList.appendChild(li);

	li.querySelector('.add-option-btn').addEventListener('click', () => openOptionModal(pollId));
}

// **4. Open Option Modal**
function openOptionModal(pollId) {
	selectedPollId = pollId; // Store selected poll ID
	optionsList.innerHTML = ''; // Clear options list
	optionModal.classList.remove('hidden');
}

// **5. Add Option to Poll**
optionForm.addEventListener('submit', async function (e) {
	e.preventDefault();

	const optionText = document.getElementById('optionText').value.trim();
	if (!optionText) return alert('Option cannot be empty!');
	if (!selectedPollId) return alert('No poll selected!');

	try {
		const response = await fetch('http://localhost:5000/polls/add-poll-option', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ PollId: selectedPollId, OptionText: optionText }),
		});

		if (!response.ok) throw new Error('Failed to add option');

		const li = document.createElement('li');
		li.textContent = optionText;
		li.className = 'p-2 bg-gray-200 rounded-md shadow';
		optionsList.appendChild(li);

		document.getElementById('optionText').value = ''; // Clear input
	} catch (error) {
		console.error('Error adding option:', error);
	}
});

// **6. Close Modal**
closeModal.addEventListener('click', () => {
	optionModal.classList.add('hidden');
});

// Fetch polls on load
fetchPolls();
