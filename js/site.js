let currentQuestionAnswered = false;

function setCurrentQuestionAnswered(item) {
    currentQuestionAnswered = false;
    if (item.type == "radio") {
        let answerDiv = item.parentNode;
        let answerDivChildrenCount = answerDiv.children.length;
        for (i = 0; i < answerDivChildrenCount; i++) {
            let child = answerDiv.children[i];
            let currentType = child.type;
            if (currentType == "radio" && child.checked == true) {
                currentQuestionAnswered = true;
                break;
            }
        }
    } else {
        if (item.value.trim() !== "" || item.value.trim().length > 0) {
            item.value.trim().length;
            currentQuestionAnswered = true;
        }
    }
}

function handleChange(item) {
    try {
        let surveyContainer = document.getElementById("surveyContainer");
        let question = item.parentNode.parentNode;
        invalidQuestion_removeInvalid(surveyContainer, question);
        submitAnswer(item);
        scrollToNextQuestion(item);
    }
    
    catch (e) {
        alert(e);
    }
}

function submitAnswer(item) {
    var json = "{ \"Question\":\"" + item.name + "\", \"Answer\": \"" + item.value + "\"}";
    // $.ajax({
    //     contentType: "application/json;charset=utf-8",
    //     method: "POST",
    //     url: "/survey/update",
    //     data: json,
    //     success: function (data) {
    //         setProgressBarWidth(data);
    //     },
    //     error: function (data) {
    //         console.log("fail");
    //     }
    // });
}

function setProgressBarWidth(NewWidth) {
    var ProgressBar = document.getElementById("progressBar");
    var CurrentWidth = ProgressBar.style.width.replace("%", "");
    var RunningWidth = CurrentWidth;
    var LastWidth;

    if (parseInt(NewWidth) == parseInt(CurrentWidth)) {
        return;
    }

    let timer = setInterval(function () {

        // Gets the width of the next step in the animation
        console.log("lerping progress bar");
        RunningWidth = lerp(RunningWidth, NewWidth, 0.35);

        // If the width from last step is the same as this step, we are at the end of the animation
        if (LastWidth == RunningWidth) {
            RunningWidth = NewWidth;
            setWidth(ProgressBar, RunningWidth);
            clearInterval(timer);
            return;
        }

        LastWidth = RunningWidth;
        setWidth(ProgressBar, RunningWidth)

    }, 20);
}

function lerp(start, end, amount) {
    // console.log("START");
    // console.log(start);
    // console.log("END");
    // console.log(end);
    // console.log("RESULT");
    // console.log((amount * (parseInt(end) - parseInt(start))) + parseInt(start));
    return (amount * (parseInt(end) - parseInt(start))) + parseInt(start);
}

function setWidth(Item, Width) {
    Item.style.width = Width + "%";
}


function scrollToNextQuestion(item) {
    if (!currentQuestionAnswered) {
        handleScroll(item);
    }
}

function badFunctionSpeling() {
    console.log("hello");
}

function handleScroll(item) {
    try {        
        //badFunctionSpelling();
        let surveyContainer = document.getElementById("surveyContainer");
        let questionAndAnswer = item.parentNode.parentNode;
        let thisAnwserIndex;
        let nextAnswerIndex;
        thisAnswerIndex = getQuestionIndex(
            surveyContainer,
            questionAndAnswer
        );
        nextAnswerIndex = thisAnswerIndex + 1;

        let numberOfQuestions = getNumberOfQuestionsOnPage(surveyContainer);
        let scrollToQuestionDiv = surveyContainer.children[nextAnswerIndex];
        if (nextAnswerIndex < numberOfQuestions) {
            scrollToQuestion(surveyContainer, scrollToQuestionDiv);
        }
    }
    catch (e)
    {
        alert(e);
    }
}

function getQuestionIndex(surveyContainer, questionAndAnswer) {
    let numberOfQuestions = getNumberOfQuestionsOnPage(surveyContainer);

    for (i = 0; i < numberOfQuestions; i++) {
        if (surveyContainer.children[i] == questionAndAnswer) {
            questionIndex = i;
            break;
        }
    }
    return questionIndex;
}

function getNumberOfQuestionsOnPage(surveyContainer) {
    let numberOfQuestions = surveyContainer.children.length;
    return numberOfQuestions;
}

function scrollToQuestion(div, toItem) {
    let divOffset = div.offsetTop;
    let currentTop = div.scrollTop;
    let newTop = toItem.offsetTop;
    let difference = newTop - divOffset;

    let runningTop = currentTop;
    let lastRunningTop;


    let timer = setInterval(function () {
        runningTop = lerp(runningTop, difference, 0.15);
        
        if (runningTop == lastRunningTop) {
            div.scrollTop = difference;
            clearInterval(timer);
            return;
        }

        lastRunningTop = runningTop;
        div.scrollTop = runningTop;
    }, 20);
}

