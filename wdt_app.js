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
        if(window.event.ctrlKey){
            if($(this).hasClass('selected')){}
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
        if(window.event.ctrlKey){
            if($(this).hasClass('selected')){}
            $(this).addClass('selected');
        }else{
            $(this).addClass('selected').siblings().removeClass('selected');
        }
    }
});


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
const staffEmployees = []

function populateTable(value,update){
    if(update){
        let memberValues = Object.values(staffEmployees)[value];
        let rows = $("#dashboardBoard tbody").children();
        let currentRow = rows[value].cells
        currentRow.item(4).innerText = memberValues.status
        return;
    }
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

function staffOut(){
    let board = $("#dashboardBoard tbody").children();
    let selected = []
    Array.prototype.forEach.call(board, child => {
         if($(child).hasClass('selected')){
            selected.push(child);
         }
         
      });
   selected.forEach(currentEmployees =>{
    let selectedNames = currentEmployees.cells.item(1).innerText;
    staffEmployees.forEach(staff=>{
        if( selectedNames == staff.name){
            staff.status = "Out"
            populateTable(staffEmployees.indexOf(staff),true)
        }
    });
   })
}

function staffIn(){
    let board = $("#dashboardBoard tbody").children();
    let selected = []
    Array.prototype.forEach.call(board, child => {
         if($(child).hasClass('selected')){
            selected.push(child);
         }
         
      });
   selected.forEach(currentEmployees =>{
    let selectedNames = currentEmployees.cells.item(1).innerText;
    staffEmployees.forEach(staff=>{
        if( selectedNames == staff.name){
            staff.status = "In"
            populateTable(staffEmployees.indexOf(staff),true)
        }
    });
   })
}

