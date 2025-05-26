

window.initDepartmentSuggestions = function (departmentInputId, employees) {
  
  
  const departmentInput = document.getElementById(departmentInputId);
  if (!departmentInput) {
    console.error(`Element with ID '${departmentInputId}' not found.`);
    return;
  }

  const suggestionBox = document.createElement("div");
  suggestionBox.classList.add("suggestions");
  suggestionBox.style.position = "absolute";
  suggestionBox.style.zIndex = "1001";
  suggestionBox.style.display = "none";
  suggestionBox.style.border = "1px solid #ccc";
  suggestionBox.style.background = "#fff";
  suggestionBox.style.maxHeight = "150px";
  suggestionBox.style.overflowY = "auto";
  suggestionBox.style.width = "100%";

  departmentInput.parentNode.style.position = "relative";
  departmentInput.parentNode.appendChild(suggestionBox);

  function showSuggestions() {
    const query = departmentInput.value.toLowerCase();
    const departments = [...new Set(employees.map(emp => emp.department.trim()))];
    const filtered = departments.filter(dept => dept.toLowerCase().includes(query));

    suggestionBox.innerHTML = "";

    if (filtered.length > 0) {
      suggestionBox.style.display = "block";
      filtered.forEach(dept => {
        const div = document.createElement("div");
        div.textContent = dept;
        div.style.padding = "8px 10px";
        div.style.cursor = "pointer";

        div.addEventListener("click", () => {
          departmentInput.value = dept;
          suggestionBox.style.display = "none";
        });

        div.addEventListener("mouseenter", () => {
          div.style.backgroundColor = "#f0f0f0";
        });
        div.addEventListener("mouseleave", () => {
          div.style.backgroundColor = "#fff";
        });

        suggestionBox.appendChild(div);
      });
    } else {
      suggestionBox.style.display = "none";
    }
  }

  departmentInput.addEventListener("input", showSuggestions);
  departmentInput.addEventListener("focus", showSuggestions);

  document.addEventListener("click", (e) => {
    if (!departmentInput.contains(e.target) && !suggestionBox.contains(e.target)) {
      suggestionBox.style.display = "none";
    }
  });
}