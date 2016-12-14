function doGet(e) {
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try {
    var database = SpreadsheetApp.openById("1CRb5J6bOdcA6XixQheCPv0Zmlk6UuOAa0yXobaajhCg"); //replace this string of numbers & letters with your database ID
    var splicedDataset = SpreadsheetApp.openById("1-sRez7Lo4vVbazXIQFLB9Hsh9JrUC3mKDScmXLushUE"); //replace this string of numbers & letters with your spliced database id
    var compliance = SpreadsheetApp.openById("1xfSMaAq0xt9mnha15RW6W3hJMsrwAFsB101B7UEC8FM"); //replace this string of numbers & letters with your compliance database id
    
    var PID = e.parameters['participant_id'];
    var sheet = database.getSheetByName(PID);
    var splicedSheet = splicedDataset.getSheetByName(PID);
    if (database.getSheetByName(PID) == null){
    //inserts sheet at the end
      var sheetIndex = database.getNumSheets()+1;
      sheet = database.insertSheet(PID, sheetIndex).setName(PID);
      splicedSheet = splicedDataset.insertSheet(PID, sheetIndex).setName(PID);
      var complianceSheet = compliance.getSheets()[0];
      var complianceNewRow = complianceSheet.getLastRow()+1;
      var today = new Date();
      complianceSheet.getRange(complianceNewRow,1).setValue(PID);
      complianceSheet.getRange(complianceNewRow,4).setValue(today);
      var endYear = today.getFullYear(), endMonth = today.getMonth();
      //the number of days you add is equal to the number of days you collect data. If you choose to use the compliance checker, add 2 to the number of 
      //data colsection days
      var endDate = today.getDate() + 9;
      var daysAfterDataCollection = new Date(endYear, endMonth, endDate);
      complianceSheet.getRange(complianceNewRow,5).setValue(daysAfterDataCollection);
      //this code will delete the extra columns in each sheet so can write more data to each spreadsheet
      //Each spreadsheet can only have a maximum of 2 million cells
      sheet.deleteColumns(3, 24);
      splicedSheet.deleteColumns(6, 21);
    } 
    var newRow = sheet.getLastRow()+1;
    for (var key = 0; key < Object.keys(e.parameters).length; key++){ 
      sheet.getRange(newRow, 1).setValue(Object.keys(e.parameters)[key]);
      splicedSheet.getRange(newRow, 1).setValue(Object.keys(e.parameters)[key]);
      sheet.getRange(newRow, 2).setValue(e.parameters[Object.keys(e.parameters)[key]]);
      splicedSheet.getRange(newRow, 4).setValue(e.parameters[Object.keys(e.parameters)[key]]);
      newRow = newRow + 1;
    }
    //create a log of what is going on
    var doc = DocumentApp.openById("1WOfuAnTdM83kXOr2rT7-weFGreq60P6wst457BXABbY");
    var body = doc.getBody();
    body.appendParagraph(Logger.getLog());
    return HtmlService.createHtmlOutput(Logger.getLog());
    return ContentService.createTextOutput(JSON.stringify({"result":"success", "row": nextRow})).setMimeType(ContentService.MimeType.JSON);
  } catch(e) {
    //if error return this
    return ContentService.createTextOutput(JSON.stringify({"result":"error", "error": e})).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}


// Compliance code

var complianceSheet = SpreadsheetApp.openById("1xfSMaAq0xt9mnha15RW6W3hJMsrwAFsB101B7UEC8FM"); //replace this string of numbers & letters with your compliance sheet ID
var splicedDataset = SpreadsheetApp.openById("1-sRez7Lo4vVbazXIQFLB9Hsh9JrUC3mKDScmXLushUE"); //replace this string of numbers & letters with your spliced database ID
function findCell(PID) {
  var compliance = complianceSheet.getSheets()[0];
  var dataRange = compliance.getDataRange();
  var values = dataRange.getValues();
  for (var i = 0; i < values.length; i++) {
    var row = "";
    for (var j = 0; j < values[i].length; j++) {     
      if (values[i][j] == PID) {
        row = i + 1;
        return row; 
        break;
      }
    }    
  }  
}

function findNextEmptyColumn(rowNum) {
  var compliance = complianceSheet.getSheets()[0];
  var dataRange = compliance.getDataRange();
  var values = dataRange.getValues()[rowNum - 1];
  Logger.log("find next empty column values: " + values);
  var column = "";
  for (var j = 5; j < values.length; j++) {
    if (values[j] === "") {
      column = j + 1;
      return column; 
      break;
    }
  }    
}  

function endOfDataCollectionPeriod(rowNum){
  var compliance = complianceSheet.getSheets()[0];
  var dataRange = compliance.getDataRange();
  var values = dataRange.getValues()[rowNum - 1];
  Logger.log(values);
  var endOfDataCollection = new Date(values[4]).getTime();
  return endOfDataCollection;
}

function startOfDataCollectionPeriod(rowNum){
  var compliance = complianceSheet.getSheets()[0];
  var dataRange = compliance.getDataRange();
  var values = dataRange.getValues()[rowNum - 1];
  var startOfDataCollection = new Date(values[3]).getTime();
  return startOfDataCollection;
}

/*function isValidDate(date)
{
    var matches = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/.exec(date);
    if (matches == null) return false;
    var d = matches[2];
    var m = matches[1] - 1;
    var y = matches[3];
    var composedDate = new Date(y, m, d);
    return composedDate.getDate() == d &&
            composedDate.getMonth() == m &&
            composedDate.getFullYear() == y;
}*/

function checkCompletedSurveys() {
  var sheetIndex = splicedDataset.getNumSheets();
  var sheetNames = [];
  var sheets = splicedDataset.getSheets();
  for (var i = 0; i < sheetIndex; i++){
    sheetNames.push(sheets[i].getSheetName());
  }
  for (var i = 0; i < sheetNames.length; i++) {
    var rowNum = Number(findCell(sheetNames[i]));
    var endDate = endOfDataCollectionPeriod(rowNum);
    var startDate = startOfDataCollectionPeriod(rowNum);
    var today = new Date().getTime();
    if (today <= endDate && today > startDate) {
      getUniqueKeys(sheetNames[i]);
    }
  }
}

function spliceData() {
  var sheetIndex = splicedDataset.getNumSheets();
  var sheetNames = [];
  var sheets = splicedDataset.getSheets();
  for (var i = 0; i < sheetIndex; i++){
    sheetNames.push(sheets[i].getSheetName());
  }
  for (var i = 0; i < sheetNames.length; i++) {
    Logger.log(sheetNames[i]);
    var rowNum = Number(findCell(sheetNames[i]));
    Logger.log("row number: " + rowNum);
    var endDate = endOfDataCollectionPeriod(rowNum);
    var startDate = startOfDataCollectionPeriod(rowNum);
    var today = new Date().getTime();
    if (today <= endDate && today > startDate) {
      spliceVariableName(sheetNames[i]);
    }
  }
}

function spliceVariableName(sheetName){
  var sheet = splicedDataset.getSheetByName(sheetName);
  var uniqueResponses = [], uniqueKeysArray = [], variableNames = [], variableNameTimestamp = [], 
      timestamp = [], responseLabel = [], splicedVariableName = [], lastRow = sheet.getLastRow(), 
      startColumn = sheet.getRange("e:e"); 
  var values = startColumn.getValues();
  var startRow = 0;
  var rowsToCheck;
  while (values[startRow][0] != "") {
    startRow++
  }
  rowsToCheck = lastRow - startRow;
  var actualStartRow = startRow + 1;
  if (rowsToCheck > 1){
    responseLabel = sheet.getRange(actualStartRow,1,rowsToCheck,1).getValues();
  //splice the variable name into appropriate names
  for (var i = 0; i < responseLabel.length; i++) {
    uniqueResponses.push(responseLabel[i][0]);
    //String(uniqueResponses[i]);  
    if (typeof uniqueResponses[i] !== 'string') return;
    var numberOfUnderscores = uniqueResponses[i].split(/_(.+)/).length-1;
      if (numberOfUnderscores == 0) {
        uniqueKeysArray.push(uniqueResponses[i].split("_",1)[0]);
        variableNames.push("");
        variableNameTimestamp.push("");
        timestamp.push("");
      }
      else if (numberOfUnderscores == 1){
        uniqueKeysArray.push(uniqueResponses[i].split("_",1)[0]);
        variableNames.push(uniqueResponses[i].split("_",2)[1]);
        variableNameTimestamp.push("");
        timestamp.push("");
      }
      else if (numberOfUnderscores > 1) {
        uniqueKeysArray.push(uniqueResponses[i].split("_",1)[0]);
        variableNames.push(uniqueResponses[i].split("_",2)[1]);
        variableNameTimestamp.push(uniqueResponses[i].split(/_(.+)/)[1]);
        timestamp.push(variableNameTimestamp[i].split(/_(.+)/)[1]);
      }
      splicedVariableName.push([ uniqueKeysArray[i], variableNames[i], timestamp[i]]);
      sheet.getRange(actualStartRow, 1, splicedVariableName.length, 3).setValues(splicedVariableName);
    }
  }
}

function getUniqueKeys(sheetName) {
  var sheet = splicedDataset.getSheetByName(sheetName);
  var compliance = complianceSheet.getSheets()[0];
  var PID = sheet.getSheetName();
  var uniqueKeys = [], uniqueKeysArray = [], removedItems, completedSurveys = [], date, today, yesterday, numberOfEntries, checkDate; 
  var lastRow = sheet.getLastRow();
  var startColumn = sheet.getRange("e:e"); 
  var values = startColumn.getValues();
  var startRow = 0;
  var rowsToCheck;
  for (var startRow = 0; startRow < values.length && values[startRow][0] != ""; ++startRow) {
    startRows.push(values[startRow][0]);
    startRow = startRows.length;
  }
  rowsToCheck = lastRow - startRow;
  var actualStartRow = startRow + 1;
  if (rowsToCheck > 1){
    var actualStartRow = startRow + 1;
    var range = sheet.getRange(actualStartRow + 1,1);
    var newData = range.getValue();
   uniqueKeys = sheet.getRange(actualStartRow,1,rowsToCheck,1).getValues();
    for (var i = 0; i < uniqueKeys.length; i++){
      uniqueKeysArray.push(uniqueKeys[i][0]);
    }    
    for (var i = 0; i < uniqueKeysArray.length; i++) {
      var value = uniqueKeysArray[i];
      var string = new RegExp(".completed");
      if (string.test(value)) {
        var splicedCompletedSurvey = value.split(".");
        Logger.log(splicedCompletedSurvey);
        var completedUniqueKey = splicedCompletedSurvey[0];
        Logger.log(completedUniqueKey);
        completedSurveys.push(completedUniqueKey);
      }
    }
    //this will only count unique keys onces; sometimes participants may send their data more than once by accident
    //this will prevent these duplicate entries from being counted
    var uniqueCompletedSurveys = eliminateDuplicates(completedSurveys);
    date = new Date();
    today = date.getTime();
    yesterday = date.setDate(date.getDate() - 1); 
    var numberOfEntries = 0;
    for (var i = 0; i < uniqueCompletedSurveys.length; i++){
      if (completedSurveys[i] < today && yesterday < uniqueCompletedSurveys[i]){
        numberOfEntries++;
      }
    }
    checkDate = new Date();
    var rowNum = findCell(PID);
    var complianceColumn = findNextEmptyColumn(rowNum);
    //Logger.log("Original compliance column: " + complianceColumn);
    /*if (complianceColumn < 6) {
      complianceColumn = 6;
    }*/
    Logger.log(complianceColumn);
    compliance.getRange(rowNum,complianceColumn,1,1).setValue(numberOfEntries);
    compliance.getRange(rowNum,complianceColumn+1,1,1).setValue(checkDate);
    sheet.getRange(actualStartRow, 5, rowsToCheck, 1).setValue("Checked");
  }
  else {
    var checkDate = new Date();
    var numberOfEntries = 0;
    var rowNum = findCell(PID);
    var complianceColumn = findNextEmptyColumn(rowNum);
    compliance.getRange(rowNum,complianceColumn,1,1).setValue(numberOfEntries);
    compliance.getRange(rowNum,complianceColumn+1,1,1).setValue(checkDate);
  }
 }

function spliceVariableNameIntakeSession(sheetName){
  var sheet = splicedDataset.getSheetByName(sheetName);
  var uniqueResponses = [], uniqueKeysArray = [], variableNames = [], variableNameTimestamp = [], 
      timestamp = [], responseLabel = [], splicedVariableName = [], lastRow = sheet.getLastRow(), 
      startColumn = sheet.getRange("e:e"); 
  var values = startColumn.getValues();
  var startRow = 0;
  var rowsToCheck;
  var startRows = [];
  for (var startRow = 0; startRow < values.length && values[startRow][0] != ''; ++startRow) {
    startRows.push(values[startRow][0]);
    startRow = startRows.length;
  }
  rowsToCheck = lastRow - startRow;
  var actualStartRow = startRow + 1;
  if (rowsToCheck > 1){
    responseLabel = sheet.getRange(actualStartRow,1,rowsToCheck,1).getValues();
  //splice the variable name into appropriate names
  for (var i = 0; i < responseLabel.length; i++) {
    uniqueResponses.push(responseLabel[i][0]);
    //String(uniqueResponses[i]);  
    if (typeof uniqueResponses[i] !== 'string') return;
    var numberOfUnderscores = uniqueResponses[i].split(/_(.+)/).length-1;
      if (numberOfUnderscores == 0) {
        uniqueKeysArray.push(uniqueResponses[i].split("_",1)[0]);
        variableNames.push("");
        variableNameTimestamp.push("");
        timestamp.push("");
      }
      else if (numberOfUnderscores == 1){
        uniqueKeysArray.push(uniqueResponses[i].split("_",1)[0]);
        variableNames.push(uniqueResponses[i].split("_",2)[1]);
        variableNameTimestamp.push("");
        timestamp.push("");
      }
      else if (numberOfUnderscores > 1) {
        uniqueKeysArray.push(uniqueResponses[i].split("_",1)[0]);
        variableNames.push(uniqueResponses[i].split("_",2)[1]);
        variableNameTimestamp.push(uniqueResponses[i].split(/_(.+)/)[1]);
        timestamp.push(variableNameTimestamp[i].split(/_(.+)/)[1]);
      }
      splicedVariableName.push([ uniqueKeysArray[i], variableNames[i], timestamp[i]]);
      sheet.getRange(actualStartRow, 1, splicedVariableName.length, 3).setValues(splicedVariableName);
      sheet.getRange(actualStartRow, 5, rowsToCheck, 1).setValue("Intake Session");
    }
  }
}

function eliminateDuplicates(arr) {
  var i,
      len=arr.length,
      out=[],
      obj={};

  for (i=0;i<len;i++) {
    obj[arr[i]]=0;
  }
  for (i in obj) {
    out.push(i);
  }
  return out;
}




