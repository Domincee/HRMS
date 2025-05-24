const toggleCollapse = document.querySelectorAll('.toggle-collapse');
const sideBar = document.querySelector('.sidebar');
const listItems = document.querySelectorAll(".list");
const listIconItems = document.querySelectorAll(".list-icon")

toggleCollapse.forEach(toggle => {
    toggle.addEventListener('click', () => {
        console.log("Element clicked!");

        const leftArrow = toggle.querySelector('.left-arrow');
        const rightArrow = toggle.querySelector('.right-arrow');

        sideBar.classList.toggle("collapse");

        if (leftArrow) leftArrow.classList.toggle("collapse");
        if (rightArrow) rightArrow.classList.toggle("collapse");




        listItems.forEach(item => {
            
                item.classList.toggle("collapse");
            });

    

        listIconItems.forEach(icon => {
                icon.classList.toggle("collapse");
            });
   
    });
});

