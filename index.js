const jest = require("jest");
const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const mustache = require("mustache");
const Employee = require("./lib/Employee")
const Manager = require("./lib/Manager")
const Engineer = require("./lib/Engineer")
const Intern = require("./lib/Intern")
const writeFileAsync = util.promisify(fs.writeFile);
const employeeArray = [];
const idArray = [];
let template = "";
async function addEmployee() {
    return inquirer.prompt(
        {
            type: "list",
            name: "add",
            message: "Would you like to add an employee?",
            choices: ["Yes","No"]
        }
    );
}
async function addAnother() {
    return inquirer.prompt(
        {
            type: "list",
            name: "add",
            message: "Would you like to add another employee?",
            choices: ["Yes","No"]
        }
    );
}
async function employeeRole() {
    return inquirer.prompt(
        {
            type: "list",
            name: "role",
            message: "What is the employee role?",
            choices: ["Employee", "Manager", "Engineer", "Intern"]
        }
    );
}
async function inputName() {
    return inquirer.prompt(
        {
            type: "input",
            name: "name",
            message: "What is the employee's name?",
        }
    );
}
async function inputID() {
    return inquirer.prompt(
        {
            type: "number",
            name: "id",
            message: "What is the employee ID?",
        }
    );
}
async function inputEmail() {
    return inquirer.prompt(
        {
            type: "input",
            name: "email",
            message: "What is the employee's email address?",
        }
    );
}
async function inputOfficeNumber() {
    return inquirer.prompt(
        {
            type: "number",
            name: "officeNumber",
            message: "What is the manager's office number?",
        }
    );
}
async function inputGithub() {
    return inquirer.prompt(
        {
            type: "input",
            name: "github",
            message: "What is the engineer's GitHub username?",
        }
    );
}
async function inputSchool() {
    return inquirer.prompt(
        {
            type: "input",
            name: "school",
            message: "What is the intern's school?",
        }
    );
}

async function init() {
    console.log("hi");
    try {
      let add = await addEmployee();
      while(add.add == "Yes"){
        let name = await inputName();
        let id = await inputID();
        while(idArray.includes(id.id) || Number.isNaN(id.id)){
            if (idArray.includes(id.id)){
                console.log("This ID is in use.  Please input a unique ID.")
                id = await inputID();
            }
            if (Number.isNaN(id.id)){
                console.log("ID must be a number.")
                id = await inputID();
            }
        }
        idArray.push(id.id);
        let email = await inputEmail();
        //validate emails here later if you feel like it and have time
        let role = await employeeRole();
        if (role.role=="Employee"){
            let employee = new Employee(name.name, id.id, email.email);
            employeeArray.push(employee);
        }
        else if (role.role=="Manager"){
            let officeNumber = await inputOfficeNumber();
            while (officeNumber.officeNumber == NaN){
                console.log("Office Number must be a number.")
                officeNumber = await inputOfficeNumber();
            }
            let employee = new Manager(name.name, id.id, email.email, officeNumber.officeNumber);
            employeeArray.push(employee);
        }
        else if (role.role=="Engineer"){
            let github = await inputGithub();
            //Validate that it's a real username and the link works?
            let employee = new Engineer(name.name, id.id, email.email, github.github);
            employeeArray.push(employee);
        }
        else if (role.role=="Intern"){
            let school = await inputSchool();
            let employee = new Intern(name.name, id.id, email.email, school.school);
            employeeArray.push(employee);
        }
        add = await addAnother();
      }
      let html = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
        <link rel="stylesheet" href="style.css">
        <title>Team Profile</title>
      </head>
      <body style="background-color: white">
        <h1 style="background-color: red">
            My Team
        </h1>
        <div class="wrapper" style="max-width: 960px; margin: 50px auto">
        `
      for(let i = 0; i<employeeArray.length; i++){
          if(i % 3 == 0){
            html += `<row>
            `
          }
          if(employeeArray[i].getRole() == "Employee"){
            template = fs.readFileSync('templates/main.html', 'utf8');
          }
          else if(employeeArray[i].getRole() == "Manager"){
            template = fs.readFileSync('templates/manager.html', 'utf8');
          }
          else if(employeeArray[i].getRole() == "Engineer"){
            template = fs.readFileSync('templates/engineer.html', 'utf8');
          }
          else if(employeeArray[i].getRole() == "Intern"){
            template = fs.readFileSync('templates/intern.html', 'utf8');
          }
          let filled = mustache.render(template, employeeArray[i])
          html += filled;
          if((i % 3 == 2) || (i == (employeeArray.length-1))){
            html += `</row>
            `
          }
      }
      html += `  </div>
      </body>
      </html>`
      await writeFileAsync("output/index.html", html);
      console.log("Successfully wrote to index.html in the output folder");
    } catch (err) {
      console.log(err);
    }
  }
  init();