// script.js

let data = JSON.parse(localStorage.getItem("attendanceData")) || {};
let currentCourse = "",
  currentSemester = "",
  currentSubject = "",
  currentDate = "";

const courseSelect = document.getElementById("courseSelect");
const semesterSelect = document.getElementById("semesterSelect");
const subjectSelect = document.getElementById("subjectSelect");
const dateSelect = document.getElementById("dateSelect");
const studentList = document.getElementById("studentList");
const searchInput = document.getElementById("searchInput");

// Sample dropdown data
const courses = ["BCA", "MCA", "BTECH", "BBA", "LLB"];
const semesters = [
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
];
const subjects = ["c1", "c2", "c3", "c4", "c5", "c6"];

// Populate dropdowns
[courses, semesters, subjects].forEach((items, index) => {
  const select = [courseSelect, semesterSelect, subjectSelect][index];
  select.innerHTML = items
    .map((item) => `<option value="${item}">${item}</option>`)
    .join("");
});

function getKey() {
  return `${currentCourse}_${currentSemester}_${currentSubject}_${currentDate}`;
}

function loadData(highlight = "") {
  const key = getKey();
  const list = (data[key] && data[key].students) || [];
  renderList(list, highlight);
}

function saveData() {
  localStorage.setItem("attendanceData", JSON.stringify(data));
}

function renderList(students, highlightTerm = "") {
  const search = searchInput.value.toLowerCase();
  studentList.innerHTML = "";

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search) ||
      s.roll.toLowerCase().includes(search)
  );

  // If no match, show warning popup
  if (filtered.length === 0 && search.trim() !== "") {
    const popup = document.getElementById("noStudentFound");
    popup.style.display = "block";
    setTimeout(() => {
      popup.style.display = "none";
    }, 3000);
    return;
  }

  filtered.forEach((student, index) => {
    const isHighlight =
      student.name.toLowerCase() === highlightTerm ||
      student.roll.toLowerCase() === highlightTerm;

    const li = document.createElement("li");
    li.className = isHighlight ? "highlight" : "";
    li.innerHTML = `
      <span>${student.name} (${student.roll})</span>
      <span>
        <input type="checkbox" ${
          student.present ? "checked" : ""
        } onchange="toggleAttendance(${index})" />
        <button onclick="deleteStudent(${index})">❌</button>
      </span>
    `;
    studentList.appendChild(li);
    if (isHighlight) li.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

function updateCurrentSelection() {
  currentCourse = courseSelect.value;
  currentSemester = semesterSelect.value;
  currentSubject = subjectSelect.value;
  currentDate = dateSelect.value;

  const key = getKey();
  if (!data[key]) data[key] = { students: [] };
  loadData();
}

function addStudent() {
  const name = document.getElementById("studentName").value;
  const roll = document.getElementById("studentRoll").value;
  if (!name || !roll) return alert("Enter name and roll");

  const key = getKey();
  data[key].students.push({ name, roll, present: false });
  saveData();
  loadData();
  document.getElementById("studentName").value = "";
  document.getElementById("studentRoll").value = "";
}

function deleteStudent(index) {
  if (!confirm("Are you sure?")) return;
  const key = getKey();
  data[key].students.splice(index, 1);
  saveData();
  loadData();
}

function toggleAttendance(index) {
  const key = getKey();
  data[key].students[index].present = !data[key].students[index].present;
  saveData();
}

function exportToCSV() {
  const key = getKey();
  const rows = [["Name", "Roll No", "Present"]];
  data[key].students.forEach((s) => {
    rows.push([s.name, s.roll, s.present ? "Yes" : "No"]);
  });

  const csvContent = rows.map((e) => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${key}_attendance.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

document.getElementById("csvInput").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const lines = event.target.result.trim().split("\n");
    const [header, ...dataLines] = lines;

    if (
      !header.toLowerCase().includes("name") ||
      !header.toLowerCase().includes("roll")
    ) {
      alert("Invalid CSV format. Make sure it starts with 'Name,Roll No'");
      return;
    }

    const key = getKey();
    if (!data[key]) data[key] = { students: [] };

    const newStudents = dataLines
      .map((line) => {
        const [name, roll] = line.split(",").map((s) => s.trim());
        return name && roll ? { name, roll, present: false } : null;
      })
      .filter(Boolean);

    data[key].students.push(...newStudents);
    saveData();
    loadData();

    alert(`${newStudents.length} students imported successfully.`);
  };

  reader.readAsText(file);
});

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

// 🔍 Search button to highlight student
document.getElementById("searchBtn").addEventListener("click", () => {
  const term = searchInput.value.trim().toLowerCase();
  const key = getKey();
  const students = data[key]?.students || [];
  renderList(students, term);
});

[courseSelect, semesterSelect, subjectSelect, dateSelect].forEach((el) => {
  el.addEventListener("change", updateCurrentSelection);
});
searchInput.addEventListener("input", () => loadData());
document.getElementById("addStudentBtn").addEventListener("click", addStudent);
document
  .getElementById("logoutBtn")
  .addEventListener("click", () => alert("Logout clicked"));

updateCurrentSelection();
