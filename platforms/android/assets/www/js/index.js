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

/* this is the short-term store for user event categories */
var userDefinedCategories; // make global

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
                          "<p align='left'><u>EXAMPLE:</u> AF1990S, for Alex Farrell, born in 1990, in Scotland.</p>" // Align center is the default.
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
        "questionPrompt": "" +
        "<br>" +
        "<p>Hi there!</p>" +
        "<br>" +
        "<p>On the following screens, we will be asking you questions about your emotional experiences within the last 30 minutes.</p>" +
        "<br>" +
        "<p>Press NEXT to rate how you are currently feeling.</p>" +
        "<br>" +
        "<p><u>Please note:</u> You should scroll down to see all the buttons listed!</p>" +
        "<br>"
    },
    /*2*/
    {
        "type": "multImg",
        "variableName": "Q3_Valence",
        "questionPrompt": "",
        "minResponse": 1,
        "maxResponse": 9,
        "srcs": [
            {"src": "./img/SAM/V1.png"}, // Self-Assessment Manikin for Valence.
            {"src": "./img/SAM/V2.png"},
            {"src": "./img/SAM/V3.png"},
            {"src": "./img/SAM/V4.png"},
            {"src": "./img/SAM/V5.png"},
            {"src": "./img/SAM/V6.png"},
            {"src": "./img/SAM/V7.png"},
            {"src": "./img/SAM/V8.png"},
            {"src": "./img/SAM/V9.png"}
        ],
        "myTexts": [
            {"myText": "<span style='color:pink; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;'>" +
            "1. Extremely unpleasant.</span>"},
            {"myText": "<span style='color:pink; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;'>" +
            "2.</span>"},
            {"myText": "<span style='color:pink; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;'>" +
            "3.</span>"},
            {"myText": "<span style='color:pink; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;'>" +
            "4.</span>"},
            {"myText": "<span style='color:pink; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;'>" +
            "5. Neither unpleasant, <br> nor pleasant.</span>"},
            {"myText": "<span style='color:pink; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;'>" +
            "6.</span>"},
            {"myText": "<span style='color:pink; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;'>" +
            "7.</span>"},
            {"myText": "<span style='color:pink; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;'>" +
            "8.</span>"},
            {"myText": "<span style='color:pink; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;'>" +
            "9. Extremely pleasant.</span>"}
        ]
    },
    /*3*/
    {
        "type": "multImg",
        "variableName": "Q4_Arousal",
        "questionPrompt": "",
        "minResponse": 1,
        "maxResponse": 9,
        "srcs": [
            {"src": "./img/SAM/A1.png"}, // Self-Assessment Manikin for Arousal.
            {"src": "./img/SAM/A2.png"},
            {"src": "./img/SAM/A3.png"},
            {"src": "./img/SAM/A4.png"},
            {"src": "./img/SAM/A5.png"},
            {"src": "./img/SAM/A6.png"},
            {"src": "./img/SAM/A7.png"},
            {"src": "./img/SAM/A8.png"},
            {"src": "./img/SAM/A9.png"}
        ],
        "myTexts": [
            {"myText": "<span style='color:#1aff1a; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;'>" +
            "1. Extremely relaxed /<br>bored / sleepy.</span>"},
            {"myText": "<span style='color:#1aff1a; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;'>" +
            "2.</span>"},
            {"myText": "<span style='color:#1aff1a; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;'>" +
            "3.</span>"},
            {"myText": "<span style='color:#1aff1a; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;'>" +
            "4.</span>"},
            {"myText": "<span style='color:#1aff1a; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;'>" +
            "5. Neutral.</span>"},
            {"myText": "<span style='color:#1aff1a; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;'>" +
            "6.</span>"},
            {"myText": "<span style='color:#1aff1a; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;'>" +
            "7.</span>"},
            {"myText": "<span style='color:#1aff1a; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;'>" +
            "8.</span>"},
            {"myText": "<span style='color:#1aff1a; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;'>" +
            "9. Extremely alert /<br>agitated.</span>"}
        ]
    },
    /*4*/
    {
        "type": "multImg",
        "variableName": "Q5_Dominance",
        "questionPrompt": "",
        "minResponse": 1,
        "maxResponse": 9,
        "srcs": [
            {"src": "./img/SAM/D1.png"}, // Self-Assessment Manikin for Dominance.
            {"src": "./img/SAM/D2.png"},
            {"src": "./img/SAM/D3.png"},
            {"src": "./img/SAM/D4.png"},
            {"src": "./img/SAM/D5.png"},
            {"src": "./img/SAM/D6.png"},
            {"src": "./img/SAM/D7.png"},
            {"src": "./img/SAM/D8.png"},
            {"src": "./img/SAM/D9.png"}
        ],
        "myTexts": [
            {"myText": "<span style='color:orange; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;'>" +
            "1. Extremely overwhelmed <br> by the situation.</span>"},
            {"myText": "<span style='color:orange; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;'>" +
            "2.</span>"},
            {"myText": "<span style='color:orange; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;'>" +
            "3.</span>"},
            {"myText": "<span style='color:orange; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;'>" +
            "4.</span>"},
            {"myText": "<span style='color:orange; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;'>" +
            "5. Neither overwhelmed, <br> nor in control.</span>"},
            {"myText": "<span style='color:orange; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;'>" +
            "6.</span>"},
            {"myText": "<span style='color:orange; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;'>" +
            "7.</span>"},
            {"myText": "<span style='color:orange; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;'>" +
            "8.</span>"},
            {"myText": "<span style='color:orange; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;'>" +
            "9. Extremely in control <br> of the situation.</span>"}
        ]
    },
    /*5*/
    {
        "type": "face",
        "variableName": "Q6_affectFace"
    },
    /*6*/

    {
        "type": "text",
        "variableName": "Q7_describeSituation",
        "questionPrompt": "What (emotional) events have occurred within the last 30 minutes?"
    },
    /*7*/
    {
        "type": "mult1",
        "variableName": "Q8_otherParticipant",
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
        "type": "mult1",
        "variableName": "Q9_numberOfParticipants",
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
    /* 9 */
    {
        "type": "userCategories_QType",
        "variableName": "Q10_userCategories",
        "questionPrompt": "How would you classify the recent events (use text only)?"//,
        //"submitNewPrompt": "Add New"
    }
];



