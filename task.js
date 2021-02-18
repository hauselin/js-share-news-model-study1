const taskinfo = {
    type: 'study', // 'task', 'survey', or 'study'
    uniquestudyid: 'js-share-news-model-study1', // unique task id: must be IDENTICAL to directory name
    desc: 'accuracy-funny-nudge', // brief description of task
    condition: 'between-within-design', // experiment/task condition
    redirect_url: false // set to false if no redirection required
};

// debug parameters
const debug = true;
const debug_n = 5; // no. of trials to present during debug
const debug_treat_condition = 'funny'  // funny or accuracy

// DEFINE TASK PARAMETERS
const rt_deadline = null;
const stim_width = 500;
var itis = iti_exponential(200, 700); 
var n_stim = {
    "pre_fake": 20,
    'pre_real': 20,
    "post_fake": 20,
    'post_real': 20,
    'n_treat': 1
};
var current_trial = 0; 

// counterbalance/randomize response options
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

// prepare stimuli
stimuli = jsPsych.randomization.repeat(stimuli, 1);  // shuffle
// fake and real stim
var stimuli_fake = stimuli.filter(i => i.veracity == 'fake').slice(0, n_stim['pre_fake'] + n_stim['post_fake'])
var stimuli_real = stimuli.filter(i => i.veracity == 'real').slice(0, n_stim['pre_real'] + n_stim['post_real'])
// pre/post stimuli
var stimuli_pre = stimuli_fake.slice(0, stimuli_fake.length / 2).concat(stimuli_real.slice(0, stimuli_real.length / 2))
stimuli_pre.map(i => i.category = "block1-pre")
stimuli_pre = jsPsych.randomization.repeat(stimuli_pre, 1);  // shuffle
var stimuli_post = stimuli_fake.slice(stimuli_fake.length / 2, stimuli_fake.length).concat(stimuli_real.slice(stimuli_real.length / 2, stimuli_real.length))
stimuli_post.map(i => i.category = "block2-post")
stimuli_post = jsPsych.randomization.repeat(stimuli_post, 1);  // shuffle
// treatment stim
var stimuli_treat = stimuli[stimuli.length - 1]

if (debug) {
    stimuli_pre = stimuli_pre.slice(0, debug_n);
    stimuli_post = stimuli_post.slice(0, debug_n);
}

// treatment instructions
var treat_instructions = {
    "funny": [
        "Now you'll take a short break." +
        "<p>During this break, we would like to pretest an actual news headline for future studies.</p>" +
        "<p>We are interested in whether people think it is <strong>funny or not</strong>.</p>" +
        "<p>We only need you to give your opinion about the <strong>funniness of a single headline</strong>.</p>" +
        "<p>After that, you will continue on to the task you were working on just now.</p> ",
    ],
    "accuracy": [
        "Now you'll take a short break." +
        "<p>During this break, we would like to pretest an actual news headline for future studies.</p>" +
        "<p>We are interested in whether people think it is <strong>accurate or not</strong>.</p>" +
        "<p>We only need you to give your opinion about the <strong>accuracy of a single headline</strong>.</p>" +
        "<p>After that, you will continue on to the task you were working on just now.</p> ",
    ]
};
var treat_prompt = {
    "funny": "To the best of your knowledge, is the above headline <strong>funny</strong>?",
    "accuracy": "To the best of your knowledge, is the above headline <strong>accurate</strong>?"
}





// generate subject ID
var date = new Date()
var subject_id = jsPsych.randomization.randomID(5) + "_" + date.getTime()
console.log("subject ID: " + subject_id);



if (debug) {
    var treat_instructions = treat_instructions[debug_treat_condition]
    var treat_prompt = treat_prompt[debug_treat_condition]
    var condition = debug_treat_condition;
} else {
    if (date.getTime() % 2) {
        var condition = 'funny';
    } else {
        var condition = 'accuracy';
    }
    // var condition = random_choice(['funny', 'accuracy']);
    var treat_instructions = treat_instructions[condition];
    var treat_prompt = treat_prompt[condition]
}
console.log("CONDITION: " + condition);




