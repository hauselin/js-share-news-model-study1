const taskinfo = {
    type: 'study', // 'task', 'survey', or 'study'
    uniquestudyid: 'js-share-news-model-study1', // unique task id: must be IDENTICAL to directory name
    desc: 'accuracy-nudge-headline', // brief description of task
    condition: 'pre-post-design', // experiment/task condition
    redirect_url: false // set to false if no redirection required
};

const debug = true;

if (debug) {
    headlines_per_block = 5;
    stimuli = stimuli.filter(i => i.img_idx <= 5);
} 


// DEFINE TASK PARAMETERS
const rt_deadline = null;
var itis = iti_exponential(200, 700);

var responses_share = {
    "likely to share": 1,
    "unlikely to share": 0
};
var responses_share_options = jsPsych.randomization.repeat(Object.keys(responses_share), 1);




var responses_accuracy = {
    "yes": 1,
    "no": 0
};
var responses_accuracy_options = jsPsych.randomization.repeat(Object.keys(responses_accuracy), 1);

jsPsych.data.addProperties({
    // subject: info_.subject,
    type: taskinfo.type,
    uniquestudyid: taskinfo.uniquestudyid,
    desc: taskinfo.desc,
    condition: taskinfo.condition,
    // info_: info_,
});



var timeline = [];  // create experiment timeline



// block: pre-treatment
var trial_headline_pre = {
    type: 'image-button-response',
    stimulus: jsPsych.timelineVariable("img_path"),
    data: {
        img_set: jsPsych.timelineVariable("img_set"),
        img_category: jsPsych.timelineVariable("img_category"),
    },
    trial_duration: rt_deadline,
    choices: responses_share_options,
    post_trial_gap: function () {
        return random_choice(itis)
    },
    stimulus_width: 600, 
    on_finish: function (data) {
        data.block = 'block1-share'
        data.event = 'response';
        if (data.button_pressed) {
            data.choice_text = responses_share_options[1];
        } else {
            data.choice_text = responses_share_options[0];
        }
        data.choice = responses_share[data.choice_text]
        console.log("Share: " + data.choice);
    }
}

var trial_headline_pre_procedure = {
    timeline: [trial_headline_pre],
    timeline_variables: stimuli,
    repetitions: 1
}













// block: accuracy treatment
var trial_treat_instructions = {
    type: 'instructions',
    pages: [
        "Now you'll take a short break." + 
        "<p>During this break, we would like to pretest an actual news headline for future studies.</p>" +
        "<p>We are interested in whether people think it is <strong>accurate or not</strong>.</p>" +
        "<p>We only need you to give your opinion about the <strong>accuracy of a single headline</strong>.</p>" + 
        "<p>After that, you will continue on to the task you were working on just now.</p> ",
    ],
    allow_backward: false,
    button_label_next: 'Continue',
    show_clickable_nav: true
}

var trial_treatment = {
    type: 'image-button-response',
    stimulus: jsPsych.timelineVariable("img_path"),
    data: {
        img_set: jsPsych.timelineVariable("img_set"),
        img_category: jsPsych.timelineVariable("img_category")
    },
    trial_duration: rt_deadline,
    choices: responses_accuracy_options,
    prompt: "To the best of your knowledge, is the above headline <strong>accurate</strong>?",
    post_trial_gap: function () {
        return random_choice(itis)
    },
    stimulus_width: 500,
    button_html: [
        '<button class="jspsych-btn" style="position:relative; left:-70px; top:100px">%choice%</button>',
        '<button class="jspsych-btn" style="position:relative; left:70px; top:100px">%choice%</button>'
    ],
    on_finish: function (data) {
        data.block = "accuracy_nudge"
        data.event = 'response';
        if (data.button_pressed) {
            data.choice_text = responses_accuracy_options[1];   
        } else {
            data.choice_text = responses_accuracy_options[0];
        }
        data.choice = responses_accuracy[data.choice_text]
        console.log('Accuracy: ' + data.choice);
    }
}

var trial_treatment_procedure = {
    timeline: [trial_treatment],
    timeline_variables: [random_choice(stimuli)],
    repetitions: 1
}







// block: post-treatment
















// push objects into timeline
timeline.push(trial_headline_pre_procedure)
timeline.push(trial_treat_instructions)
timeline.push(trial_treatment_procedure)





// run task
jsPsych.init({
    timeline: timeline,
    preload_images: stimuli.map(i => i.img_path),
    on_finish: function () {
        if (debug) {
            jsPsych.data.displayData();
        }
    }
})
