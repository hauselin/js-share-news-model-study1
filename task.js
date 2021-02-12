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

jsPsych.data.addProperties({
    // subject: info_.subject,
    type: taskinfo.type,
    uniquestudyid: taskinfo.uniquestudyid,
    desc: taskinfo.desc,
    condition: taskinfo.condition,
    // info_: info_,
});

// create experiment timeline
var timeline = [];

var trial = {
    type: 'image-keyboard-response',
    stimulus: jsPsych.timelineVariable("img"),
    trial_duration: rt_deadline,
    // choices: ['ArrowLeft', 'ArrowRight'],
    choices: ['y', 'n'],
    prompt:
        '<p>How likely would you be to share it?</p>' +
        'yes (y) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; no (n)',
    post_trial_gap: function () {
        return random_choice(itis)
    },
    stimulus_width: 500
}

var trial_procedure = {
    timeline: [trial],
    timeline_variables: stimuli,
    repetitions: 1
}


var trial2 = {
    type: 'image-button-response',
    stimulus: jsPsych.timelineVariable("img"),
    trial_duration: rt_deadline,
    choices: ['likely to share', 'unlikely to share'],
    post_trial_gap: function () {
        return random_choice(itis)
    },
    stimulus_width: 500
}

var trial_procedure2 = {
    timeline: [trial2],
    timeline_variables: stimuli,
    repetitions: 1
}

// push objects into timeline 
timeline.push(trial_procedure, trial_procedure2);

jsPsych.init({
    timeline: timeline,
    preload_images: stimuli.map(i => i.img),
    on_finish: function () {
        if (debug) {
            jsPsych.data.displayData();
        }
    }
})
