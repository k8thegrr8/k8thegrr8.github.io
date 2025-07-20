
// This section loads modules.  It loads the Express server and stores
// it in "express", then creates a application, a router, and a path handler
const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');

// This part sets up the database
const {Pool} = require('pg');
// You may need to modify the password or database name in the following line:
const connectionString = `postgres://postgres:CTI_110_WakeTech@localhost/Gradebook`;
// The default password is CTI_110_WakeTech
// The default database name is Gradebook
const pool = new Pool({connectionString:connectionString})

// This line says when it's looking for a file linked locally,
// check in sub-folder "public"
app.use(express.static(path.join(__dirname, 'public')));

// This creates a new anonymous function that runs whenever 
// someone calls "get" on the server root "/"
router.get('/', function(req, res){
    // It just returns a file to their browser 
    // from the same directory it's in, called gradebook.html
    res.sendFile(path.join(__dirname, 'gradebook.html'));
});

app.use("/", router);

router.get('/api/grades',function(req, res){
    pool.query(
        `SELECT Students.student_id, first_name, last_name, AVG(assignments.grade) as total_grade \
            FROM Students  \
            LEFT JOIN Assignments ON Assignments.student_id = Students.student_id \
            GROUP BY Students.student_id \
            ORDER BY total_grade DESC`,
        [],
        function( err, result){
            if(err)
            {
                console.error(err);
            }
            
            result.rows.forEach( 
                    function(row){
                        console.log(`Student Name: ${row.first_name} ${row.last_name}`);
                        console.log(`Grade: ${row.total_grade}`);
                    }
            ); // End of forEach
            
            res.status(200).json(result.rows);
        }
    );
});

let server = app.listen(3000, function(){
    console.log("App Server via Express is listening on port 3000");
    console.log("To quit, press CTRL + C");
});
function fetchGradeData() {
    //This function will query the PostgreSQL database and return grade data 
    console.log("Fetching grade data...");
    //Create a new request for HTTP data
    let xhr = new XMLHttpRequest();
    // This will address on the machine we're asking for data
    let apiRoute = "/api/grades";
    // When the request changes status, we run this anonymous function
    xhr.onreadystatechage = function (){
        let results;
        // Check if we're done
        if(xhr.readyState === xhr.DONE) {
            // Check if we're successful
            if(xhr.status !== 200){
                console.error(`Could not get grades. 
                    Status: ${xhr.status}`);
            }
            // And then call the function to update the HTML with our data
            populateGradebook(JSON.parse(xhr.responseText));
        }

    }.bind(this);
    xhr.open("get", apiRoute, true);
    xhr.send();
}

function populateGradebook(data) {
    // This function will take the fetched grade data and populate the table
    console.log("Populating gradebook with data:", data);
    let tableElm = document.getElementByID("gradebook"); //Get the gradebook table element
        data.forEach(function(assignment){ // For each row of data we're passed in
            let row = document.createElement("tr"); // create a table row element
            let columns = []; // Hand place to stick the columns of information
            columns.name = document.createElement('td'); // The first column's table data will be the name
            columns.name.appendChild(
                // Concatenate the full name:  "last_name, first_name"
                document.createTextNode(assignment.last_name + ", " = assignment.first_name)
            );
            columns.grade = document.createElement('td'); // second column will be the grade
            columns.grade.appendChild(
                // Just put the name in text, you could be fancy and figure out the letter grade here
                // with either a bunch of conditions, or a JavaScript "switch" statement
                document.createTextNode(assignment.total_grade)
            );
            // Add the table data columns to the table row
            row.appendChild(columns.name);
            row.appendChild(columns.grade);
        });
}