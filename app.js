let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const name = document.getElementById("taskName").value;
  const category = document.getElementById("taskCategory").value;
  const deadline = document.getElementById("taskDeadline").value;
  const status = document.getElementById("taskStatus").value;

  if (!name || !category || !deadline) {
    alert("Please fill out all fields.");
    return;
  }

  tasks.push({ name, category, deadline, status });
  saveTasks();
  displayTasks();
  clearForm();
}

function clearForm() {
  document.getElementById("taskName").value = "";
  document.getElementById("taskCategory").value = "";
  document.getElementById("taskDeadline").value = "";
  document.getElementById("taskStatus").value = "In Progress";
}

function updateTaskStatus(index, newStatus) {
  tasks[index].status = newStatus;
  saveTasks();
  displayTasks();
}

function getStatus(task) {
  const today = new Date().toISOString().split("T")[0];
  if (task.status !== "Completed" && task.deadline < today) {
    return "Overdue";
  }
  return task.status;
}

function displayTasks(filtered = tasks) {
  const tbody = document.getElementById("taskBody");
  tbody.innerHTML = "";
  filtered.forEach((task, index) => {
    const row = tbody.insertRow();
    row.insertCell().innerText = task.name;
    row.insertCell().innerText = task.category;
    row.insertCell().innerText = task.deadline;
    row.insertCell().innerText = getStatus(task);

    const select = document.createElement("select");
    ["In Progress", "Completed"].forEach(status => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = status;
      if (task.status === status) option.selected = true;
      select.appendChild(option);
    });
    select.onchange = () => updateTaskStatus(index, select.value);
    row.insertCell().appendChild(select);
  });
}

function filterTasks() {
  const status = document.getElementById("statusFilter").value;
  const category = document.getElementById("categoryFilter").value.toLowerCase();

  const filtered = tasks.filter(task => {
    const statusMatch = status === "All" || getStatus(task) === status;
    const categoryMatch = !category || task.category.toLowerCase().includes(category);
    return statusMatch && categoryMatch;
  });

  displayTasks(filtered);
}

window.onload = () => displayTasks();