var lastPage = [
    {"message": "Thank you for completing this session's questions. Please wait while the data is sent to our servers..."},
    {"message": "That's cool! I'll notify you again in 10 minutes!"},
    {"message": "Thanks again for installing our app. Please wait while the data is sent to our servers..."}
];


/*Populate the view with data from surveyQuestion model*/
// Making mustache templates
// Here you declare global variables as well
var NUMSETUPQS = participantSetup.length;

var SNOOZEQ = 0;

var questionTmpl = "<p>{{{questionText}}}</p><ul>{{{buttons}}}</ul>";

var questionTextTmpl = "{{{questionPrompt}}}"; // All variables are HTML escaped by default. If you want to return unescaped HTML, use the triple mustache: {{{name}}}, which allows to execute html code for instance.

var buttonTmpl = "<li><button id='{{id}}' value='{{value}}'>{{{label}}}</button></li>";

var imageButtonTmpl = "" +
    "<li>" +
    "<div style='position: absolute; left:40px; top: calc(10px + 105px * ({{value}} - 1)); '>" + // Just slightly more than the 100 x 100 buttons themselves
    "<button id='{{id}}' value='{{value}}' style='position: absolute; background:url({{{src}}}); height:100px; width:100px; background-size: 100%;'/>" +
    "<span style='left: 130px; top: 35px; position: relative;'>{{{myText}}}</span>" +
    "</div>" +
    "</li>";


var textTmpl = "<li><textarea cols=50 rows=5 id='{{id}}'></textarea></li><li><button type='submit' value='Enter'>Enter</button></li>";

var checkListTmpl = "<li><input type='checkbox' id='{{id}}' value='{{value}}'>{{label}}</input></li>";

var instructionTmpl = "<li><button id='{{id}}' value = 'Next'>Next</button></li>";

var sliderTmpl = "<li><input type='range' min='{{min}}' max='{{max}}' value='{{value}}' id='{{id}}' oninput='outputUpdate(value)'/><output for='{{id}}' id='slider'>50</output><script>function outputUpdate(slidervalue){document.querySelector('#slider').value=slidervalue;}</script></li><li><button type='submit' value='Enter'>Enter</button></li>";

