import { departmentFromRecord } from '../data/records.js';
import {addNotification} from '../js/ui.js';

let currentSort = { column: null, asc: true };
let departments = [...departmentFromRecord]; // Local mutable copy
let nextDepID = departments.length
  ? Math.max(...departments.map(d => d.depID)) + 1
  : 1;

export function render() {
  const container = document.createElement('div');
  container.classList.add('employee');

  container.innerHTML = `
    <div class="employee-container flex flex-col g-4 p-4">
      <h2 class="title">Department List</h2>
      <h4 class="subtitle">Manage Department</h4>

      <div class="table-wrapper">
        <table class="employee-table bg-white">
          <thead class="table-header">
            <tr>
              <th>
                <button class="btn-sorter flex g-2 item-center" id="sortByDepID"> 
                  <span>ID</span>
                  <img class="w-8 h-8" src="./assets/imgs-icons/up-and-down-arrows-svgrepo-com.svg" alt="">
                </button>
              </th>
              <th>
                <button class="btn-sorter flex g-2 item-center" id="sortByNameDep"> 
                  <span>Department</span>
                  <img class="w-8 h-8" src="./assets/imgs-icons/up-and-down-arrows-svgrepo-com.svg" alt="">
                </button>
              </th>
              <th><span>Color Code</span></th>
              <th><span>Headcount</span></th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody class="table-body"></tbody>
        </table>
      </div>

      <div class="w-full flex justify-around items-center align-center">
        <div id="totalDep" class="flex gap-10">
          <span>Total Department: 0</span>
        </div>
        <button id="addBtnEmployee" class="add-Btn border-2 bg-blue-700 text-white border-black w-24 rounded-lg">Add</button>
      </div>

      <!-- Confirmation Modal -->
      <div id="confirmModal" class="confirm-modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" style="display:none;">
        <div class="modal-content bg-white p-6 rounded shadow-lg max-w-sm w-full">
          <p id="confirmMessage" class="mb-6 text-center text-lg"></p>
          <div class="flex justify-around">
            <button id="confirmYes" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Yes</button>
            <button id="confirmNo" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">No</button>
          </div>
        </div>
      </div>

      <!-- Add Department Modal -->
      <div id="addDepartmentModal" class="add-dep-modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" style="display:none;">
        <div class="modal-content bg-white p-6 rounded shadow-lg max-w-sm w-full">
          <h3 class="text-center text-xl mb-4">Add New Department</h3>
          <form id="addDepartmentForm" class="flex flex-col gap-4">
            <label>
              Department Name:
              <input type="text" id="depNameInput" required placeholder="Enter department name" class="border rounded p-2 w-full" />
            </label>
            <label>
              Select Color:
              <input type="color" id="depColorInput" value="#007bff" class="w-full h-10 cursor-pointer" />
            </label>
            <div class="flex justify-around mt-4">
              <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add</button>
              <button type="button" id="cancelAddBtn" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    .confirm-modal, .add-dep-modal { 
      position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
      display: flex; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.5); 
      z-index: 1000;
    }
    .modal-content {
      background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      max-width: 400px; width: 90%;
    }
    .color-dot {
      display: inline-block;
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
    }
  `;
  document.head.appendChild(style);

  const tbody = container.querySelector('tbody');

  // Confirmation modal elements
  const confirmModal = container.querySelector('#confirmModal');
  const confirmMessage = container.querySelector('#confirmMessage');
  const confirmYes = container.querySelector('#confirmYes');
  const confirmNo = container.querySelector('#confirmNo');

  // Add Department modal elements
  const addDepModal = container.querySelector('#addDepartmentModal');
  const addDepForm = container.querySelector('#addDepartmentForm');
  const depNameInput = container.querySelector('#depNameInput');
  const depColorInput = container.querySelector('#depColorInput');
  const cancelAddBtn = container.querySelector('#cancelAddBtn');

  // Hide modals initially
  confirmModal.style.display = 'none';
  addDepModal.style.display = 'none';

  // Confirmation modal promise function
function showConfirmModal(message) {
  return new Promise((resolve) => {
    confirmMessage.textContent = message;
    confirmMessage.style.color = "black";
    confirmModal.style.display = 'flex';

    function cleanup() {
      confirmYes.removeEventListener('click', onYes);
      confirmNo.removeEventListener('click', onNo);
      confirmModal.style.display = 'none';
    }

    function onYes() {
      cleanup();
      resolve(true);
      addNotification("Successfully removed ", "success");  // <-- show notification here
    }

    function onNo() {
      cleanup();
      resolve(false);
    }

    confirmYes.addEventListener('click', onYes);
    confirmNo.addEventListener('click', onNo);
  });
}
const editColorModal = document.getElementById('editColorModal');
const editColorInput = document.getElementById('editColorInput');
const editColorSave = document.getElementById('editColorSave');
const editColorCancel = document.getElementById('editColorCancel');

let currentEditingDepID = null;

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('edit-btn')) {
    const depID = Number(e.target.getAttribute('data-depID'));
    const department = departments.find(dep => dep.depID === depID);
    if (!department) return;

    currentEditingDepID = depID;
    editColorInput.value = department.depColor || '#000000';

    editColorModal.classList.remove('hidden');
  }
});

