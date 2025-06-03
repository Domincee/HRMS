import { employeesFromRecord } from '/data/employee.js';


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

    const statusColor = emp.status ? 'bg-yellow-500' : 'bg-red-500';
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
      <button class="bg-blue-800 w-auto p-1 rounded-lg border-2 border-blue-700 text-white 
       shadow-lg hover:bg-blue-500 hover:text-white hover:scale-105 
       transition-bg duration-300" 
       id="edit-btn">Edit</button>

      <button class="remove-btn border-2 border-black w-auto p-1 rounded-lg border-2 hover:border-blue-700 text-black 
       shadow-lg hover:bg-gray-200  hover:scale-105 
       transition-all duration-300" 
       id="remove-btn">Remove</button>
      </td>
    `;
    tbody.appendChild(row);
  });


}
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

  // Attach event listeners
  container.querySelector('#sortById').addEventListener('click', () => sortTable('id'));
  container.querySelector('#sortByName').addEventListener('click', () => sortTable('name'));
  container.querySelector('#sortByDep').addEventListener('click', () => sortTable('department'));
  container.querySelector('#sortByStat').addEventListener('click', () => sortTable('status'));

  return container;
}