var datePickerTmpl = '<li><input id="{{id}}" data-format="DD-MM-YYYY" data-template="D MMM YYYY" name="date"><br /><br /></li><li><button type="submit" value="Enter">Enter</button></li><script>$(function(){$("input").combodate({firstItem: "name",minYear:2015, maxYear:2016});});</script>';

var dateAndTimePickerTmpl = '<li><input id="{{id}}" data-format="DD-MM-YYYY-HH-mm" data-template="D MMM YYYY  HH:mm" name="datetime24"><br /><br /></li><li><button type="submit" value="Enter">Enter</button></li><script>$(function(){$("input").combodate({firstItem: "name",minYear:2015, maxYear:2016});});</script>';

var timePickerTmpl = '<li><input id="{{id}}" data-format="HH:mm" data-template="HH : mm" name="time"><br /><br /></li><li><button type="submit" value="Enter">Enter</button></li><script>$(function(){$("input").combodate({firstItem: "name"});});</script>';

var lastPageTmpl = "<h3>{{message}}</h3>";

var affectButtonTmpl = "" +
    "<style>html, body, iframe{margin: 0; border: 0; padding: 0; display: block; width: 100vw; height: 90vh;}</style>" +
    "<li><div id='{{id}}'>" +
    "<iframe id='AffectButton' src='https://rawgit.com/CaterinaC/Android_App/master/AffectButtonMobile_Edit/affectbutton_version2_original.html'></iframe>" +
    "</div></li>" +
    "<li><button type='submit' value='Enter'>Enter</button></li>";

