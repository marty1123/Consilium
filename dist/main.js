var $ = require("jquery");
const {app, BrowserWindow} = require('electron')
//window.$ = window.jQuery = require('jquery');
  
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let win
  
  function createWindow () {
    // Create the browser window.
    //var viewport = require('electron-viewport')(950, 1025, {resizable:false})
    //var win = viewport.getWindow()

    win = new BrowserWindow({width: 950, height: 1025, minWidth: 950})
    
  
    // and load the index.html of the app.
    win.loadFile('index.html')

    //Removes menu bar from window.
    //win.setMenu(null)
  
    // Emitted when the window is closed.
    win.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      win = null
    })
  }
  
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow)
  
  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
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
  monthAmount = new Date(currentYear, currentMonth, 0).getDate()
  currentMonthName = monthNames[currentMonth - 1]
  console.log(currentDate,currentMonth,currentYear,firstDay,monthAmount)

  for (i = 1; i <= firstDay; i++){
    document.getElementById("dpGrid" + parseInt(i)).innerHTML = " ";
  }

  for (i = 1 + firstDay; i <= monthAmount + firstDay; i++){
    document.getElementById("dpGrid" + parseInt(i)).innerHTML = i - firstDay 
    console.log("Check")
  }

  /*for (i = 1 + monthAmount; i <= monthAmount + firstDay; i++){
    document.getElementById("dpGrid" + parseInt(i)).innerHTML = " ";
  }*/

  document.getElementById("datePickerDate").innerHTML = currentMonthName + " " + currentYear;
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

function viewAllEvents(){
  console.log("VIEWALLEVENTS");
}