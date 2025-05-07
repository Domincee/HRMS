const allNavItems = document.querySelectorAll('.nav-list li, .nav-list-collapsed li');
const sectionContainers = document.querySelectorAll('.section-container'); // Ensure this selects all sections


function showSection(sectionName) {

  sectionContainers.forEach(sec => sec.classList.remove('active'));


  const target = document.querySelector(`.section-container[data-section="${sectionName}"]`);
  if (target) target.classList.add('active');
}

// Loop
for (let i = 0; i < allNavItems.length; i++) {
  allNavItems[i].addEventListener('click', () => {
    const section = allNavItems[i].dataset.section;
    if (!section) return;

    console.log('Clicked on section:', section);

  
    allNavItems.forEach(el => el.classList.remove('active-section'));

    
    allNavItems.forEach(el => {
      if (el.dataset.section === section) {
        el.classList.add('active-section');
      }
    });

    // Show the right section
    showSection(section);
  });
}