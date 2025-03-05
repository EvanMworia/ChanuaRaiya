async function fetchPolls() {
	try {
		let response = await fetch('http://localhost:5000/polls/all-polls');
		if (!response.ok) {
			throw new Error('Failed to fetch polls');
		}
		let polls = await response.json();

		console.log('Fetched Polls:', polls); // Debugging

		// Ensure response is an array
		if (!Array.isArray(polls)) {
			throw new Error('Invalid response format: Expected an array');
		}

		// Select the main container and clear old polls
		const pollContainer = document.getElementById('polls-container');
		pollContainer.innerHTML = ''; // Clear previous content

		// Fetch options for each poll
		polls.forEach((poll) => {
			loadPoll(poll, pollContainer);
		});
	} catch (error) {
		console.error('Error:', error);
		document.getElementById('polls-container').innerHTML = `<p class="text-red-500">Failed to load polls.</p>`;
	}
}

async function loadPoll(poll, container) {
	try {
		// Fetch poll options using the poll ID
		const response = await fetch(`http://localhost:5000/polls/${poll.PollId}`);
		if (!response.ok) {
			throw new Error(`Failed to load options for poll ID: ${poll.PollId}`);
		}

		const pollData = await response.json();
		console.log(`Poll Data for ${poll.PollId}:`, pollData); // Debugging

		// Ensure pollData.Options exists
		if (!pollData.Options || !Array.isArray(pollData.Options)) {
			console.warn('Poll has no options:', poll);
			return;
		}

		// Create a div for each poll
		const pollDiv = document.createElement('div');
		pollDiv.classList.add('p-4', 'border', 'rounded', 'shadow-md', 'mb-4');
		pollDiv.setAttribute('data-poll-id', poll.PollId); // ✅ Add this line

		// Create poll question heading
		const questionElement = document.createElement('h2');
		questionElement.textContent = pollData.Question;
		questionElement.classList.add('font-bold', 'text-lg', 'mb-2');
		pollDiv.appendChild(questionElement);

		// Create form to hold radio buttons
		const form = document.createElement('form');
		form.id = `poll-form-${poll.PollId}`;

		// Loop through options and create radio buttons
		pollData.Options.forEach((option) => {
			const label = document.createElement('label');
			label.classList.add('block', 'p-2', 'cursor-pointer');

			const radio = document.createElement('input');
			radio.type = 'radio';
			radio.name = `poll-option-${poll.PollId}`; // Unique name per poll
			radio.value = option.OptionId;
			radio.classList.add('mr-2');

			label.appendChild(radio);
			label.appendChild(document.createTextNode(option.OptionText));
			form.appendChild(label);
		});

		// Create submit button
		const submitButton = document.createElement('button');
		submitButton.textContent = 'Vote';
		submitButton.type = 'button';
		submitButton.classList.add('mt-4', 'px-4', 'py-2', 'bg-[#006B1A]', 'text-white', 'rounded');
		submitButton.onclick = () => submitVote(poll.PollId);
		// submitButton.onclick = () => submitVote(pollId);

		form.appendChild(submitButton);
		pollDiv.appendChild(form);

		// Append each poll to the main container
		container.appendChild(pollDiv);
	} catch (error) {
		console.error(`Error loading poll ${poll.PollId}:`, error);
	}
}

// Function to handle vote submission
async function submitVote(pollId) {
	const selectedOption = document.querySelector(`input[name="poll-option-${pollId}"]:checked`);

	if (!selectedOption) {
		alert('Please select an option before voting.');
		return;
	}
	let token = localStorage.getItem('token');
	let payload = token.split('.')[1];
	let decodedPayload = JSON.parse(atob(payload));
	console.log(decodedPayload.userId);
	const voteData = {
		UserId: decodedPayload.userId, // Dummy User ID
		PollId: pollId,
		OptionId: selectedOption.value,
	};

	try {
		const response = await fetch('http://localhost:5000/polls/cast-vote', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(voteData),
		});

		const result = await response.json();
		if (response.ok) {
			alert('Vote submitted successfully!');
			fetchPollResults(pollId); // 🆕 Fetch and show results
		} else {
			alert(`Error: ${result.message || 'Failed to submit vote'}`);
		}
	} catch (error) {
		console.error('Error submitting vote:', error);
		alert('Something went wrong, please try again.');
	}
}
async function fetchPollResults(pollId) {
	try {
		const response = await fetch(`http://localhost:5000/polls/results/${pollId}`);
		if (!response.ok) throw new Error('Failed to fetch poll results');

		const pollResults = await response.json();
		console.log(`Poll Results API Response for ${pollId}:`, pollResults); // Debugging

		// Update to check Results instead of Options
		if (!pollResults.Results || !Array.isArray(pollResults.Results)) {
			console.warn(`No results found for poll ${pollId}.`, pollResults);
			return;
		}

		// Create a div for results
		const resultsDiv = document.createElement('div');
		resultsDiv.classList.add('mt-4', 'p-2', 'bg-gray-100', 'rounded', 'results');

		// Insert poll results
		resultsDiv.innerHTML =
			`<h3 class="font-bold">Results:</h3>` +
			pollResults.Results.map(
				(option) => `<p>${option.OptionText}: <strong>${option.VoteCount || 0} votes</strong></p>`
			).join('');

		// Find the correct poll div
		const pollDiv = document.querySelector(`[data-poll-id="${pollId}"]`);
		if (!pollDiv) {
			console.error(`Poll div not found for ID: ${pollId}`);
			return;
		}

		// Replace or append results
		const existingResults = pollDiv.querySelector('.results');
		if (existingResults) {
			existingResults.replaceWith(resultsDiv);
		} else {
			pollDiv.appendChild(resultsDiv);
		}
	} catch (error) {
		console.error(`Error fetching poll results for ${pollId}:`, error);
	}
}

// Fetch and display all polls
fetchPolls();

//working versuion
//worked fine - poll results in console
