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
  
  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.


function startLoad(){
  console.log("Test");
  var selectd = new Date();
  setPickerDate(selectd);
  }

function viewAllEvents(){
  console.log("VIEWALLEVENTS");
}

function setPickerDate(selectd){
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
  var d = selectd;
  var currentDate = d.getDate();
  var currentMonth = d.getMonth() + 1;
  var currentYear = d.getFullYear();
  var firstDay = new Date(currentYear + "-" + currentMonth + "-01").getDay();
  var monthAmount = new Date(currentYear, currentMonth, 0).getDate()
  var currentMonthName = monthNames[currentMonth - 1]
  console.log(currentDate,currentMonth,currentYear,firstDay,monthAmount)

  for (i = 1 + firstDay; i <= monthAmount; i++){
    document.getElementById("dpGrid" + parseInt(i)).innerHTML = i - firstDay 
    console.log("Check")
  }

  document.getElementById("datePickerDate").innerHTML = currentMonthName + " " + currentYear;
}
