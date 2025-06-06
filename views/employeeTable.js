import { employeesFromRecord } from '../data/employee.js';

let currentSort = { column: null, asc: true };


export function render() {
  const container = document.createElement('div');
  container.classList.add('employee');

  container.innerHTML = `
    <div class="employee-container flex flex-col g-4 p-4">
      <h2 class="title">Employee List</h2>
      <h4 class="subtitle">Manage Employee</h4>
      

      <div class="table-wrapper">
        <table class="employee-table bg-white">
          <thead class="table-header">
            <tr>
              <th>
              <button class="btn-sorter flex g-2 item-center" id="sortById"> 
                <span>ID</span>
               <img class="w-8 h-8" src="/assets/imgs-icons/up-and-down-arrows-svgrepo-com.svg" alt="">
              </button>
              </th>

              <th>
              <button class="btn-sorter flex g-2 item-center" id="sortByName"> 
                <span>Full Name</span>
               <img class="w-8 h-8" src="/assets/imgs-icons/up-and-down-arrows-svgrepo-com.svg" alt="">
              </button>
              </th>
              <th>
              <button class="btn-sorter flex g-2 item-center" id="sortByDep"> 
                <span>Department</span>
               <img class="w-8 h-8" src="/assets/imgs-icons/up-and-down-arrows-svgrepo-com.svg" alt="">
              </button>
              </th>
              <th>
               <button class="btn-sorter flex g-2 item-center" id="sortByStat"> 
                <span>Status</span>
               <img class="w-8 h-8" src="/assets/imgs-icons/up-and-down-arrows-svgrepo-com.svg" alt="">
              </button>
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody class="table-body"></tbody>
        </table>
  
      </div>
            <button id="addBtn" class="add-Btn border-2 bg-blue-700 text-white  border-black w-24 rounded-lg">Add </button>
    </div>

    
  `;

  const tbody = container.querySelector('tbody');
  
   function renderTableBody(data) {
     tbody.innerHTML = '';
    data.forEach(emp => {
    const row = document.createElement('tr');
      
    const statusColor = emp.status ? 'bg-blue-400' : 'bg-red-500';
    const statusText = emp.status ? 'Active' : 'Inactive';

    const statusCircle = `
        <span class="status-dot inline-block w-3 h-3 rounded-full ${statusColor}">
        </span> 
        <p class="text-status">${statusText}</p>
    `;

    row.innerHTML = `
      <td>${emp.id}</td>
      <td>${emp.firstName} ${emp.lastName}</td>
      <td>${emp.department}</td>
      <td class="statusCon">${statusCircle}</td>
      <td>
        <button 
          class="edit-btn bg-blue-800 w-auto p-1 rounded-lg border-2 border-blue-700 text-white 
          shadow-lg hover:bg-blue-500 hover:text-white hover:scale-105 transition duration-300" 
          data-id="${emp.id}">
          Edit
        </button>
        <button 
          class="remove-btn border-2 border-black w-auto p-1 rounded-lg hover:border-blue-700 text-black 
          shadow-lg hover:bg-gray-200 hover:scale-105 transition-all duration-300">
           remove
          </div>
        </button>
      </td>
    `;
    tbody.appendChild(row);

        /* Show modal */
    row.querySelector(".remove-btn").addEventListener("click", () => {
      const employee = employeesFromRecord.find((e) => e.id === emp.id);
      if (!employee) return;

      const existingModal = document.getElementById("confirmationModal");
      if (existingModal) existingModal.remove();

      const modalHTML = `
        <div id="confirmationModal" 
            class="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div id="modalContent" class="bg-white p-6 rounded shadow-lg max-w-sm text-center">
            <p class="mb-4 text-lg font-semibold">
              Are you sure you want to remove ${employee.firstName} ${employee.lastName}?
            </p>
            <button id="confirmYes" class="bg-red-600 text-white px-4 py-2 rounded mr-2">Yes</button>
            <button id="confirmNo" class="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML("beforeend", modalHTML);

      document
        .getElementById("confirmYes")
        .addEventListener("click", async () => {
          const modalContent = document.getElementById("modalContent");

                modalContent.innerHTML = `
            <div class="flex flex-col items-center">
              <div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p class="text-sm">Removing employee...</p>
            </div>
          `;

          try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const index = employeesFromRecord.findIndex((e) => e.id === emp.id);
           if (index === -1) {
              console.warn("Employee not found in record.");
              return;
            }

            employeesFromRecord.splice(index, 1);
            row.remove();

            console.log(`Employee with ID ${emp.id} has been removed.`);/* REMOVE WHEN DEPLOY */

            
          } catch (err) {
            console.error("Failed to remove employee:", err);
          } finally {
            document.getElementById("confirmationModal")?.remove();
          }
        });

      document.getElementById("confirmNo").addEventListener("click", () => {
        document.getElementById("confirmationModal").remove();
      });
    });

    /* Event listner for remove emplyoe */





    /* Event listner for editing employee */

// EDIT BUTTON CLICK: populate and show modal
row.querySelector('.edit-btn').addEventListener('click', () => {
  
  const employee = employeesFromRecord.find(e => e.id === emp.id);
  if (!employee) return;

  sessionStorage.setItem('editingEmployeeId', employee.id);

  document.getElementById('employeeID').value = employee.id;
  document.getElementById('firstName').value = employee.firstName;
  document.getElementById('lastName').value = employee.lastName;
  document.getElementById('Age').value = employee.age;
  document.getElementById('dateHired').value = employee.dateHired;
  populateDepartmentDropdown();
  document.getElementById('department').value = employee.department;

  const genderButtons = document.querySelectorAll('.gender-btn button');
  genderButtons.forEach(btn => {
    btn.classList.remove('selected');
    if (employee.gender === btn.dataset.gender) {
      btn.classList.add('selected');
    }
  });
  

  // Remove previous event listeners by cloning confirmBtn (to prevent duplicates)
  const confirmBtn = document.getElementById("confirmBtn");
  const newConfirmBtn = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

  newConfirmBtn.addEventListener('click', () => {
    // Create a custom confirmation modal
    const existingConfirmModal = document.getElementById('customConfirmModal');
    if (existingConfirmModal) existingConfirmModal.remove();

    const modalHTML = `
      <div id="customConfirmModal" 
           class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[500]">
        <div class="bg-white rounded-xl p-6 max-w-xs text-center shadow-lg">
          <p class="mb-4 text-lg font-semibold">
            Are you sure you want to update <strong>${employee.firstName} ${employee.lastName}</strong>'s record?
          </p>
          <button id="customConfirmYes" class="bg-blue-600 text-white px-4 py-2 rounded mr-2 hover:scale-105 hover:bg-blue-700 transition-all duration-300">Yes</button>
          <button id="customConfirmNo" class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 hover:scale-105 transition-all">Cancel</button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    document.getElementById('customConfirmYes').addEventListener('click', async () => {
      // Show loading inside the custom confirm modal
      const modalContent = document.getElementById('customConfirmModal').querySelector('div');
      modalContent.innerHTML = `
        <div class="flex flex-col items-center p-6">
          <div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>Updating employee record...</p>
        </div>
      `;

      try {
        // Simulate update delay (replace with actual update logic)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // TODO: your update logic here (update employeesFromRecord or backend call)

        // After update, remove modals and hide employeeModal
        document.getElementById('customConfirmModal').remove();
        document.getElementById('employeeModal').classList.add('hidden');
        console.log(`Employee ${employee.firstName} ${employee.lastName} updated!`);
      } catch (err) {
        console.error("Failed to update employee:", err);
      }
    });

    document.getElementById('customConfirmNo').addEventListener('click', () => {
      document.getElementById('customConfirmModal').remove();
    });
  });


  // Show modal (with original form content)
  document.getElementById('employeeModal').classList.remove('hidden');
  

});


});




}


