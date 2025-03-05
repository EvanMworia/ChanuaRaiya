document.addEventListener('DOMContentLoaded', async function () {
	try {
		// Fetch total incidents
		let incidentsRes = await fetch('http://localhost:5000/incidents/all-incidents');
		let incidents = await incidentsRes.json();
		document.getElementById('total-incidents').textContent = incidents.length;

		// Fetch total documents
		let documentsRes = await fetch('http://localhost:5000/documents/all-documents');
		let documents = await documentsRes.json();
		document.getElementById('total-documents').textContent = documents.length;

		// Fetch total polls
		let pollsRes = await fetch('http://localhost:5000/polls/all-polls');
		let polls = await pollsRes.json();
		document.getElementById('total-polls').textContent = polls.length;

		// Fetch total government officials
		let usersRes = await fetch('http://localhost:5000/users/all-users');
		let users = await usersRes.json();
		let officialsCount = users.filter((user) => user.Role === 'Official').length;
		document.getElementById('total-officials').textContent = officialsCount;

		// Fetch most famous poll
		let pollRes = await fetch('http://localhost:5000/polls/results/27107f81-ec73-46ba-a907-df8fc1e01c1f');
		let pollDetail = await fetch('http://localhost:5000/polls/poll/27107f81-ec73-46ba-a907-df8fc1e01c1f');

		let pollData = await pollRes.json();
		let pollInfo = await pollDetail.json();
		console.log(pollInfo[0]);
		document.getElementById(
			'famous-poll'
		).textContent = `Poll ID: ${pollInfo[0].Question} (${pollData.TotalVotes} votes)`;

		// Display poll results in a chart
		let ctx = document.getElementById('pollChart').getContext('2d');
		new Chart(ctx, {
			type: 'pie',
			data: {
				labels: pollData.Results.map((option) => option.OptionText),
				datasets: [
					{
						data: pollData.Results.map((option) => option.VoteCount),
						backgroundColor: ['#4CAF50', '#FF5733'],
					},
				],
			},
		});
	} catch (error) {
		console.error('Error fetching dashboard data:', error);
	}
});
