function doGet(localStore) {

    var lock = LockService.getPublicLock();
    lock.waitLock(30000);
    try {
        var database = SpreadsheetApp.openById("1CRb5J6bOdcA6XixQheCPv0Zmlk6UuOAa0yXobaajhCg"); //replace this string of numbers & letters with your database ID
        var splicedDataset = SpreadsheetApp.openById("1-sRez7Lo4vVbazXIQFLB9Hsh9JrUC3mKDScmXLushUE"); //replace this string of numbers & letters with your spliced database id
        var compliance = SpreadsheetApp.openById("1xfSMaAq0xt9mnha15RW6W3hJMsrwAFsB101B7UEC8FM"); //replace this string of numbers & letters with your compliance database id

        var PID = localStore.parameters['participant_id'];
        var sheet = database.getSheetByName(PID);
        var splicedSheet = splicedDataset.getSheetByName(PID);

        // If this is a new user, we add some information about them to the compliance sheet (start and end date).
        if (database.getSheetByName(PID) == null){
            //inserts sheet at the end
            var sheetIndex = database.getNumSheets()+1;
            sheet = database.insertSheet(PID, sheetIndex).setName(PID);
            splicedSheet = splicedDataset.insertSheet(PID, sheetIndex).setName(PID);
            var complianceSheet = compliance.getSheets()[0];
            var complianceNewRow = complianceSheet.getLastRow()+1;
            var today = new Date();
            complianceSheet.getRange(complianceNewRow,1).setValue(PID);
            complianceSheet.getRange(complianceNewRow,2).setValue(today);// this might be why we have blank cols - mibbe change 2
            var endYear = today.getFullYear(), endMonth = today.getMonth();
            //the number of days you add is equal to the number of days you collect data. If you choose to use the compliance checker, add 2 to the number of 
            //data colsection days
            var endDate = today.getDate() + 14;
            var daysAfterDataCollection = new Date(endYear, endMonth, endDate);
            complianceSheet.getRange(complianceNewRow,5).setValue(daysAfterDataCollection);
            //this code will delete the extra columns in each sheet so can write more data to each spreadsheet
            //Each spreadsheet can only have a maximum of 2 million cells
            sheet.deleteColumns(3, 24); //  NOTE: Caterina commented out this and line below to see if extra data on spreadsheet
            splicedSheet.deleteColumns(3, 24);
        }

        var newRow = sheet.getLastRow()+1;
        for (var key = 0; key < Object.keys(localStore.parameters).length; key++){
            sheet.getRange(newRow, 1).setValue(Object.keys(localStore.parameters)[key]);//sends the element name (the long string index)
            splicedSheet.getRange(newRow, 1).setValue(Object.keys(localStore.parameters)[key]);
            sheet.getRange(newRow, 2).setValue(localStore.parameters[Object.keys(localStore.parameters)[key]]); // sends the actual value
            splicedSheet.getRange(newRow, 2).setValue(localStore.parameters[Object.keys(localStore.parameters)[key]]);
            newRow = newRow + 1;
        }
        //create a log of what is going on
        var doc = DocumentApp.openById("1WOfuAnTdM83kXOr2rT7-weFGreq60P6wst457BXABbY");
        var body = doc.getBody();
        body.appendParagraph(Logger.getLog());
      
        return HtmlService.createHtmlOutput(Logger.getLog());
        return ContentService.createTextOutput(JSON.stringify({"result":"success", "row": newRow})).setMimeType(ContentService.MimeType.JSON);
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
