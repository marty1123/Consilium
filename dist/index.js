var fs = require('fs');

$(document).ready(()=>{

  //Creates the class ListItem
  function ListItem(name, description, startDate, endDate, startTime, endTime, color) {
    return({
      "name":name,
      "description":description,
      "startDate":startDate,
      "endDate":endDate,
      "startTime":startTime,
      "endTime":endTime,
      "color":color
    })
  }

  //List Class
  function List(){
    this.ListTask = [];
    
    //function used to add new item to list array
    this.Add = function(name, description, startDate, endDate, startTime, endTime, color){
        this.ListTask.push(new ListItem(name, description, startDate, endDate, startTime, endTime, color));
    }
  }

  function createStandardList(cList){
    cList.Add("testName","testDescription","3/5/6","4/5/6","3:00","4:00","color");
    cList.Add("testName","testDescription","3/5/6","4/5/6","3:00","4:00","color");
    console.log(cList)
  }

  console.log(JSON.parse(fs.readFileSync("userData.json", "utf-8")))
  //var cList = new List();
  var cList = new List(JSON.parse(fs.readFile('userData.json')));
  //createStandardList(cList);
  console.log(cList.ListTask);
  //localStorage.setItem("cList", JSON.stringify(cList));
  //cList.ListTask.splice(0,2);
  console.log(cList.ListTask)


  

  //Delcaration for several universal veriables required with date calcuation  
  var d = 0;
  var currentDate = 0;
  var currentMonth = 0;
  var currentYear = 0;
  var firstDay = 0;
  var monthAmount = 0;
  var currentMonthName = "";
  var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

  var startMonth = 0;
  var startYear = 0;
  var endMonth = 0;
  var endYear = 0;

  console.log("Test");
  var selectd = new Date();
  setPickerDate(selectd);
      
  //This function establishes the current date, fills out several variables.
  function setPickerDate(selectd){
    d = selectd;
    currentDate = d.getDate();
    currentMonth = d.getMonth() + 1;
    currentYear = d.getFullYear();
    startMonth = currentMonth;
    startYear = currentYear;
    endMonth = currentMonth;
    endYear = currentYear;
    generatePicker();
  }

  //This function controls most of the miniature date picker 
  function generatePicker(){
    firstDay = new Date(currentYear + "-" + currentMonth + "-01").getDay();
    monthAmount = new Date(currentYear, currentMonth, 0).getDate();
    currentMonthName = monthNames[currentMonth - 1]
    console.log(currentDate,currentMonth,currentYear,firstDay,monthAmount)
  
    for (i = 1; i <= firstDay; i++){
      document.getElementById("dpGrid" + parseInt(i)).innerHTML = "&nbsp;";
    }
  
    for (i = 1 + firstDay; i <= monthAmount + firstDay; i++){
      document.getElementById("dpGrid" + parseInt(i)).innerHTML = i - firstDay; 
      console.log("Check")
    }
  
    for (i = firstDay + monthAmount + 1; i <= 42; i++){
      document.getElementById("dpGrid" + parseInt(i)).innerHTML = "&nbsp;";
    }
  
    $("#datePickerDate").html(currentMonthName + " " + currentYear);
  }
  
  //addPickerMonth and removePickerMonth both cycle back and forth though months on the mini date picker respectively
  //Calls the function addPickerMonth when the right play button is clicked
  $("#rightPlayButt").click(addPickerMonth)
  function addPickerMonth(){
    if (currentMonth < 12){
      currentMonth = currentMonth + 1;
    } else {
      currentYear = currentYear + 1;
      currentMonth = currentMonth - 11;
    }
    generatePicker();
    $(".selectedDate").removeClass("selectedDate")
  } 
  
  //Calls the function removePickerMonth when the left play button is clicked
  $("#leftPlayButt").click(removePickerMonth)
  function removePickerMonth(){
    if (currentMonth > 1){
      currentMonth = currentMonth - 1;
    } else {
      currentYear = currentYear - 1;
      currentMonth = currentMonth + 11;
    }
    generatePicker();
    $(".selectedDate").removeClass("selectedDate")
  }
  
  
  //This function controls selecting a date from the date picker
  var lastPick = "";
  $(".pickerDatesDisplay").click(function() {
    $(".selectedDate").removeClass("selectedDate");

    console.log($(this).attr("id"));

    selectedDate = $(this).attr("id");
    innerHTML = $(this).html();

    if (innerHTML == "&nbsp;"){
    } else if (lastPick == this) {
      $(".selectedDate").removeClass("selectedDate")
    } else {
      $("#" + selectedDate).addClass("selectedDate");
    }

    lastPick = this;
  })

  //This function prepares several drop down forms and information within the create event dialog
  //Also prepares the month selection buttons within create event dialog

  $('body').on('click', '.createEventButt', function () {
    console.log("createeventbutt clicked")
    startMonth = currentMonth;
    startYear = currentYear;
    endMonth = currentMonth;
    endYear = currentYear;
    $("#eventName").val("");
    $("#eventNameLabel").html("Event Name...");
    $("#eventDescription").val("")
    $("#eventDescriptionLabel").html("Event Description...");

    year = currentYear;
    month = currentMonth;
    days = monthAmount;
    combined = "";
    contents = "";

    $("#eventStartMonth , #eventEndMonth").html(currentMonthName + " " + currentYear)

    for (i = 1; i <= days; i++){
      combined = i + "/" + currentMonth + "/" + currentYear;
      contents += '<li class="mdl-menu__item" data-val=' + combined + '>' + combined + '</li>';
      $("#startYearCont, #endYearCont").html(contents);
    }

    //This function dynamically generates the times to display within create event
    var x = 30; //minutes interval
    var times = []; // time array
    var tt = 0; // start time
    var ap = ['AM', 'PM']; // AM-PM
    var timeContents = "";
  
    //loop to increment the time and push results in array
    for (var i=0;tt<24*60; i++) {
    var hh = Math.floor(tt/60); // getting hours of day in 0-24 format
    var mm = (tt%60); // getting minutes of the hour in 0-55 format
    times[i] = ("" + ((hh==12)?12:hh%12)).slice(-2) + ':' + ("0" + mm).slice(-2) + ap[Math.floor(hh/12)]; // pushing data in array in [00:00 - 12:00 AM/PM format]
    tt = tt + x; 
    }
    

    for (i = 0; i < times.length; i++){
      timeContents += '<li class="mdl-menu__item" data-val=' + times[i] + '>' + times[i]+ '</li>';
      $("#startHourCont, #endHourCont").html(timeContents)
    }


    //required to be triggered when lists are dynamically added
    getmdlSelect.init('.mdlRefreshTime, .mdlRefreshStart, .mdlRefreshEnd');
  });

  //Cycles through months within create event (for event starting month)
  $('body').on('click', '#eventStartMonthBack', function () {
    if (startMonth > 1){
      startMonth = startMonth - 1;
      } else {
      startYear = startYear - 1;
      startMonth = startMonth + 11;
    }

    $("#eventStartMonth").html(monthNames[startMonth - 1] + " " + startYear)
    generateSelectDates();
  });

  $('body').on('click', '#eventStartMonthForward', function () {
    if (startMonth < 12){
      startMonth = startMonth + 1;
      } else {
      startYear = startYear + 1;
      startMonth = startMonth - 11;
    }
  
    $("#eventStartMonth").html(monthNames[startMonth - 1] + " " + startYear)
    generateSelectDates();
  });

  //Generates dates when the user has changed the month for their event
  function generateSelectDates(){
    console.log("TESTST")
    combined="";
    contents="";
    days = new Date(startYear, startMonth, 0).getDate();
    for (i = 1; i <= days; i++){
      combined = i + "/" + startMonth + "/" + startYear;
      contents += '<li class="mdl-menu__item" data-val=' + combined + '>' + combined + '</li>';
      $("#startYearCont").html(contents);
    }
    getmdlSelect.init('.mdlRefreshStart');
  }





//controls cycles through months within create event (for the end month)
$('body').on('click', '#eventEndMonthBack', function () {
  if (endMonth > 1){
    endMonth = endMonth - 1;
    } else {
      endYear = endYear - 1;
      endMonth = endMonth + 11;
  }

  $("#eventEndMonth").html(monthNames[endMonth - 1] + " " + endYear)
  generateSelectEndDates();
});

$('body').on('click', '#eventEndMonthForward', function () {
  if (endMonth < 12){
    endMonth = endMonth + 1;
    } else {
      endYear = endYear + 1;
      endMonth = endMonth - 11;
  }

  $("#eventEndMonth").html(monthNames[endMonth - 1] + " " + endYear)
  generateSelectEndDates();
});

//Generates dates when the user has changed the month for their event
function generateSelectEndDates(){
  console.log("TESTST")
  combined="";
  contents="";
  days = new Date(endYear, endMonth, 0).getDate();
  for (i = 1; i <= days; i++){
    combined = i + "/" + endMonth + "/" + endYear;
    contents += '<li class="mdl-menu__item" data-val=' + combined + '>' + combined + '</li>';
    $("#endYearCont").html(contents);
  }
  getmdlSelect.init('.mdlRefreshEnd');
}


//

//Clears values associated with create month dialog
  $('body').on('click', '#closeDialog', function () {
    console.log("dialogCLOSED")
    
  })

  //Function that validifies inputted dialog data and submitss if logical.  
  $(".agreeDialogButton").click(function() {
    var selectedStartDay = $("#startYear").val();
    var selectedEndDay = $("#endYear").val();
    var startHour = $("#startHour").val().replace(":","");
    var endHour = $("#endHour").val().replace(":","");
    var eventName = $("#eventName").val();
    var eventDescription = $("#eventDescription").val();
    var color = $(".selectedColor").attr("value")
    var dataValidity = true;
    var dataInput = true;

    //Checking for blank inputs
    inputArray = [selectedStartDay, selectedEndDay, startHour, endHour, eventName];
    
    for (i = 0; i < inputArray.length; i++){
      if (inputArray[i] == "" || inputArray[i] == undefined || inputArray[i] == NaN){
        dataInput = false;
        console.log("Empty input detected")
      }    
    }

    console.log("EVENT NAME, DESCRIPTION: ", eventName, eventDescription)
    console.log("SelecteDates: ", selectedStartDay,selectedEndDay)
    console.log(startHour.substring(startHour.length -2, startHour.length))
    
    //Multiple if statements check hour / time validity
    //Start and end day comparison
    var startDay = selectedStartDay.split("/");
    var startDay = new Date(startDay[1] + "/" + startDay[0] + "/" + startDay[2]);
    console.log("STARTDAYDATE: ", startDay);

    var endDay = selectedEndDay.split("/");
    var endDay = new Date(endDay[1] + "/" + endDay[0] + "/" + endDay[2]);
    console.log("ENDDAYDATE: ", endDay);



    if (startDay >= endDay){
      console.log("Problem Detected")
      dataValidity = false;
      


      if (dataValidity == true){
        if (startHour.substring(startHour.length -2, startHour.length) == "PM"){
          console.log("starthour: ",startHour)
          startHour = parseInt(startHour);
          startHour = startHour + 1200;
          console.log("starthour: ",startHour)
        } else {
          startHour = parseInt(startHour, 10)
        }
    
        if (endHour.substring(endHour.length -2, endHour.length) == "PM"){
          console.log("starthour: ",endHour)
          endHour = parseInt(endHour);
          endHour = endHour + 1200;
          console.log("endthour: ",endHour)
        } else {
          endHour = parseInt(endHour, 10)
        }
    
        console.log("start ", startHour)
        console.log("end ", endHour)
    
        if (startHour >= endHour){
          dataValidity = false;
          console.log("Times entered are invalid")
        } else if (startHour < endHour){
          dataValidity = true;
        }

      }


      
  
  
      
    }

    if (dataValidity == false && dataInput == false){
      $("#validityWarning").html("Area left blank and invalid date")
    } else if (dataValidity == false){
      $("#validityWarning").html("Invalid date or time entered")
    } else if (dataInput == false){
      $("#validityWarning").html("Area left blank")
    }

    if (dataValidity == true && dataInput == true){
      cList.Add(eventName,eventDescription,selectedStartDay,selectedEndDay,startHour,endHour,color)
      //localStorage.setItem("cList", JSON.stringify(cList));

      console.log("NEW ARRAY ENTRY:", cList.ListTask)
      $("#eventName, #eventDescription").html("")
      startMonth = currentMonth;
      startYear = currentYear;
      endMonth = currentMonth;
      endYear = currentYear;
      dialog.close();
    }
  })

  var lastColorPick = "";
  //Color Picker function
  $(".colorPickerUnit").click(function(){
    $(".selectedColor").html("&nbsp;")
    $(".selectedColor").removeClass("selectedColor");
    $(this).addClass("selectedColor");
    $(this).html("✔")

    lastColorPick = $(this).attr("value")
    console.log(lastColorPick)
    console.log("TEST11111")
    
  })
  


})

/*$(".selectedDate").removeClass("selectedDate");

    console.log($(this).attr("id"));

    selectedDate = $(this).attr("id");
    innerHTML = $(this).html();

    if (innerHTML == "&nbsp;"){
    } else if (lastPick == this) {
      $(".selectedDate").removeClass("selectedDate")
    } else {
      $("#" + selectedDate).addClass("selectedDate");
    }
 */


  