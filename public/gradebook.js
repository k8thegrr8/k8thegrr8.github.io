window.onload = function () {
    fetchGradeData();
};

function fetchGradeData() {
    console.log("Fetching grade data...");
    let xhr = new XMLHttpRequest();
    let apiRoute = "/api/grades";

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status !== 200) {
                console.error(`Could not get grades. Status: ${xhr.status}`);
                return;
            }

            try {
                const data = JSON.parse(xhr.responseText);
                populateGradebook(data);
            } catch (e) {
                console.error("Failed to parse JSON response:", e);
            }
        }
    };

    xhr.open("GET", apiRoute, true);
    xhr.send();
}

function populateGradebook(data) {
    console.log("Populating gradebook with data:", data);

    let tableElm = document.querySelector("#gradebook tbody");
    if (!tableElm) {
        console.error("Could not find table body.");
        return;
    }

    tableElm.innerHTML = ""; // Optional: clear old rows

    data.forEach(function (assignment) {
        let row = document.createElement("tr");

        let nameCell = document.createElement("td");
        nameCell.textContent = `${assignment.last_name}, ${assignment.first_name}`;

        let gradeCell = document.createElement("td");
        gradeCell.textContent = assignment.total_grade;

        row.appendChild(nameCell);
        row.appendChild(gradeCell);

        tableElm.appendChild(row);
    });
}
