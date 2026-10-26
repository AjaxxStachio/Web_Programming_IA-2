/*
File Name:      validation.js
Student Name:   Ajani Scarlett
Student ID:     2302995
Assignment:     2302995_IA#2_AY26-27
Due Date:       26/10/2026
*/


document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registrationForm");
    const submitBtn = document.getElementById("submitBtn");
    const fileInput = document.getElementById("avatar");
    const nameInput = document.getElementById("fullName");
    const emailInput = document.getElementById("email");
    const githubInput = document.getElementById("github");
    const avatarError = document.getElementById("avatarError");
    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const githubError = document.getElementById("githubError");
    const dropArea = document.getElementById("drop-area");
    const imagePreview = document.getElementById("image-preview");
    const uploadPrompt = document.getElementById("upload-prompt");
    const imageActions = document.getElementById("image-actions");
    const btnChange = document.getElementById("btn-change");
    const btnRemove = document.getElementById("btn-remove");

    let isAvatarValid = false;
    let isNameValid = false;
    let isEmailValid = false;
    let isGithubValid = false;
  
    dropArea.addEventListener("click", (e) => {
        if (e.target.id !== 'btn-change' && e.target.id !== 'btn-remove') {
            fileInput.click();
        }
    });

    btnChange.addEventListener("click", (e) => {
        e.stopPropagation(); 
        fileInput.click();
    });

    btnRemove.addEventListener("click", (e) => {
        e.stopPropagation(); 
        resetAvatar();
    });

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.add('drag-active'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.remove('drag-active'), false);
    });

    dropArea.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            fileInput.dispatchEvent(new Event('change')); // Trigger validation
        }
    });

    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
    
        avatarError.textContent = ""; 
        imagePreview.classList.remove("active");
        uploadPrompt.style.display = "flex";
        imageActions.style.display = "none";
        isAvatarValid = false;

        if (!file) {
            avatarError.textContent = "Please upload an avatar.";
            return updateButton();
        }

        const validTypes = ["image/jpeg", "image/png"];
        if (!validTypes.includes(file.type)) {
            avatarError.textContent = "File must be JPG or PNG.";
            return updateButton();
        }

        if (file.size > 500 * 1024) {
            avatarError.textContent = "File too large. Please upload a photo under 500KB.";
            return updateButton();
        }
   
        isAvatarValid = true;
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;     
            imagePreview.classList.add("active");   
            uploadPrompt.style.display = "none";    
            imageActions.style.display = "flex";  
        };
        reader.readAsDataURL(file); 
        
        updateButton();
    });

    function resetAvatar() {
        fileInput.value = "";
        isAvatarValid = false;
        avatarError.textContent = "";
        
        imagePreview.src = "";
        imagePreview.classList.remove("active");
        uploadPrompt.style.display = "flex";
        imageActions.style.display = "none";
        
        updateButton();
    }

    nameInput.addEventListener("input", () => {
        const name = nameInput.value.trim();
        nameError.textContent = "";

        if (name === "") {
            nameError.textContent = "Full name is required.";
            isNameValid = false;
        } else {
            isNameValid = true;
        }
        updateButton();
    });

    emailInput.addEventListener("input", () => {
        const email = emailInput.value.trim();
        emailError.textContent = "";

        if (email === "") {
            emailError.textContent = "Email address is required.";
            isEmailValid = false;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(email)) {
                isEmailValid = true;
            } else {
                emailError.textContent = "Please enter a valid email address.";
                isEmailValid = false;
            }
        }
        updateButton();
    });
  
    githubInput.addEventListener("input", () => {
        const github = githubInput.value.trim();
        githubError.textContent = "";

        if (github === "") {
            githubError.textContent = "GitHub username is required.";
            isGithubValid = false;
        } else if (github.charAt(0) !== "@") {
            githubError.textContent = "GitHub username must start with @.";
            isGithubValid = false;
        } else {
            isGithubValid = true;
        }
        updateButton();
    });

    function updateButton() {
        submitBtn.disabled = !(isAvatarValid && isNameValid && isEmailValid && isGithubValid);
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault(); 

        if (!(isAvatarValid && isNameValid && isEmailValid && isGithubValid)) return;

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const userData = {
                fullName: nameInput.value.trim(),
                email: emailInput.value.trim(),
                github: githubInput.value.trim(),
                avatarData: e.target.result 
            };

            localStorage.setItem("codingConfUser", JSON.stringify(userData));
            window.location.href = "ticket.html";
        };

        reader.readAsDataURL(file);
    });
});