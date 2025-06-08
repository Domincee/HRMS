import { employeesFromRecord } from '../data/records.js';
import { containsBannedWord } from '../data/disallowedWords.js';

// Form and state
const form = document.getElementById('employeeForm');
let selectedGender = null;
let selectedStatus = null;

// Gender selection
document.querySelectorAll('.gender-btn button').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedGender = btn.dataset.gender;
  });
});

// Status selection
document.querySelectorAll('.status-btn button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.status-btn button').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedStatus = btn.dataset.status === 'true';
  });
});

// Form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();

  if (containsBannedWord(firstName) || containsBannedWord(lastName)) {
    alert('Please avoid inappropriate language in the name fields.');
    return;
  }

  showConfirmationModal();
});

// Show confirmation modal
function showConfirmationModal() {
  const editingEmployeeId = sessionStorage.getItem('editingEmployeeId');
  const isEditMode = !!editingEmployeeId;
  const currentEmployee = isEditMode
    ? employeesFromRecord.find(emp => emp.id === Number(editingEmployeeId))
    : null;

  // Remove old modal
  const existing = document.getElementById('customConfirmModal');
  if (existing) existing.remove();

  const message = isEditMode
    ? `Are you sure you want to update <strong>${currentEmployee.firstName} ${currentEmployee.lastName}</strong>'s record?`
    : `Are you sure you want to <strong>add this new employee</strong>?`;

  const modalHTML = `
    <div id="customConfirmModal" class="fixed inset-0 z-[999] bg-black bg-opacity-50 flex justify-center items-center">
      <div class="bg-white rounded-xl p-6 max-w-xs text-center shadow-lg">
        <p class="mb-4 text-lg font-semibold">${message}</p>
        <button id="customConfirmYes" class="bg-blue-600 text-white px-4 py-2 rounded mr-2 hover:scale-105 hover:bg-blue-700 transition-all duration-300">Yes</button>
        <button id="customConfirmNo" class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 hover:scale-105 transition-all duration-300">Cancel</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Handle modal button clicks
document.body.addEventListener('click', (e) => {
  if (e.target.matches('#customConfirmYes')) {
    processForm();
  }
  if (e.target.matches('#customConfirmNo')) {
    const modal = document.getElementById('customConfirmModal');
    if (modal) modal.remove();
  }
});

// Process form (Add or Edit)
async function processForm() {
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const age = parseInt(document.getElementById('Age').value);
  const department = document.getElementById('department').value;
  const dateHired = document.getElementById('dateHired').value;
  const editingEmployeeId = sessionStorage.getItem('editingEmployeeId');

  const isEditMode = !!editingEmployeeId;
  const gender = selectedGender;
  const status = selectedStatus;

  const employeeData = { firstName, lastName, department, age, dateHired, gender, status };



 if (!isEditMode) {
  // Validation for adding new employee
  if (!firstName || !lastName || !age || !department || !dateHired || !gender || status === null) {
    alert('Please complete all required fields.');
    return;
  }

  if (isNaN(age) || age < 16 || age > 100) {
    
    alert('Please enter a valid age between 16 and 100.');
    return;
  }
} else {
  // Optional: Prevent submit if no fields changed
  const original = employeesFromRecord.find(emp => emp.id === Number(editingEmployeeId));
  const hasChanges = Object.keys(employeeData).some(
    key => employeeData[key] !== original[key]
  );

  if (!hasChanges) {
    alert("No changes detected.");
    return;
  }
}


  const modalContent = document.querySelector('#customConfirmModal > div');
  if (modalContent) {
    modalContent.innerHTML = `
      <div class="flex flex-col items-center p-6">
        <div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p>${isEditMode ? 'Updating' : 'Adding'} employee record...</p>
      </div>
    `;
  }

  const slowTimeout = setTimeout(() => {
    const mc = document.querySelector('#customConfirmModal > div');
    if (mc) {
      mc.insertAdjacentHTML('beforeend', `
        <p class="mt-2 text-sm text-gray-500" id="slowNetworkMsg">Still working... Please wait.</p>
      `);
    }
  }, 2000);

  try {
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (isEditMode) {
      updateEmployeeRecord(Number(editingEmployeeId), employeeData);
    } else {
      addEmployeeRecord(employeeData);
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

// Helpers
function updateEmployeeRecord(employeeId, updatedData) {
  const empIndex = employeesFromRecord.findIndex(emp => emp.id === employeeId);
  if (empIndex !== -1) {
    employeesFromRecord[empIndex] = {
      ...employeesFromRecord[empIndex],
      ...updatedData
    };

    localStorage.setItem('employees', JSON.stringify(employeesFromRecord));

    const updatedEmployee = employeesFromRecord[empIndex];
    addNotification(`Successfully updated employee ${updatedEmployee.firstName} ${updatedEmployee.lastName}`, "success");

    if (window.renderEmployeeTable) {
      window.renderEmployeeTable([...employeesFromRecord]);
    }
  } else {
    console.warn(`Employee ID ${employeeId} not found.`);
    addNotification(`Failed to update employee.`, "error");
  }
}

function addEmployeeRecord(newData) {
  try {
    const newId = generateUniqueId();
    const newEmployee = { id: newId, ...newData };
    employeesFromRecord.push(newEmployee);

    localStorage.setItem('employees', JSON.stringify(employeesFromRecord));
    console.log('✅ Added New Employee:', newEmployee);

    if (window.renderEmployeeTable) {
      window.renderEmployeeTable([...employeesFromRecord]);
    }

    addNotification(`Successfully added employee ${newEmployee.firstName} ${newEmployee.lastName}`, "success");
  } catch (error) {
    console.error("Failed to add new employee:", error);
    addNotification(`Failed to add new employee: ${error.message}`, "error");
  }
}

function generateUniqueId() {
  let newId;
  const existingIds = new Set(employeesFromRecord.map(emp => emp.id));
  do {
    newId = Math.floor(1000 + Math.random() * 9000);
  } while (existingIds.has(newId));
  return newId;
}
