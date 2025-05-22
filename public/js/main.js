import { employees } from "/public/js/record.js";

const totalEmployee = document.getElementById("totalEmployee");
const employee = document.getElementById("employee");
let editingIndex = -1;

/* ALERT  */
const confirmBtns = document.getElementById("confirmBtns");
const confirmMess = document.getElementById("confirm-message");


/* MODALS */
const formModal = document.querySelector(".form-modal");
const confiModal = document.getElementById("confirmationModal");





/*SHOW FORM EMPLOYEE */
const addNew = document.querySelector(".add-new");
const cancelAdd = document.querySelector(".cancel-add");
 const dateInput = document.getElementById("dateHired");
addNew.addEventListener("click", function() {

    confiModal.style.display = "none"; 
    formModal.style.display = "flex"; 
    formEmp.style.flexDirection = "column";
   
     if (dateInput) {
    dateInput.style.display = "none"; // Hide the date input
  }

});
cancelAdd.addEventListener("click", function() {

 formModal.style.display = "none"; 
});


const formEmp = document.getElementById("employeeForm");
const fNameInput = document.getElementById("firstName");
const lNameInput = document.getElementById("lastName");
const depInput = document.getElementById("department");




formEmp.addEventListener('submit', function (e) {
  e.preventDefault();
  const firstName = fNameInput.value.trim();
  const lastName = lNameInput.value.trim();
  const department = depInput.value.trim();

  if (editingIndex >= 0) {
    employees[editingIndex] = { firstName, lastName, department, active: true, dateHired: new Date().toLocaleDateString() };
    editingIndex = -1;

  } else {
    employees.push({ firstName, lastName, department,active: true, dateHired: new Date().toLocaleDateString() });
  }

  formEmp.reset();
  renderTable();
});

/* ADD MODAL */
window.confirmDeleteEmployee = function(index) {
    formModal.style.display = "none"; 
    const emp = employees[index];
    confirmMess.textContent = `Are you sure you want to remove ${emp.firstName} ${emp.lastName} from the list?`;
    const btnYes = confirmBtns.querySelector(".btn-yes");
    btnYes.onclick = function() {
   

       setTimeout(() => {
             confiModal.style.display = "none";
        }, 300); 
        employees.splice(index, 1);    
        renderTable();
        renderTotal();
        renderNewHires();  
    } 
    
    const btnNo = confirmBtns.querySelector(".btn-no");
    btnNo.onclick = function() {
        setTimeout(() => {
             confiModal.style.display = "none";
        }, 300);
      
    }
        
    confiModal.style.display = "flex"; 
};



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

window.editEmployee = function(index) {
  console.log("Edit employee at index:", index);

  // Show modal
  formModal.style.display = "flex";
  formEmp.style.flexDirection = "row";

  /* Add inputs dateHire*/  
    if (!document.getElementById("dateHired")) {
    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.id = "dateHired";
    dateInput.name = "dateHired";
    dateInput.required = true;

    // Set max date to today
    const today = new Date().toISOString().split("T")[0];
    dateInput.max = today;

    // Insert before buttons div
    const btnsDiv = formEmp.querySelector(".btns");
    formEmp.insertBefore(dateInput, btnsDiv);
    }

  // Fill inputs
  const emp = employees[index];
  document.getElementById("firstName").value = emp.firstName;
  document.getElementById("firstName").setAttribute("placeholder", emp.firstName);
  document.getElementById("lastName").value = emp.lastName;
    document.getElementById("lastName").setAttribute("placeholder", emp.lastName);
  document.getElementById("department").value = emp.department;
 document.getElementById("department").setAttribute("placeholder", emp.department);
  editingIndex = index;

 

};






window.cancelDelete = function () {
  confiModal.style.display = "none"; // Or remove "show" class
};


renderTable();
renderNewHires();
renderTotal();