editColorCancel.addEventListener('click', () => {
  editColorModal.classList.add('hidden');
  currentEditingDepID = null;
});

editColorSave.addEventListener('click', () => {
  if (currentEditingDepID === null) return;

  const newColor = editColorInput.value.trim();
  const department = departments.find(dep => dep.depID === currentEditingDepID);
  if (!department) return;

  department.depColor = newColor;
  editColorModal.classList.add('hidden');
  renderTableBody(departmentFromRecord);

  addNotification('Department color updated successfully!', 'success');

  // Update UI element showing color - make sure you have this class in your HTML
  const colorEl = document.querySelector(`.dep-color-${currentEditingDepID}`);
  if (colorEl) {
    colorEl.style.backgroundColor = newColor;
  }

  currentEditingDepID = null;
});

  function updateDepartmentCount(data) {
    const totalDepContainer = container.querySelector('#totalDep');
    totalDepContainer.innerHTML = `
      <span>Total Department: <strong><u>${data.length}</u></strong></span>
    `;
  }

  function renderTableBody(data) {
    tbody.innerHTML = '';
    updateDepartmentCount(data);

    data.forEach((department, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${department.depID}</td>
        <td>${department.department}</td>
        <td>
          <span class="color-dot" style="background-color: ${department.depColor};"></span>
        </td>
        <td>${department.depLength ?? 0}</td>
        <td class="flex gap-5 w-auto">
          <button
            class="edit-btn bg-blue-800 w-auto p-1 rounded-lg border-2 border-blue-700 text-white 
              shadow-lg hover:bg-blue-500 hover:text-white hover:scale-105 transition duration-300" 
            data-depID="${department.depID}">
            Edit
          </button>
          <button 
            class="remove-btn remove-dep-btn border-2 border-black p-1 rounded-lg hover:scale-105 hover:bg-white" 
            data-index="${index}" 
            data-name="${department.department}">
            Remove
          </button>
        </td>
      `;

      row.querySelector(".remove-btn").addEventListener("click", async () => {
        const confirmed = await showConfirmModal(`Are you sure you want to remove "${department.department}" department?`);
        if (confirmed) {
          departments.splice(index, 1);
          renderTableBody([...departments]);
        }
      });

      tbody.appendChild(row);
    });
  }

  // Sorting function
  function sortTable(column) {
    const sorted = [...departments].sort((a, b) => {
      let aVal, bVal;
      switch (column) {
        case 'id':
          aVal = a.depID;
          bVal = b.depID;
          break;
        case 'name':
          aVal = a.department.toLowerCase();
          bVal = b.department.toLowerCase();
          break;
      }

      if (aVal < bVal) return currentSort.asc ? -1 : 1;
      if (aVal > bVal) return currentSort.asc ? 1 : -1;
      return 0;
    });

    currentSort = {
      column,
      asc: currentSort.column === column ? !currentSort.asc : true,
    };

    departments = [...sorted];
    renderTableBody(sorted);
  }

  container.querySelector('#sortByDepID').addEventListener('click', () => sortTable('id'));
  container.querySelector('#sortByNameDep').addEventListener('click', () => sortTable('name'));

  // Add button click: open Add Department modal
  container.querySelector('#addBtnEmployee').addEventListener('click', () => {
    depNameInput.value = '';
    depColorInput.value = '#007bff';
    addDepModal.style.display = 'flex';
  });

  // Cancel button on Add modal
  cancelAddBtn.addEventListener('click', () => {
    addDepModal.style.display = 'none';
  });

  // Handle Add Department form submit
  addDepForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newName = depNameInput.value.trim();
    const newColor = depColorInput.value;

    if (!newName) {
      alert('Please enter a department name.');
      return;
    }

    // Optional: prevent duplicate names
    if (departments.some(dep => dep.department.toLowerCase() === newName.toLowerCase())) {
      alert('Department name already exists.');
      return;
    }

    // Create new department object
    const newDepartment = {
      depID: nextDepID++,
      department: newName,
      depColor: newColor,
      depLength: 0, // default headcount
    };

    departments.push(newDepartment);
     addNotification(`Department "${newName}" added successfully!`, "success");
    renderTableBody([...departments]);
    addDepModal.style.display = 'none';
  });

  renderTableBody(departments);
  return container;
}
