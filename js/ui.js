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
  const closeModalBtn = document.getElementById("closermBtn");
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


document.getElementById("confirmBtn").addEventListener('click', () => {
       document.getElementById('employeeModal').classList.add('hidden');
})





export function showReusableConfirmModal(message, onConfirm, onCancel = () => {}) {
  const modal = document.getElementById('customConfirmModal');
  const msgEl = document.getElementById('customConfirmMessage');
  const spinner = document.getElementById('customConfirmSpinner');
  const slowMsg = document.getElementById('slowNetworkMsg');
  const btnGroup = document.getElementById('customConfirmButtons');
  const yesBtn = document.getElementById('customConfirmYes');
  const noBtn = document.getElementById('customConfirmNo');

  // Reset UI
  msgEl.textContent = message;
  spinner.classList.add('hidden');
  slowMsg.classList.add('hidden');
  btnGroup.classList.remove('hidden');
  modal.classList.remove('hidden');

  // Remove previous listeners
  const newYesBtn = yesBtn.cloneNode(true);
  const newNoBtn = noBtn.cloneNode(true);
  yesBtn.replaceWith(newYesBtn);
  noBtn.replaceWith(newNoBtn);

  newYesBtn.addEventListener('click', async () => {
    btnGroup.classList.add('hidden');
    spinner.classList.remove('hidden');

    const slowTimeout = setTimeout(() => {
      slowMsg.classList.remove('hidden');
    }, 3000);

    try {
      await onConfirm();
    } catch (err) {
      console.error("Confirmation action failed:", err);
    } finally {
      clearTimeout(slowTimeout);
      modal.classList.add('hidden');
      spinner.classList.add('hidden');
      slowMsg.classList.add('hidden');
    }
  });

  newNoBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    onCancel();
  });
}
