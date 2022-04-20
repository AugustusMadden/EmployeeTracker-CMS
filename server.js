const mysql = require('mysql2');
const consoleTable = require('console.table');
const inquirer = require('inquirer');

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
                choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Close application']
                
            }
        )
        .then((data) => {
            if (data.startSelect === 'View all departments') {
                viewDept();
            } 
            else if (data.startSelect === 'View all roles') {
                viewRoles();
            } 
            else if (data.startSelect === 'View all employees') {
                viewEmp();
            } 
            else if (data.startSelect === 'Add a department') {
                addDept();
            } 
            else if (data.startSelect === 'Add a role') {
                addRole();
            } 
            else if (data.startSelect === 'Add an employee') {
                addEmp();
            }
            else if (data.startSelect === 'Update an employee role') {
                roleUpdate();
                return ;
            }
            else if (data.startSelect === 'Close application'){
                process.exit();
            }
        });

}

function viewDept() {
    db.query('SELECT * FROM department', (err, data) => {
        if (err) throw err;
        console.table(data);
        init();
    })
};

function viewRoles() {
    db.query('SELECT * FROM roles', (err, data) => {
        if (err) throw err;
        console.table(data);
        init();
    })
};

function viewEmp() {
    db.query('SELECT * FROM employee', (err, data) => {
        if (err) throw err;
        console.table(data);
        init();
    })
};

function addDept() {
    const deptQuestion = [{
        type: 'input',
        name: 'deptName',
        message: 'Please enter the name of the new department.'
    }];
    inquirer
        .prompt(deptQuestion)
        .then((data) => {
            db.query('INSERT INTO roles (name) VALUES (?)', [data.deptName], (err, result) => {
                console.log('New department added.');
                init();
            })
        })
};

function addRole() {
    const departmentArray = [];
    
    db.query('SELECT * FROM department', (err, result) => {
        for (i = 0; i < result.length; i++) {
            departmentArray.push(result[i].name)
        }
    });
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
        type: 'list',
        name: 'roleDept',
        message: 'Please enter the department of the new role.',
        choices: departmentArray
        }
    ];
    inquirer
    .prompt(roleQuestion)
    .then((data) => {
        db.query('SELECT * FROM department', (err, results) => {
            let deptId = 0;
            for (i=0; i<results.length; i++) {
                if (data.roleDept === results[i].name){
                    deptId = results[i].id
                }
            }
            db.query('INSERT INTO roles (title,salary,department_id) VALUES (?,?,?)', [data.roleName, data.roleSalary, deptId], (err, result) => {
                console.log('New role added.');
                console.log(data.roleName, data.roleSalary, deptId);
                init();
            })
        });
    }) 
};

function addEmp() {
    const roleArray = [];
    
    db.query('SELECT * FROM roles', (err, result) => {
        for (i = 0; i < result.length; i++) {
            roleArray.push(result[i].title)
        }
    });

    const managerArray = [];

    db.query('SELECT first_name, last_name FROM employee', (err, result) => {
        for (i = 0; i < result.length; i++) {
            let managerName = result[i].first_name + ' ' + result[i].last_name;
            managerArray.push(managerName)
        }
    });
    
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
        type: 'list',
        name: 'empRole',
        message: 'Please enter the role of the new employee.',
        choices: roleArray
        },
        {
        type: 'list',
        name: 'empManager',
        message: 'Please enter the name of the manager of the new employee.',
        choices: managerArray
        }
    ];
    inquirer
    .prompt(empQuestion)
    .then((data) => {

        db.query('SELECT * FROM roles', (err, results) => {
            let roleId = 0;
            for (i=0; i < results.length; i++) {
                if (data.empRole === results[i].title){
                    roleId = results[i].id
                }
            }
            db.query('SELECT * FROM employee', (err, results) => {
                const manager = data.empManager.split(" ");
                let managerID = null;
                for (i=0; i < results.length; i++) {
                    console.log(results[i])
                    if (manager[0] === results[i].first_name && manager[1] === results[i].last_name){
                        managerID=results[i].id
                    }
                } 
                db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)', [data.empFirstName, data.empLastName, roleId, managerID], (err, result) => {
                    console.log('New employee added.');
                    console.log(data.empFirstName, data.empLastName, roleId, managerID);
                    init();
                });
            });
        });
    }) 
};

function roleUpdate() {
    const employeeArray = [];

    db.query('SELECT first_name, last_name FROM employee', (err, result) => {
        for (i = 0; i < result.length; i++) {
            let empName = result[i].first_name + ' ' + result[i].last_name;
            employeeArray.push(empName)
            
        }
    });
    const roleArray = [];
    
    db.query('SELECT * FROM roles', (err, result) => {
        for (i = 0; i < result.length; i++) {
            roleArray.push(result[i].title)
        }
    });
    
    const updatedRoleQuestions = [
        {
            type: 'checkbox',
            name: 'dud',
            message: 'Please confirm you are authorized to alter employee role information',
            choices: ['Confirm', "confirm"]
        },
        {
            type: 'list',
            message: 'What is their new role?',
            name: 'empRole',
            choices: roleArray
        },
        {
            type: 'list',
            message: 'Which employee needs their role amended?',
            name: 'empName',
            choices: employeeArray
        }
        
    ]
    inquirer
        .prompt(updatedRoleQuestions)
        .then((data) => {
            let newTitle = data.empRole;
            db.query('SELECT * FROM roles', (err, results) => {
                let newRoleId = 0;
                for (i=0; i<results.length; i++) {
                    if (newTitle === results[i].title){
                        newRoleId = results[i].id;
                        
                    }
                }
                const updatedEmployee = data.empName.split(" ");
                db.query('SELECT * FROM employee', (err, results) => {
                    if (err) {
                        console.log(err)
                    }

                    let employeeID = 0
                    for (i = 0; i < results.length; i++) {
                        if (updatedEmployee[0] === results[i].first_name && updatedEmployee[1] === results[i].last_name) {
                            console.log(results);
                            employeeID = results[i].id;
                        }
                    }
                    db.query('UPDATE employee SET role_id = ? WHERE id = ?', [newRoleId, employeeID], (err, results) => {
                        console.log(results);
                        init();
                    })
                })
        })
        });
};











/* WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database */

init();