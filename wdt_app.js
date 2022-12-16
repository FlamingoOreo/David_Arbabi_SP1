// #region digitalClock
function digitalClock() {  // Clock Functionality 
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    setInterval(() => {
        let currentDate = new Date();
        let minutes = currentDate.getMinutes();
        let seconds = currentDate.getSeconds();
        if(minutes<10){   // To add a 0 before the minutes/seconds
            minutes = `0${minutes}`;
        }
        if(seconds<10){
            seconds = `0${seconds}`;
        }
        let date = `${currentDate.getDate()} ${(monthNames[currentDate.getMonth()])} ${currentDate.getFullYear()}`;
        let time =  `${currentDate.getHours()}:${minutes}:${seconds}`;
        let string = (`DATE ${date} TIME ${time}`);

        $("#timeandDate").text(string);
    }, 1000
    );
};
// #endregion
// #region staff&DriverSelection
$("#dashboardBoard tbody").on( "click", "tr", function(){ // Staff Selection
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

$("#deliveryBoard tbody").on( "click", "tr", function(){ // Driver Selection
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
};
class StaffMember extends Employee{
    constructor(data){
    super(data);
    this.picture = data.picture.thumbnail;
    this.email = data.email;
    this.status = "In";
    this.outTime = "";
    this.duration = "";
    this.expectedReturn = "";
}};
class DeliveryDriver extends Employee{
    constructor(data){
    super(data);
    this.vehicle = data.vehicle;
    this.telephone = data.telephone;
    this.address = data.address;
    this.returnTime = data.returnTime;
}};

// #endregion
// #region staffUserGet
function staffUserGet(type,options) {
    // This function is responsible for inheritance object creation.
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
   
};
// #endregion
// #region populateTable
const staffEmployees = []
function populateTable(value){
    if(value==5){ // This fills the table to only 5 for now, changing this number adds more/less staff
        return;
    }
    let staffMember = staffUserGet('Staff');
    staffEmployees.push(staffMember);
    $("#dashboardBoard tbody").append(`<tr><td><img src=${staffMember.picture} /></td><td>${staffMember.name}</td><td>${staffMember.surname}</td><td>${staffMember.email}</td><td>${staffMember.status}</td><td></td><td></td><td></td></tr>`);
    populateTable(value+1);
};
// #endregion
// #region updateTable
function updateTable(value){
    let memberValues = Object.values(staffEmployees)[value];
    let rows = $("#dashboardBoard tbody").children();
    let currentRow = rows[value].cells;
    $(currentRow.item(4)).fadeOut(300,'linear',function(){
        $(currentRow.item(4)).text(memberValues.status);
    });
    $(currentRow.item(4)).fadeIn(900,'linear');
    $(currentRow.item(5)).fadeOut(300,'linear',function(){
        $(currentRow.item(5)).text(memberValues.outTime);
    });
    $(currentRow.item(5)).fadeIn(900,'linear');
    $(currentRow.item(6)).fadeOut(300,'linear',function(){
        $(currentRow.item(6)).text(memberValues.duration);
    });
    $(currentRow.item(6)).fadeIn(900,'linear');
    $(currentRow.item(7)).fadeOut(300,'linear',function(){
        $(currentRow.item(7)).text(memberValues.expectedReturn);
    });
    $(currentRow.item(7)).fadeIn(900,'linear');
    return;
};
// #endregion
// #region staffOut
async function staffOut(){ 
    let board = $("#dashboardBoard tbody").children(); // Every table row of the body
    let selectedName = []
    let selectedLastName = []
    Array.prototype.forEach.call(board, child => {  // Finds every element that is selected on the table and adds the name value to an array
         if($(child).hasClass('selected')){
            selectedName.push(child.cells.item(1).innerText);
            selectedLastName.push(child.cells.item(2).innerText);
         }
      });
      for (let i = 0; i < staffEmployees.length; i++) {
        const staff = staffEmployees[i];
        if (selectedName.includes(staff.name) && selectedLastName.includes(staff.surname)) { //If there is a match
          await Swal.fire({
            title: `Enter out-time for ${staff.name} in minutes:`,
            text: 'Please enter a number:',
            input: 'text',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            inputValidator: value => {
              // Validate the input to make sure it is a number
              if (isNaN(value)) {
                return 'You must enter a number!';
              } 
            }
          }).then(result => {
            if (result.value) {
              // If the user clicks the confirm button, get the value from the input field
              let minutes = result.value;
              const now = new Date();
              staff.outTime = now.getHours() + ':' + ((now.getMinutes() < 10 ? '0' : '') + now.getMinutes());
              staff.status = 'Out';
              staff.duration = toHoursAndMinutes(minutes);
              staff.expectedReturn = returnTimer(now.getHours() * 60 + now.getMinutes() + parseInt(minutes),0
              );
              setTimeout(() => {
                if (staff.status == 'Out') {
                  return staffMemberIsLate(staff);
                }
                return;
              }, (parseInt(minutes) * 60) * 1000);
              return updateTable(i);
            }
          });
        }
      }};
// #endregion
// #region staffIn
function staffIn(){
    let board = $("#dashboardBoard tbody").children();  // Every table row of the body
    let selectedName = [];
    let selectedSurnameName = [];
    Array.prototype.forEach.call(board, child => {  // Finds every element that is selected on the table and adds the name value to an array
         if($(child).hasClass('selected')){
            selectedName.push(child.cells.item(1).innerText);
            selectedSurnameName.push(child.cells.item(2).innerText);
         }
      });
    staffEmployees.forEach(staff=>{ // Cycles through every staff member object created during initial load
       if(selectedName.includes(staff.name) && selectedSurnameName.includes(staff.surname)){ //If there is a match 
        if(staff.status == "In"){
            return;
        };
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
    return `${hours} hr : ${minutes} min`;
}
function returnTimer(totalMinutes,count) {
    let hours = Math.floor(totalMinutes / 60);
    if(hours>24){
        count++
        return returnTimer(totalMinutes-1440,count);
    }
    let minutes = totalMinutes % 60;
    if(minutes<10){
        minutes = `0${minutes}`;
    }
    if(count>0){
        return `${hours}:${minutes}
                +${count} day(s)`;
    
    }
    return `${hours}:${minutes}`;
}
// #endregion
// #region staffMemberIsLate
function staffMemberIsLate(staff) {
    const toast = $(`
      <div class="toast position-fixed bottom-50 end-0 staff-late-toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
        <div class="toast-header">
          <strong class="me-auto text-danger">Staff Delay Alert!</strong>
          <i class="bi bi-bell-fill"></i>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body" id="delayBody">
            <img src="..." class="rounded me-2" alt="staffPicture">
            <span></span>
            <br>
            <br>
            <strong class="text-mute"></strong>
        </div>
      </div>
    `);
  
    toast.find('.toast-body img').attr('src', staff.picture);
    toast.find('.toast-body strong').text(`Time out-of-office: ${staff.duration}`);
    toast.find('.toast-body span').text(`${staff.name} ${staff.surname} is delayed.`);

    toast.appendTo('#toast-container');
    toast.appendTo('#toast-container');
    toast.toast('show');
};
// #endregion
// #region addDelivery
function addDelivery(){
    const input = $("#scheduleBoard tbody").children()[0]
    const driverObject = {
        vehicle: input.cells[0].children[0].value,
        name: {
            first: input.cells[1].children[0].value,
            last: input.cells[2].children[0].value,
        },
        telephone: parseInt(input.cells[3].children[0].value),
        address: input.cells[4].children[0].value,
        returnTime: input.cells[5].children[0].value,
    };
    // Generates the driver object 
    const driver = staffUserGet('Delivery', driverObject);
    if(validateDelivery(driver)){
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: `Delivery for ${driver.returnTime} added`,
            showConfirmButton: false,
            timer: 1500
        })
        const result = (driver.vehicle == "Car") ? '<i class="bi bi-car-front"></i>' :  '<i class="bi bi-bicycle"></i>';

        $("#deliveryBoard tbody").prepend(`<tr><td>${result}</td><td>${driver.name}</td><td>${driver.surname}</td><td>${driver.telephone}</td><td>${driver.address}</td><td>${driver.returnTime}</td></tr>`);
    };
    const driverMinutes = parseInt(driver.returnTime.split(":")[0]*60) + parseInt(driver.returnTime.split(":")[1]);
    const now = new Date();
    const hours = now.getHours();
    const mintutes = now.getMinutes();
    const currentMinutes = (hours*60) + mintutes;
    const difference = driverMinutes-currentMinutes;
    setTimeout(()=>{
        const array = $("#deliveryBoard tbody").children()
        Array.prototype.forEach.call(array, element => {
        if(driver.name == element.cells[1].innerText && driver.surname == element.cells[2].innerText && driver.telephone ==element.cells[3].innerText && driver.address == element.cells[4].innerText && driver.returnTime == element.cells[5].innerText){
            return deliveryDriverIsLate(driver);
        }
    })
        return;
    },(parseInt(difference)*60)*1000);
    
};
function clearDelivery(){
    $("#deliveryBoard .selected").fadeOut(500,'linear',function(){
        $("#deliveryBoard .selected").remove();

    });
};

// #endregion
// #region validateDelivery
function validateDelivery(driver){
    const faultyInput = [];
    Object.keys(driver).forEach(property => {
        if(typeof driver[property] === "string" && (driver[property] == "" || driver[property].trim() === "")){
            const first = property.charAt(0); //Capitalize the fault
            const upper = first.toUpperCase();
            faultyInput.push(upper+property.substring(1));
        }
    });
    if(faultyInput.length>0){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `${faultyInput.join(' , ')} field required!`,
          })
        return false;
    };
    if(!checkPhoneNumber()){
        Swal.fire({
            icon: 'error',
            title: `  Not a valid number!`,
            text: 'Telephone number must be at least 7 digits & only digits!',
            footer: `Example 123456789`
          })
        return false;
    };
    return true;
    
}
function checkPhoneNumber() {
    let input = $("#phone-input");
    let errorMessage = $("#error-message");
    if (input.val().length < 7) {
      errorMessage.html("Please enter at least 7 digits");
      return false;
    } else {
      let isValid = /^[\d]+$/.test(input.val()); // This checks if the input is valid by only containing numbers or "-"
      if (!isValid) {
        errorMessage.html("Please enter only numbers");
        return false;
      } else {
        errorMessage.html("");
        return true;
      }
    }
  }

// #endregion
// #region deliveryDriverisLate
function deliveryDriverIsLate(driver){
const toast = $(`  <div class="toast position-fixed bottom-50 end-0" role="alert" aria-live="assertive" aria-atomic="true" class="driver-late" data-bs-autohide="false">
    <div class="toast-header">
      <strong class="me-auto text-danger">Delivery Driver Delay Alert!</strong>
      <i class="bi bi-bell-fill"></i>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body driver-delay-body">
        <span></span>
        <br>
        <span class="address"></span>
        <br>
        <span class="telephone"></span>
        <br>
        <br>
        <strong class="text-mute"></strong>
    </div>
  </div>`);

    toast.find(".driver-delay-body strong").text(`Estimated return time: ${driver.returnTime}`);
    toast.find(".driver-delay-body span").first().text(`Name: ${driver.name} ${driver.surname} is delayed.`);
    toast.find(".driver-delay-body .address").text(`Address: ${driver.address}`);
    toast.find(".driver-delay-body .telephone").text(`Telephone: ${driver.telephone}`);
    toast.appendTo('#toast-container');
    toast.appendTo('#toast-container');
    toast.toast('show');
};

// #endregion
// #region buttonAnimation
$("button").hover(
  function() {
    if($(this).is(":animated")) {
        return;
      }
    $(this).animate({ fontSize: "20px" }, 300);
  },
  function() {
    
    $(this).animate({ fontSize: "16px" }, 300);
  }
);
// #endregion
