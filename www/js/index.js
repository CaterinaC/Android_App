/*ExperienceSampler License
 The MIT License (MIT)

 Copyright (c) 2014-2015 Sabrina Thai & Elizabeth Page-Gould

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

// All edits from original version have been made by and belong to Caterina Constantinescu, 2016. University of Edinburgh.

/* activate localStorage */
var localStore = window.localStorage;
/* surveyQuestion Model (This time, written in "JSON" format to interface more cleanly with Mustache) */

var participantSetup = [
    {
        "type": "instructions",
        "variableName": "welcomeMessage",
        "questionPrompt": "<p>Hello, and thanks for installing our app!</p>" +
                          "<p>You will be beeped 4 times a day over the next 2 weeks, and asked to answer some questions here.</p>" +
                          "<p>Press the button below to continue!</p>"
    },
    {

        "type": "text",
        "variableName": "participant_id",
        "questionPrompt": "<p>Please type in your participant ID as:</p>" +
                          "<p>Your initials + Year of birth + First letter from country of origin.</p>" +
                          "<p align='left'>EXAMPLE: AF1990S, for Alex Farrell, born in 1990, in Scotland.</p>" // Align center is the default.
    }
];

var surveyQuestions = [
    /*0*/
    {
        "type": "mult1",
        "variableName": "Q1_pressPlay",
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
        "type": "instructions",
        "variableName": "Q2_generalInstructions",
        "questionPrompt": "On the following screens, we will be asking you questions about your emotional experiences within the last 30 minutes."
    },
    /*2*/
    {
        "type": "slider",
        "variableName": "Q3_thermometerValence",
        "questionPrompt": "<p>Please indicate how you are feeling at the moment, where:</p>" +
                          "<p>100 = extremely pleasant;</p>" +
                          "<p>50 = neither pleasant, nor unpleasant;</p>" +
                          "<p>0 = extremely unpleasant.</p>" +
                          "<p>You can give your answer by moving the slider up or down, and you can see the value to the right of the slider.</p>",
        "minResponse": 0,
        "maxResponse": 100
    },
    /*3*/
    {
        "type": "slider",
        "variableName": "Q4_thermometerArousal",
        "questionPrompt": "<p>Please indicate how you are feeling at the moment, where:</p>" +
                          "<p>100 = extremely alert/agitated;</p>" +
                          "<p>50 = neutral;</p>" +
                          "<p>0 = extremely relaxed/bored/sleepy.</p>" +
                          "<p>You can give your answer by moving the slider up or down, and you can see the value to the right of the slider.</p>",
        "minResponse": 0,
        "maxResponse": 100
    },
    /*4*/
    {
        "type": "slider",
        "variableName": "Q5_thermometerDominance",
        "questionPrompt": "<p>Please indicate how you are feeling at the moment, where:</p>" +
                          "<p>100 = extremely in control of the situation;</p>" +
                          "<p>50 = neither in control, nor overwhelmed;</p>" +
                          "<p>0 = completely overwhelmed by the situation.</p>" +
                          "<p>You can give your answer by moving the slider up or down, and you can see the value to the right of the slider.</p>",
        "minResponse": 0,
        "maxResponse": 100
    },
    /*5*/
    {
        "type": "text",
        "variableName": "Q6_describeSituation",
        "questionPrompt": "What (emotional) events have occurred within the last 30 minutes?"
    },
    /*6*/
    {
        "type": "mult1",
        "variableName": "Q7_otherParticipant",
        "questionPrompt": "Was anyone else involved?",
        "minResponse": 0,
        "maxResponse": 1,
        "labels": [
            {"label": "No"},
            {"label": "Yes"}
        ]
    },
    /*7*/
    {
        "type": "mult1",
        "variableName": "Q8_numberOfParticipants",
        "questionPrompt": "How many other people were involved?",
        "minResponse": 1,
        "maxResponse": 8,
        "labels": [
            {"label": "1"},
            {"label": "2"},
            {"label": "3"},
            {"label": "4"},
            {"label": "5"},
            {"label": "6"},
            {"label": "7"},
            {"label": "Over 7"}
        ]
    },
    /*8*/
    {
        "type": "mult1",
        "variableName": "Q9_eventCategory",
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
    {"message": "Thank you for completing this session's questions. Please wait while the data is sent to our servers..."},
    {"message": "That's cool! I'll notify you again in 10 minutes!"},
    {"message": "Thanks again for installing our app. Please wait while the data is sent to our servers..."}
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
        question.questionText = Mustache.render(eval(questionTextTmpl), {questionPrompt: questionPrompt});

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

    /*
        Question Index -1 means just installed app & asked for participant_id for the first time ever.
     */
    renderLastPage: function(pageData, question_index) {
        $("#question").html(Mustache.render(lastPageTmpl, pageData));
        console.log("Inside renderLastPage, question Index is " + question_index);
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
            var year=datestamp.getFullYear(), month=datestamp.getMonth(), day=datestamp.getDate(), hours=datestamp.getHours(), minutes=datestamp.getMinutes(), seconds=datestamp.getSeconds();
            localStore[localStore.participant_id + "_" + uniqueKey + "_" + "has" + "_" + "completedSurvey"  + "_" + year + "_" + month + "_" + day + "_" + hours + "_" + minutes + "_" + seconds] = 1;
            app.saveDataLastPage();
        }
    },

    /* Record User Responses */
    recordResponse: function(button, count, type) {
        //Record date (create new date object)
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

        //save metadata vars to localstore for use maintaining state later
        if (currentQuestion=="participant_id") {
            localStore.participant_id = response;
            localStore.uniqueKey = uniqueKey;
        }

        uniqueRecord = localStore.participant_id + "_" + uniqueKey + "_" + currentQuestion + "_" + year + "_" + month + "_" + day + "_" + hours + "_" + minutes + "_" + seconds;




        if (currentQuestion != "welcomeMessage") {
            localStore[uniqueRecord] = response;
        }

        if ( count == 5) {
            console.log("question 5 LS UK is " + localStore.uniqueKey + " / UK is " + uniqueKey);
        }

        //Identify the next question to populate the view
        //This is where you do the Question Logic
        //if (count <= -1) {console.log(uniqueRecord);}
        if (count == -1) {
            console.log("we want to call schedule notifs and then render las page");
            app.scheduleNotifs(); app.renderLastPage(lastPage[2], count);
        } // "Tx for install, data sent to servers."
        else if (count == SNOOZEQ && response == 0) {
            app.renderLastPage(lastPage[1], count);
        } // "That's cool, I'll notify you again in 10mins"

        else if (count == 6 && response == 0) {
            console.log("question 6 answer 0 - LS UK is " + localStore.uniqueKey + " / UK is " + uniqueKey);
            $("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(8);});
            localStore[localStore.participant_id + "_" + uniqueKey + "_Q8_numberOfParticipants_" + year + "_" + month + "_" + day + "_" + hours + "_" + minutes + "_" + seconds] = 'None';
        }
        else if (count == 6 && response == 1) {
            $("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(7);});
        }
        else if (count == 8) {
            $("#question").fadeOut(400, function () { // With vw/vh, we can size elements to be relative to the size of the viewport.
                document.write('<style>html, body, iframe{margin: 0; border: 0; padding: 0; display: block; width: 100vw; height: 100vh; background: white; color: black;}iframe {height: calc(100vh); width: calc(100vw);}</style>' +
                    '<iframe src="https://rawgit.com/CaterinaC/Android_App/master/AffectButtonMobile_Edit/affectbutton_version2_original.html"></iframe>');
            });
        }
        else if (count < surveyQuestions.length-1) {
            $("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(count+1);});
        }
        else {
            app.renderLastPage(lastPage[0], count);
        } // "Thank you for completing the questions"
    },

    /* Prepare for Resume and Store Data */
    /* Time stamps the current moment to determine how to resume */
    pauseEvents: function() {
        localStore.pause_time = new Date().getTime();
        app.saveData();
    },

    /* Initialize the whole thing */
    init: function() {
        console.log("In init");
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

        console.log("We are in SampleParticipant\n " + localStore.uniqueKey + " / " + uniqueKey);
        var current_moment = new Date();
        var current_time = current_moment.getTime();
        if ((current_time - localStore.pause_time) > 600000 || localStore.snoozed == 1) {
            uniqueKey = new Date().getTime();
            localStore.snoozed = 0;
            app.renderQuestion(0);
        }
        else {
            if (!isNaN(localStore.uniqueKey)) {
                uniqueKey = localStore.uniqueKey;
            } else {
                /* We don't know why, but for some reason, we lose the uniqueKey session identifier.
                 Here, the global uniqueKey variable remains in memory, but disappears from the localStore
                 (which is ultimately what is sent to Google, not the global variables).
                 This is why we first try to use the global uniqueKey to restore the localStore one.
                 But failing, that, if we've simply lost it, we create a new session uniqueKey and
                 we append a string to the end, so it's easy to identify in the sorted Google Sheets
                 whenever the session ID was lost. */
                if ( !isNaN(uniqueKey)) {
                    localStore.uniqueKey = uniqueKey;
                } else {
                    uniqueKey = new Date().getTime()+  "_Unique_key_was_lost";
                }
            }
        }
        app.saveData();
    },

    saveData:function() {
        // take a local copy of app state data to rebuild localStore in a minute
        var pid = localStore.participant_id, snoozed = localStore.snoozed,
            uniqueKey = localStore.uniqueKey, pause_time = localStore.pause_time;

        /* remove state data from localStore so that it isn't sent to database every time
        delete localStore.snoozed;
        delete localStore.uniqueKey;
        delete localStore.pause_time;
        */

        $.ajax({
            type: 'get',
            url: 'https://script.google.com/macros/s/AKfycbzorRQG-JNAkC9JjYqT3pEwYPIo3ocTdC5zzom9OQpbVSmX_30N/exec',
            data: localStore,
            crossDomain: true,
            success: function (result) {
                localStore.clear();

                // rebuild localStore state data
                localStore.participant_id = pid;
                localStore.snoozed = snoozed;
                localStore.uniqueKey = uniqueKey;
                localStore.pause_time = pause_time;
            },
            error: function (request, error) {
                console.log("saving data failed with following error:");
                console.log(error);
            }
        });
    },

    saveDataLastPage:function() {
        // take a local copy of app state data to rebuild localStore in a minute
        var pid = localStore.participant_id, snoozed = localStore.snoozed,
            uniqueKey = localStore.uniqueKey, pause_time = localStore.pause_time;

        /* remove state data from localStore so that it isn't sent to database every time
        delete localStore.snoozed;
        delete localStore.uniqueKey;
        delete localStore.pause_time;
        */

        console.log("and inside save data the arra looks liek this");
        console.log(localStore);

        $.ajax({
            type: 'get',
            url: 'https://script.google.com/macros/s/AKfycbzorRQG-JNAkC9JjYqT3pEwYPIo3ocTdC5zzom9OQpbVSmX_30N/exec',
            data: localStore,
            crossDomain: true,
            success: function (result) {
                localStore.clear();

                // rebuild localStore
                localStore.participant_id = pid;
                localStore.snoozed = snoozed;
                localStore.uniqueKey = uniqueKey;
                localStore.pause_time = pause_time;
                $("#question").html("<h3>Your responses have been recorded. Thank you! </h3>");
            },
            error: function (request, error) {
                console.log("saving data failed with following error:");
                console.log(error);
                $("#question").html("<h3>Please try resending data. If problems persist, please contact the researchers.</h3><br><button>Resend data</button>");
                $("#question button").click(function () {app.saveDataLastPage();});
            }
        });
    },

    scheduleNotifs:function() {

        cordova.plugins.backgroundMode.enable();
        var interval1, interval2, interval3, interval4;
        var a, b, c, d;
        var date1, date2, date3, date4;
        var currentMaxHour, currentMaxMinutes, currentMinHour, currentMinMinutes;
        var currentLag, maxInterval;
        var day = 86400000;
        var minDiaryLag = 7200000; // (2h in milliseconds) minimum gap between measures
        var randomDiaryLag = 7200000; //2h gets used with above to ensure max 4h between successive measures
        var dateObject = new Date();
        var currentHour = dateObject.getHours(), currentMinute = dateObject.getMinutes();

        var now = dateObject.getTime();
        for (var i = 0; i < 14; i ++) { // 14 days of testing since first run of app.

            currentMaxHour = 22;
            currentMaxMinutes = 0; //("22:00")
            currentMinHour = 8;
            currentMinMinutes = 0; // ("08:00")

            currentLag = (((((24 - parseInt(currentHour) + parseInt(currentMinHour))*60) - parseInt(currentMinute) + parseInt(currentMinMinutes))*60)*1000);

            maxInterval = (((((parseInt(currentMaxHour) - parseInt(currentMinHour))*60) + parseInt(currentMaxMinutes) - parseInt(currentMinMinutes))*60)*1000);
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

            localStore[localStore.participant_id + "_" + 'notification_' + i + '_1'] = localStore.participant_id + "_" + a + "_" + date1; //e.g., notification_0_1,	undefined_101_Thu Dec 15 2016 09:21:38 GMT-0500 (EST)
            localStore[localStore.participant_id + "_" + 'notification_' + i + '_2'] = localStore.participant_id + "_" + b + "_" + date2;
            localStore[localStore.participant_id + "_" + 'notification_' + i + '_3'] = localStore.participant_id + "_" + c + "_" + date3;
            localStore[localStore.participant_id + "_" + 'notification_' + i + '_4'] = localStore.participant_id + "_" + d + "_" + date4;
            console.log("adding to localstore " + i + " should be" );
            console.log("[" + localStore.participant_id + "_" + 'notification_' + i + '_1' + "]");
            console.log ("  =  ");
            console.log (localStore.participant_id + "_" + c + "_" + date3);
            console.log();
            console.log(localStore)
        }
        console.log("and at the very bottom of schedulenotifs localstore looks like this: ");
        console.log( localStore);
    },

    snoozeNotif:function() {
        var now = new Date().getTime(), snoozeDate = new Date(now + 600*1000); // 10 minutes
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