var addCategoryTmpl = "<li><textarea cols=10 rows=1 id='newCat'></textarea></li><li><button type='submit' value='Add New'>Add New</button></li>";





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

            case 'multImg': // multiple buttons with images
                question.buttons = "";
                var src_count = 0;
                var myText_count = 0;
                for (var i = question.minResponse; i <= question.maxResponse; i++) {
                    var src = question.srcs[src_count++].src;
                    var myText = question.myTexts[myText_count++].myText;
                    question.buttons += Mustache.render(imageButtonTmpl, {
                        id: question.variableName+i,
                        value: i,
                        src: src,
                        myText: myText
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
                question.buttons = Mustache.render(sliderTmpl, {id: question.variableName+"1"},
                    {min: question.minResponse}, {max: question.maxResponse}, {value: (question.maxResponse)/2});
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


            case 'face': //affect face iframe
                question.buttons = Mustache.render(affectButtonTmpl, {id: question.variableName+"1"});
                $("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
                $("#question ul li button").click(function(){
                    app.recordResponse($("face"), question_index, question.type);
                });
                break;

            case 'userCategories_QType': // List user categories + text entry for new ones

                // this type of question is built from three mini components
                // first we build a list of buttons from user defined categories
                // then we add a free text entry box to the bottom of that list
                // finally we wrap all of that up as a variable that we send to the "questionTmpl" which is
                // in charge of building the actual page the user sees

                // build buttons list
                question.buttons = "";
                 for (var i = 0; i < userDefinedCategories.length; i++) {
                    var label = userDefinedCategories[i];
                    question.buttons += Mustache.render(buttonTmpl, {
                        id: question.variableName+i,
                        value: label,
                        label: label
                    });
                }

                // add text box to bottom of button list
                question.buttons += Mustache.render(addCategoryTmpl, {id: question.variableName+userDefinedCategories.length});





                /*
                 // text entry validation
                 // two tasks to do
                 // first - limit char size
                 // second - make sure it doesn't fire when you submit one of the OTHER buttons (not text button)

                 $("#question ul li button").click(function(){
                    if (app.validateResponse($("textarea"))){
                        app.recordResponse($("textarea"), question_index, question.type);
                    }
                    else {
                        alert("Please enter something.");
                    }
                });
                */


                // build final question page
                $("#question").html(Mustache.render(questionTmpl, question)).fadeIn(400);
                $("#question ul li button").click(function(){
                    app.recordResponse(this, question_index, question.type);
                });

                break;
        }
    },

    /*
        Question Index -1 means just installed app & asked for participant_id for the first time ever.
     */
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
        //Record value of clicked button
        else if (type == 'multImg') {
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
        else if (type == 'face') {

            var fra = document.getElementById('AffectButton');

            // following will work on same domain (or subdomain with document.domain set) only
            var fraContent = fra.contentDocument || fra.contentWindow.document;
            var pleasure = fraContent.getElementById('pleasure').value;
            var arousal = fraContent.getElementById('arousal').value;
            var dominance = fraContent.getElementById('dominance').value;
            response = "p_" + pleasure + "_a_" + arousal +"_d_"+ dominance;
            currentQuestion = "Q6_affectFace"; // Remember to edit Q6 here if necessary, as it is hard-coded.
        }
        else if (type == 'userCategories_QType') {
            response = button.value;
            //Create a unique identifier for this response
            currentQuestion = "Q10_userCategories";

            if ( response == "Add New") {
                response = document.getElementById('newCat').value;
               // response = temp.value;
                // remove newlines from user input
                response = response.replace(/(\r\n|\n|\r)/g, ""); //encodeURIComponent(); decodeURIComponent()
               // currentQuestion = button.attr('id').slice(0, -1);
                userDefinedCategories.push(response);
            }

        }

        uniqueRecord = localStore.participant_id + "_" + uniqueKey + "_" + currentQuestion + "_" + year + "_" + month + "_" + day + "_" + hours + "_" + minutes + "_" + seconds;




        if (currentQuestion != "welcomeMessage") {
            localStore[uniqueRecord] = response;
        }


        //Identify the next question to populate the view
        //This is where you do the Question Logic
        if (count == -1) {
            // //save metadata vars to localstore for use maintaining state later  this is the logic to handle new users
            localStore.participant_id = response;
            localStore.uniqueKey = uniqueKey;

            // shortly, this user's self-defined categories will be stored here
            userDefinedCategories = new Array();
            userDefinedCategories.push("frustration");
            localStore.setItem("userDefinedCategories", JSON.stringify(userDefinedCategories));

            app.scheduleNotifs(); app.renderLastPage(lastPage[2], count); // "Tx for install, data sent to servers."
        }
        else if (count == SNOOZEQ && response == 0) {
            app.renderLastPage(lastPage[1], count); // "That's cool, I'll notify you again in 10 mins"
        }
        else if (count == 1){
            // this is where we load the user categories from the localStore and turn it back into an array
            userDefinedCategories = JSON.parse(localStore.getItem("userDefinedCategories"));
            $("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(count+1);});
        }
        else if (count == 7 && response == 0) {
            // we now jump to Q 10 instead of Q9 cause of the new user category data page
            $("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(9);});
            localStore[localStore.participant_id + "_" + uniqueKey + "_Q9_numberOfParticipants_" + year + "_" + month + "_" + day + "_" + hours + "_" + minutes + "_" + seconds] = 'None';
        }
        else if (count == 7 && response == 1) {
            $("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(8);});
        }
        else if (count == 9) { // i.e., the new categorization question
            app.renderLastPage(lastPage[0], count);
        }
        /*
         *  Was:
         *  else if (count < surveyQuestions.length-1) {
         *  $("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(count+1);});
         }
         *  Changed to allow for additions near end of question array - without this one has to add new questions
         *  earlier in the question array and rewire everything by hand.
         */
        else if (count < surveyQuestions.length-1) {
            $("#question").fadeOut(400, function () {$("#question").html("");app.renderQuestion(count+1);});
        }
        else  {
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

        //console.log("We are in SampleParticipant\n " + localStore.uniqueKey + " / " + uniqueKey);
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


                // console.log("save data 1");
                // convert the array of user categories to a string for localStore
                localStore.setItem("userDefinedCategories", JSON.stringify(userDefinedCategories));
            },
            error: function (request, error) {
                console.log("Saving data failed with following error:");
                console.log(error);
                console.log(request);
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

                // console.log("save data 2");
                // convert the array of user categories to a string for localStore
                localStore.setItem("userDefinedCategories", JSON.stringify(userDefinedCategories));

                $("#question").html("" +
                    "<h3>" +
                    "<p>Your responses have been recorded, so you can now close the app.</p>" +
                    "<br>" +
                    "<p>Thanks and see you later!</p>" +
                    "</h3>");
            },
            error: function (request, error) {
                console.log("Saving data failed with following error:");
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

        }
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
