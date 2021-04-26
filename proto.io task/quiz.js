//read data from quiz.json and result.json
var q_req = new XMLHttpRequest();
var r_req = new XMLHttpRequest();
var q_dt; //question data
var r_dt; //result data
var points = 0;
var n = 1; //question number

q_req.onreadystatechange = function() 
{
  if (this.readyState == 4 && this.status == 200) 
  {
    q_dt = JSON.parse(this.responseText);
  }
};
r_req.onreadystatechange = function() 
{
  if (this.readyState == 4 && this.status == 200) 
  {
    r_dt = JSON.parse(this.responseText);
  }
};
q_req.open("GET", "https://proto.io/en/jobs/candidate-questions/quiz.json", true);
r_req.open("GET", "https://proto.io/en/jobs/candidate-questions/result.json", true);

q_req.send(); 
r_req.send();

q_req.onload = function()
{
    clear(); //clear all checked choices
    //show title and description
    document.getElementById("title").innerHTML = q_dt.title;
    document.getElementById("description").innerHTML = q_dt.description;
    show_hide(0); // show all elements associated with the first question
};

    // show/hide div elements according to q_type 
    // i refers to q_number
function show_hide(i)
{
    document.getElementById("img").src = q_dt.questions[i].img;
    document.getElementById("q_id").innerHTML = "Q" + q_dt.questions[i].q_id + ": ";
    document.getElementById("q_title").innerHTML = q_dt.questions[i].title;
    document.getElementById("results").style.display = "none";

    if (q_dt.questions[i].question_type == "mutiplechoice-single")
    {
        document.getElementById("tfChoices").style.display = "none";
        document.getElementById("cbChoices").style.display = "none";
        document.getElementById("mChoices").style.display = "block";
            //show possible answers for multiplechoice-single questions
        for (let x = 1; x <= q_dt.questions[i].possible_answers.length; x++) 
        {
            document.getElementById("lbl" + x).innerHTML = q_dt.questions[i].possible_answers[x-1].caption;
        }
        
    }
    else if (q_dt.questions[i].question_type == "truefalse") 
    {
            //show possible answers for truefalse questions
        document.getElementById("mChoices").style.display = "none";
        document.getElementById("cbChoices").style.display = "none";
        document.getElementById("tfChoices").style.display = "block";

        document.getElementById("lblt").innerHTML = "True";
        document.getElementById("lblf").innerHTML = "False"
    } 
    else if (q_dt.questions[i].question_type == "mutiplechoice-multiple")
    {
        //show possible answers for multiplechoice-multiple questions
        document.getElementById("mChoices").style.display = "none";
        document.getElementById("tfChoices").style.display = "none";
        document.getElementById("cbChoices").style.display = "block";

        for (let x = 1; x <= q_dt.questions[i].possible_answers.length; x++) 
        {
            document.getElementById("cbLbl" + x).innerHTML = q_dt.questions[i].possible_answers[x-1].caption;
        }
    }
    else
    {
        //in case q_type not found
        console.log("Question type error");

    }
        //if current question is the last one, hide next button and show result button
    if ((i+1) == q_dt.questions.length)
    {
        document.getElementById("btn").style.display = "none";
        document.getElementById("btn_result").style.display = "inline";
    }
 
}
// highlight correct answer and display for 3 seconds
function timed()
{
    show_correct(n);
    setTimeout(next, 3000) 
}


//show next question based on question number
function next()
{

    // show or hide questions with their possible answers based on question's number
    show_hide(n);
    // gets the checked possible answers, checks which answers are correct and adds up points
    n++; //fetch next question
   clear();
}
// hightlight correct answers based on question type
function show_correct(n)
{
    get_checked(n);

    if (q_dt.questions[n-1].question_type == "mutiplechoice-single")
    {
        for (let i = 1; i <= q_dt.questions[n-1].possible_answers.length; i++) 
        {
            if (document.getElementById("mChoice" + i).value == q_dt.questions[n-1].correct_answer) 
            {
                document.getElementById("lbl" + i).style.borderStyle ="solid";
            }            
        }
    }
    else if (q_dt.questions[n-1].question_type == "truefalse")
    {
        if (JSON.parse(document.getElementById("tfChoice1").value) == q_dt.questions[n-1].correct_answer) 
        {
            document.getElementById("lblt").style.borderStyle ="solid";
        }
        else if (JSON.parse(document.getElementById("tfChoice2").value) == q_dt.questions[n-1].correct_answer) 
        {
            document.getElementById("lblf").style.borderStyle ="solid";
        }
    }
    else if (q_dt.questions[n-1].question_type == "mutiplechoice-multiple")
    {
         for (let i = 1; i <= q_dt.questions[n-1].possible_answers.length; i++) 
        {            
            for (let j = 0; j < q_dt.questions[n-1].correct_answer.length; j++) 
            {
                if (document.getElementById("cbChoice" + i).value == q_dt.questions[n-1].correct_answer[j])  
                {
                    document.getElementById("cbLbl" + i).style.borderStyle ="solid";
                    console.log("hi");
                }                
            }
        }
    }
   

}

