import { employeesFromRecord } from '../data/employee.js';


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
  const currentEmployee = employeesFromRecord.find(emp => emp.id === Number(editingEmployeeId));
  if (!currentEmployee) return;

  // Remove existing modal if already open
  const existing = document.getElementById('customConfirmModal');
  if (existing) existing.remove();

  const modalHTML = `
    <div id="customConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
      <div class="bg-white rounded-xl p-6 max-w-xs text-center shadow-lg">
        <p class="mb-4 text-lg font-semibold">
          Are you sure you want to update <strong>${currentEmployee.firstName} ${currentEmployee.lastName}</strong>'s record?
        </p>
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

  if (!editingEmployeeId) return;

  const currentEmployee = employeesFromRecord.find(emp => emp.id === Number(editingEmployeeId));
  if (!currentEmployee) return;

  const gender = selectedGender !== null ? selectedGender : currentEmployee.gender;
  const status = selectedStatus !== null ? selectedStatus : currentEmployee.status;

  const updatedData = {
    firstName,
    lastName,
    department,
    age,
    dateHired,
    gender,
    status
  };

  // Show loading screen inside the confirmation modal before submitting
  const modalContent = document.querySelector('#customConfirmModal > div');
  modalContent.innerHTML = `
    <div class="flex flex-col items-center p-6">
      <div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p>Updating employee record...</p>
    </div>
  `;
            const slowTimeout = setTimeout(() => {
            console.warn("⏳ Slow internet connection... please wait...⏳");

            // Optional: Show a secondary loading message inside the modal
            const modalContent = document.querySelector('#customConfirmModal > div');
            if (modalContent) {
                modalContent.insertAdjacentHTML('beforeend', `
                <p class="mt-2 text-sm text-gray-500" id="slowNetworkMsg">
                    Still working... Please wait.
                </p>
                `);
            }
            },2000/* ,2s */); //

            // 2. Then await your async logic (update simulation or real fetch)
            try {
            await new Promise(resolve => setTimeout(resolve, 3000));// simulate delay
            updateEmployeeRecord(Number(editingEmployeeId), updatedData);

             
           
            } finally {
            // 3. Clear timeout and clean up after completion
            clearTimeout(slowTimeout);
            const slowMsg = document.getElementById('slowNetworkMsg');
            if (slowMsg) slowMsg.remove();

        // Hide modals

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
