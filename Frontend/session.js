document.addEventListener('DOMContentLoaded', () => {
	updateUserInfo(); // Call this function when the page loads
	document.getElementById('logout-btn').addEventListener('click', logoutUser);
});

// FUNCTION TO UPDATE USER ROLE & EMAIL IN THE UI
function updateUserInfo() {
	const token = localStorage.getItem('token');
	if (!token) return;

	const decoded = parseJwt(token);
	if (!decoded || !decoded.role || !decoded.email) return;

	// Insert the values into the HTML
	document.getElementById('user-role').textContent = decoded.role;
	document.getElementById('user-email').textContent = decoded.email;
}

// FUNCTION TO PARSE JWT TOKEN
function parseJwt(token) {
	try {
		const base64Url = token.split('.')[1]; // Extract payload
		const jsonPayload = atob(base64Url);
		return JSON.parse(jsonPayload) || {}; // Always return an object
	} catch (error) {
		console.error('Invalid token:', error);
		return {}; // Return an empty object to prevent errors
	}
}

function logoutUser() {
	localStorage.removeItem('token'); // Clear stored token
	// showMessage('Logged out successfully!', 'success');

	setTimeout(() => {
		window.location.href = `/Frontend/auth%20component/login.html`; // Redirect to login page
	}, 1500);
}