function results()
{
    get_checked(n); // validate the last question 

    points = points_percentage(points); // calculate points percentage

    if (points >= r_dt.results[0].minpoints && points <= r_dt.results[0].maxpoints)
    {
        show_result(0);
    }
    else if (points >= r_dt.results[1].minpoints && points <= r_dt.results[1].maxpoints)
    {
        show_result(1);
    }
    else if(points >= r_dt.results[2].minpoints && points <= r_dt.results[2].maxpoints)
    {
        show_result(2);
    }
    else
    {
        console.log("result error");
    }
}

function show_result(x)
{
    document.getElementById("wrap").style.display = "none"; // hide wrap
    // show results based on score
    document.getElementById("img").src = r_dt.results[x].img;
    document.getElementById("img").style.maxWidth = "80%";
    document.getElementById("title").innerHTML = r_dt.results[x].title;
    document.getElementById("title").style.fontSize = "35px";
    document.getElementById("description").innerHTML = r_dt.results[x].message;
    document.getElementById("description").style.fontSize = "50px";
}

//uncheck all radio buttons and checkboxes
function clear()
{
    var el1 = document.getElementsByClassName("radio");
    var el2 = document.getElementsByClassName("lbl");
    for (var i of el1) 
    {
        i.checked = 0; 

    }
    for (var i of el2)
    {
        i.style.borderStyle ="hidden";

    }

   
}
   // gets the checked possible answers, checks which answers are correct and adds up points
function get_checked(n)
{
    // if question type is mutiplechoice-single
    if (q_dt.questions[n-1].question_type == "mutiplechoice-single")
    {
        var mCrt = []; 
        assign_values(n);
        // loop through possible answers 
        for (let a = 1; a <= q_dt.questions[n-1].possible_answers.length; a++) 
        {
            // if each choice that is selected has the correct answer, give corresponding points
            if (document.getElementById("mChoice" + a).checked
             && document.getElementById("mChoice" + a).value == q_dt.questions[n - 1].correct_answer)
            {
                points +=  q_dt.questions[n - 1].points;
                mCrt[0] = document.getElementById("mChoice" + a).id;
            }
        } 
    }
        // if question type is truefalse
    else if (q_dt.questions[n-1].question_type == "truefalse")
    {
        var tfCrt = [];
        for (let y = 1; y <= 2; y++) 
        {
            //if an option is checked and it's correct, give corresponding points
            if (document.getElementById("tfChoice" + y).checked
             && JSON.parse(document.getElementById("tfChoice" + y).value) == q_dt.questions[n - 1].correct_answer)
            {
                points +=  q_dt.questions[n - 1].points;
                tfCrt[0] = document.getElementById("tfChoice" + y).id;
            } 
        }
    }
    else if (q_dt.questions[n-1].question_type == "mutiplechoice-multiple") 
    {
        assign_values(n);
        var sCrt = []; // selected correct answers
        var x = 0;

         // for each checked choice that its value equals any of the question's correct answers,
         // add it to arr_cbCr
        for (let j = 1; j <= q_dt.questions[n-1].possible_answers.length; j++) 
        {
            if (document.getElementById("cbChoice" + j).checked == true)
            {
                for (let k = 0; k < q_dt.questions[n-1].correct_answer.length; k++) 
                {
                    if(document.getElementById("cbChoice" + j).value == q_dt.questions[n-1].correct_answer[k])
                    {
                        sCrt[x] = q_dt.questions[n-1].correct_answer[k];
                    }                    
                }
                x++;   
            }
        }
        var p = 0;
        if (sCrt.length == q_dt.questions[n-1].correct_answer.length)
        {
            for (let i = 0; i < sCrt.length; i++) 
            {
                 for (let j = 0; j < sCrt.length; j++) 
                 {
                     if (sCrt[i] == q_dt.questions[n-1].correct_answer[j])
                     {
                         p = q_dt.questions[n-1].points;
                     }
                 }
            }
        }
        points +=p;
    }
}
// assign values of possible answers to the value attribute of each choice
// this function assigns values in cases of mutiplechoice_single and mutiplechoice_multiple
// is case of truefalse questions, true and false are assigned in the HTML respectively
function assign_values(n)
{
    if (q_dt.questions[n-1].question_type == "mutiplechoice-single")
    {
        for (let x = 1; x <= q_dt.questions[n-1].possible_answers.length; x++) 
        {
            document.getElementById("mChoice" + x).value = q_dt.questions[n - 1].possible_answers[x -1].a_id;    
        } 
    }

    else if (q_dt.questions[n-1].question_type == "mutiplechoice-multiple")
    {
        for (let x = 1; x <= q_dt.questions[n-1].possible_answers.length; x++) 
        {
            document.getElementById("cbChoice" + x).value = q_dt.questions[n - 1].possible_answers[x-1].a_id;   
        } 
    }
    else
    {
        console.log("type error!");
    }
}

function points_percentage(p)
{
    var tp = 0;
    for (let i = 0; i < q_dt.questions.length; i++) 
    {
        tp += q_dt.questions[i].points;
    }

    p *= (100/tp);
    return p;
}