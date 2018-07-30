$(document).ready(()=>{

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

  $('body').ready(function () {
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
    times[i] = ("0" + (hh % 12)).slice(-2) + ':' + ("0" + mm).slice(-2) + ap[Math.floor(hh/12)]; // pushing data in array in [00:00 - 12:00 AM/PM format]
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
    console.log("test")
    startMonth = currentMonth;
    startYear = currentYear;
    endMonth = currentMonth;
    endYear = currentYear;
  })

  //Function that validifies inputted dialog data and submitss if logical.  
  $(".agreeDialogButton").click(function() {
    var selectedStartDay = $("#startYear").val();
    var selectedEndDay = $("#endYear").val();
    var startHour = $("#startHour").val().replace(":","");
    var endHour = $("#endHour").val().replace(":","");

    if (startHour.slice(4,6) == "PM"){
      startHour = parseInt(startHour, 10) + 1200;
      console.log(startHour)
    } else {
      startHour = parseInt(startHour, 10)
    }

    endHour = parseInt(endHour,10);
    console.log("start ", startHour)
    console.log("end ", endHour)

    if (startHour > endHour){
      console.log("You R Stupid")
    }

    //console.log(selectedStartDay,selectedEndDay,startHour,endHour)
    
    //dialog.close();
  })





  /*  $("#rightPlayButt").click(addPickerMonth)
  if (currentMonth > 1){
      currentMonth = currentMonth - 1;
    } else {
      currentYear = currentYear - 1;
      currentMonth = currentMonth + 11;
    }*/





  /*
  function createEventDialog(){
  
    console.log("test")
  
    year = currentYear
    for (i = 1; i < 5; i++){
      document.getElementById("sYearList").innerHTML += '<li class="mdl-menu__item" data-val="DEU">' + year + '</li>';
      year = year + 1;
    }
  } */

})



  