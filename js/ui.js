function toggleTheme() {
  document.documentElement.classList.toggle("dark");
  const theme = document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
  localStorage.setItem("theme", theme);

  const btnText = document.querySelector(".btn-theme p");
  btnText.textContent = theme === "dark" ? "Light" : "Dark";
}

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  const isDark = savedTheme === "dark";
  const closeModalBtn = document.getElementById("closeEmployeeModal");
  const modalEmployee = document.getElementById("employeeModal");

  closeModalBtn.addEventListener("click", () => {
    modalEmployee.classList.add("hidden");
  });

  if (isDark) {
    document.documentElement.classList.add("dark");
  }

  const btnText = document.querySelector(".btn-theme p");
  btnText.textContent = isDark ? "Light" : "Dark";
});

/* FOR ACTIVE INACTIVE BTN STAUS */
const statusContainer = document.querySelector(".status-btn");
const statusButtons = statusContainer.querySelectorAll("button");
const statusText = statusContainer.querySelector("#statusText");

statusButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Get the value from data-status attribute
    const status = button.getAttribute("data-status");

    /* CHANGE THE STATUS VALUE FROM BOOLEAN */
    const statusBool = status === "true";

    /* IF selectedStatus is true the it is active else false */
    const selectedStatus = statusBool ? "Active" : "Inactive";
    statusText.textContent = selectedStatus;

    // Optional: toggle .selected class for button styling
    statusButtons.forEach((btn) => btn.classList.remove("selected"));
    button.classList.add("selected");
  });
});

/* FOR GENDER CLICK BTN */

const genderContainer = document.querySelector(".gender-btn");
const genderButtons = genderContainer.querySelectorAll("button");

genderButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    genderButtons.forEach((b) => b.classList.remove("selected"));

    btn.classList.add("selected"); // apply to clicked one
  });
});

const editTypeButtons = document.querySelectorAll(".edit-type");

editTypeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Find the input sibling inside the same <li> parent
    const li = button.closest("li");
    if (!li) return;

    const input = li.querySelector("input");
    if (input) {
      input.focus();
    }
  });
});

/* close modal */


document.getElementById("closeEmployeeModal").addEventListener('click', () => {
       document.getElementById('employeeModal').classList.add('hidden');
});



function showNotif(){
  console.log("clicked");
 addNotification("Failed to add John Doe", "success");
  document.querySelector('.notif-text').classList.add('show');
}



function addNotification(message, type = "success", duration = 3000) {
  const notifList = document.querySelector('.notif-list');

  // Choose icon and background based on type
  const icon = type === "error"
    ? "./assets/imgs-icons/error.png"
    : "./assets/imgs-icons/checklist.png";

  const isItFail = type === "error" ? "error" : "success";

  const notif = document.createElement('p');
  notif.className = `notif-text p-2 border-2 rounded-lg flex gap-5 ${isItFail} `;
  notif.innerHTML = `
    ${message}
    <img src="${icon}" alt="${type}" class="w-6 h-6">
  `;

  notifList.appendChild(notif);

  // Trigger slide-in effect
  requestAnimationFrame(() => {
    notif.classList.add('show');
  });

  // Auto-remove
  setTimeout(() => {
    notif.classList.remove('show');
    setTimeout(() => notif.remove(), 300);
  }, duration);

  // Click to remove instantly
  notif.addEventListener('click', () => notif.remove());
}

