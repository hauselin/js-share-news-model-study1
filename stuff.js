var covid_concern = {
    timeline: [{
        type: 'html-slider-response',
        stimulus: jsPsych.timelineVariable('desc'),
        data: {
            block: jsPsych.timelineVariable('name')
        },
        labels: jsPsych.timelineVariable('labels'),
        slider_width: 500,
        min: 0, max: 100, start: 50, step: 1.0, require_movement: true,
        on_finish: function (data) {
            data.event = 'prescreen';
            data.start_point = 50;
            data.resp = Number(data.response);
            console.log("name: " + data.block + "; response: " + data.response);
        }
    }],

    timeline_variables: [
        { "desc": "How concerned are you about COVID-19 (the new coronavirus)?", "labels": ['not concerned at all', 'extremely concerned'], "name": "covid-concern" },
        { "desc": "How often do you proactively check the news regarding COVID-19 (the new coronavirus)?", "labels": ["never", "very often"], "name": "covid-news-freq" }],
    randomize_order: false
};





// media
var media_criticism_options = ['Criticism from news organizations keeps political leaders from doing their job.', 'Criticism from news organizations keeps political leaders from doing things that should not be done.'];
var media_criticism = {
    type: 'survey-multi-choice',
    questions: [
        {
            prompt: "Some people think that by criticizing leaders, news organizations keep political leaders from doing their job. Others think that such criticism is worth it because it keeps political leaders from doing things that should not be done. Which position is closer to your opinion?",
            options: media_criticism_options,
            horizontal: false,
            required: true,
            name: 'media_criticism'
        },
    ],
    on_finish: function (data) {
        data.event = 'media_criticism';
        data.block = 'media_questions';
        data.choice = JSON.parse(data.responses)[data.event];
        data.resp = media_criticism_options.findIndex(i => i.includes(data.choice)) + 1;
    },
};

// media
var media_fair_options = ['News organizations tend to deal fairly with all sides.', 'News organizations tend to favor one side.'];
var media_fair = {
    type: 'survey-multi-choice',
    questions: [
        {
            prompt: "In presenting the news dealing with political and social issues, do you think that news organizations deal fairly with all sides, or do they tend to favor one side?",
            options: media_fair_options,
            horizontal: false,
            required: true,
            name: 'media_fair'
        },
    ],
    on_finish: function (data) {
        data.event = 'media_fair';
        data.block = 'media_questions';
        data.choice = JSON.parse(data.responses)[data.event];
        data.resp = media_fair_options.findIndex(i => i.includes(data.choice)) + 1;
    },
};





// debrief review headlines
var instructions_debrief = {
    type: 'instructions', allow_backward: false, button_label_next: 'Continue', show_clickable_nav: true,
    pages: ["You're reaching the end of the survey.<br>Earlier on, we showed you a variety of headlines.<br>Half of them were false and half of them were true.<br>You will see all the <strong>TRUE</strong> headlines again; any headlines not shown were FALSE.<br><br>You must review all the <strong>TRUE</strong> headlines to submit this survey."]
}

var debrief_pages = stimuli_real.map(i => '<img src="' + i.img_path + '">');
var debrief_headlines = {
    type: 'instructions',
    button_label_next: '', button_label_previous: "",
    allow_keys: false,
    show_clickable_nav: true,
    show_page_number: true,
    page_label: "True Headline",
    pages: debrief_pages
}





var demo_politicalpref_options = ['Strongly Democratic', 'Democratic', 'Lean Democratic', 'Lean Republican', 'Republican', 'Strongly Republican'];
var demo_politicalpref = {
	type: 'html-button-response',
	stimulus: 'Which of the following best describes your political preference?<br><br>',
	choices: demo_politicalpref_options,
	on_finish: function (data) {
		data.event = 'politicalpref';
		data.block = 'demographics';
		data.resp = demo_politicalpref_options[data.button_pressed];
	}
}



var demo_economicissues_options = ['Strongly Liberal', 'Somewhat Liberal', 'Moderate', 'Somewhat Conservative', 'Strongly Conservative'];
var demo_economicissues = {
    type: 'html-button-response',
    stimulus: 'On economic issues I am...<br><br>',
    choices: demo_economicissues_options,
    on_finish: function (data) {
        data.event = 'economicissues';
        data.block = 'demographics';
        data.resp = demo_economicissues_options[data.button_pressed];
    }
}


var demo_socialissues_options = ['Strongly Liberal', 'Somewhat Liberal', 'Moderate', 'Somewhat Conservative', 'Strongly Conservative'];
var demo_socialissues = {
    type: 'html-button-response',
    stimulus: 'On social issues I am...<br><br>',
    choices: demo_socialissues_options,
    on_finish: function (data) {
        data.event = 'socialissues';
        data.block = 'demographics';
        data.resp = demo_socialissues_options[data.button_pressed];
    }
}