function validateForm(nextOrPrev) {
    if (nextOrPrev == "PREV") {
        return true;
    }

    let surveyContainer = document.getElementById("surveyContainer");

    for (i = 0; i < surveyContainer.children.length; i++) {
        let question = surveyContainer.children[i];
        let enteredAnswer;
        let required;
        let validationMessage;

        if (question.id != "buttonContainer" && question.id != "alertMessge") {
            let questionType = question.dataset.questiontype;

            if (questionType.toUpperCase() == "OPENENDED_STORENUMBER") {
                enteredAnswer = question.children[1].children[0].value;
                required = question.children[1].children[0].required;
                validationMessage = validateOpenEndedStoreNumber(enteredAnswer, required);
                if (validationMessage != "VALID") {
                    invalidQuestion_scrollAndColor(surveyContainer, question, validationMessage);
                    return false;
                } else {
                    invalidQuestion_removeInvalid(surveyContainer, question);
                }
            }

            if (questionType.toUpperCase() == "OPENENDED_INTEGER") {
                enteredAnswer = question.children[1].children[0].value;
                required = question.children[1].children[0].required;
                validationMessage = validateOpenEnded_Integer(enteredAnswer, required);
                if (validationMessage != "VALID") {
                    invalidQuestion_scrollAndColor(surveyContainer, question, validationMessage);
                    return false;
                }
            }

            if (questionType.toUpperCase() == "OPENENDED_DATE") {
                enteredAnswer = question.children[1].children[0].value;
                required = question.children[1].children[0].required;
                validationMessage = validateOpenEnded_Date(enteredAnswer, required);
                if (validationMessage != "VALID") {
                    invalidQuestion_scrollAndColor(surveyContainer, question, validationMessage);
                    return false;
                }
            }
            
            if (questionType.toUpperCase() == "MULTIPLECHOICE") {
                let questionAnswered = false;

                for (j = 0; j < question.children[1].children.length; j++) {
                    child = question.children[1].children[j];
                    currentType = child.type;

                    if (currentType == "radio" && child.checked == true) {
                        questionAnswered = true;
                        break;
                    }
                }

                if (questionAnswered == false) {
                    validationMessage = "Please answer this question.";
                    invalidQuestion_scrollAndColor(surveyContainer, question, validationMessage);
                    return false;
                }
                
            }

            if (questionType.toUpperCase() == "MULTIPLECHOICE_RANKING") {
                let questionAnswered = false;

                for (j = 0; j < question.children[3].children.length; j++) {
                    child = question.children[3].children[j];
                    currentType = child.type;

                    if (currentType == "radio" && child.checked == true) {
                        questionAnswered = true;
                        invalidQuestion_removeInvalid(surveyContainer, question);
                        break;
                    }
                }

                if (questionAnswered == false) {
                    validationMessage = "Please answer this question.";
                    invalidQuestion_scrollAndColor(surveyContainer, question, validationMessage);
                    return false;
                }

            }

            answerDiv = surveyContainer.children[i].children[surveyContainer.children[i].children.length - 1];
            for (j = 0; j < answerDiv.children.length; j++) {
                answerChild = answerDiv.children[j];
            }
        }
    }

    return true;
}

function validateOpenEndedStoreNumber (enteredAnswer, required) {
    // if (enteredAnswer.length != 6) {
    //     return "Please enter a valid store number.";
    // }
    return "VALID";
}

function validateOpenEnded_Integer(enteredAnswer, required) {
    // if (required == true) {
    //     if (enteredAnswer.length == 0) {
    //         return "Please answer this question.";
    //     }
    // }    

    // if (isNaN(enteredAnswer)) {
    //     return "This answer must be a number.";
    // }

    return "VALID";
}

function validateOpenEnded_Date(enteredAnswer, required) {
   // if (required == true) {
      // if (enteredAnswer.length == 0) {
      //      return "Please answer this question.";
     //   }
 //   }
    return "VALID";
}

function validateMultipleChoice(enteredAnswer, required) {
    if (required == true) {
        if (enteredAnswer.length == 0) {
            return "Please answer this question.";
        }
    }

    return "VALID";
}

function invalidQuestion_scrollAndColor(div, question, message) {
    scrollToQuestion(div, question);
    colorQuestion(div, question, message);
}

function invalidQuestion_removeInvalid(surveyContainer, question) {
    question.children[0].classList.remove("invalid");
    let invalidSpan = findInvalidSpan(question);
    invalidSpan.innerHTML = "";
}

function colorQuestion(div, question, message) {
    question.children[0].classList.add("invalid");
    //let invalidSpan = question.children[1].children[1];
    let invalidSpan = findInvalidSpan(question);
    invalidSpan.innerHTML = message;
}

function findInvalidSpan(question) {
    let spanFound = false;
    let span;

    if (question.children.length > 0) {
        for (var i = 0; i < question.children.length; i++) {
            var child1 = question.children[i];
            if (child1.nodeName == "SPAN") {
                span = child1;
                spanFound = true;
                return span;
            }

            if (spanFound == false) {
                if (child1.children.length > 0) {
                    for (var j = 0; j < child1.children.length; j++) {
                        let child2 = child1.children[j];

                        if (child2.nodeName == "SPAN") {
                            span = child2;
                            spanFound = true;
                            return span;
                        }

                        if (spanFound == false) {
                            if (child2.children.length > 0) {
                                for (var k = 0; k < child2.children.length; k++) {
                                    let child3 = child2.children[k];
                                    if (child3.nodeName == "SPAN") {
                                        span = child3;
                                        spanFound = true;
                                        return span;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}