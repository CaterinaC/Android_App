/*ExperienceSampler License

 /* activate localStorage */
var localStore = window.localStorage;
/* surveyQuestion Model (This time, written in "JSON" format to interface more cleanly with Mustache) */

var participantSetup = [
    {
        "type": "text",
        "variableName": "participant_id",
        "questionPrompt": "Please type in your participant ID as: your initials + year of birth + first letter from country of origin. Example:  AF1990S  , for Alex Farrell, born in 1990, in Scotland. Always keep the same ID!",
    }
];

var surveyQuestions = [
    /*0*/
    {
        "type": "mult1",
        "variableName": "snooze",
        "questionPrompt": "Are you able to take the survey now?",
        "minResponse": 0,
        "maxResponse": 1,
        "labels": [
            {"label": "No"},
            {"label": "Yes"}
        ]
    },
    /*1*/
    {
        "type": "text",
        "variableName": "participant_id",
        "questionPrompt": "Please type in your participant ID again, as: your initials + year of birth + first letter from your country of origin (example: AF1990S)."
    },
    /*2*/
    {
        "type": "instructions",
        "variableName": "generalInstructions",
        "questionPrompt": "On the following screens, we will be asking you questions about your experiences within the last 30 minutes."
    },
    /*3*/
    {
        "type": "slider",
        "variableName": "thermometerValence",
        "questionPrompt": "Please indicate how you are feeling at the moment, where 0 = extremely unpleasant; 0 = neither pleasant, nor unpleasant; +50 = extremely pleasant. You can give your answer by moving the slider up or down, and you can see the value to the right of the slider.",
        "minResponse": 0,
        "maxResponse": 50
    },
    /*4*/
    {
        "type": "slider",
        "variableName": "thermometerArousal",
        "questionPrompt": "Please indicate how you are feeling at the moment, where 0 = extremely bored/sleepy/relaxed; 0 = neutral; +50 = extremely alert/agitated. You can give your answer by moving the slider up or down, and you can see the value to the right of the slider.",
        "minResponse": 0,
        "maxResponse": 50
    },
    /*5*/
    {
        "type": "slider",
        "variableName": "thermometerDominance",
        "questionPrompt": "Please indicate how you are feeling at the moment, where 0 = completely overwhelmed by the situation; 0 = neither overwhelmed, nor in control; +50 = extremely dominant / in control of the situation. You can give your answer by moving the slider up or down, and you can see the value to the right of the slider.",
        "minResponse": 0,
        "maxResponse": 50
    },
    /*6*/
    {
        "type": "text",
        "variableName": "describeSituation",
        "questionPrompt": "What (emotional) events have occurred within the last 30 minutes?"
    },
    /*7*/
    {
        "type": "mult1",
        "variableName": "otherParticipant",
        "questionPrompt": "Was anyone else involved?",
        "minResponse": 0,
        "maxResponse": 1,
        "labels": [
            {"label": "No"},
            {"label": "Yes"}
        ]
    },
    /*8*/
    {
        "type": "text",
        "variableName": "numberOfParticipants",
        "questionPrompt": "How many other people were involved?"
    },
    /*9*/
    {
        "type": "mult1",
        "variableName": "eventCategory",
        "questionPrompt": "Would you class the recent events as:",
        "minResponse": 1,
        "maxResponse": 7,
        "labels":[
            {"label": "Neutral"},
            {"label": "Overall positive"},
            {"label": "Overall negative"},
            {"label": "Positive, and also exciting"},
            {"label": "Positive, and also relaxing"},
            {"label": "Negative, but unexciting"},
            {"label": "Negative, but very intense"}
        ]
    }
];

var lastPage = [
    {"message": "Thank you for completing today’s questions. Please wait while the data is sent to our servers..."},
    {"message": "That's cool! I'll notify you again in 10 minutes!"},
    {"message": "Thank you for installing our app. Please wait while the data is sent to our servers..."}
];


/*Populate the view with data from surveyQuestion model*/
// Making mustache templates
//Here you declare global variables are well
var NUMSETUPQS = participantSetup.length;

var SNOOZEQ = 0;

var questionTmpl = "<p>{{{questionText}}}</p><ul>{{{buttons}}}</ul>";

var questionTextTmpl = "{{questionPrompt}}";

var buttonTmpl = "<li><button id='{{id}}' value='{{value}}'>{{label}}</button></li>";

var textTmpl = "<li><textarea cols=50 rows=5 id='{{id}}'></textarea></li><li><button type='submit' value='Enter'>Enter</button></li>";