window.renderEmployeeTable = renderTableBody;
renderTableBody([...employeesFromRecord]); 

  renderTableBody([...employeesFromRecord]);
   function sortTable(column) {
    const sorted = [...employeesFromRecord].sort((a, b) => {
      let aVal, bVal;

      switch (column) {
        case 'id':
          aVal = a.id;
          bVal = b.id;
          break;
        case 'name':
          aVal = `${a.firstName} ${a.lastName}`.toLowerCase();
          bVal = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case 'department':
          aVal = a.department.toLowerCase();
          bVal = b.department.toLowerCase();
          break;
        case 'status':
          aVal = a.status ? 1 : 0;
          bVal = b.status ? 1 : 0;
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

    renderTableBody(sorted);
   

  }
   function populateDepartmentDropdown() {
      const departmentSelect = document.getElementById('department');
      if (!departmentSelect) return;

      // Clear current options
      departmentSelect.innerHTML = '<option value="">Select Department</option>';

      // Get unique departments
      const departments = [...new Set(employeesFromRecord.map(emp => emp.department))];

      departments.forEach(dep => {
        const option = document.createElement('option');
        option.value = dep;
        option.textContent = dep;
        departmentSelect.appendChild(option );
      });
    }
  // Attach event listeners



  container.querySelector('#sortById').addEventListener('click', () => sortTable('id'));
  container.querySelector('#sortByName').addEventListener('click', () => sortTable('name'));
  container.querySelector('#sortByDep').addEventListener('click', () => sortTable('department'));
  container.querySelector('#sortByStat').addEventListener('click', () => sortTable('status'));
  return container;
}

