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
