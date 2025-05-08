
    // Get all navigation buttons and sections
    const buttons = document.querySelectorAll(".nav-list li");
    const sections = document.querySelectorAll(".board-sections li");

    // Loop through each button and add event listener
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function() {
            // Remove 'active-section' class from all sections
            sections.forEach(section => section.classList.remove("active-section"));

            // Add 'active-section' class to the clicked section
            const sectionId = this.getAttribute("data-section");
            document.getElementById(sectionId).classList.add("active-section");
        });
    }

    // Show the default section (Dashboard) on page load
    document.getElementById("dashboard").classList.add("active-section");
