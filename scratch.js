
// support_economic_inequality
var instructions_support_economic_inequality = {
    type: 'instructions', allow_backward: false, button_label_next: 'Continue', show_clickable_nav: true,
    pages: ["Next, you will see different statements.<br><br>Please indicate your level of agreement with each statement"],
}

var support_economic_inequality_labels = ['strongly disagree', 'strongly agree']
var support_economic_inequality_procedure = {
    timeline: [{
        type: 'html-slider-response',
        stimulus: jsPsych.timelineVariable('desc'),
        data: {
            q: jsPsych.timelineVariable('q'),
            subscale: jsPsych.timelineVariable('subscale'),
            reverse: jsPsych.timelineVariable('reverse')
        },
        labels: support_economic_inequality_labels,
        slider_width: 500, min: 10, max: 70, slider_start: 40, step: 1,
        require_movement: false,
        on_finish: function (data) {
            data.resp = Number(data.response) / 10;
            data.resp_reverse = data.resp;
            if (data.reverse) { // reverse code item if necessary
                data.resp_reverse = 70 + 10 - data.resp;
            }
            console.log("q" + data.q + " (reverse: " + data.reverse + "): " + data.stimulus);
            console.log("resp: " + data.resp + ", resp_reverse: " + data.resp_reverse);
        }
    }],
    timeline_variables: items_support_economic_inequality,
    randomize_order: false
};

