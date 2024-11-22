//search  fuhction  
function toggleSearch() {
    const searchBox = document.getElementById('search-box');
    searchBox.classList.toggle('d-none');
}
function handleSearch() {
    event.preventDefault();
    const searchValue = document.getElementById('searchInput').value;
    window.location.href = "browse.html?name="+searchValue;
}

// button buat card seasons
function selectFilter(btn) {
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.style.backgroundColor = '#ffffff';
        button.style.color = 'black';
    });
    btn.style.backgroundColor = '#000';
    btn.style.color = 'white';
}

//subs function scrpt
let isSubscribed = false; // Global subscription status

// Toggle subscription status
function toggleSubscription() {
  const btnNavbar = document.getElementById("subscribeBtnNavbar");  // Navbar button
  const btnMain = document.getElementById("subscribeBtn");  // Main form button
  
  if (isSubscribed) {
    alert("You have unsubscribed successfully.");
    btnNavbar.innerText = "Subscribe";  // Change text on navbar button
    btnMain.innerText = "Subscribe";  // Change text on main form button
  } else {
    alert("Thank you for subscribing! We will provide you with the latest fashion updates.!");
    btnNavbar.innerText = "Unsubscribe";  // Change text on navbar button
    btnMain.innerText = "Unsubscribe";  // Change text on main form button
  }
  
  isSubscribed = !isSubscribed;  // Toggle the subscription status
}
