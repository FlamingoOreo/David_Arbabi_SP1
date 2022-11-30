// #region digitalClock
function digitalClock() {  // Clock Functionality 
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    setInterval(() => {
        let currentDate = new Date();
        let date = `${currentDate.getDate()} ${(monthNames[currentDate.getMonth()])} ${currentDate.getFullYear()}`;
        let time =  `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
        let string = (`DATE ${date} TIME ${time}`);

        $("#timeandDate").text(string);
    }, 1000);
};
// #endregion
// #region staffSelection
$("#dashboardBoard tr").click(function(){ // Staff Selection
    if(this.parentElement.nodeName == "THEAD"){
        return 
    }
    if($(this).hasClass('selected')){
        if(window.event.ctrlKey){
            if($(this).hasClass('selected')){
                $(this).removeClass('selected');
            }
        }
        else{
            $(this).removeClass('selected');
            $(this).siblings().removeClass('selected');
        }
    }else{
        if(window.event.ctrlKey){  // Allowing us to select multiple staff members
            $(this).addClass('selected');
        }
        else{
            $(this).addClass('selected').siblings().removeClass('selected');
        }
    }
});

$("#deliveryBoard tr").click(function(){ // Driver Selection
    if(this.parentElement.nodeName == "THEAD"){
        return
    }
    if($(this).hasClass('selected')){
        if(window.event.ctrlKey){
            if($(this).hasClass('selected')){
                $(this).removeClass('selected');
            }
        }else{
            $(this).removeClass('selected');
            $(this).siblings().removeClass('selected');
        }
    }else{
        if(window.event.ctrlKey){ // Allowing us to select multiple staff members
            $(this).addClass('selected');
        }else{
            $(this).addClass('selected').siblings().removeClass('selected');
        }
    }
});
// #endregion
// #region Classes
class Employee{
    constructor(
        data
){
    this.name = data.name.first;
    this.surname = data.name.last;
 }
}

class StaffMember extends Employee{
    constructor(data){
    super(data);
    this.picture = data.picture.thumbnail;
    this.email = data.email
    this.status = "In";
    this.outTime = "";
    this.duration = "";
    this.expectedReturn = "";
}staffMemberIsLate(){
    return `${this.name} is late! They left at ${this.outTime}`;
}

}
class DeliveryDriver extends Employee{
    constructor(data){
    super(data);
    this.vehicle = data.vehicle
    this.telephone = data.telephone
    this.address = data.address
    this.returnTime = data.returnTime
}deliveryDriverIsLate(){
    return `${this.name} is late! They were supposed to return  at ${this.returnTime}`;
}
}

// #endregion
// #region employeeFactory
function employeeFactory(type,options) {
    switch(type){
        case 'Staff':
        $.ajax({
            url:'https://randomuser.me/api/',
            async: false,  
            dataType: 'json',
            success:function(data) {
               result = data.results[0]; 
            }
            });
            return new StaffMember(result);
        case 'Delivery':
            return new DeliveryDriver(options);
    }
   
}
// #endregion
// #region populateTable
const staffEmployees = []
function populateTable(value){
    if(value>4){
        return;
    }
    let staffMember = employeeFactory('Staff');
    staffEmployees.push(staffMember);
    let memberValues = Object.values(staffMember);
    let rows = $("#dashboardBoard tbody").children();
    
    let currentRow = rows[value].cells
    currentRow.item(0).innerHTML = `<img src=${memberValues[2]} />`;
    currentRow.item(1).innerText = memberValues[0]
    currentRow.item(2).innerText = memberValues[1]
    currentRow.item(3).innerText = memberValues[3]
    currentRow.item(4).innerText = memberValues[4]
    populateTable(value+1)
}
// #endregion
// #region updateTable
function updateTable(value){
    let memberValues = Object.values(staffEmployees)[value];
    let rows = $("#dashboardBoard tbody").children();
    let currentRow = rows[value].cells;
    currentRow.item(4).innerText = memberValues.status;
    currentRow.item(5).innerText = memberValues.outTime;
    currentRow.item(6).innerText = memberValues.duration;
    currentRow.item(7).innerText = memberValues.expectedReturn;
    return;
}
// #endregion
// #region staffOut
function staffOut(){ 
    let board = $("#dashboardBoard tbody").children(); // Every table row of the body
    let selected = []
    Array.prototype.forEach.call(board, child => {  // Finds every element that is selected on the table and adds the name value to an array
         if($(child).hasClass('selected')){
            selected.push(child.cells.item(1).innerText);
         }
      });
    staffEmployees.forEach(async staff=>{ // Cycles through every staff member object created during initial load
       if(selected.includes(staff.name)){ //If there is a match
        if(selected.length>1){   // If there is more than one selection
        let value = prompt(`Enter out-time for ${staff.name} in minutes:`)
        if(isNaN(value)){
            alert("You must enter a number!")
            return;
        }
        if(value != null){
            const now = new Date();
            staff.outTime = now.getHours() + ':' + ((now.getMinutes()<10?'0':'') + now.getMinutes());
            staff.status = "Out";
            staff.duration = toHoursAndMinutes(value);
            staff.expectedReturn = returnTimer(now.getHours()*60 + now.getMinutes()+parseInt(value),0);
            return updateTable(staffEmployees.indexOf(staff));
        } 
       }
       else{  // If there is only one selection we do a Swal.fire instead of prompts 
        const {value: minutes} = await Swal.fire({
            title: 'Update Staff Member',
            input: 'number',
            inputLabel: `Enter out-time for ${staff.name}`,
            showCancelButton: true,
            inputValidator: (value) => { // If user types no value
              if (!value) {
                return 'Write out-time in minutes!'
              }
            }
          })
          if(minutes){ // If user types a value
            const now = new Date();
            staff.outTime = now.getHours() + ':' + ((now.getMinutes()<10?'0':'') + now.getMinutes());
            staff.status = "Out";
            staff.duration = toHoursAndMinutes(minutes);
            staff.expectedReturn = returnTimer(now.getHours()*60 + now.getMinutes()+parseInt(minutes),0);
            return updateTable(staffEmployees.indexOf(staff));
          }
        }
    }
    })}
// #endregion
// #region staffIn
function staffIn(){
    let board = $("#dashboardBoard tbody").children();  // Every table row of the body
    let selected = []
    Array.prototype.forEach.call(board, child => {  // Finds every element that is selected on the table and adds the name value to an array
         if($(child).hasClass('selected')){
            selected.push(child.cells.item(1).innerText);
         }
      });
    staffEmployees.forEach(staff=>{ // Cycles through every staff member object created during initial load
       if(selected.includes(staff.name)){ //If there is a match 
            staff.status = "In";
            staff.outTime = "";
            staff.duration = "";
            staff.expectedReturn = "";
            updateTable(staffEmployees.indexOf(staff));
        }
        });
   }
// #endregion
// #region timeconverters
function toHoursAndMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours} hr: ${minutes} min`;
}
function returnTimer(totalMinutes,count) {
    let hours = Math.floor(totalMinutes / 60);
    if(hours>24){
        count++
        return returnTimer(totalMinutes-1440,count)
    }
    let minutes = totalMinutes % 60;
    if(minutes<10){
        minutes = `0${minutes}`
    }
    if(count>0){
        return `${hours}:${minutes}
                +${count} day(s)`;
    
    }
    return `${hours}:${minutes}`;
}
// #endregion

