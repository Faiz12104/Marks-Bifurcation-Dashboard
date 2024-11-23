// Save table data to localStorage
function saveTableData(tableId, storageKey) {
  const table = document.getElementById(tableId);
  const rows = table.getElementsByTagName("tbody")[0].rows;
  const data = [];

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].cells;
    data.push({
      groupName: cells[0].textContent,
      marks: cells[1].textContent,
    });
  }

  localStorage.setItem(storageKey, JSON.stringify(data));
}

// Load table data from localStorage
function loadTableData(tableId, storageKey) {
  const table = document.getElementById(tableId).getElementsByTagName("tbody")[0];
  const data = JSON.parse(localStorage.getItem(storageKey)) || [];
  table.innerHTML = ""; // Clear existing rows

  data.forEach((item) => {
    const row = table.insertRow();
    row.insertCell(0).textContent = item.groupName;
    row.insertCell(1).textContent = item.marks;
    row.insertCell(2).innerHTML = `
      <button class="edit-btn" onclick="editRow(this, '${storageKey}', '${tableId}')">Edit</button>
      <button class="delete-btn" onclick="deleteRow(this, '${storageKey}', '${tableId}')">Delete</button>
    `;
  });
}

// Function to add a new student to a group
function addStudentRow() {
  const studentNameInput = document.getElementById("studentNameInput").value.trim();
  const groupNameInput = document.getElementById("groupInput").value.trim();

  if (!studentNameInput || !groupNameInput) {
    alert("Both Group Name and Student Name are required.");
    return;
  }

  // Retrieve student data from localStorage
  let data = JSON.parse(localStorage.getItem("studentData")) || [];

  // Find the target group or create a new one
  let group = data.find(g => g.groupName === groupNameInput);
  
  if (group) {
    // Ensure students is an array
    if (!Array.isArray(group.students)) {
      group.students = [];
    }
    // Add the student to the existing group if not already added
    if (!group.students.includes(studentNameInput)) {
      group.students.push(studentNameInput);
    }
  } else {
    // Create a new group with the student
    data.push({
      groupName: groupNameInput,
      students: [studentNameInput],
    });
  }

  // Save the updated data back to localStorage
  localStorage.setItem("studentData", JSON.stringify(data));

  // Reload student data to update the table
  loadStudentData();

  // Clear input fields
  document.getElementById("studentNameInput").value = '';
  document.getElementById("groupInput").value = '';
}

// Function to load and display student data in the table
function loadStudentData() {
  const table = document.getElementById("studentTable").getElementsByTagName("tbody")[0];
  const data = JSON.parse(localStorage.getItem("studentData")) || [];

  table.innerHTML = ""; // Clear existing rows

  // Loop through the groups and display their students
  data.forEach((item, index) => {
    // Ensure students is an array before calling join()
    if (!Array.isArray(item.students)) {
      item.students = [];  // Default to empty array if invalid data is found
    }

    const row = table.insertRow();
    row.insertCell(0).textContent = item.groupName; // Display group name
    row.insertCell(1).textContent = item.students.join(", "); // Join student names with a comma

    // Add Edit and Delete buttons
    row.insertCell(2).innerHTML = `
      <button class="edit-btn" onclick="editGroupRow(${index})">Edit</button>
      <button class="delete-btn" onclick="deleteGroupRow(${index})">Delete</button>
    `;
  });
}

// Function to edit a group row
function editGroupRow(index) {
  const data = JSON.parse(localStorage.getItem("studentData")) || [];
  const group = data[index];

  const newGroupName = prompt("Edit Group Name:", group.groupName);
  const newStudents = prompt("Edit Students (comma-separated):", group.students.join(", "));

  if (newGroupName && newStudents) {
    group.groupName = newGroupName.trim();
    group.students = newStudents.split(",").map(s => s.trim()); // Update student list
    localStorage.setItem("studentData", JSON.stringify(data)); // Save changes
    loadStudentData(); // Reload table
  }
}

// Function to delete a group row
function deleteGroupRow(index) {
  const data = JSON.parse(localStorage.getItem("studentData")) || [];
  
  if (confirm(`Are you sure you want to delete the group "${data[index].groupName}"?`)) {
    data.splice(index, 1); // Remove the selected group
    localStorage.setItem("studentData", JSON.stringify(data)); // Save changes
    loadStudentData(); // Reload table
  }
}

// Load student data when the page loads
document.addEventListener("DOMContentLoaded", loadStudentData);





// Add a new row to the presentation table with dynamic maxMarks
function addRow(tableId, storageKey) {
  const table = document.getElementById(tableId).getElementsByTagName("tbody")[0];
  const row = table.insertRow();

  // Determine the maximum marks based on the current page
  let maxMarks = 25; // Default value
  if (window.location.pathname.includes("presentation3.html")) {
    maxMarks = 50;
  }

  row.insertCell(0).innerHTML = `<input type="text" placeholder="Group Name" />`;
  row.insertCell(1).innerHTML = `<input type="number" min="0" max="${maxMarks}" placeholder="Marks" />`;
  row.insertCell(2).innerHTML = `
    <button class="save-btn" onclick="saveRow(this, '${storageKey}', '${tableId}')">Save</button>
    <button class="delete-btn" onclick="deleteRow(this, '${storageKey}', '${tableId}')">Delete</button>
  `;
}

