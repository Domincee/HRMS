import { employees } from "/public/js/record.js";

const totalEmployee = document.getElementById("totalEmployee");
const employee = document.getElementById("employee");


const newEmpTtl = document.getElementById("newEmpTotal");

function renderTotal() {
  const count = employees.length;
  totalEmployee.textContent = count;
   employee.textContent = count > 1 ? "Employees"   : "Employee";

   
  
}

function renderNewHires(){
    const dateNow = new Date();
    const newHires = employees.filter(emp => {
        const dateHired = new Date(emp.dateHired);
        return dateHired.getFullYear() === dateNow.getFullYear() && dateHired.getMonth() === dateNow.getMonth() && dateHired.getDate() === dateNow.getDate();
    });

    const newEmpCount = newHires.length;
    const newEmp = document.getElementById("newEmp");
     newEmp.textContent = newEmpCount <= 1 ? "New Employee"   : "New Employees";
     newEmpTtl.textContent = newHires.length;
}



const tbBody = document.getElementById("employeeTable");


function renderTable() {
    tbBody.innerHTML = "";

    employees.forEach((emp,index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${emp.firstName}</td>
            <td>${emp.lastName}</td>
            <td>${emp.department}</td>
          
            <td>${emp.active}</td>
            <td>${emp.dateHired}</td>
            <td>
                <button class="btn btn-primary"  onclick="editEmployee(${index})">Edit</button>
                <button class="btn btn-danger" onclick="confirmDeleteEmployee(${index})">Remove</button>
            </td>
        `;
        tbBody.appendChild(row);
    });

}
const confiModal = document.getElementById("confirmationModal");
const confirmBtns = document.getElementById("confirmBtns");
const confirmMess = document.getElementById("confirm-message");

window.confirmDeleteEmployee = function(index) {
    const emp = employees[index];
 
    confirmMess.textContent = `Are you sure you want to remove ${emp.firstName} ${emp.lastName} from the list?`;
    const btnYes = confirmBtns.querySelector(".btn-yes");
    btnYes.onclick = function() {
        employees.splice(index, 1);
        // Re-render the table
        renderTable();
        renderTotal();
        renderNewHires();
    
        confiModal.style.display = "none"; // or use classList.remove('show')
    } 
    
    const btnNo = confirmBtns.querySelector(".btn-no");
    btnNo.onclick = function() {
        setTimeout(() => {
             confiModal.style.display = "none";
        }, 300);
        // or use classList.remove('show')
    }
        
    confiModal.style.display = "block"; 
};


window.cancelDelete = function () {
  confiModal.style.display = "none"; // Or remove "show" class
};

window.editEmployee = function(index) {
    console.log("Edit employee at index:", index);
    console.log("Employee data:", employees[index]);
};
renderTable();
renderNewHires();
renderTotal();