jsPsych.data.addProperties({
    subject: subject_id,
    type: taskinfo.type,
    uniquestudyid: taskinfo.uniquestudyid,
    desc: taskinfo.desc,
    condition: taskinfo.condition,
    // info_: info_,
});

// add url parameters
const urlvar = jsPsych.data.urlVariables();
const urlvar_keys = Object.keys(urlvar);
const urlvar_n = urlvar_keys.length;
if (urlvar_n > 0) {
    console.log("URL variables")
    for (var i = 0; i < urlvar_n; i++) {
        var key_i = urlvar_keys[i];
        var temp_obj = {};
        temp_obj[key_i] = urlvar[urlvar_keys[i]];
        console.log(temp_obj)
        jsPsych.data.addProperties(temp_obj);
    }
}



var timeline = [];  // create experiment timeline



// TODO start instructions and screener




// block: pre-treatment
var trial_share_pre = {
    type: 'image-button-response',
    stimulus: jsPsych.timelineVariable("img_path"),
    data: {
        img_category: jsPsych.timelineVariable("img_category"),
        veracity: jsPsych.timelineVariable("veracity"),
    },
    trial_duration: rt_deadline,
    choices: responses_share_options,
    post_trial_gap: function () {
        return random_choice(itis)
    },
    stimulus_width: stim_width, 
    on_finish: function (data) {
        data.block = 'block1-share'
        data.event = 'response';
        current_trial += 1;
        data.trial = current_trial;
        if (data.button_pressed) {
            data.choice_text = responses_share_options[1];
        } else {
            data.choice_text = responses_share_options[0];
        }
        data.choice = responses_share[data.choice_text]
        console.log("Veracity: " + data.veracity);
        console.log("Share: " + data.choice);
    }
}

var trial_share_pre_procedure = {
    timeline: [trial_share_pre],
    timeline_variables: stimuli_pre,
    repetitions: 1
}













// block: treatment
var trial_treatment_instructions = {
    type: 'instructions',
    pages: treat_instructions,
    allow_backward: false,
    button_label_next: 'Continue',
    show_clickable_nav: true
}

var trial_treatment = {
    type: 'image-button-response',
    stimulus: jsPsych.timelineVariable("img_path"),
    data: {
        img_category: jsPsych.timelineVariable("img_category")
    },
    trial_duration: rt_deadline,
    choices: responses_accuracy_options,
    prompt: treat_prompt,
    post_trial_gap: function () {
        return random_choice(itis)
    },
    stimulus_width: stim_width,
    button_html: [
        '<button class="jspsych-btn" style="position:relative; left:-70px; top:100px">%choice%</button>',
        '<button class="jspsych-btn" style="position:relative; left:70px; top:100px">%choice%</button>'
    ],
    on_finish: function (data) {
        data.block = "treat"
        data.event = 'response';
        // current_trial += 1;
        // data.trial = current_trial;
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
    timeline_variables: [stimuli_treat],
    repetitions: 1
}













// block: post-treatment
var trial_share_post = {
    type: 'image-button-response',
    stimulus: jsPsych.timelineVariable("img_path"),
    data: {
        img_category: jsPsych.timelineVariable("img_category"),
        veracity: jsPsych.timelineVariable("veracity"),
    },
    trial_duration: rt_deadline,
    choices: responses_share_options,
    post_trial_gap: function () {
        return random_choice(itis)
    },
    stimulus_width: stim_width,
    on_finish: function (data) {
        data.block = 'block2-share'
        data.event = 'response';
        current_trial += 1;
        data.trial = current_trial;
        if (data.button_pressed) {
            data.choice_text = responses_share_options[1];
        } else {
            data.choice_text = responses_share_options[0];
        }
        data.choice = responses_share[data.choice_text]
        console.log("Veracity: " + data.veracity);
        console.log("Share: " + data.choice);
    }
}

var trial_share_post_procedure = {
    timeline: [trial_share_post],
    timeline_variables: stimuli_post,
    repetitions: 1
}









// TODO: add CRT








// push objects into timeline
timeline.push(trial_share_pre_procedure)
timeline.push(trial_treatment_instructions)
timeline.push(trial_treatment_procedure)
timeline.push(trial_share_post_procedure)





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
