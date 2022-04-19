const mysql = require('mysql2');

const fs = require('fs');
const inquirer = require('inquirer');

const randID = require('./utils/randID')
//IMPORT questions from index.js

/* app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static('public'))

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
); */

    const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'MaddenSQL_alpha903',
        database: 'employeelist_db'
    },
    console.log(`Connected to the employeelist_db database.`)
);

db.connect((err) => {
    if (err) {
      return console.error('error: ' + err.message);
    }
});
function init() {
    //Load all seed data into schema tables on initiation
    
     inquirer
        .prompt(
            {
                type: 'list',
                name: 'startSelect',
                message: 'What would you like to do today?',
                choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
                
            }
        )

        .then((data) => {
            console.log(data);

            if (data.startSelect === 'View all departments') {
                    const sql = `SELECT * FROM department`;

                    db.query(sql, (err, rows) => {
                    });
            } 
            else if (data.startSelect === 'View all roles') {
                const sql = `SELECT * FROM roles`;

                db.query(sql, (err, rows) => {
                });
            } 
            else if (data.startSelect === 'View all employees') {
                const sql = `SELECT * FROM roles`;

                db.query(sql, (err, rows) => {
                });
            } 
            else if (data.startSelect === 'Add a department') {
                inquirer
                    .prompt(deptQuestion)
                    .then((data) => {
                        console.log(data)
                        init();
                    });
            } 
            else if (data.startSelect === 'Add a role') {
                inquirer
                    .prompt(roleQuestion)
                    .then((data) => {
                        console.log(data)
                    });
            } 
            else if (data.startSelect === 'Add an employee') {
                inquirer
                    .prompt(empQuestion)
                    .then((data) => {
                        console.log(data)
                    });
            }
            else if (data.startSelect === 'Update an employee role') {
                return ;
            }
        });

}

const deptQuestion = [{
    type: 'input',
    name: 'deptName',
    message: 'Please enter the name of the new department.'
}];


const roleQuestion = [
    {
    type: 'input',
    name: 'roleName',
    message: 'Please enter the name of the new role.'
    },  
    {type: 'input',
    name: 'roleSalary',
    message: 'Please enter the salary of the new role.'
    },  
    {
    type: 'input',
    name: 'roleDept',
    message: 'Please enter the department of the new role.'
    }
];


const empQuestion = [{
    type: 'input',
    name: 'empFirstName',
    message: 'Please enter the first name of the new employee.'
    },
    {
    type: 'input',
    name: 'empLastName',
    message: 'Please enter the last name of the new employee.'
    },
    {
    type: 'input',
    name: 'empRole',
    message: 'Please enter the role of the new employee.'
    },
    {
    type: 'input',
    name: 'empManager',
    message: 'Please enter the name of the manager new employee.'
    }
]


/* WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database */


/* app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
}) */

init();