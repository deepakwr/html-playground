    
var todayDate = new Date();
var viewDate =  new Date();
var selectedButton = null;
var months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
var appointments = {};
var logging = true;

function loadNextMonth(){
  loadCalendar(viewDate.getMonth()+1);
}


function loadPreviousMonth(){
  if((viewDate.getMonth()-1)<todayDate.getMonth() && viewDate.getFullYear() <= todayDate.getFullYear())
  {
    alert("You cannot add appointments to previous month.");
    return;
  }
  loadCalendar(viewDate.getMonth()-1);
}

function loadCalendar(month){  
  

  if(month == null)
  {
    viewDate = new Date();
    month = viewDate.getMonth();
  }
  else{
    var year = viewDate.getFullYear();
    if (month == -1){
      year--;
      month = 11;
    }
    else if(month == 12){
      year++;
      month = 0;
    }
    viewDate = new Date(year, month, 1);
  }

  clearDisplayDays();
  removeAllDisplayAppointments();
  displayMonthAndYear();
  disableEditButton(true);
  disableRemoveButton(true);
  disableDetailTextBox(true);

  var currentDayOfMonth = getDifferenceinDays(viewDate);
  log(currentDayOfMonth);

  var totalDaysToAdd = getDays(viewDate) +currentDayOfMonth;
  log(totalDaysToAdd);
  
  var currentDate = todayDate.getDate(); 
  log(currentDate);
  
  for(var i=1;i<=(totalDaysToAdd);i++)
  {
    var dayValue =  i- (currentDayOfMonth);
    var button = document.createElement("BUTTON");
    button.classList.add("day");
    if(dayValue <= 0)
    {
      button.disabled = true;
      button.style.opacity = 0;
    }
    else if(dayValue<currentDate && todayDate.getMonth() == viewDate.getMonth() && viewDate.getFullYear() == todayDate.getFullYear() )
    {
      button.disabled = true;
    }

    button.value = dayValue +"/"+viewDate.getMonth() +"/"+viewDate.getFullYear();
    button.innerHTML = dayValue;
    document.getElementById("days").append(button);
    if(appointments[button.value]!=null)
    {
      button.classList.add("markedDay");
      updateAppointmentsOnScreen(button.value);
    }
    button.addEventListener("click", function() {
        selectDateForAppointment(this);
      });
  }
}

function getDays(date){
    if(date.getMonth()==11)
    {
      return (new Date(date.getFullYear()+1,0,0).getDate());  
    }
    return (new Date(date.getFullYear(),date.getMonth()+1,0).getDate());
}

function getCurrentDay(){
  return (new Date().getDay());
}

function getDifferenceinDays(date){
  var firstOfTheMonth = new Date(date.getFullYear(),date.getMonth(),1).getDay();
  var currentDayOfTheMonth = date.getDay();//new Date(date.getFullYear(),date.getMonth(),1).getDay();
  return (firstOfTheMonth);//Math.abs(firstOfTheMonth -currentDayOfTheMonth ));
}

function addAppointment(){
  if(selectedButton==null)
  {
    alert("Please select/click on a date for adding an appointment.");
    return;
  }

  if(selectedButton.classList.contains("markedDay"))
  {
    alert("Appointment has been made already. If you wish to modify the details, you can update the details and click on edit.")
  }
  else
  {
    
    if(document.getElementById("detail").value.length<=0 || document.getElementById("detail").value.trim().length<=0)
    {
      alert("No detail added for appointment.");
      return;
    }
    appointments[selectedButton.value] = document.getElementById("detail").value;
    selectedButton.classList.add("markedDay");

    // alert("Date of Appointment: "+ selectedButton.value +" Details: "+appointments[selectedButton.value]);
    
    updateAppointmentsOnScreen(selectedButton.value);
    clearSelectedButton();

    document.getElementById("detail").value = "";
  }
}

function selectDateForAppointment(button){
  
  clearSelectedButton();

  if(button.classList.contains("selectedDay")){
    button.classList.remove("selectedDay");
    selectedButton = null;
  }
  else{
    button.classList.add("selectedDay");
    selectedButton = button;
    updateDetailInputBox(button.value);
    disableDetailTextBox(false);
  }
}

function updateDetailInputBox(key){
  if(appointments[key]!=null)
  {
    document.getElementById("detail").value = appointments[key];
    disableEditButton(false);
    disableRemoveButton(false);
  }
  else
  {
    disableEditButton(true);
    disableRemoveButton(true);
    document.getElementById("detail").value = "";
  }
}

function clearSelectedButton(){
  if(selectedButton!=null)
    selectedButton.classList.remove("selectedDay");
  
  selectedButton = null;
  updateDetailInputBox(null);
  disableDetailTextBox(true);
}

function updateAppointmentsOnScreen(key){
  if(appointments[key]!=null)
  {
    var label = document.getElementById(key);
    // if(document.getElementById(key)!=null)
    label = label ==null ? document.createElement("LABEL"): label;
    label.innerHTML = key+": "+appointments[key]+"<br>"; 
    label.id = key;
    document.getElementById("listedAppointment").appendChild(label);
  }
}

function removeAllDisplayAppointments(){
  var myNode = document.getElementById("listedAppointment");
  while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
  }
}

function removeAppointment(){
  // if(selectedButton==null)
  // {
  //   alert("No date selected." );
  //   return;
  // }

  var key = selectedButton.value;
  // if(appointments[key] == null)
  // {
  //   alert("No appoinments made for the selected date:" +selectedButton.value );
  //   return;
  // }

  var element = document.getElementById(key);
  if(element!=null)
  {
      element.remove();
  }
  selectedButton.classList.remove("markedDay");
  delete appointments[key];
  clearSelectedButton();
}

function editAppointment(){
  // if(selectedButton==null)
  // {
  //   alert("No date selected." );
  //   return;
  // }

  // var key = selectedButton.value;
  // if(appointments[key] == null)
  // {
  //   alert("No appoinments made for the selected date:" +selectedButton.value );
  //   return;
  // }
  appointments[selectedButton.value] = document.getElementById("detail").value;
  // document.getElementById(key)

  // removeAppointment();
  // addAppointment();
  updateAppointmentsOnScreen(selectedButton.value);
}

function log(value){
    if(logging){
      console.log(value);
    }
}


function clearDisplayDays(){
  var myNode = document.getElementById("days");
  while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
  }
}
function displayMonthAndYear(){
  var value = months[viewDate.getMonth()] + " " + viewDate.getFullYear(); 
  document.getElementById("displayMonth").innerHTML = value;
}

function disableEditButton(disabled){
  document.getElementById("editAppointment").disabled = disabled;
}


function disableRemoveButton(disabled){
  document.getElementById("removeAppointment").disabled = disabled;
}

function disableAddButton(disabled){
  document.getElementById("addAppoinment").disabled = disabled;
}

function disableDetailTextBox(disabled){
  document.getElementById("detail").disabled = disabled;
}