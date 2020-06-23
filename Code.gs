/*
	Script that turns a Google Sheet into CSV and uses it as a Product Data import in Google Analytics
	By Julien Coquet - 
    https://juliencoquet.com/en/
    https://mightyhive.com
    
	Pre-requisites:
		Google Analytics property 
			- with Enhanced eCommerce enabled
			- with at least one Data Import set up for Product Data
		Google Sheet with access granted to Google Analytics API
*/


function onOpen() {
  // Init script and create menus
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [
    {name: "Generate CSV and Upload to GA", functionName: "main"},
    {name: "Logout", functionName: "logout"},
    
  ];
  ss.addMenu("Upload", menuEntries);
};


function csvFromCells(){
  var fileName = "sheet.csv"; // Rename this to whatever file you want
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Data"); // Change this to whatever name you gave to your first sheet
  
  // Create a timestamped folder containing your CSV, for good measure
  var folder = DriveApp.createFolder("Google Analytics Uploads " + new Date().getTime() );
  
  var csvFile = convertRangeToCsvFile_(fileName, sheet);
  var file = folder.createFile(fileName, csvFile);

  // Grab the CSV file's Google Drive ID
  var fileID = file.getId()
  return fileID;
}


function convertRangeToCsvFile_(csvFileName, sheet) {
  // get available data range in the spreadsheet
  var activeRange = sheet.getDataRange();
  try {
    var data = activeRange.getValues();
    var csvFile = undefined;

    // loop through the data in the range and build a string with the csv data
    if (data.length > 1) {
      var csv = "";
      for (var row = 0; row < data.length; row++) {
        for (var col = 0; col < data[row].length; col++) {
          if (data[row][col].toString().indexOf(",") != -1) {
            data[row][col] = "\"" + data[row][col] + "\"";
          }
        }

        // join each row's columns
        // add a carriage return to end of each row, except for the last one
        if (row < data.length-1) {
          csv += data[row].join(",") + "\r\n";
        }
        else {
          csv += data[row];
        }
      }
      csvFile = csv;
    }
    return csvFile;
  }
  catch(err) {
    Logger.log(err);
    Browser.msgBox(err);
  }
}

function uploadProductCSV(fileID){
  
  // Google Analytics account information - taken from the Settings tab
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Settings");
  // Retrieve your GA account ID and property ID from where you get your tracking code from.
  var accountId = sheet.getRange("B2").getValue(); // e.g. UA-123456
  var webPropertyId = sheet.getRange("B3").getValue(); // e.g. UA-123456-1
    
  // Retrieve your Google Analytics data upload Data Source ID
  // This can be found in your Google Analytics admin panel at the property level, under Data Import
  var customDataSourceId = sheet.getRange("B4").getValue();
  
  // Encoding for the win!
  var myString = "";
  var encoded = Utilities.base64Encode(myString);
  var byteDataArray = Utilities.base64Decode(encoded);
  
  var file = DriveApp.getFileById(fileID)
  var fileAsBlob = file.getBlob();
  var fileAsBytes = fileAsBlob.getBytes();
  
  var combinedBytes = byteDataArray.concat(fileAsBytes);
  var allBytesAsBlob = Utilities.newBlob(combinedBytes);
  
  // Invoke the Google Analytics Management API and send the data blob along with it
  var newUpload = Analytics.Management.Uploads.uploadData(
    accountId, 
    webPropertyId, 
    customDataSourceId, 
    allBytesAsBlob
  );
}


function logout(){
  signOut();
}

function main(){
  /* HERE WE GO */
  
  // Create CSV from "Data" sheet, store to GDrive, get CSV file ID
  myCSV = csvFromCells();
  
  // retrieves the CSV file, encodes it and uploads it to Google Analytics
  uploadProductCSV(myCSV); 
  
  // Output alert box in browser
  Browser.msgBox("Done.\rCheck your Google Analytics property under Data Import");
}
