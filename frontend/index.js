import { backend } from "declarations/backend";

let quill;
const modal = document.getElementById("postModal");
const newPostBtn = document.getElementById("newPostBtn");
const closeBtn = document.getElementsByClassName("close")[0];
const postForm = document.getElementById("postForm");
const loadingSpinner = document.getElementById("loadingSpinner");

// Initialize Quill
document.addEventListener('DOMContentLoaded', () => {
    quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'header': 1 }, { 'header': 2 }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                ['link', 'image'],
                ['clean']
            ]
        }
    });
    
    loadPosts();
});

// Modal controls
newPostBtn.onclick = () => modal.style.display = "block";
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

// Form submission
postForm.onsubmit = async (e) => {
    e.preventDefault();
    
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const content = quill.root.innerHTML;

    if (!title || !author || !content) {
        alert("Please fill in all fields");
        return;
    }

    showLoading();

    try {
        await backend.createPost(title, content, author);
        modal.style.display = "none";
        postForm.reset();
        quill.setContents([]);
        await loadPosts();
    } catch (error) {
        console.error("Error creating post:", error);
        alert("Failed to create post. Please try again.");
    } finally {
        hideLoading();
    }
};

async function loadPosts() {
    showLoading();
    try {
        const posts = await backend.getPosts();
        displayPosts(posts);
    } catch (error) {
        console.error("Error loading posts:", error);
        alert("Failed to load posts. Please refresh the page.");
    } finally {
        hideLoading();
    }
}

function displayPosts(posts) {
    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = "";

    posts.forEach(post => {
        const postElement = document.createElement("article");
        postElement.className = "post";
        
        const date = new Date(Number(post.timestamp));
        const formattedDate = date.toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        postElement.innerHTML = `
            <h2 class="post-title">${post.title}</h2>
            <div class="post-meta">By ${post.author} • ${formattedDate}</div>
            <div class="post-content">${post.content}</div>
        `;
        
        postsContainer.appendChild(postElement);
    });
}

function showLoading() {
    loadingSpinner.style.display = "block";
}

function hideLoading() {
    loadingSpinner.style.display = "none";
}
