let posts = [];

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('fetchButton').addEventListener('click', toggleTable);
    document.getElementById('searchButton').addEventListener('click', fetchPostById);
});

async function toggleTable() {
    const tableContainer = document.getElementById('tableContainer');
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/');
        if (!response.ok) throw new Error('Failed to fetch posts');
        posts = await response.json();
        displayTable(posts);
    } catch (error) {
        showError(error.message);
    }
}

function displayTable(posts) {
    const tableContainer = document.getElementById('tableContainer');
    let tableHTML = '<table><thead><tr><th>ID</th><th>Title</th><th>Body</th></tr></thead><tbody>';
    posts.forEach(post => {
        tableHTML += `<tr>
            <td>${post.id}</td>
            <td contenteditable="true">${post.title}</td>
            <td contenteditable="true">${post.body}</td>
        </tr>`;
    });
    tableHTML += '</tbody></table>';
    tableContainer.innerHTML = tableHTML;

    document.querySelectorAll('[contenteditable="true"]').forEach(cell => {
        cell.addEventListener('input', saveTableData);
    });
}

function saveTableData(event) {
    const cell = event.target;
    const postId = cell.closest('tr').querySelector('td:first-child').innerText;
    const field = cell.cellIndex === 1 ? 'title' : 'body';
    const newValue = cell.innerText;

    const postIndex = posts.findIndex(post => post.id == postId);
    if (postIndex !== -1) {
        posts[postIndex][field] = newValue;
    }
}

function fetchPostById() {
    const postId = document.getElementById('postId').value;
    const postDetail = document.getElementById('postDetail');

    // Find the post with the given ID
    const post = posts.find(post => post.id == postId);
    
    // Display the post details or a not found message
    if (post) {
        postDetail.innerHTML = `<h2>Post Details</h2>
            <p>ID: ${post.id}</p>
            <p>Title: ${post.title}</p>
            <p>Body: ${post.body}</p>`;
    } else {
        postDetail.innerHTML = '<p>No post found with this ID.</p>';
    }
}

function showError(message) {
    document.getElementById('tableContainer').innerHTML = `<p>Error: ${message}</p>`;
}