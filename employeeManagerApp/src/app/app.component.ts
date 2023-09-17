import { Component, OnInit, ViewChild } from '@angular/core';
import { Employee } from './employee';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EmployeeService } from './employee.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private http: HttpClient, private employeeService: EmployeeService) { }

  public employees: Employee[] = [];
  public editEmployee: Employee | undefined;
  public deleteEmployee?: Employee;

  @ViewChild("f") signUpForm?: NgForm; /*local reference zapisan u HTML-u */


  ngOnInit() {
    this.getEmployees();
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe((data) => {
      this.employees = data;
    }),
      (error: HttpErrorResponse) => {
        console.log(error);
        alert(error.message);
      }

  }

  public onOpenModal(employee?: Employee, mode?: string) {
    const container = document.getElementById("main-container"); //main container div
    const button = document.createElement('button');
    button.type = "button"; //changing from default 'submit' to button type 'button'
    button.style.display = 'none';
    button.setAttribute("data-toggle", "modal");


    if (mode === "add") {
      button.setAttribute("data-target", "#addEmployeeModal");
      //ukoliko drugi funckijski argument bude jednak 'add' tada se prikazuje sav content pod id 'addEmployeeModal' a sakriva sve ostalo
    }
    else if (mode === "edit") {
      this.editEmployee = employee;
      button.setAttribute("data-target", "#updateEmployeeModal");
      //ukoliko drugi funckijski argument bude jednak 'edit' tada se prikazuje sav content pod id 'updateEmployeeModal' a sakriva sve ostalo
    }
    if (mode === "delete") {
      this.deleteEmployee = employee;
      button.setAttribute("data-target", "#deleteEmployeeModal");
      //ukoliko drugi funckijski argument bude jednak 'delete' tada se prikazuje sav content pod id 'deleteEmployeeModal' a sakriva sve ostalo
    }

    container?.appendChild(button);
    button.click();
  }

  public AddEmployee(form: NgForm): void {

    document.getElementById("add-employee-form")?.click();

    this.employeeService.addEmployee(form.value).subscribe((data) => {
      this.getEmployees();
      this.signUpForm?.reset(); //resetting the form
    });
  }

  public UpdateEmployee(employee: Employee): void {
    this.employeeService.updateEmployee(employee).subscribe((data) => {

      this.getEmployees();
    });
  }

  public DeleteEmployee(employeeID: number): void {
    this.employeeService.deleteEmployee(employeeID).subscribe((data) => {
      this.getEmployees(); //auto refresh
    });
  }

  public searchEmployees(key: string): void {
    const results: Employee[] = [];
    for (const employee of this.employees) {
      if (employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(employee);
      }
    }
    this.employees = results;
    if (!key) {
      this.getEmployees();
    }
  }
}
