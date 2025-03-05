document.addEventListener('DOMContentLoaded', () => {
	const signupForm = document.getElementById('signup-form');
	const loginForm = document.getElementById('login-form');

	if (signupForm) signupForm.addEventListener('submit', handleSignup);
	if (loginForm) loginForm.addEventListener('submit', handleLogin);
});

// Function to display messages
function showMessage(message, type = 'success') {
	const messageBox = document.getElementById('message-box');
	if (!messageBox) return;

	messageBox.textContent = message;
	messageBox.className = `fixed top-5 right-5 px-4 py-2 rounded shadow-md text-white transition-opacity duration-500 ${
		type === 'error' ? 'bg-red-600' : 'bg-green-600'
	}`;

	messageBox.style.opacity = '1';
	setTimeout(() => {
		messageBox.style.opacity = '0';
	}, 3000); // Hide after 3 seconds
}

// SIGNUP HANDLER
async function handleSignup(event) {
	event.preventDefault();

	const username = document.getElementById('username').value.trim();
	const email = document.getElementById('email').value.trim();
	const password = document.getElementById('password').value.trim();

	if (!username || !email || !password) return showMessage('All fields are required.', 'error');

	try {
		const res = await fetch('http://localhost:5000/users/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ Username: username, Email: email, Password: password }),
		});

		if (!res.ok) throw new Error((await res.json()).message || 'Signup failed');

		showMessage('Signup successful! Redirecting...', 'success');
		setTimeout(() => (window.location.href = './login.html'), 1500);
	} catch (err) {
		showMessage(err.message, 'error');
	}
}

// LOGIN HANDLER
async function handleLogin(event) {
	event.preventDefault();

	const email = document.getElementById('email').value.trim();
	const password = document.getElementById('password').value.trim();

	if (!email || !password) return showMessage('All fields are required.', 'error');

	try {
		const res = await fetch('http://localhost:5000/users/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ Email: email, Password: password }),
		});

		if (!res.ok) throw new Error((await res.json()).message || 'Login failed');

		const { token } = await res.json();
		localStorage.setItem('token', token);

		showMessage('Login successful! Redirecting...', 'success');

		// Decode the token and determine the role
		const decoded = parseJwt(token);

		// if (decoded.role === 'Admin') {
		// 	window.location.href = '../ADMIN PAGES/admin dashboard component/admin dashboard.html';
		// } else if (decoded.role == 'Official') {
		// 	window.location.href = '../GOVERNMENT OFF PAGES/dashboard component/dashboard.html';
		// } else {
		// 	window.location.href = '../dashboard component/dashboard.html';
		// }
	} catch (err) {
		showMessage(err.message, 'error');
	}
}

// FUNCTION TO PARSE JWT TOKEN
function parseJwt(token) {
	try {
		const base64Url = token.split('.')[1]; // Extract payload
		const jsonPayload = atob(base64Url);
		return JSON.parse(jsonPayload) || {}; // Ensure we always return an object
	} catch (error) {
		console.error('Invalid token:', error);
		return {}; // Return an empty object to prevent errors
	}
}

// CHECK AUTH FUNCTION
function checkAuth() {
	if (!localStorage.getItem('token')) {
		showMessage('Please log in first.', 'error');
		setTimeout(() => (window.location.href = './login.html'), 1500);
	}
}
