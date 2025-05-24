const toggleCollapse = document.querySelectorAll('.toggle-collapse');
const sideBar = document.querySelector('.sidebar');

toggleCollapse.forEach(toggle => {
    toggle.addEventListener('click', function() {
        const leftArrow = this.children[0]; 
        const rightArrow = this.children[1];
        const widthCol = 200; // ✅ Use number instead of string

        // Get the actual computed display style
        const leftArrowDisplay = window.getComputedStyle(leftArrow).display;
   
        // Toggle visibility based on actual display value
        if (leftArrowDisplay === 'block') {  
            sideBar.style.width = widthCol + "px";
             // ✅ Convert back to string
            rightArrow.style.display = 'none';  
            leftArrow.style.display = 'block';
        } else {  
            rightArrow.style.display = 'block';  
            leftArrow.style.display = 'none';  
            sideBar.style.width = (widthCol * 2) + "px";
        }
    });
});