 /* DARK AND LIGHT MODE */

document.addEventListener('DOMContentLoaded', function() {
    // Check user's preference from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Theme toggle button
    document.getElementById('themeToggle').addEventListener('click', function() {
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  });


  
    // Load logged-in company data
    const loggedInCompany = JSON.parse(localStorage.getItem('loggedInCompany'));

    if (loggedInCompany) {
      document.getElementById('logo').textContent = loggedInCompany.company;
    } else {
      alert('No user logged in');
      window.location.href = 'index.html'; // Redirect to login page
    }

    // Load and manage employees data
    let employees = JSON.parse(localStorage.getItem('employees')) || [];

    function saveEmployees() {
      localStorage.setItem('employees', JSON.stringify(employees));
    }

    function displayEmployees() {
      const tbody = document.querySelector("#employeeTable tbody");
      tbody.innerHTML = "";

      employees.forEach((emp, index) => {
        let row = document.createElement('tr');
        row.innerHTML = `
          <td>${emp.name}</td>
          <td>${emp.position}</td>
          <td>${emp.hoursWorked}</td>
          <td>${emp.absentDays}</td>
         <td><button class="delete-btn" onclick="deleteEmployee(${index})">Delete</button></td>
        `;
        tbody.appendChild(row);
      });
    }

    function addEmployee() {
      const name = document.getElementById('empName').value.trim();
      const position = document.getElementById('empPosition').value.trim();
      const hoursWorked = parseInt(document.getElementById('hoursWorked').value);
      const absentDays = parseInt(document.getElementById('absentDays').value);

      if (name && position && !isNaN(hoursWorked) && !isNaN(absentDays)) {
        // Add new employee to the list
        employees.push({ name, position, hoursWorked, absentDays });
        saveEmployees();
        displayEmployees();
        clearForm();
      } else {
        alert("Please fill out all fields correctly.");
      }
    }

            let deleteIndex = null;

        function deleteEmployee(index) {
        deleteIndex = index;
        document.getElementById('confirmModal').classList.remove('hidden');
        }

        document.getElementById('confirmYes').addEventListener('click', function() {
        if (deleteIndex !== null) {
            employees.splice(deleteIndex, 1);
            saveEmployees();
            displayEmployees();
            deleteIndex = null;
        }
        document.getElementById('confirmModal').classList.add('hidden');
        });

        document.getElementById('confirmNo').addEventListener('click', function() {
        deleteIndex = null;
        document.getElementById('confirmModal').classList.add('hidden');
        });

    function clearForm() {
      document.getElementById('empName').value = "";
      document.getElementById('empPosition').value = "";
      document.getElementById('hoursWorked').value = "";
      document.getElementById('absentDays').value = "";
    }

    // Logout function
    function logout() {
      localStorage.removeItem('loggedInCompany');
      window.location.href = 'index.html'; // Redirect to login page
    }

    // Display existing employees when page loads
    displayEmployees();