var checkListTmpl = "<li><input type='checkbox' id='{{id}}' value='{{value}}'>{{label}}</input></li>";

var instructionTmpl = "<li><button id='{{id}}' value = 'Next'>Next</button></li>";

var sliderTmpl = "<li><input type='range' min='{{min}}' max='{{max}}' value='{{value}}' orient=vertical id='{{id}}' oninput='outputUpdate(value)'></input><output for='{{id}}' id='slider'>50</output><script>function outputUpdate(slidervalue){document.querySelector('#slider').value=slidervalue;}</script></li><li><button type='submit' value='Enter'>Enter</button></li>";

var datePickerTmpl = '<li><input id="{{id}}" data-format="DD-MM-YYYY" data-template="D MMM YYYY" name="date"><br /><br /></li><li><button type="submit" value="Enter">Enter</button></li><script>$(function(){$("input").combodate({firstItem: "name",minYear:2015, maxYear:2016});});</script>';

var dateAndTimePickerTmpl = '<li><input id="{{id}}" data-format="DD-MM-YYYY-HH-mm" data-template="D MMM YYYY  HH:mm" name="datetime24"><br /><br /></li><li><button type="submit" value="Enter">Enter</button></li><script>$(function(){$("input").combodate({firstItem: "name",minYear:2015, maxYear:2016});});</script>';

var timePickerTmpl = '<li><input id="{{id}}" data-format="HH:mm" data-template="HH : mm" name="time"><br /><br /></li><li><button type="submit" value="Enter">Enter</button></li><script>$(function(){$("input").combodate({firstItem: "name"});});</script>';

var lastPageTmpl = "<h3>{{message}}</h3>";

var uniqueKey;

