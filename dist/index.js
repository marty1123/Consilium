var fs = require('fs');
const ipc = require('electron').ipcRenderer

$(document).ready(()=>{

  //Creates the class ListItem
  function ListItem(name, description, startDate, endDate, startHour, endHour, color, tag) {
    return({
      "name":name,
      "description":description,
      "startDate":startDate,
      "endDate":endDate,
      "startHour":startHour,
      "endHour":endHour,
      "color":color,
      "tag":tag
    })
  }

  //List Class
  function List(){
    this.ListTask = [];
    
    //function used to add new item to list array
    this.Add = function(name, description, startDate, endDate, startHour, endHour, color, tag){
        this.ListTask.push(new ListItem(name, description, startDate, endDate, startHour, endHour, color, tag));
    }
  }

  function createStandardList(cList){
    console.log(cList)
  }

  console.log(JSON.parse(fs.readFileSync("dist/userData.json", "utf-8")));
  //var cList = new List();
  var dataOutput = JSON.parse(fs.readFileSync('dist/userData.json', "utf-8"))
  var cList = dataOutput;
  //createStandardList(cList);
  console.log(cList.ListTask);
  //localStorage.setItem("cList", JSON.stringify(cList));
  //cList.ListTask.splice(0,2);

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
  var currentDateStatic = "";

  var currentView = "";

  var monthViewTemplate = fs.readFileSync('dist/monthViewTemplate.html', "utf-8");
  var weekViewTemplate = fs.readFileSync('dist/weekTemplate.html', "utf-8");

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
    currentDateStatic = currentYear + "," + currentMonth + "," + currentDate;
    console.log("currentDatestatic:" + currentDateStatic);
    //Calls the function to generate the mini upcoming dates
    generateMiniUpcoming();
    generatePicker();
    displayMonthEvents();
  }

  //This function controls most of the miniature date picker 
  function generatePicker(){
    firstDay = new Date(currentYear + "-" + currentMonth + "-01").getDay();
    monthAmount = new Date(currentYear, currentMonth, 0).getDate();
    currentMonthName = monthNames[currentMonth - 1]
    console.log(currentDate,currentMonth,currentYear,firstDay,monthAmount)
  
    for (i = 1; i <= firstDay; i++){
      $("#dpGrid" + parseInt(i)).html("&nbsp;")
      $("#dpGrid" + parseInt(i)).addClass("dark");

      if(currentView == "monthView"){
        $("#mdNumb" + parseInt(i)).html("&nbsp;")
        $("#mdGrid" + parseInt(i)).addClass("dark");
      }
    }
  
    for (i = 1 + firstDay; i <= monthAmount + firstDay; i++){
      $("#dpGrid" + parseInt(i)).html(i - firstDay); 
      $("#dpGrid" + parseInt(i)).removeClass("dark");

      if(currentView == "monthView"){
        $("#mdNumb" + parseInt(i)).html(i - firstDay);
        $("#mdGrid" + parseInt(i)).removeClass("dark");
      }
      console.log("Check")
    }
  
    for (i = firstDay + monthAmount + 1; i <= 42; i++){
      $("#dpGrid" + parseInt(i)).html("&nbsp;")
      $("#dpGrid" + parseInt(i)).addClass("dark");

      if(currentView == "monthView"){
        $("#mdNumb" + parseInt(i)).html("&nbsp;")
        $("#mdGrid" + parseInt(i)).addClass("dark");
      }
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

    if (currentView == "monthView"){
      displayMonthEvents()
    }

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
    
    if (currentView == "monthView"){
      displayMonthEvents()
    }
  }
  
  
  //This function controls selecting a date from the date picker
  var lastPick = new Date(currentDate);
  lastPick = lastPick.getDate();
  $(".pickerDatesDisplay").click(function() {
    $(".selectedDate").removeClass("selectedDate");

    selectedDate = $(this).attr("id");
    innerHTML = $(this).html();

    if (innerHTML == "&nbsp;"){
    } else if (lastPick == this) {
      $(".selectedDate").removeClass("selectedDate")
    } else {
      $("#" + selectedDate).addClass("selectedDate");
    }

    lastPick = $(this).text();

    if (currentView == "weekView"){
      console.log("weekview refreshed")
      weekView();
    }

    if (currentView == "dayView"){
      dayView();
    }
  })

  //This function prepares several drop down forms and information within the create event dialog
  //Also prepares the month selection buttons within create event dialog

  function createEventButtModal(){
    console.log("createeventbutt clicked")
    startMonth = currentMonth;
    startYear = currentYear;
    endMonth = currentMonth;
    endYear = currentYear;
    $("#eventName").val("");
    $("#eventNameLabel").html("Event Name...");
    $("#eventDescription").val("")
    $("#eventDescriptionLabel").html("Event Description...");

    $(".mdl-dialog__title").html("Create a new event")

    year = currentYear;
    month = currentMonth;
    days = monthAmount;
    combined = "";
    contents = "";

    $("#eventStartMonth , #eventEndMonth").html(currentMonthName + " " + currentYear)

    for (i = 1; i <= days; i++){
      combined = i + "/" + currentMonth + "/" + currentYear;
      contents += '<li class="mdl-menu__item start'+ combined +'"  data-val=' + combined + '>' + combined + '</li>';
      $("#startYearCont").html(contents);
    }

    for (i = 1; i <= days; i++){
      combined = i + "/" + currentMonth + "/" + currentYear;
      contents += '<li class="mdl-menu__item end'+ combined +'"  data-val=' + combined + '>' + combined + '</li>';
      $("#endYearCont").html(contents);
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
  }

  $('body').on('click', '.createEventButt', createEventButtModal);

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



    if (startDay > endDay){
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

    //Confirms all data is correct and creates the event, adding it to the array of objects.
    if (dataValidity == true && dataInput == true){
      var tag = generateTag()
      
      generateTag();

      cList.ListTask.push(new ListItem(eventName, eventDescription, selectedStartDay, selectedEndDay, startHour, endHour, color, tag))
      var dataInput = JSON.stringify(cList);
      fs.writeFileSync('dist/userData.json', dataInput, 'utf-8');

      console.log("NEW ARRAY ENTRY:", cList.ListTask)
      $("#eventName, #eventDescription").html("")
      startMonth = currentMonth;
      startYear = currentYear;
      endMonth = currentMonth;
      endYear = currentYear;
      dialog.close();
      document.getElementById("eventSnackbar").MaterialSnackbar.showSnackbar({"message":"Event Created"})
      viewRefresh(currentView)
      generateMiniUpcoming()
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

  //Function to sort date ascending
  function compare(a,b) {
    var startDayA = a.startDate.split("/");
    startDayA = new Date(startDayA[1] + "/" + startDayA[0] + "/" + startDayA[2]);

    var startDayB = b.startDate.split("/");
    startDayB = new Date(startDayB[1] + "/" + startDayB[0] + "/" + startDayB[2]);

    var startHourA = a.startHour.replace("PM","11");
    startHourA = startHourA.replace("AM","");
    var startHourB = b.startHour.replace("PM","11");
    startHourB = startHourB.replace("AM","");


    if (startDayA < startDayB){
      return -1;
    }
    if (startDayA > startDayB){
      return 1;
    }
    if (startDayA.getTime() == startDayB.getTime()){
      if (startHourA < startHourB){
        return -1;
      } 
      if (startHourA > startHourB){
        return 1;
      }
    }
    return 0;
  }

  //generates a unique identifying tag that is added to the event
  function generateTag(){
    var tag = Math.floor(1000 + Math.random() * 9000);

    for (i=0; i <= cList.ListTask.length - 1; i++){
      if (tag == cList.ListTask[i]["tag"]){
        generateTag();
      }
    }
    return tag
  }

  

  //Generate mini upcoming events
  function generateMiniUpcoming() {
    var currentList = JSON.parse(JSON.stringify(cList))
    
    //Checks to make sure date is after current date
    function checkDateAfterCurrent(){
      var recursionCheck = true;

      for (i = 0; i <= currentList.ListTask.length - 1; i++){
        var startDate = currentList.ListTask[i]["startDate"];
          startDate = startDate.split("/");
          startDate = new Date(startDate[2] + "," + startDate[1] + "," + startDate[0]);
          currentDate = new Date(currentDateStatic)
  
        if (startDate < currentDate){
          currentList.ListTask.splice(i,1)
          recursionCheck = false;
        }
      }
      if (recursionCheck == false){
        checkDateAfterCurrent()
      }
    }

    checkDateAfterCurrent()

    currentList.ListTask.sort(compare);

    console.log(currentList)
    
    console.log("LENGTH: ",currentList.ListTask.length)

    function remainingDay(startDate){
      var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
      var firstDate = new Date(currentDateStatic);
      var secondDate = startDate;

      var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
      return diffDays
    }


    if(currentList.ListTask.length < 6){
      var name = currentList.ListTask[i]["name"];
      if (name.length > 20){
        name = name.slice(0,19)
      } 


      for(i = 0; i < currentList.ListTask.length; i++){
        var startDate = currentList.ListTask[i]["startDate"];
        startDate = startDate.split("/");
        startDate = new Date(startDate[2] + "," + startDate[1] + "," + startDate[0]);
        $("#upcomingEvent"+(i+1)).html(name + " - " + remainingDay(startDate) + " Days" + '<br>' + currentList.ListTask[i]["startDate"]);
      }
    } else for(i = 0; i < 6; i++){

        var name = currentList.ListTask[i]["name"];
        if (name.length > 18){
          name = name.slice(0,17)
        } 

        var startDate = currentList.ListTask[i]["startDate"];
        startDate = startDate.split("/");
        startDate = new Date(startDate[2] + "," + startDate[1] + "," + startDate[0]);
        $("#upcomingEvent"+(i+1)).html(name + " - " + remainingDay(startDate) + " Days" + '<br>' + currentList.ListTask[i]["startDate"]);
    }
  }


  function displayAllEvents(){

    $("#weekButt").removeClass("mdl-button--accent")
    $("#eventsButt").addClass("mdl-button--accent")
    $("#dayButt").removeClass("mdl-button--accent")
    $("#monthButt").removeClass("mdl-button--accent")


    $(".viewTypeTitle").html("Events View")

    currentView = "eventView";

    var content = "";
    var currentList = JSON.parse(JSON.stringify(cList))
    currentList.ListTask.sort(compare);

    var startHour = "";
    var endHour = "";

    content += '<ul class="mdl-list">'
    
    for (i = 0; i <= currentList.ListTask.length - 1; i++){

      startHour = currentList.ListTask[i]["startHour"]
      endHour = currentList.ListTask[i]["endHour"]

      if (startHour.length == 5){
        startHour = startHour.split("")
        startHour = startHour[0] + ":" + startHour[1] + startHour[2] + startHour[3] + startHour[4]
      } else {
        startHour = startHour.split("")
        startHour = startHour[0] + startHour[1] + ":" + startHour[2] + startHour[3] + startHour[4] + startHour[5]
      }

      if (endHour.length == 5){
        endHour = endHour.split("")
        endHour = endHour[0] + ":" + endHour[1] + endHour[2] + endHour[3] + endHour[4]
      } else {
        endHour = endHour.split("")
        endHour = endHour[0] + endHour[1] + ":" + endHour[2] + endHour[3] + endHour[4] + endHour[5]
      }

      content += '<li class="listItem mdl-list__item mdl-shadow--2dp" value='+ currentList.ListTask[i]["tag"] +'> <span class="mdl-list__item-primary-content eventNameDesc"> <div class="circle mdl-shadow--2dp" style=background-color:#' + currentList.ListTask[i]["color"] + '>&nbsp;</div>'
      content += currentList.ListTask[i]["name"] + " - " + currentList.ListTask[i]["description"] + '</span>' + '<span class="mdl-list__item-primary-content">' + currentList.ListTask[i]["startDate"] + " - " + currentList.ListTask[i]["endDate"] + '</span>' + '<span class="mdl-list__item-primary-content">' + startHour + " - " + endHour;
      content += '<div id="deleteEvent" value="' + currentList.ListTask[i]["tag"] + '">&#10006;</div> </span> </li>'
    }
    content += '</ul>';
    $("#viewPane").html(content)
  }

  function viewRefresh(){
    if (currentView == "eventView"){
      displayAllEvents();
    } else if (currentView == "monthView"){
      displayMonthEvents();
    } else if (currentView == "dayView"){
      dayView();
    }
  }

  function saveCList(){
    var dataInput = JSON.stringify(cList);
    fs.writeFileSync('dist/userData.json', dataInput, 'utf-8');
  }

  $('body').on('click', '#deleteEvent', function () {
    console.log("EVENTDELET")
    tag = $(this).attr("value")
    console.log(tag)
    for(i = 0; i < cList.ListTask.length; i++){
      if(cList.ListTask[i]["tag"] == tag){
        cList.ListTask.splice(i,1)
      }
    }
    saveCList()
    viewRefresh();
    generateMiniUpcoming();
    document.getElementById("eventSnackbar").MaterialSnackbar.showSnackbar({"message":"Event Removed"});
  })



  $("#eventsButt").click(displayAllEvents)


  //Controls the displaying of Month events
  function displayMonthEvents(){
    $(".viewTypeTitle").html("Month View")
    currentView = "monthView";
    $("#viewPane").html(monthViewTemplate);
    generatePicker();
    generateEventsForDisplayMonth();

    $("#weekButt").removeClass("mdl-button--accent")
    $("#eventsButt").removeClass("mdl-button--accent")
    $("#dayButt").removeClass("mdl-button--accent")
    $("#monthButt").addClass("mdl-button--accent")
  }

  //Function that generates the actual events for month view
  function generateEventsForDisplayMonth(){
    var currentList = JSON.parse(JSON.stringify(cList))
    currentList.ListTask.sort(compare);

    var content = "";

    for(i = 0; i < currentList.ListTask.length; i++){
      for(x = 0; x <= monthAmount; x++){

        var startDate = currentList.ListTask[i]["startDate"];
        startDate = startDate.split("/");
        startDate = new Date(startDate[2] + "," + startDate[1] + "," + startDate[0]);

        var displayDate = new Date(currentYear + "," + currentMonth + "," + x)

        //console.log(startDate + "---" + displayDate)

        if (displayDate.getTime() == startDate.getTime()){
          //console.log("match Found!")

          if (currentList.ListTask[i]["color"] == "222222"){
            content = '<div class="monthEvent mdl-shadow--2dp" value='+ currentList.ListTask[i]["tag"] +' style="color:white; background-color:#' + currentList.ListTask[i]["color"] + '">' + currentList.ListTask[i]["name"] + '</div>'
            $("#mdGrid" + (x + firstDay)).prepend(content);
          } else {
            content = '<div class="monthEvent mdl-shadow--2dp" value='+ currentList.ListTask[i]["tag"] +' style="background-color:#' + currentList.ListTask[i]["color"] + '">' + currentList.ListTask[i]["name"] + '</div>'
            $("#mdGrid" + (x + firstDay)).prepend(content);
          }
        }
      }
    }
  }



  $("#monthButt").click(displayMonthEvents)


  //Function that controls all of the week view
  function weekView(){

    $(".viewTypeTitle").html("Week View")
    currentView = "weekView"

    $("#weekButt").addClass("mdl-button--accent")
    $("#eventsButt").removeClass("mdl-button--accent")
    $("#dayButt").removeClass("mdl-button--accent")
    $("#monthButt").removeClass("mdl-button--accent")


    $("#viewPane").html(weekViewTemplate)
    var day = currentDate;
    var month = currentMonth;
    var year = currentYear;
    var daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    var currentList = JSON.parse(JSON.stringify(cList))
    currentList.ListTask.sort(compare);

    chosenDate = new Date(currentYear,currentMonth - 1,lastPick);
    tomorrow = chosenDate;

    displayDates = [];
    displayDates.push(new Date(tomorrow.setDate(tomorrow.getDate())))

    for(i = 0; i <= 5; i++){
      displayDates.push(new Date(tomorrow.setDate(tomorrow.getDate()+1)))
    }


    //Generating the appropriate names of days within the week
    for(i=0; i < 7; i++){
      dayOfTheWeek = displayDates[i].getDay();
      dayOfTheWeek = daysOfTheWeek[dayOfTheWeek]
      $("#weekDay" + i).html(dayOfTheWeek + " "+ displayDates[i].getDate())
    }



    //Generation of events to display in week view
    for(x = 0; x < displayDates.length; x++){
      for(i = 0; i < currentList.ListTask.length; i++ ){
        var listDate = currentList.ListTask[i]["startDate"];
        listDate = listDate.split("/");
        listDate = new Date(listDate[2] + "," + listDate[1] + "," + listDate[0]);

        if (listDate.getTime() == displayDates[x].getTime()){
          console.log("match found")
          var eventName = currentList.ListTask[i]["name"];
          var eventColor = currentList.ListTask[i]["color"];
          var top = currentList.ListTask[i]["startHour"];
          var end = currentList.ListTask[i]["endHour"];

          function timeFixer(hour){
            if (hour.indexOf('PM') > -1){
              hour = hour.replace("PM","");
              if (parseInt(hour) >= 1200){
                hour = parseInt(hour)
              } else {
                  last2 = hour.slice(-2)
                if(last2 == "30"){
                  hour = parseInt(hour) + 1220
                } else {
                  hour = parseInt(hour) + 1200;
                }
              }
              
            } else if (hour.indexOf("AM") > -1){
              hour = hour.replace("AM","");
  
              if (parseInt(hour)>= 1200){
                hour = parseInt(hour)+1200
              } else {
                  last2 = hour.slice(-2)
                if(last2 == "30"){
                  hour = parseInt(hour) + 20
                } else {
                  hour = parseInt(hour)
                }
              }
            }
            return hour
          }
          
          hour = top
          top = timeFixer(hour)
          hour = end
          end = timeFixer(hour)


          top = top / 2
          end = end / 2
          var duration = end - top
          console.log(duration)
        
          console.log(top)



          var content = "";
          content = '<div class="weekEvent mdl-shadow--2dp" value='+ currentList.ListTask[i]["tag"] +' style=height:'+ duration +'px;top:'+ top +'px;background-color:#'+ eventColor +'>' + eventName + '</div>'; 
          $("#column" + x).append(content)


        }
      }
    }
  }

  $("#weekButt").click(weekView)





  //Function that controls displaying all the events in a single day
  function dayView(){
    var noEventCheck = false;
    var chosenDate = new Date(currentYear,currentMonth - 1,lastPick);

    $("#weekButt").removeClass("mdl-button--accent")
    $("#eventsButt").removeClass("mdl-button--accent")
    $("#dayButt").addClass("mdl-button--accent")
    $("#monthButt").removeClass("mdl-button--accent")


    $(".viewTypeTitle").html("Day View")

    currentView = "dayView";

    var content = "";
    var currentList = JSON.parse(JSON.stringify(cList))
    currentList.ListTask.sort(compare);

    var startHour = "";
    var endHour = "";

    content += '<ul class="mdl-list">'
    
    for (i = 0; i <= currentList.ListTask.length - 1; i++){

      var startDate = currentList.ListTask[i]["startDate"];
        startDate = startDate.split("/");
        startDate = new Date(startDate[2] + "," + startDate[1] + "," + startDate[0]);

      if (chosenDate.getTime() == startDate.getTime()){
        noEventCheck = true;
        startHour = currentList.ListTask[i]["startHour"]
        endHour = currentList.ListTask[i]["endHour"]
  
        if (startHour.length == 5){
          startHour = startHour.split("")
          startHour = startHour[0] + ":" + startHour[1] + startHour[2] + startHour[3] + startHour[4]
        } else {
          startHour = startHour.split("")
          startHour = startHour[0] + startHour[1] + ":" + startHour[2] + startHour[3] + startHour[4] + startHour[5]
        }
  
        if (endHour.length == 5){
          endHour = endHour.split("")
          endHour = endHour[0] + ":" + endHour[1] + endHour[2] + endHour[3] + endHour[4]
        } else {
          endHour = endHour.split("")
          endHour = endHour[0] + endHour[1] + ":" + endHour[2] + endHour[3] + endHour[4] + endHour[5]
        }
  
        content += '<li class="listItem mdl-list__item mdl-shadow--2dp" value='+ currentList.ListTask[i]["tag"] +'> <span class="mdl-list__item-primary-content eventNameDesc"> <div class="circle mdl-shadow--2dp" style=background-color:#' + currentList.ListTask[i]["color"] + '>&nbsp;</div>'
        content += currentList.ListTask[i]["name"] + " - " + currentList.ListTask[i]["description"] + '</span>' + '<span class="mdl-list__item-primary-content">' + currentList.ListTask[i]["startDate"] + " - " + currentList.ListTask[i]["endDate"] + '</span>' + '<span class="mdl-list__item-primary-content">' + startHour + " - " + endHour;
        content += '<div id="deleteEvent" value="' + currentList.ListTask[i]["tag"] + '">&#10006;</div> </span> </li>'

      }
    }
    content += '</ul>';
    $("#viewPane").html(content)

    if (noEventCheck == false){
      console.log("no Events Today")
      $("#viewPane").html('<div class="noEventsToday">No events today!</div>')
    }
  }

  $("#dayButt").click(dayView)






  function editEvent(tag){
    console.log("EDITEVENTTAG: ", tag)
    var currentList = JSON.parse(JSON.stringify(cList))
    currentList.ListTask.sort(compare);

    var name; var description; var startDate; var endDate; var startHour; var endHour; var color
    var originalCurrentYear = currentYear;
    var originalCurrentMonth = currentMonth;
    var originalStartYear = startYear;
    var originalStartMonth = startMonth;

    for (i = 0; i < currentList.ListTask.length; i++){
      if (currentList.ListTask[i]["tag"] == tag){
        name = currentList.ListTask[i]["name"];
        description = currentList.ListTask[i]["description"];
        startDate = currentList.ListTask[i]["startDate"];
        endDate = currentList.ListTask[i]["endDate"];
        startHour = currentList.ListTask[i]["startHour"];
        endHour = currentList.ListTask[i]["endHour"];
        color = currentList.ListTask[i]["color"];


        console.log("startDate: ",startDate)
        var startDay = startDate.split("/");

        currentYear = parseInt(startDay[2]);
        currentMonth = parseInt(startDay[1]);
        startYear = parseInt(startDay[2]);
        startMonth = parseInt(startDay[1]);
        generatePicker();
        createEventButtModal();

        //startClass = document.getElementsByClassName("start"+startMonth)

        console.log(".start" + startDate)

        $("#eventName").val(name)
        $("#eventDescription").val(description)
        //$('#' + 'start' + startDate).addClass("selected")
        $(".mdl-textfield").addClass("is-dirty")

        $(".mdl-dialog__title").html("Edit Event")
        dialog.showModal();

        


      }
    }

  }

  $('body').on('dblclick', '.listItem', function () {
    var tag = this.getAttribute("value")
    editEvent(tag)
  })

  $('body').on('dblclick', '.monthEvent', function () {
    var tag = this.getAttribute("value")
    editEvent(tag)
  })

  $('body').on('dblclick', '.weekEvent', function () {
    var tag = this.getAttribute("value")
    editEvent(tag)
  })


})




  