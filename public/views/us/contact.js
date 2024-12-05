document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert("Thank you for submitting the form!");
});

function toggleSearch() {
    const searchBox = document.getElementById('search-box');
    searchBox.classList.toggle('d-none');
}

//newsletter
const submitButton = document.getElementById('submitBtn');
const emailInput = document.getElementById('emailInput');
const responseMessage = document.getElementById('responseMessage');
const errorMessage = document.getElementById('errorMessage');

submitButton.addEventListener('click', function() {
    const email = emailInput.value;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (emailPattern.test(email)) {
        responseMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        emailInput.value = '';  
    } else {
        errorMessage.style.display = 'block';
        responseMessage.style.display = 'none';
    }
});
