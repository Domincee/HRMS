
import { employeesFromRecord } from './data/employee.js';


const form = document.getElementById('employeeForm');



// Get values from gender buttons
const genderButtons = document.querySelectorAll('.gender-btn button');
let selectedGender = null;

genderButtons.forEach(btn => { 
    btn.addEventListener('click', () => {
        selectedGender = btn.dataset.gender;
    });
});


const statusBtn = document.querySelectorAll('.status-btn button');
let selectedStatus = null;

statusBtn.forEach(btn => { 
    btn.addEventListener('click', () => {
         statusBtn.forEach(b => b.classList.remove('selected'));
         btn.classList.add('selected');
         selectedStatus = btn.dataset.status === 'true';
    });
});



// Form submission logic
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const age = parseInt(document.getElementById('Age').value);
    const department = document.getElementById('department').value;
    const dateHired = document.getElementById('dateHired').value;
    const editingEmployeeId = sessionStorage.getItem('editingEmployeeId');

      if (!editingEmployeeId) {
            console.warn("No editing employee ID found in session storage.");
            return;
        }


        const currentEmployee = employeesFromRecord.find(emp => emp.id === Number(editingEmployeeId));
         if (!currentEmployee) {
        console.warn("Employee not found.");
         return;
      }

      const  gender = selectedGender !== null ? selectedGender : currentEmployee.gender;
      
      const  status = selectedStatus !== null ? selectedStatus : currentEmployee.status;
    // Create employee object
    const updatedData = {
        firstName,
        lastName,
        department,
        age,
        dateHired,
        gender,
        status
    };

    // 🔍 Print the data
    console.log("Updating employee with ID:", editingEmployeeId);
    console.log(updatedData);

       updateEmployeeRecord(Number(editingEmployeeId), updatedData);
});

const updateEmployeeRecord = (employeeId, updatedData) => {
    const empIndex = employeesFromRecord.findIndex(emp => emp.id === employeeId);

    if (empIndex !== -1) {
        employeesFromRecord[empIndex] = {
            ...employeesFromRecord[empIndex],
            ...updatedData
        };

        // Save to localStorage
        localStorage.setItem('employees', JSON.stringify(employeesFromRecord));

        console.log(`Updated Employee ${employeeId}:`, employeesFromRecord[empIndex]);

          if (window.renderEmployeeTable) {
          window.renderEmployeeTable([...employeesFromRecord]);
      }


    } else {
        console.log(`Employee ID ${employeeId} not found.`);
    }
};