// Save a row after editing
function saveRow(button, storageKey, tableId) {
  const row = button.parentElement.parentElement;
  const groupName = row.cells[0].querySelector("input").value;
  const marks = parseInt(row.cells[1].querySelector("input").value, 10);

  // Determine the maximum marks based on the current page
  let maxMarks = 25; // Default value
  if (window.location.pathname.includes("presentation3.html")) {
    maxMarks = 50;
  }

  if (groupName && marks >= 0 && marks <= maxMarks) {
    row.cells[0].textContent = groupName;
    row.cells[1].textContent = marks;
    row.cells[2].innerHTML = `
      <button class="edit-btn" onclick="editRow(this, '${storageKey}', '${tableId}')">Edit</button>
      <button class="delete-btn" onclick="deleteRow(this, '${storageKey}', '${tableId}')">Delete</button>
    `;

    saveTableData(tableId, storageKey); // Save to localStorage
  } else {
    alert(`Please enter valid marks between 0 and ${maxMarks}.`);
  }
}

// Edit a row
function editRow(button, storageKey, tableId) {
  const row = button.parentElement.parentElement;
  const groupName = row.cells[0].textContent;
  const marks = row.cells[1].textContent;

  // Determine the maximum marks based on the current page
  let maxMarks = 25; // Default value
  if (window.location.pathname.includes("presentation3.html")) {
    maxMarks = 50;
  }

  row.cells[0].innerHTML = `<input type="text" value="${groupName}" />`;
  row.cells[1].innerHTML = `<input type="number" value="${marks}" min="0" max="${maxMarks}" />`;
  row.cells[2].innerHTML = `
    <button class="save-btn" onclick="saveRow(this, '${storageKey}', '${tableId}')">Save</button>
    <button class="delete-btn" onclick="deleteRow(this, '${storageKey}', '${tableId}')">Delete</button>
  `;
}

// Delete a row
function deleteRow(button, storageKey, tableId) {
  const row = button.parentElement.parentElement;
  row.remove();
  saveTableData(tableId, storageKey); // Save after deletion
}

// Save table data to localStorage
function saveTableData(tableId, storageKey) {
  const table = document.getElementById(tableId).getElementsByTagName("tbody")[0];
  const rows = table.rows;
  const data = Array.from(rows).map(row => ({
    groupName: row.cells[0].textContent,
    marks: row.cells[1].textContent,
  }));

  localStorage.setItem(storageKey, JSON.stringify(data)); // Save to localStorage
}

// Load table data from localStorage
function loadTableData(tableId, storageKey) {
  const table = document.getElementById(tableId).getElementsByTagName("tbody")[0];
  const data = JSON.parse(localStorage.getItem(storageKey)) || [];
  table.innerHTML = ""; // Clear existing rows

  data.forEach((item) => {
    const row = table.insertRow();
    row.insertCell(0).textContent = item.groupName;
    row.insertCell(1).textContent = item.marks;
    row.insertCell(2).innerHTML = `
      <button class="edit-btn" onclick="editRow(this, '${storageKey}', '${tableId}')">Edit</button>
      <button class="delete-btn" onclick="deleteRow(this, '${storageKey}', '${tableId}')">Delete</button>
    `;
  });
}

// Load the data when the page is loaded
document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("presentation1.html")) {
    loadTableData("presentationTable", "presentation1Data");
  } else if (window.location.pathname.includes("presentation2.html")) {
    loadTableData("presentationTable", "presentation2Data");
  } else if (window.location.pathname.includes("presentation3.html")) {
    loadTableData("presentationTable", "presentation3Data");
  } else if (window.location.pathname.includes("result.html")) {
    loadResultData();
  }
});

// Calculate and display results
function loadResultData() {
  const resultTable = document.getElementById("resultTable").getElementsByTagName("tbody")[0];
  const data1 = JSON.parse(localStorage.getItem("presentation1Data")) || [];
  const data2 = JSON.parse(localStorage.getItem("presentation2Data")) || [];
  const data3 = JSON.parse(localStorage.getItem("presentation3Data")) || [];
  const allGroups = {};

  const maxMarks = {
    presentation1: 25,
    presentation2: 25,
    presentation3: 50,
  };

  [data1, data2, data3].forEach((data, index) => {
    const presentationKey = `presentation${index + 1}`;
    const totalMaxMarks = maxMarks[presentationKey];

    data.forEach((item) => {
      const groupName = item.groupName;
      const marks = parseInt(item.marks, 10) || 0;

      if (!allGroups[groupName]) allGroups[groupName] = { total: 0, maxMarks: 0 };
      allGroups[groupName].total += marks;
      allGroups[groupName].maxMarks += totalMaxMarks;
    });
  });

  const results = Object.keys(allGroups)
    .map((groupName) => {
      const totalMarks = allGroups[groupName].total;
      const maxMarks = allGroups[groupName].maxMarks;
      const percentage = ((totalMarks / maxMarks) * 100).toFixed(2);
      return { groupName, totalMarks, percentage };
    })
    .sort((a, b) => b.percentage - a.percentage);

  results.forEach((result) => {
    const row = resultTable.insertRow();
    row.insertCell(0).textContent = result.groupName;
    row.insertCell(1).textContent = result.totalMarks;
    row.insertCell(2).textContent = `${result.percentage}%`;
  });
}



// Check if the user is logged in
if (localStorage.getItem('isLoggedIn')) {
  // User is logged in, show the logout button
  document.getElementById('logoutBtn').style.display = 'block';
  
  // Display user information (for example, username)
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  document.getElementById('userInfo').textContent = `Hello, ${loggedInUser.username}!`;

} else {
  // If not logged in, redirect to login page
  window.location.href = 'index.html'; // Redirect to login page if not logged in
}

// Handle logout
document.getElementById('logoutBtn').addEventListener('click', function() {
  // Clear login state
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('loggedInUser');

  // Redirect to login page
  window.location.href = 'login.html'; // Replace with your login page
});

