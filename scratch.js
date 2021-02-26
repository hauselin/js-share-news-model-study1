var demo_economicissues_options = ['Strongly Liberal', 'Somewhat Liberal', 'Moderate', 'Somewhat Conservative', 'Strongly Conservative'];
var demo_economicissues = {
    type: 'survey-multi-choice',
    questions: [
        {
            prompt: 'On economic issues I am...',
            options: demo_economicissues_options,
            horizontal: false,
            required: true,
            name: 'economicissues'
        }],
    choices: demo_economicissues_options,
    on_finish: function (data) {
        data.event = 'economicissues';
        data.block = 'demographics';
        data.resp = JSON.parse(data.responses)[data.event];
    }
}
