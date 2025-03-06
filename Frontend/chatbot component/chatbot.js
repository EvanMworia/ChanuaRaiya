document.addEventListener('DOMContentLoaded', function () {
	const chatContainer = document.getElementById('chat-container');
	const fileInput = document.getElementById('fileInput');
	const sendButton = document.getElementById('sendButton');

	sendButton.addEventListener('click', async () => {
		const file = fileInput.files[0];

		if (!file) {
			appendMessage('bot', '⚠️ Please select a document to upload.');
			return;
		}

		appendMessage('user', `📎 ${file.name}`);

		const formData = new FormData();
		formData.append('file', file);

		try {
			appendMessage('bot', '⏳ Summarizing your document, please wait...');

			const response = await fetch('http://localhost:5000/api/summarize', {
				method: 'POST',
				body: formData,
			});

			const data = await response.json();

			if (response.ok) {
				appendMessage('bot', `📌 **Summary:** ${data.summary}`);
			} else {
				appendMessage('bot', `❌ Error: ${data.error || 'Failed to summarize.'}`);
			}
		} catch (error) {
			appendMessage('bot', '❌ An error occurred. Please try again.');
			console.error('Upload error:', error);
		}
	});

	function appendMessage(sender, message) {
		const msgDiv = document.createElement('div');
		msgDiv.className =
			sender === 'bot'
				? 'bot-message bg-gray-200 p-3 rounded-lg w-fit'
				: 'user-message bg-[#006B1A] text-white p-3 rounded-lg self-end w-fit';
		msgDiv.innerHTML = message;

		chatContainer.appendChild(msgDiv);
		chatContainer.scrollTop = chatContainer.scrollHeight;
	}
});