var name;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    // Bind Event Listeners
    bindEvents: function() {
        document.addEventListener("deviceready", this.onDeviceReady, false);
        document.addEventListener("resume", this.onResume, false);
        document.addEventListener("pause", this.onPause, false);
    },
    onDeviceReady: function() {
        app.init();
    },
    onResume: function() {app.sampleParticipant();},
    onPause: function() {app.pauseEvents();},

    //Beginning our app functions
    /* The first function is used to specify how the app should display the various questions. You should note which questions
     should be displayed using which formats before customizing this function*/


    renderQuestion: function(question_index) {
        //First load the correct question from the JSON database
        var questionPrompt;
        var question;

        if (question_index <= -1) { // NEGATIVE INDICES IN JS MEAN THAT WE ARE COUNTING FROM THE END OF THE LIST. e.g., -1 = last element.
            question = participantSetup[question_index + NUMSETUPQS];
        }
        else {
            question = surveyQuestions[question_index];
        }

        questionPrompt = question.questionPrompt;
        question.questionText = Mustache.render(questionTextTmpl, {questionPrompt: questionPrompt});

        //Now populate the view for this question, depending on what the question type is
        switch (question.type) {

            case 'mult1': // Rating scales (i.e., small numbers at the top of the screen and larger numbers at the bottom of the screen).
                question.buttons = "";
                var label_count = 0;
                for (var i = question.minResponse; i <= question.maxResponse; i++) {
                    var label = question.labels[label_count++].label;
                    question.buttons += Mustache.render(buttonTmpl, {
                        id: question.variableName+i,
                        value: i,
                        label: label
                    });
                }
                $("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
                $("#question ul li button").click(function(){
                    app.recordResponse(this, question_index, question.type);
                });
                break;

            case 'mult2': // Rating scales (i.e., positive numbers at the top of the screen and negative numbers at the bottom of the screen).
                question.buttons = "";
                var label_count = 0;
                for (var j = question.maxResponse; j >= question.minResponse; j--) {
                    var label = question.labels[label_count++].label;
                    question.buttons += Mustache.render(buttonTmpl, {
                        id: question.variableName+j,
                        value: j,
                        label: label
                    });
                }
                $("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
                $("#question ul li button").click(function(){
                    app.recordResponse(this, question_index, question.type);
                });
                break;

            case 'checklist':
                question.buttons = "";
                var label_count = 0;
                var checkboxArray = [];
                for (var i = question.minResponse; i <= question.maxResponse; i++) {
                    var label = question.labels[label_count++].label;
                    question.buttons += Mustache.render(checkListTmpl, {
                        id: question.variableName+i,
                        value: i,
                        label: label
                    });
                }
                question.buttons += "<li><button type='submit' value='Enter'>Enter</button></li>";
                $("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
                $("#question ul li button").click( function(){
                    checkboxArray.push(question.variableName);
                    $.each($("input[type=checkbox]:checked"), function(){checkboxArray.push($(this).val());});
                    app.recordResponse(String(checkboxArray), question_index, question.type);
                });
                break;

            case 'slider':
                question.buttons = Mustache.render(sliderTmpl, {id: question.variableName+"1"}, {min: question.minResponse}, {max: question.maxResponse}, {value: (question.maxResponse)/2});
                $("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
                var slider = [];
                $("#question ul li button").click(function(){
                    slider.push(question.variableName);
                    slider.push($("input[type=range]").val());
                    app.recordResponse(String(slider), question_index, question.type);
                });
                break;

            case 'instructions':
                question.buttons = Mustache.render(instructionTmpl, {id: question.variableName+"1"});
                $("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
                var instruction = [];
                $("#question ul li button").click(function(){
                    instruction.push(question.variableName);
                    instruction.push($(this).val());
                    app.recordResponse(String(instruction), question_index, question.type);
                });
                break;

            case 'text': //default to open-ended text
                question.buttons = Mustache.render(textTmpl, {id: question.variableName+"1"});
                $("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
                $("#question ul li button").click(function(){
                    if (app.validateResponse($("textarea"))){
                        app.recordResponse($("textarea"), question_index, question.type);
                    }
                    else {
                        alert("Please enter something.");
                    }
                });
                break;

            case 'datePicker':
                question.buttons = Mustache.render(datePickerTmpl, {id: question.variableName+"1"});
                $("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
                var date, dateSplit, variableName = [], dateArray = [];
                $("#question ul li button").click(function(){
                    date = $("input").combodate('getValue');
                    dateArray.push(question.variableName);
                    dateArray.push(date);
                    app.recordResponse(String(dateArray), question_index, question.type);
                });
                break;

            case 'dateAndTimePicker':
                question.buttons = Mustache.render(dateAndTimePickerTmpl, {id: question.variableName+"1"});
                $("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
                var date, dateSplit, variableName = [], dateArray = [];
                $("#question ul li button").click(function(){
                    date = $("input").combodate('getValue');
                    dateArray.push(question.variableName);
                    dateArray.push(date);
                    app.recordResponse(String(dateArray), question_index, question.type);
                });
                break;

            case 'timePicker':
                question.buttons = Mustache.render(timePickerTmpl, {id: question.variableName+"1"});
                $("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
                var time, timeSplit, variableName = [], timeArray = [];
                $("#question ul li button").click(function(){
                    time = $("input").combodate('getValue');
                    timeArray.push(question.variableName);
                    timeArray.push(time);
                    app.recordResponse(String(timeArray), question_index, question.type);
                });
                break;
        }
    },

    renderLastPage: function(pageData, question_index) {
        $("#question").html(Mustache.render(lastPageTmpl, pageData));
        if ( question_index == SNOOZEQ ) {
            app.snoozeNotif();
            localStore.snoozed = 1;
            app.saveData();
        }
        else if ( question_index == -1) {
            app.saveDataLastPage();
        }
        else {
            var datestamp = new Date();
            var year = datestamp.getFullYear(), month = datestamp.getMonth(), day=datestamp.getDate(), hours=datestamp.getHours(), minutes=datestamp.getMinutes(), seconds=datestamp.getSeconds();
            localStore[uniqueKey + '.' + "completed" + "_" + "completedSurvey"  + "_" + year + "_" + month + "_" + day + "_" + hours + "_" + minutes + "_" + seconds] = 1;
            app.saveDataLastPage();
        }
    },

    /* Record User Responses */
    recordResponse: function(button, count, type) {
        //Record date (create new date object

        var datestamp = new Date();
        var year = datestamp.getFullYear(), month = datestamp.getMonth(), day=datestamp.getDate(), hours=datestamp.getHours(), minutes=datestamp.getMinutes(), seconds=datestamp.getSeconds();
        //Record value of text field
        var response, currentQuestion, uniqueRecord;

        if (type == 'text') {
            response = button.val();
            // remove newlines from user input
            response = response.replace(/(\r\n|\n|\r)/g, ""); //encodeURIComponent(); decodeURIComponent()
            currentQuestion = button.attr('id').slice(0,-1);
        }
        else if (type == 'slider') {
            response = button.split(/,(.+)/)[1];
            currentQuestion = button.split(",",1);
        }
        //Record the array
        else if (type == 'checklist') {
            response = button.split(/,(.+)/)[1];
            currentQuestion = button.split(",",1);
        }
        else if (type == 'instructions') {
            response = button.split(/,(.+)/)[1];
            currentQuestion = button.split(",",1);
        }
        //Record value of clicked button
        else if (type == 'mult1') {
            response = button.value;
            //Create a unique identifier for this response
            currentQuestion = button.id.slice(0,-1);
        }
        else if (type == 'mult2') {
            response = button.value;
            //Create a unique identifier for this response
            currentQuestion = button.id.slice(0,-1);
        }
        else if (type == 'datePicker') {
            response = button.split(/,(.+)/)[1];
            currentQuestion = button.split(",",1);
        }
        else if (type == 'dateAndTimePicker') {
            response = button.split(/,(.+)/)[1];
            currentQuestion = button.split(",",1);
        }
        else if (type == 'timePicker') {
            response = button.split(/,(.+)/)[1];
            currentQuestion = button.split(",",1);
        }

        //if (count == 6) {name = response;} // IS THIS SUPPOSED TO BE ANOTHER ELSE IF? Or what is this here, out of the blue.
        //if (count <= -1) {uniqueRecord = currentQuestion;} // Why is else below all by itself?!?!?!??!?!?
         uniqueRecord = uniqueKey + "_" + currentQuestion + "_" + year + "_" + month + "_" + day + "_" + hours + "_" + minutes + "_" + seconds;


        //Save this to local storage
        localStore[uniqueRecord] = response;
        //Identify the next question to populate the view
        //This is where you do the Question Logic
        //if (count <= -1) {console.log(uniqueRecord);}
        if (count == -1) {app.scheduleNotifs(); app.renderLastPage(lastPage[2], count);} // "Tx for install, data sent to servers."
        else if (count == SNOOZEQ && response == 0) {app.renderLastPage(lastPage[1], count);} // "That's cool, I'll notify you again in 10mins"

        else if (count == 7 && response == 0) {$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(9);});}
        else if (count == 7 && response == 1) {$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(8);});}

        else if (count < surveyQuestions.length-1) {$("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(count+1);});}
        else {app.renderLastPage(lastPage[0], count);} // "Thank you for completing the questions"
    },

    /* Prepare for Resume and Store Data */
    /* Time stamps the current moment to determine how to resume */
    pauseEvents: function() {
        localStore.pause_time = new Date().getTime();
        app.saveData();
    },

    /* Initialize the whole thing */
    init: function() {
        uniqueKey = new Date().getTime();
        if (localStore.participant_id === " " || !localStore.participant_id) {app.renderQuestion(-NUMSETUPQS);}
        else {
            uniqueKey = new Date().getTime();
            localStore.uniqueKey = uniqueKey;
            app.renderQuestion(0);
        }
        localStore.snoozed = 0;
    },

    sampleParticipant: function() {
        var current_moment = new Date();
        var current_time = current_moment.getTime();
        if ((current_time - localStore.pause_time) > 600000 || localStore.snoozed == 1) {
            uniqueKey = new Date().getTime();
            localStore.snoozed = 0;
            app.renderQuestion(0);
        }
        else {
            uniqueKey = localStore.uniqueKey;
        }
        app.saveData();
    },

    saveData:function() {
        $.ajax({
            type: 'get',
            url: 'https://script.google.com/macros/s/AKfycbzzbp0437BkTqx95W9THF9JhWcydzn-K-FJTbwIHF23-S0JbDXG/exec',
            data: localStore,
            crossDomain: true,
            success: function (result) {
                var pid = localStore.participant_id, snoozed = localStore.snoozed,
                    uniqueKey = localStore.uniqueKey, pause_time = localStore.pause_time;
                localStore.clear();
                localStore.participant_id = pid;
                localStore.snoozed = snoozed;
                localStore.uniqueKey = uniqueKey;
                localStore.pause_time = pause_time;
            },
            error: function (request, error) {console.log(error);},
        });
    },

    saveDataLastPage:function() {
        $.ajax({
            type: 'get',
            url: 'https://script.google.com/macros/s/AKfycbzzbp0437BkTqx95W9THF9JhWcydzn-K-FJTbwIHF23-S0JbDXG/exec',
            data: localStore,
            crossDomain: true,
            success: function (result) {
                var pid = localStore.participant_id, snoozed = localStore.snoozed, uniqueKey = localStore.uniqueKey;
                localStore.clear();
                localStore.participant_id = pid;
                localStore.snoozed = snoozed;
                localStore.uniqueKey = uniqueKey;
                $("#question").html("<h3>Your responses have been recorded. Thank you for completing this survey.</h3>");
            },
            error: function (request, error) {
                console.log(error);
                $("#question").html("<h3>Please try resending data. If problems persist, please contact the researchers.</h3><br><button>Resend data</button>");
                $("#question button").click(function () {app.saveDataLastPage();});
            }
        });
    },

    scheduleNotifs:function() {
        //cordova.plugins.backgroundMode.enable();
        var interval1, interval2, interval3, interval4;
        var a, b, c, d;
        var date1, date2, date3, date4;
        var currentMaxHour, currentMaxMinutes, currentMinHour, currenMinMinutes, nextMinHour, nextMinMinutes;
        var currentLag, maxInterval;
        var day = 86400000;
        var minDiaryLag = 3600000; // (60 mins in millis) minimum gap between measures
        var randomDiaryLag = 7200000; //120 minutes gets used with above to ensure max 180 mins between measures
     //   var weekdayDinnerTime = str.split("22:00");
     //   var weekdayWakeTime = str.split("08:00");
        var dateObject = new Date();
        var currentHour = dateObject.getHours(), currentMinute = dateObject.getMinutes();

        var now = dateObject.getTime();
        for (var i = 0; i < 14; i ++) {

            currentMaxHour = 22;//weekdayDinnerTime[0];
            currentMaxMinutes = 0;//weekdayDinnerTime[1];
            currentMinHour = 8;//weekdayWakeTime[0];
            currenMinMinutes = 0;//weekdayWakeTime[1];

            nextMinHour = currentMinHour;//weekdayWakeTime[0];
            nextMinMinutes = currenMinMinutes;//weekdayWakeTime[1];



            currentLag = (((((24 - parseInt(currentHour) + parseInt(currentMinHour))*60) - parseInt(currentMinute) + parseInt(currenMinMinutes))*60)*1000);


          //  nightlyLag= (((((24 - parseInt(currentHour) + parseInt(nextMinHour))*60) - parseInt(currentMinute) + parseInt(nextMinMinutes))*60)*1000);

            maxInterval = (((((parseInt(currentMaxHour) - parseInt(currentMinHour))*60) + parseInt(currentMaxMinutes) - parseInt(currenMinMinutes))*60)*1000);
            interval1 = parseInt(currentLag) + (parseInt(Math.round(Math.random()*randomDiaryLag)+minDiaryLag)) + day*i;
            interval2 = interval1 + (parseInt(Math.round(Math.random()*randomDiaryLag)+minDiaryLag));
            interval3 = interval2 + (parseInt(Math.round(Math.random()*randomDiaryLag)+minDiaryLag));
            interval4 = interval3 + (parseInt(Math.round(Math.random()*randomDiaryLag)+minDiaryLag));


            a = 101+(parseInt(i)*100);
            b = 102+(parseInt(i)*100);
            c = 103+(parseInt(i)*100);
            d = 104+(parseInt(i)*100);

            date1 = new Date(now + interval1);
            date2 = new Date(now + interval2);
            date3 = new Date(now + interval3);
            date4 = new Date(now + interval4);

            cordova.plugins.notification.local.schedule({icon: 'ic_launcher', id: a, at: date1, text: 'Time for your next Diary Survey!', title: 'Diary Survey'});
            cordova.plugins.notification.local.schedule({icon: 'ic_launcher', id: b, at: date2, text: 'Time for your next Diary Survey!', title: 'Diary Survey'});
            cordova.plugins.notification.local.schedule({icon: 'ic_launcher', id: c, at: date3, text: 'Time for your next Diary Survey!', title: 'Diary Survey'});
            cordova.plugins.notification.local.schedule({icon: 'ic_launcher', id: d, at: date4, text: 'Time for your next Diary Survey!', title: 'Diary Survey'});

            localStore['notification_' + i + '_1'] = localStore.participant_id + "_" + a + "_" + date1;
            localStore['notification_' + i + '_2'] = localStore.participant_id + "_" + b + "_" + date2;
            localStore['notification_' + i + '_3'] = localStore.participant_id + "_" + c + "_" + date3;
            localStore['notification_' + i + '_4'] = localStore.participant_id + "_" + d + "_" + date4;
        }
    },

    snoozeNotif:function() {
        var now = new Date().getTime(), snoozeDate = new Date(now + 600*1000);
        var id = '99';
        cordova.plugins.notification.local.schedule({
            icon: 'ic_launcher',
            id: id,
            title: 'Diary Survey',
            text: 'Please complete survey now!',
            at: snoozeDate
        });
        //console.log(snoozeDate);
    },

    validateResponse: function(data){
        var text = data.val();
//         console.log(text);
        if (text === ""){
            return false;
        } else {
            return true;
        }
    }
};
