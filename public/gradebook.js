document.addEventListener("DOMContentLoaded", function() {
    fetchGradeData();
});

function fetchGradeData() {
    console.log("Fetching grade data...");
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status !== 200) {
                console.error(`Could not get grades. Status: ${xhr.status}`);
                return;
            }
            console.log("Raw response:", xhr.responseText);
            populateGradebook(JSON.parse(xhr.responseText));
        }
    };
    xhr.open("get", "/api/grades", true);
    xhr.send();
}

function populateGradebook(data) {
    console.log("Populating gradebook with data:", data);
    let tableElm = document.querySelector("#gradebook tbody"); // important fix
    if (!tableElm) {
        console.error("Could not find the gradebook table element.");
        return;
    }

    tableElm.innerHTML = ""; // Clear previous rows

    data.forEach(function (assignment) {
        let row = document.createElement("tr");

        let nameCell = document.createElement('td');
        nameCell.textContent = `${assignment.last_name}, ${assignment.first_name}`;

        let gradeCell = document.createElement('td');
        gradeCell.textContent = assignment.total_grade;

        row.appendChild(nameCell);
        row.appendChild(gradeCell);

        tableElm.appendChild(row);
    });
}
