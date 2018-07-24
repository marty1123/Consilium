var $ = require("jquery");
const {app, BrowserWindow} = require('electron')
  
  let win
  
  function createWindow () {
    //var viewport = require('electron-viewport')(950, 1025, {resizable:false})
    //var win = viewport.getWindow()

    win = new BrowserWindow({width: 970, height: 1025, minWidth: 970})
    
    win.loadFile('index.html')
  
    win.on('closed', () => {
      win = null
    })
  }
  
  app.on('ready', createWindow)
  
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', () => {
    if (win === null) {
      createWindow()
    }
  })
  


function startLoad(){
  console.log("Test");
  var selectd = new Date();
  setPickerDate(selectd);
  }


var d = 0;
var currentDate = 0;
var currentMonth = 0;
var currentYear = 0;
var firstDay = 0;
var monthAmount = 0;
var currentMonthName = "";
var monthNames = [];

function setPickerDate(selectd){
  monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
  d = selectd;
  currentDate = d.getDate();
  currentMonth = d.getMonth() + 1;
  currentYear = d.getFullYear();
  generatePicker();
}

function generatePicker(){
  firstDay = new Date(currentYear + "-" + currentMonth + "-01").getDay();
  monthAmount = new Date(currentYear, currentMonth, 0).getDate();
  currentMonthName = monthNames[currentMonth - 1]
  console.log(currentDate,currentMonth,currentYear,firstDay,monthAmount)

  for (i = 1; i <= firstDay; i++){
    document.getElementById("dpGrid" + parseInt(i)).innerHTML = " ";
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

function addPickerMonth(){
  if (currentMonth < 12){
    currentMonth = currentMonth + 1;
  } else {
    currentYear = currentYear + 1;
    currentMonth = currentMonth - 11;
  }
  generatePicker();
} 

function removePickerMonth(){
  if (currentMonth > 1){
    currentMonth = currentMonth - 1;
  } else {
    currentYear = currentYear - 1;
    currentMonth = currentMonth + 11;
  }
  generatePicker();
}

function viewAllEvents(){
  console.log("VIEWALLEVENTS");
}

/*
function createEventDialog(){

  console.log("test")

  year = currentYear
  for (i = 1; i < 5; i++){
    document.getElementById("sYearList").innerHTML += '<li class="mdl-menu__item" data-val="DEU">' + year + '</li>';
    year = year + 1;
  }
} */