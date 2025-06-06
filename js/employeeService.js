import { employeesFromRecord } from '../data/employee.js';
import { containsBannedWord } from '../data/disallowedWords.js';

const form = document.getElementById('employeeForm');

const genderButtons = document.querySelectorAll('.gender-btn button');
let selectedGender = null;

genderButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    selectedGender = btn.dataset.gender;
  });
});

const statusButtons = document.querySelectorAll('.status-btn button');
let selectedStatus = null;

statusButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    statusButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedStatus = btn.dataset.status === 'true';
  });
});

// Intercept form submission to show confirmation modal
form.addEventListener('submit', (e) => {
  e.preventDefault();
  showConfirmationModal();
});

// Show the confirmation modal
function showConfirmationModal() {
  const editingEmployeeId = sessionStorage.getItem('editingEmployeeId');

  const isEditMode = !!editingEmployeeId;
  const currentEmployee = isEditMode
    ? employeesFromRecord.find(emp => emp.id === Number(editingEmployeeId))
    : null;

  // Remove existing modal if already open
  const existing = document.getElementById('customConfirmModal');
  if (existing) existing.remove();

  const message = isEditMode
    ? `Are you sure you want to update <strong>${currentEmployee.firstName} ${currentEmployee.lastName}</strong>'s record?`
    : `Are you sure you want to <strong>add this new employee</strong>?`;

  const modalHTML = `
    <div id="customConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
      <div class="bg-white rounded-xl p-6 max-w-xs text-center shadow-lg">
        <p class="mb-4 text-lg font-semibold">${message}</p>
        <button id="customConfirmYes" class="bg-blue-600 text-white px-4 py-2 rounded mr-2 hover:scale-105 hover:bg-blue-700 transition-all duration-300">Yes</button>
        <button id="customConfirmNo" class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 hover:scale-105 transition-all duration-300">Cancel</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Handle confirmation modal button clicks
document.body.addEventListener('click', (e) => {
  if (e.target.matches('#customConfirmYes')) {
    processForm();
  }

  if (e.target.matches('#customConfirmNo')) {
    const modal = document.getElementById('customConfirmModal');
    if (modal) modal.remove();
  }
});

// Async function to process and update employee
async function processForm() {
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const age = parseInt(document.getElementById('Age').value);
  const department = document.getElementById('department').value;
  const dateHired = document.getElementById('dateHired').value;
  const editingEmployeeId = sessionStorage.getItem('editingEmployeeId');

  const isEditMode = !!editingEmployeeId;
  const gender = selectedGender;
  const status = selectedStatus;

  const employeeData = {
    firstName,
    lastName,
    department,
    age,
    dateHired,
    gender,
    status
  };

  const modalContent = document.querySelector('#customConfirmModal > div');
  modalContent.innerHTML = `
    <div class="flex flex-col items-center p-6">
      <div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p>${isEditMode ? 'Updating' : 'Adding'} employee record...</p>
    </div>
  `;

  const slowTimeout = setTimeout(() => {
    console.warn("⏳ Slow internet connection... please wait...⏳");
    const modalContent = document.querySelector('#customConfirmModal > div');
    if (modalContent) {
      modalContent.insertAdjacentHTML('beforeend', `
        <p class="mt-2 text-sm text-gray-500" id="slowNetworkMsg">
          Still working... Please wait.
        </p>
      `);
    }
  }, 2000);

  try {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay

    if (isEditMode) {
      updateEmployeeRecord(Number(editingEmployeeId), employeeData);
    } else {
      addEmployeeRecord(employeeData); // 👈 new function for adding
    }
  } finally {
    clearTimeout(slowTimeout);
    const slowMsg = document.getElementById('slowNetworkMsg');
    if (slowMsg) slowMsg.remove();

    document.getElementById('employeeModal').classList.add('hidden');
    const modal = document.getElementById('customConfirmModal');
    if (modal) modal.remove();
  }
}

// Function to update employee record
function updateEmployeeRecord(employeeId, updatedData) {
  const empIndex = employeesFromRecord.findIndex(emp => emp.id === employeeId);
  if (empIndex !== -1) {
    employeesFromRecord[empIndex] = {
      ...employeesFromRecord[empIndex],
      ...updatedData
    };

    localStorage.setItem('employees', JSON.stringify(employeesFromRecord));


    /* REMOVE WHEN DEPLOYMENT */
    console.log(`✅ Updated Employee ${employeeId}:`, employeesFromRecord[empIndex]);

    if (window.renderEmployeeTable) {
      window.renderEmployeeTable([...employeesFromRecord]);
    }
  } else {
    console.warn(`Employee ID ${employeeId} not found.`);
  }
}


function addEmployeeRecord(newData) {
  const newId = generateUniqueId();

  const newEmployee = {
    id: newId,
    ...newData
  };

  employeesFromRecord.push(newEmployee);
  localStorage.setItem('employees', JSON.stringify(employeesFromRecord));

  console.log('✅ Added New Employee:', newEmployee);

  if (window.renderEmployeeTable) {
    window.renderEmployeeTable([...employeesFromRecord]);
  }
}


function generateUniqueId() {
  let newId;
  const existingIds = new Set(employeesFromRecord.map(emp => emp.id));

  do {
    newId = Math.floor(1000 + Math.random() * 9000); // generates number from 1000 to 9999
  } while (existingIds.has(newId));

  return newId;
}

document.body.addEventListener('click', (e) => {
    const hideConfirmModal = document.getElementById('customConfirmModal');
  if (e.target.matches('#confirmBtn')) {
    e.preventDefault(); 
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    if (containsBannedWord(firstName) || containsBannedWord(lastName)) {
      alert('Please avoid inappropriate language in the name fields before confirming.');

      hideConfirmModal.classList.add('hidden');

      return; // Don't proceed with processing

    }

    processForm();
  }

  if (e.target.matches('#customConfirmNo')) {
    const modal = document.getElementById('customConfirmModal');
    if (modal) modal.remove();
  }
});
