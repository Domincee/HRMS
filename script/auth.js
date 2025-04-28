document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const themeToggle = document.getElementById('themeToggle');
    const moonIcon = document.getElementById('moonIcon');
    const sunIcon = document.getElementById('sunIcon');

    // Function to update icon visibility based on theme
    function updateIcons() {
        if (document.body.classList.contains('dark')) {
            moonIcon.classList.remove('hidden');
            sunIcon.classList.add('hidden');
        } else {
            moonIcon.classList.add('hidden');
            sunIcon.classList.remove('hidden');
        }
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
    updateIcons(); // Important: set correct icon on page load!

    // Theme toggle click event
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark');
        
        // Save the theme
        if (document.body.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
        
        // Update icons after toggling
        updateIcons();
    });
});


function login() {
    const companyName = document.getElementById('companyName').value.trim();
    const password = document.getElementById('password').value;

    let accounts = JSON.parse(localStorage.getItem('accounts')) || [];

    // Find account by company name and password
    let account = accounts.find(acc => acc.company === companyName && acc.password === password);

    if (account) {
      // Store logged-in user data in LocalStorage
      localStorage.setItem('loggedInCompany', JSON.stringify(account));

      // Redirect to hr.html
      window.location.href = "dashboard.html";
    } else {
        showAlert('Invalid company name or password');
    }
  }

  function createAccount() {
    const companyName = document.getElementById('companyName').value.trim();
    const password = document.getElementById('password').value;

    let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    let existingAccount = accounts.find(acc => acc.company === companyName);

    if (existingAccount) {
        showAlert('Company already exists. Please use a different name.');
    } else {
        if (companyName && password) {
            let newAccount = { company: companyName, password: password };
            accounts.push(newAccount);
            localStorage.setItem('accounts', JSON.stringify(accounts));

            localStorage.setItem('loggedInCompany', JSON.stringify(newAccount));
            window.location.href = "dashboard.html";
        } else {
            showAlert('Please fill out all fields.');
        }
    }
}

// Function to show the custom alert
function showAlert(message) {
    const alertBox = document.getElementById('customAlert');
    const alertOverlay = document.getElementById('alertOverlay');
    const alertMessage = document.getElementById('alertMessage');
    alertMessage.textContent = message;
    alertBox.classList.add('show');
    alertOverlay.classList.add('show');
    alertBox.classList.remove('hidden');
    alertOverlay.classList.remove('hidden');
}

function closeAlert() {
    const alertBox = document.getElementById('customAlert');
    const alertOverlay = document.getElementById('alertOverlay');
    alertBox.classList.remove('show');
    alertOverlay.classList.remove('show');
    setTimeout(() => {
        alertBox.classList.add('hidden');
        alertOverlay.classList.add('hidden');
    }, 300); // Wait for fade-out animation
}