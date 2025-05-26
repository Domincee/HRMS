const toggleDrop = document.getElementById("toggle-drop");
const accountDrop = document.querySelector('.accout-dropdown');


document.addEventListener("click", (event) => {
    if (!toggleDrop.contains(event.target) && !accountDrop.contains(event.target)) {
        accountDrop.classList.add("hidden");
    }
});

toggleDrop.addEventListener("click", () => {
    accountDrop.classList.toggle("hidden");
});


document.addEventListener("DOMContentLoaded", () => {
    const showQuickManage = document.getElementById("showQuickManage");
    const manageShow = document.querySelector('.manage-show');

    document.addEventListener("click", (event) => {
        if (showQuickManage && manageShow && !showQuickManage.contains(event.target) && !manageShow.contains(event.target)) {
            manageShow.classList.add("hidden");
        }
    });

    showQuickManage.addEventListener("click", () => {
        manageShow.classList.toggle("hidden");



    });

  
});


const listItems = document.querySelectorAll('.navigator-container .list-icon');

listItems.forEach(item => {
    item.addEventListener('click', () => {
        
        listItems.forEach(li => li.classList.remove('active')); 
        item.classList.add('active');
    });
});
