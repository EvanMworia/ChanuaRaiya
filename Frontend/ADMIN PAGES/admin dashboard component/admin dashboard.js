const contentArea = document.querySelector('main');

async function getUsers() {
	try {
		let response = await fetch('http://localhost:5000/users/all-users');
		let users = await response.json();

		contentArea.innerHTML = `
            <h1 class="text-2xl font-semibold mb-4">Admin Dashboard - Users</h1>
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="px-4 py-2 border">User ID</th>
                            <th class="px-4 py-2 border">Name</th>
                            <th class="px-4 py-2 border">Email</th>
                            <th class="px-4 py-2 border">Role</th>
                            <th class="px-4 py-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="users-table-body">
                    </tbody>
                </table>
            </div>
        `;

		let tableBody = document.getElementById('users-table-body');
		users.forEach((user) => {
			let row = document.createElement('tr');
			row.className = 'border-t';

			row.innerHTML = `
                <td class="px-4 py-2 border">${user.UserId}</td>
                <td class="px-4 py-2 border">${user.Username}</td>
                <td class="px-4 py-2 border">${user.Email}</td>
                <td class="px-4 py-2 border">
                    <select class="role-select px-2 py-1 border rounded" data-id="${user.UserId}">
                        <option value="Admin" ${user.Role === 'Admin' ? 'selected' : ''}>Admin</option>
                        <option value="User" ${user.Role === 'User' ? 'selected' : ''}>User</option>
                        <option value="Official" ${user.Role === 'Official' ? 'selected' : ''}>Official</option>
                    </select>
                </td>
                <td class="px-4 py-2 border flex gap-2">
                    <button class="update-btn bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700" data-id="${
						user.UserId
					}">
                        Update
                    </button>
                    <button class="delete-btn bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700" data-id="${
						user.UserId
					}">
                        Delete
                    </button>
                </td>
            `;

			tableBody.appendChild(row);
		});

		// Attach event listeners to Update buttons
		document.querySelectorAll('.update-btn').forEach((button) => {
			button.addEventListener('click', async (e) => {
				let userId = e.target.dataset.id;
				let selectedRole = document.querySelector(`select[data-id='${userId}']`).value;

				try {
					let response = await fetch(`http://localhost:5000/users/update/${userId}`, {
						method: 'PATCH',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ Role: selectedRole }),
					});

					if (!response.ok) throw new Error('Failed to update role');

					alert(`User ${userId} role updated to: ${selectedRole}`);
				} catch (error) {
					console.error('Error updating user:', error);
					alert('Error updating user role.');
				}
			});
		});

		// Attach event listeners to Delete buttons
		document.querySelectorAll('.delete-btn').forEach((button) => {
			button.addEventListener('click', async (e) => {
				let userId = e.target.dataset.id;

				if (!confirm(`Are you sure you want to delete user ${userId}?`)) return;

				try {
					let response = await fetch(`http://localhost:5000/users/delete/${userId}`, {
						method: 'DELETE',
					});

					if (!response.ok) throw new Error('Failed to delete user');

					alert(`User ${userId} has been deleted.`);
					getUsers(); // Refresh the table
				} catch (error) {
					console.error('Error deleting user:', error);
					alert('Error deleting user.');
				}
			});
		});
	} catch (error) {
		console.error('Error fetching users:', error);
	}
}

getUsers();
