const taskinfo = {
    type: 'study', // 'task', 'survey', or 'study'
    uniquestudyid: 'js-share-news-model-study1', // unique task id: must be IDENTICAL to directory name
    desc: '', // brief description of task
    condition: 'accuracy_nudge', // experiment/task condition
    redirect_url: false // set to false if no redirection required
};

const debug = true;


// DEFINE TASK PARAMETERS
const rt_deadline = null;
var itis = iti_exponential(200, 700);
var response_options = ['likely to share', 'unlikely to share'];
var response_options = jsPsych.randomization.repeat(response_options, 1);
var yn_options = ['no', 'yes'];
var yn_options = jsPsych.randomization.repeat(yn_options, 1);

jsPsych.data.addProperties({
    // subject: info_.subject,
    type: taskinfo.type,
    uniquestudyid: taskinfo.uniquestudyid,
    desc: taskinfo.desc,
    condition: taskinfo.condition,
    // info_: info_,
});








var timeline = [];  // create experiment timeline



// pre-treatment
var trial_headline_pre = {
    type: 'image-button-response',
    stimulus: jsPsych.timelineVariable("img"),
    trial_duration: rt_deadline,
    choices: response_options,
    post_trial_gap: function () {
        return random_choice(itis)
    },
    stimulus_width: 600
}

var trial_headline_pre_procedure = {
    timeline: [trial_headline_pre],
    timeline_variables: stimuli,
    repetitions: 1
}

var trial_treat_instructions = {
    type: 'instructions',
    pages: [
        "Now you'll take a short break." +
        "<p>We would like to pretest an actual news headline for future studies.</p>" +
        "<p>We are interested in whether people think it is <strong>accurate or not</strong>.</p>" +
        "<p>We only need you to give your opinion about the <strong>accuracy of a single headline</strong>.</p>" + 
        "<p>After that, you will continue on to the task you were working on just now.</p> ",
    ],
    allow_backward: false,
    button_label_next: 'Continue',
    show_clickable_nav: true
}

// treatment
var trial_treatment = {
    type: 'image-button-response',
    stimulus: jsPsych.timelineVariable("img"),
    trial_duration: rt_deadline,
    choices: yn_options,
    prompt: "To the best of your knowledge, is the above headline <strong>accurate</strong>?",
    post_trial_gap: function () {
        return random_choice(itis)
    },
    stimulus_width: 500,
    button_html: [
        '<button class="jspsych-btn" style="position:relative; left:-70px; top:100px">%choice%</button>',
        '<button class="jspsych-btn" style="position:relative; left:70px; top:100px">%choice%</button>'
    ]
}

var trial_treatment_procedure = {
    timeline: [trial_treatment],
    timeline_variables: [random_choice(stimuli)],
    repetitions: 1
}







// post-treatment



// push objects into timeline
// timeline.push(trial_headline_pre_procedure)
// timeline.push(trial_treat_instructions)
timeline.push(trial_treatment_procedure)





// run task
jsPsych.init({
    timeline: timeline,
    preload_images: stimuli.map(i => i.img),
    on_finish: function () {
        if (debug) {
            jsPsych.data.displayData();
        }
    }
})
