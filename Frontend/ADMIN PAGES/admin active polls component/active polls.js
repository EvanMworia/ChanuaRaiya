document.addEventListener('DOMContentLoaded', () => {
	const pollsContainer = document.createElement('div');
	pollsContainer.className = 'mt-6 space-y-4'; // Tailwind styling
	document.querySelector('main').appendChild(pollsContainer);

	// Fetch and display polls
	async function fetchPolls() {
		try {
			const response = await fetch('http://localhost:5000/polls/all-polls');
			if (!response.ok) throw new Error('Failed to fetch polls');
			const polls = await response.json();
			renderPolls(polls);
		} catch (error) {
			console.error('Error fetching polls:', error);
		}
	}

	// Render polls with delete buttons
	function renderPolls(polls) {
		pollsContainer.innerHTML = ''; // Clear previous list
		if (polls.length === 0) {
			pollsContainer.innerHTML = `<p class="text-gray-600">No active polls found.</p>`;
			return;
		}

		polls.forEach((poll) => {
			const pollElement = document.createElement('div');
			pollElement.className = 'flex justify-between items-center p-4 bg-white shadow-md rounded-lg';

			pollElement.innerHTML = `
				<div>
					<h3 class="text-lg font-semibold text-gray-800">${poll.Question}</h3>
					<p class="text-sm text-gray-500">${poll.PollId}</p>
				</div>
				<button 
					class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition" 
					data-id="${poll.PollId}"
				>
					Delete
				</button>
			`;

			// Attach delete event listener
			pollElement.querySelector('button').addEventListener('click', async (e) => {
				const pollId = e.target.getAttribute('data-id');
				await deletePoll(pollId);
			});

			pollsContainer.appendChild(pollElement);
		});
	}

	// Delete poll function
	async function deletePoll(pollId) {
		try {
			const response = await fetch(`http://localhost:5000/polls/poll/${pollId}`, {
				method: 'DELETE',
			});
			if (!response.ok) throw new Error('Failed to delete poll');

			// Refresh polls after deletion
			await fetchPolls();
		} catch (error) {
			console.error('Error deleting poll:', error);
		}
	}

	// Initial fetch
	fetchPolls();
});
