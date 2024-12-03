const postsContainer = document.getElementById("posts");
const postForm = document.getElementById("postForm");
const bannedWords = ["kontol", "bangsat", "tolol", "tai"];

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(function(section) {
        section.style.display = 'none';
        section.classList.remove('hero-section', 'd-flex', 'align-items-center', 'text-left', 'mb-3');
    });
    const activeSections = document.querySelectorAll(`#${sectionId}`);
    activeSections.forEach(function(section) {
        section.style.display = 'block';
        section.classList.add('hero-section', 'd-flex', 'align-items-center', 'text-left', 'mb-3');
    });
}

function containsBannedWords(content) {
    for (const word of bannedWords) {
        if (content.toLowerCase().includes(word.toLowerCase())) {
            return true;
        }
    }
    return false;
}

async function fetchPosts() {
    try {
        const response = await fetch("/api/posts");
        const posts = await response.json();
        postsContainer.innerHTML = "";
        posts.forEach((post) => {
            const postElement = document.createElement("div");
            postElement.className = "card mb-3";
            postElement.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${post.author}</h5>
                    <p class="card-text">${post.content}</p>
                    <small class="text-muted">${post.date}</small>
                </div>
            `;
            postsContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}

function checkPostStatus() {
    const hasPosted = localStorage.getItem("hasPosted");
    if (hasPosted) {
        postForm.style.display = "none";
        const notice = document.createElement("p");
        notice.className = "alert alert-warning mt-3";
        notice.textContent = "Km dah bikin satu komentar. Cm satu komentar diperbolehkan per perangkat :p";
        postForm.parentElement.appendChild(notice);
    }
}

postForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const author = document.getElementById("author").value;
    const content = document.getElementById("content").value;
    if (containsBannedWords(content)) {
        alert("Konten km mengandung kata-kata terlarang-! Plz kurangin toxic mu.");
        return;
    }
    try {
        const response = await fetch("/api/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ author, content }),
        });
        if (response.ok) {
            localStorage.setItem("hasPosted", "true");
            postForm.reset();
            fetchPosts();
            checkPostStatus();
        } else {
            console.error("Failed to add post");
        }
    } catch (error) {
        console.error("Error submitting post:", error);
    }
});

fetchPosts();
checkPostStatus();
