import { departmentFromRecord } from '../data/records.js';
import {showCustomConfirm} from '../js/ui.js';

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
          
        <div class="w-full flex justify-around items-center align-center ">

           <div id="totalDep" class="flex gap-10">
              <span>Total Department: 0</span>
         
            </div>

          <button id="addBtnEmployee" class="add-Btn border-2 bg-blue-700 text-white border-black w-24 rounded-lg">Add</button>

        </div>
    </div>

   
  `;

    const tbody = container.querySelector('tbody');

        function updateDepartmentCount(data) {
        const totalEmpContainer = container.querySelector('#totalDep');
        const total = data.length;

        totalEmpContainer.innerHTML = `
          <span>Total Department: <strong> <u> ${total}</u> </strong></span>
        `;
      }



function renderTableBody(data) {
  tbody.innerHTML = '';

  updateDepartmentCount(departmentFromRecord);
  data.forEach((dep, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${dep.depID}</td>
      <td>${dep.department}</td>
      <td>
        <span 
          style="
            display: inline-block; 
            width: 16px; 
            height: 16px; 
            border-radius: 50%; 
            background-color: ${dep.depColor};
          ">
        </span>
      </td>
      <td>${dep.depLength}</td>
      <td class="flex gap-5 w-auto">
        <button
          class="edit-btn bg-blue-800 w-auto p-1 rounded-lg border-2 border-blue-700 text-white 
            shadow-lg hover:bg-blue-500 hover:text-white hover:scale-105 transition duration-300" 
          data-depID="${dep.depID}">
          Edit
        </button>
        <button 
          class="remove-btn remove-dep-btn border-2 border-black p-1 rounded-lg hover:scale-105 hover:bg-white" 
          data-index="${index}" 
          data-name="${dep.department}">
          Remove
        </button>
      </td>
    `;
    tbody.appendChild(row);

    // Attach event listener for remove button on this row



            row.querySelector(".remove-btn").addEventListener("click", () => {
      showCustomConfirm('Are you sure you want to remove this department?').then((confirmed) => {
            if (confirmed) {
              console.log('User clicked YES');
              // Do your removal here
            } else {

              
              console.log('User clicked CANCEL');
              // Do nothing or cancel removal
            }
            });


    });

  });
  
}

  function sortTable(column) {
    const sorted = [...departmentFromRecord].sort((a, b) => {
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

    renderTableBody(sorted);
  }

  container.querySelector('#sortByDepID').addEventListener('click', () => sortTable('id'));
  container.querySelector('#sortByNameDep').addEventListener('click', () => sortTable('name'));

  renderTableBody([...departmentFromRecord]);
  return container;
}
/*  */

