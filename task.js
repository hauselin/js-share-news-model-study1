var taskinfo = {
	type: 'study', // 'task', 'survey', or 'study'
	uniquestudyid: 'js-share-news-model-study1-pilot', // unique task id: must be IDENTICAL to directory name
	desc: 'accuracy-funny-nudge-between-within-design', // brief description of task
	redirect_url: "https://www.google.com"
};

// debug parameters
const debug = false;
const debug_n = 3; // no. of trials to present during debug
const debug_treat_condition = 'funny'  // funny or accuracy

// DEFINE TASK PARAMETERS
const rt_deadline = null;
const stim_width = 500;
var itis = iti_exponential(200, 700);
var n_stim = {
	"pre_fake": 16,
	'pre_real': 16,
	"post_fake": 16,
	'post_real': 16,
	'n_treat': 1,
	'n_practice': 2,
};
var include = 1;  // to keep track of whether people pass/fail attention check/screens
var current_trial = 0;  // trial counter for sharing trials
var current_iti = 100; // random value on each trial

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
// var stimuli_treat = [stimuli[stimuli.length - 1]];


// practice stim
var stimuli_practice = stimuli.slice(stimuli.length - n_stim['n_practice'], stimuli.length);

if (debug) {
	stimuli_pre = stimuli_pre.slice(0, debug_n);
	stimuli_post = stimuli_post.slice(0, debug_n);
	stimuli_real = stimuli_pre.filter(i => i.veracity == 'real').concat(stimuli_post.filter(i => i.veracity == 'real'));
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
// var CONDITION = 4;

// assign condition
if (debug) {
	console.log("DEBUG MODE!")
	var treat_instructions = treat_instructions[debug_treat_condition]
	var treat_prompt = treat_prompt[debug_treat_condition]
	var condition = debug_treat_condition;
	var CONDITION = -1;
	console.log('Randomly determining treatment headline.')
	var stimuli_treat = [random_choice(stimuli_treat)];
} else {  // counterbalance experimental conditions
	if (CONDITION == 1) {
		var condition = 'accuracy';
		var stimuli_treat = [stimuli_treat[0]];
	} else if (CONDITION == 2) {
		var condition = 'accuracy';
		var stimuli_treat = [stimuli_treat[1]];
	} else if (CONDITION == 3) {
		var condition = 'funny';
		var stimuli_treat = [stimuli_treat[0]];
	} else if (CONDITION == 4) {
		var condition = 'funny';
		var stimuli_treat = [stimuli_treat[1]];
	} else {
		var CONDITION = -1;
		console.log('Randomly determining condition.')
		var condition = random_choice(['funny', 'accuracy']);
		console.log('Randomly determining treatment headline.')
		var stimuli_treat = [random_choice(stimuli_treat)];
	}
	var treat_instructions = treat_instructions[condition];
	var treat_prompt = treat_prompt[condition]
}
taskinfo.condition = condition;
console.log("CONDITION: " + CONDITION);
console.log("condition: " + condition);


// prepare image paths for preloading
var stim_preload = stimuli.map(i => i.img_path).concat(stimuli_treat[0].img_path);






jsPsych.data.addProperties({
	subject: subject_id,
	type: taskinfo.type,
	uniquestudyid: taskinfo.uniquestudyid,
	desc: taskinfo.desc,
	condition: taskinfo.condition,
	condition_jspsych: CONDITION,
	complete: 0,  // task not completed yet

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






var instructions_start = {
	type: 'instructions', allow_backward: false, button_label_next: 'Continue', show_clickable_nav: true, allow_keys: false,
	pages: [
		"To have the best experience, we highly recommend using <strong>Google Chrome</strong> or <strong>FireFox</strong> to complete this survey.<br><br>You should also try to <strong>complete this survey in one sitting</strong>. If you leave this survey or closing the browser tab/window, you will have to start from the beginning again when you return to it.<br><br>Finally, <strong>avoid clicking back or forward in your browser</strong> because that will also bring you back to the beginning of the survey.",
		"First, we have a few questions about social media use."],
}

var socialmedia_content_share = {
	type: 'survey-multi-select',
	questions: [
		{
			prompt: "Which of these types of content would you consider sharing on social media (if any)? (You can select multiple options.)",
			options: jsPsych.randomization.repeat(["Political news", "Sports news", 'Celebrity news', "Science/technology news", "Business news"], 1).concat(['Other']),
			horizontal: false,
			required: true,
			name: 'social_media_content_share'
		},
	],
	on_finish: function (data) {
		data.event = 'prescreen';
		data.block = 'social_media_content_share';
		data.choice = JSON.parse(data.responses)[data.block];
	},
};

var socialmedia_content_share_other = {
	timeline: [{
		type: 'survey-text',
		questions: [{ prompt: 'What other kinds of content would you consider sharing on social media?', columns: 30, required: true, name: 'social_media_content_share_other' }],
		on_finish: function (data) {
			data.event = 'prescreen';
			data.block = 'social_media_content_share_other';
			data.resp = JSON.parse(data.responses)[data.block];
		}
	}],
	conditional_function: function () {
		var data = jsPsych.data.get().last(1).values()[0];
		console.log(data.choice)
		if (data.choice.includes('Other')) {
			return true;
		} else {
			return false;
		}
	}
}

var accounts = [];
var socialmedia_account = {
	type: 'survey-multi-select',
	questions: [
		{
			prompt: "What type of social media accounts do you use (if any)? (You can select multiple options.)",
			options: jsPsych.randomization.repeat(["Facebook", "Twitter", "Snapchat", "Instagram", "WhatsApp", "TikTok", "Parler"], 1).concat(['Other', "I don't use social media"]),
			horizontal: false,
			required: true,
			name: 'social_media_account'
		},
	],
	on_finish: function (data) {
		data.event = 'prescreen';
		data.block = 'social_media_account';
		data.choice = JSON.parse(data.responses)[data.block];
		accounts = accounts.concat(data.choice);
		// console.log(accounts);
	}
};

var socialmedia_account_other = {
	timeline: [{
		type: 'survey-text',
		questions: [{ prompt: 'What other types of social media accounts do you use?', columns: 30, required: true, name: 'social_media_account_other' }],
		on_finish: function (data) {
			data.event = 'prescreen';
			data.block = 'social_media_account_other';
			data.resp = JSON.parse(data.responses)[data.block];
			accounts = accounts.concat(data.resp);
		}
	}],
	conditional_function: function () {
		var data = jsPsych.data.get().last(1).values()[0];
		// console.log(data.choice)
		if (accounts.includes("I don't use social media")) {
			return false;
		} else if (data.choice.includes('Other')) {
			return true;
		} else {
			return false;
		}
	}
}

var socialmedia_account_disqualify = {
	timeline: [{
		type: 'instructions', allow_backward: false, button_label_next: '', show_clickable_nav: false, allow_keys: false,
		pages: ["Sorry. This survey is for people who use social media. This restriction is only for this survey, so please consider completing our future surveys.<br><br>Sorry again and all the best!"],
	}],
	conditional_function: function () {
		if (accounts.includes("I don't use social media")) {
			console.log('Not a social media user! Disqualified.');
			localStorage.setItem(taskinfo.uniquestudyid + '_qualify_check', 'no');
			return true;
		} else {
			console.log('Social media user. Continue.');
			localStorage.setItem(taskinfo.uniquestudyid + '_qualify_check', 'yes');
			return false;
		}
	}
}


















// screen
var screen1 = {
	type: 'survey-multi-select',
	questions: [
		{
			prompt:
				// '<p style="text-align:left;">' +
				'When a big news story breaks, people often go online to get up-to-the-minute details on what is going on. We want to know which websites people trust to get this information. We also want to know if people are paying attention to the question. Please ignore the question and select FoxNews.com and NBC.com as your two answers.<br><br>When there is a big news story, which is the one news website you would visit first? (Please choose only one):',
			// '</p>',
			options: jsPsych.randomization.repeat(["New York Times website", "Yahoo! News", "Huffington Post", "NBC.com", "CNN.com", "USA Today Website", "FoxNews.com", "Google News"], 1).concat(['Other']),
			horizontal: false,
			required: true,
			name: 'screen1'
		},
	],
	on_finish: function (data) {
		data.event = 'prescreen';
		data.block = 'screen1';
		data.choice = JSON.parse(data.responses)[data.block];
		if (data.choice.includes("FoxNews.com") && data.choice.includes("NBC.com") && include != 0) {
			include = 1;
			data.include = 1;
		} else {
			include = 0;
			data.include = 0;
		}
		console.log("include: " + include);
	},
};





























// block: pre-treatment

var instructions_pre = {
	type: 'instructions', allow_backward: false, button_label_next: 'Continue', show_clickable_nav: true, allow_keys: false,
	pages: ["In a moment, you will be presented with a set of news headlines and from social media.",
		"We are interested in the extent to which you would consider sharing them on social media if you had seen them there."]
}

var trial_share_pre = {
	type: 'image-button-response',
	stimulus: jsPsych.timelineVariable("img_path"),
	data: {
		img_category: jsPsych.timelineVariable("img_category"),
		img_idx: jsPsych.timelineVariable("img_idx"),
		veracity: jsPsych.timelineVariable("veracity"),
		benefits_r: jsPsych.timelineVariable("benefits_r"),
		favors_r: jsPsych.timelineVariable("favors_r"),
		funny: jsPsych.timelineVariable("funny"),
		surprising: jsPsych.timelineVariable("surprising"),
		headline_n: jsPsych.timelineVariable("headline_n"),
		important: jsPsych.timelineVariable("important"),
		likely_true: jsPsych.timelineVariable("likely_true"),
		likely_share: jsPsych.timelineVariable("likely_share"),
		reputation_engage: jsPsych.timelineVariable("reputation_engage"),
		reputation_overall: jsPsych.timelineVariable("reputation_overall"),
		reputation_partyloyalty: jsPsych.timelineVariable("reputation_partyloyalty"),
	},
	trial_duration: rt_deadline,
	choices: responses_share_options,
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
		data.choice = responses_share[data.choice_text];
		console.log("trial " + current_trial + "; veracity: " + data.veracity + ", share: " + data.choice);
		current_iti = random_choice(itis);
		data.iti = current_iti;
	},
	post_trial_gap: function () { return current_iti },
	render_on_canvas: false
}

var trial_share_pre_procedure = {
	timeline: [trial_share_pre],
	timeline_variables: stimuli_pre,
	repetitions: 1
}

// deepcopy practice trials
var trial_pre_procedure_practice = jsPsych.utils.deepCopy(trial_share_pre_procedure);
trial_pre_procedure_practice['timeline_variables'] = stimuli_practice;
delete trial_pre_procedure_practice['timeline'][0].on_finish;
trial_pre_procedure_practice['timeline'][0].on_finish = function (data) {
	data.block = 'block1-share'
	data.event = 'practice';
	if (data.button_pressed) {
		data.choice_text = responses_share_options[1];
	} else {
		data.choice_text = responses_share_options[0];
	}
	data.choice = responses_share[data.choice_text];
	console.log("PRACTICE! veracity: " + data.veracity + ", share: " + data.choice);
	current_iti = random_choice(itis);
	data.iti = current_iti;
}











// block: treatment
var trial_treatment_instructions = {
	type: 'instructions',
	pages: treat_instructions,
	allow_backward: false,
	button_label_next: 'Continue',
	show_clickable_nav: true,
	allow_keys: false
}

var trial_treatment = {
	type: 'image-button-response',
	stimulus: jsPsych.timelineVariable("img_path"),
	data: {
		img_category: jsPsych.timelineVariable("img_category"),
		img_idx: jsPsych.timelineVariable("img_idx"),
		veracity: jsPsych.timelineVariable("veracity"),
	},
	trial_duration: rt_deadline,
	choices: responses_accuracy_options,
	prompt: treat_prompt,
	post_trial_gap: function () {
		return 2000;
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
		console.log('response: ' + data.choice);
	},
	render_on_canvas: false
}

var trial_treatment_procedure = {
	timeline: [trial_treatment],
	timeline_variables: stimuli_treat,
	repetitions: 1
}













// block: post-treatment
var trial_share_post = {
	type: 'image-button-response',
	stimulus: jsPsych.timelineVariable("img_path"),
	data: {
		img_category: jsPsych.timelineVariable("img_category"),
		img_idx: jsPsych.timelineVariable("img_idx"),
		veracity: jsPsych.timelineVariable("veracity"),
		benefits_r: jsPsych.timelineVariable("benefits_r"),
		favors_r: jsPsych.timelineVariable("favors_r"),
		funny: jsPsych.timelineVariable("funny"),
		surprising: jsPsych.timelineVariable("surprising"),
		headline_n: jsPsych.timelineVariable("headline_n"),
		important: jsPsych.timelineVariable("important"),
		likely_true: jsPsych.timelineVariable("likely_true"),
		likely_share: jsPsych.timelineVariable("likely_share"),
		reputation_engage: jsPsych.timelineVariable("reputation_engage"),
		reputation_overall: jsPsych.timelineVariable("reputation_overall"),
		reputation_partyloyalty: jsPsych.timelineVariable("reputation_partyloyalty"),
	},
	trial_duration: rt_deadline,
	choices: responses_share_options,
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
		data.choice = responses_share[data.choice_text];
		console.log("trial " + current_trial + "; veracity: " + data.veracity + ", share: " + data.choice);
		current_iti = random_choice(itis);
		data.iti = current_iti;
	},
	post_trial_gap: function () { return current_iti },
	render_on_canvas: false
}

var trial_share_post_procedure = {
	timeline: [trial_share_post],
	timeline_variables: stimuli_post,
	repetitions: 1
}







// crt
var instructions_crt = {
	type: 'instructions', allow_backward: false, button_label_next: 'Continue', show_clickable_nav: true, allow_keys: false,
	pages: ["In the following section you will be asked several questions.<br><br>Please do your best to answer as accurately as possible."],
}

var crt_procedure = {
	timeline: [{
		type: 'survey-text',
		questions: [{ prompt: jsPsych.timelineVariable('desc'), columns: 20, required: true, name: jsPsych.timelineVariable('q') }],
		on_finish: function (data) {
			data.event = 'postscreen';
			data.desc = jsPsych.timelineVariable('desc', true);
			data.q = jsPsych.timelineVariable('q', true);
			data.block = jsPsych.timelineVariable('subscale', true);
			data.resp = JSON.parse(data.responses)[data.q.toString()];
			data.answer_intuitive = jsPsych.timelineVariable('answer_intuitive', true)
			data.answer_correct = jsPsych.timelineVariable('answer_correct', true);
			data.choice = JSON.parse(data.responses)[data.block];
			console.log("response: " + data.response);
		}
	}],
	timeline_variables: items_crt,
	randomize_order: true
};

var crt_check = {
	type: 'html-button-response',
	stimulus: 'Have you seen any of those world problems before?<br><br>',
	choices: ['yes', 'maybe', 'no'],
	on_finish: function (data) {
		data.event = 'crt-check';
		if (data.button_pressed == 0) {
			data.resp = 1;
		} else if (data.button_pressed == 1) {
			data.resp = 0.5;
		} else if (data.button_pressed == 2) {
			data.resp = 0;
		}
	}
}











// screen
var screen2 = {
	type: 'survey-multi-select',
	questions: [
		{
			prompt:
				'<p style="text-align:left;">' +
				"We would like to get a sense of your general preferences.<br><br>" +
				"Most modern theories of decision making recognize that decisions do not take place in a vacuum. Individual preferences and knowledge, along with situational variables can greatly impact the decision process. To demonstrate that you've read this much, just go ahead and select both red and green among the alternatives below, no matter what your favorite color is. Yes, ignore the question below and select both of those options.<br><br>" +
				"What is your favorite color?" +
				'</p>',
			options: jsPsych.randomization.repeat(['white', 'pink', 'green', 'black', 'blue', 'red'], 1),
			horizontal: true,
			required: true,
			name: 'screen2'
		},
	],
	on_finish: function (data) {
		data.event = 'prescreen';
		data.block = 'screen2';
		data.choice = JSON.parse(data.responses)[data.block];
		if (data.choice.includes("red") && data.choice.includes("green") && include != 0) {
			include = 1;
			data.include = 1;
		} else {
			include = 0;
			data.include = 0;
		}
		console.log("include: " + include);
	},
};











// media
var media_share_accuracy_options = ['not at all important', 'slightly important', 'moderately important', 'very important', 'extremely important'];
var media_share_accuracy = {
	type: 'survey-multi-choice',
	questions: [
		{
			prompt: "How important is it to you that you only share news articles on social media (such as Facebook and Twitter) if they are accurate?",
			options: media_share_accuracy_options,
			horizontal: false,
			required: true,
			name: 'media_share_accuracy'
		},
	],
	on_finish: function (data) {
		data.event = 'media_share_accuracy';
		data.block = 'media_questions';
		data.choice = JSON.parse(data.responses)[data.event];
		data.resp = media_share_accuracy_options.findIndex(i => i.includes(data.choice)) + 1;
	},
};





var instructions_media_trust = {
	type: 'instructions', allow_backward: false, button_label_next: 'Continue', show_clickable_nav: true, allow_keys: false,
	pages: ["Next, you'll indicate to what extent you trust the information that comes from different sources."]
}

var media_trust_questions_labels = ['none at all', 'a little', 'a moderate amount', 'a lot', 'a great deal'];
var media_trust_questions = ['National news organizations', 'Local news organizations', 'Friends and family', 'Social networking sites (e.g., Facebook, Twitter)', '3rd party fact-checkers (e.g., snopes.com, factcheck.org)'];
var media_trust = {
	type: 'survey-likert',
	questions: function () {
		var qs = [];
		for (var i = 0; i < media_trust_questions.length; i++) {
			qs_temp = {};
			qs_temp['name'] = media_trust_questions[i];
			qs_temp['prompt'] = media_trust_questions[i];
			qs_temp['required'] = true;
			qs_temp['labels'] = media_trust_questions_labels;
			qs.push(qs_temp);
		}
		return qs;
	},
	on_finish: function (data) {
		data.event = 'media_trust'
		data.block = 'media_questions';
	}
}


















// screen 
var instructions_screen = {
	type: 'instructions', allow_backward: false, button_label_next: 'Continue', show_clickable_nav: true, allow_keys: false,
	pages: ["Next, you will see a series of statements.<br><br>Please tell us whether you agree or disagree with each statement."]
}

var labels5 = { "agree strongly": 2, "agree": 1, "neither agree nor disagree": 0, "disagree": -1, "disagree strongly": -2 }
var screen_questions = ['Please click the "neither agree nor disagree" response.', 'People convicted of murder should be given the death penalty.', 'Gays and lesbians should have the right to legally marry.', 'World War I came after World War II.', 'In order to reduce the budget deficit, the federal government should raise taxes on people that make more than $250,000 per year.', 'The Affordable Care Act passed by Congress in 2010 should be repealed.', 'The government should require all electricity power plants to significantly reduce their greenhouse gas emissions even if it might increase electricity bills a few dollars a month.'];
screen_questions = jsPsych.randomization.repeat(screen_questions, 1);  // shuffle
screen_questions_idx = screen_questions.findIndex(i => i.includes('neither agree nor disagree'));
var screen3 = {
	type: 'survey-likert',
	questions: function () {
		var qs = [];
		for (var i = 0; i < screen_questions.length; i++) {
			qs_temp = {};
			qs_temp['name'] = i;
			qs_temp['prompt'] = screen_questions[i];
			qs_temp['required'] = true;
			qs_temp['labels'] = Object.keys(labels5);
			qs.push(qs_temp);
		}
		return qs;
	},
	on_finish: function (data) {
		data.block = 'screen3';
		var responses = JSON.parse(data.responses)
		data.resp = responses[screen_questions_idx];
		data.resp = Object.values(labels5)[data.resp];
		if (data.resp == 0 && include != 0) {
			include = 1;
			data.include = 1;
		} else {
			include = 0;
			data.include = 0;
		}
		console.log("include: " + include);
	}
}









// support_economic_inequality
var instructions_support_economic_inequality = {
	type: 'instructions', allow_backward: false, button_label_next: 'Continue', show_clickable_nav: true, allow_keys: false,
	pages: ["Next, you will see different statements.<br><br>Please indicate your level of agreement with each statement."],
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
		require_movement: true,
		on_finish: function (data) {
			data.resp = Number(data.response) / 10;
			data.resp_reverse = data.resp;
			if (data.reverse) { // reverse code item if necessary
				data.resp_reverse = 7 + 1 - data.resp;
			}
			console.log("q" + data.q + " (reverse: " + data.reverse + "): " + data.stimulus);
			console.log("resp: " + data.resp + ", resp_reverse: " + data.resp_reverse);
		}
	}],
	timeline_variables: items_support_economic_inequality,
	randomize_order: false
};








// subjective_inequality
var instructions_subjective_inequality = {
	type: 'instructions', allow_backward: false, button_label_next: 'Continue', show_clickable_nav: true, allow_keys: false,
	pages: ["We want to know how you feel about the next set of statements. There are no right or wrong answers.<br><br>When responding to the statements, please consider how well you think they describe <strong>THE PLACE YOU CURRENTLY LIVE IN.</strong><br><br>"],
}

var subjective_inequality_labels = ['strongly disagree', 'strongly agree']
var subjective_inequality_procedure = {
	timeline: [{
		type: 'html-slider-response',
		stimulus: jsPsych.timelineVariable('desc'),
		data: {
			q: jsPsych.timelineVariable('q'),
			subscale: jsPsych.timelineVariable('subscale'),
			reverse: jsPsych.timelineVariable('reverse')
		},
		labels: subjective_inequality_labels,
		slider_width: 500, min: 10, max: 70, slider_start: 40, step: 1,
		require_movement: true,
		on_finish: function (data) {
			data.resp = Number(data.response) / 10;
			data.resp_reverse = data.resp;
			if (data.reverse) { // reverse code item if necessary
				data.resp_reverse = 7 + 1 - data.resp;
			}
			console.log("q" + data.q + " (reverse: " + data.reverse + "): " + data.stimulus);
			console.log("resp: " + data.resp + ", resp_reverse: " + data.resp_reverse);
		}
	}],
	timeline_variables: items_subjective_inequality,
	randomize_order: false
};







// demographics
var demo_age = {
	type: 'survey-text',
	questions: [{ prompt: "What is your age?", columns: 20, required: true, name: 'age' }],
	on_finish: function (data) {
		data.event = 'age';
		data.block = 'demographics'
		data.resp = Number(JSON.parse(data.responses)[data.event]);
		console.log("response: " + data.resp);
	}
}



var demo_gender_options = ['Female', 'Male', 'Trans Female', 'Trans Male', 'Trans/Non-Binary', 'Not listed', 'Prefer not to answer'];
var demo_gender = {
	type: 'survey-multi-choice',
	questions: [
		{
			prompt: 'What is your gender?',
			options: demo_gender_options,
			horizontal: false,
			required: true,
			name: 'gender'
		}],
	choices: demo_gender_options,
	on_finish: function (data) {
		data.event = 'gender';
		data.block = 'demographics';
		data.resp = JSON.parse(data.responses)[data.event];
	}
}

var demo_education = {
	type: 'html-slider-response',
	stimulus: 'How many years of formal education have you completed?<br><br>',
	labels: ['0 years', '5 years', '10 years', '15 years', '20 years or more'],
	require_movement: true,
	min: 0, max: 20, slider_start: 10,
	on_finish: function (data) {
		data.resp = data.response;
	}
};




var demo_houseincome_options = ['Less than $10,000', '$10,000 to $19,999', '$20,000 to $29,999', '$30,000 to $39,999', '$40,000 to $49,999', '$50,000 to $59,999', '$60,000 to $69,999', '$70,000 to $79,999', '$80,000 to $89,999', '$90,000 to $99,999', '$100,000 to $149,999', '$150,000 or more'];
var demo_houseincome = {
	type: 'survey-multi-choice',
	questions: [
		{
			prompt: 'Information about income is very important to understand.  Would you please give your best guess?<br><br>Please indicate the answer that includes your entire household income in (previous year) before taxes.',
			options: demo_houseincome_options,
			horizontal: false,
			required: true,
			name: 'houseinicome'
		}],
	choices: demo_houseincome_options,
	on_finish: function (data) {
		data.event = 'houseinicome';
		data.block = 'demographics';
		data.resp = JSON.parse(data.responses)[data.event];
	}
}




var demo_ethnicity_options = ['White/Caucasian', 'Asian', 'Black or African American', 'Native Hawaiian/Pacific Islander', 'American Indian/Alask Native', 'Other'];
var demo_ethnicity = {
	type: 'survey-multi-select',
	questions: [
		{
			prompt: "Please choose whichever ethnicity that you identify with (you may choose more than one option).",
			options: demo_ethnicity_options,
			horizontal: false,
			required: true,
			name: 'ethnicity'
		},
	],
	on_finish: function (data) {
		data.event = 'ethnicity';
		data.block = 'demographics';
		data.resp = JSON.stringify(JSON.parse(data.responses)[data.event]);
	},
};

var demo_ethnicity_other = {
	timeline: [{
		type: 'survey-text',
		questions: [{ prompt: 'What other ethnicities do you identify with?', columns: 30, required: true, name: 'demo_ethnicity_other' }],
		on_finish: function (data) {
			data.event = 'ethnicity_other';
			data.block = 'demographics_other';
			data.resp = JSON.parse(data.responses)['demo_ethnicity_other'];
		}
	}],
	conditional_function: function () {
		var data = jsPsych.data.get().last(1).values()[0];
		console.log(data.choice)
		if (data.resp.includes('Other')) {
			return true;
		} else {
			return false;
		}
	}
}








var demo_english_options = ['no', 'yes'];
var demo_english = {
	type: 'html-button-response',
	stimulus: 'Are you fluent in English?<br><br>',
	choices: demo_english_options,
	on_finish: function (data) {
		data.event = 'english';
		data.block = 'demographics';
		data.resp = data.button_pressed;
	}
}

var demo_politicalpos_options = ['Democrat', 'Republican', 'Independent', 'Other'];
var demo_politicalpos = {
	type: 'html-button-response',
	stimulus: 'Which of the following best describes your political position?<br><br>',
	choices: demo_politicalpos_options,
	on_finish: function (data) {
		data.event = 'politicalpos';
		data.block = 'demographics';
		data.resp = demo_politicalpos_options[data.button_pressed];
	}
}


var demo_politicalpref_options = ['Strongly Democratic', 'Democratic', 'Lean Democratic', 'Lean Republican', 'Republican', 'Strongly Republican'];
var demo_politicalpref = {
	type: 'survey-multi-choice',
	questions: [
		{
			prompt: 'Which of the following best describes your political preference?',
			options: demo_politicalpref_options,
			horizontal: false,
			required: true,
			name: 'politicalpref'
		}],
	choices: demo_politicalpref_options,
	on_finish: function (data) {
		data.event = 'politicalpref';
		data.block = 'demographics';
		data.resp = JSON.parse(data.responses)[data.event];
	}
}



var demo_socialissues_options = ['Strongly Liberal', 'Somewhat Liberal', 'Moderate', 'Somewhat Conservative', 'Strongly Conservative'];
var demo_socialissues = {
	type: 'survey-multi-choice',
	questions: [
		{
			prompt: 'On social issues I am...',
			options: demo_socialissues_options,
			horizontal: false,
			required: true,
			name: 'socialissues'
		}],
	choices: demo_socialissues_options,
	on_finish: function (data) {
		data.event = 'socialissues';
		data.block = 'demographics';
		data.resp = JSON.parse(data.responses)[data.event];
	}
}




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



var demo_potus2020_options = ['Joseph Biden', 'Donald Trump', 'Other candidate', 'Did not vote for reasons outside of my control', 'Did not vote but could have', 'Did not vote out of protest'];
var demo_potus2020 = {
	type: 'survey-multi-choice',
	questions: [
		{
			prompt: 'Who did you vote for in the 2020 Presidential Election?<br><br><strong>Reminder: This survey is anonymous.</strong>',
			options: demo_potus2020_options,
			horizontal: false,
			required: true,
			name: 'potus2020'
		}],
	choices: demo_potus2020_options,
	on_finish: function (data) {
		data.event = 'potus2020';
		data.block = 'demographics';
		data.resp = JSON.parse(data.responses)[data.event];
	}
}













// social media sources
var socialmedia_source = {
	type: 'survey-multi-select',
	questions: [
		{
			prompt: "Earlier on, when you thought about whether you would share the content, which social media source were you primarily thinking about? (You can select more than one option if you were thinking about multiple sources.)",
			options: jsPsych.randomization.repeat(["Facebook", "Twitter", "Snapchat", "Instagram", "WhatsApp", "TikTok", "Parler"], 1).concat(['Other', "I didn't think of any source (e.g., because it isn't the sort of content I would ever share)"]),
			horizontal: false,
			required: true,
			name: 'smsource'
		},
	],
	on_finish: function (data) {
		data.event = 'smsource';
		data.block = 'smsource';
		data.choice = JSON.parse(data.responses)[data.block];
	}
};

var socialmedia_source_other = {
	timeline: [{
		type: 'survey-text',
		questions: [{ prompt: 'What other social media sources were you thinking about?', columns: 30, required: true, name: 'social_media_source_other' }],
		on_finish: function (data) {
			data.event = 'smsource_other';
			data.block = 'social_media_source_other';
			data.resp = JSON.parse(data.responses)[data.block];
		}
	}],
	conditional_function: function () {
		var data = jsPsych.data.get().last(1).values()[0];
		// console.log(data.choice)
		if (data.choice.includes('Other')) {
			return true;
		} else {
			return false;
		}
	}
}




























// random response
var random_resp_options = ['no', 'yes'];
var random_resp = {
	type: 'survey-multi-choice',
	questions: [
		{
			prompt: "Did you respond <strong>randomly</strong> at any point during the study?<br><br><strong>Note: Please be honest! You will get your payment regardless of your response.</strong>",
			options: random_resp_options,
			horizontal: false,
			required: true,
			name: 'random_resp'
		},
	],
	on_finish: function (data) {
		data.event = 'random_resp';
		data.block = 'cheat';
		data.choice = JSON.parse(data.responses)[data.event];
		data.resp = random_resp_options.findIndex(i => i.includes(data.choice));
	},
};

// google response
var google_resp_options = ['no', 'yes'];
var google_resp = {
	type: 'survey-multi-choice',
	questions: [
		{
			prompt: "Did you search the internet (via Google or otherwise) for any of the news headlines?<br><br><strong>Note: Please be honest! You will get your payment regardless of your response.</strong>",
			options: google_resp_options,
			horizontal: false,
			required: true,
			name: 'google_resp'
		},
	],
	on_finish: function (data) {
		data.event = 'google_resp';
		data.block = 'cheat';
		data.choice = JSON.parse(data.responses)[data.event];
		data.resp = google_resp_options.findIndex(i => i.includes(data.choice));
	},
};




















// comments
var comments_procedure = {
	timeline: [{
		type: 'survey-text',
		questions: [{ prompt: jsPsych.timelineVariable('desc'), columns: 60, required: false, name: jsPsych.timelineVariable('name') }],
		on_finish: function (data) {
			data.event = jsPsych.timelineVariable('name', true);
			data.block = 'comments'
			data.resp = JSON.parse(data.responses)[data.event];
			localStorage.removeItem(taskinfo.uniquestudyid + '_qualify_check');
		}
	}],
	timeline_variables: [
		// {
		// 	"desc": "Please enter the ZIP code for your primary residence.<br><strong>Reminder: This survey is anonymous.</strong>",
		// 	"name": "zipcode"
		// },
		{
			"desc": "Do you have any comments about our survey?",
			"name": "comments_survey"
		},
		{
			"desc": "Roughly how long did this survey take you to complete?",
			"name": "time_taken"
		},
	],
	randomize_order: false
};










var instructions_redirect = {
	type: 'instructions', allow_backward: false, button_label_next: 'Submit', show_clickable_nav: true, allow_keys: false,
	pages: ["You've completed the survey. Click the button below to submit your responses. You'll be redirected to the survey platform."],
}


















// push objects into timeline

timeline.push(instructions_start)
timeline.push(socialmedia_account)
timeline.push(socialmedia_account_other)
timeline.push(socialmedia_account_disqualify)
timeline.push(socialmedia_content_share)
timeline.push(socialmedia_content_share_other)

timeline.push(screen2)

timeline.push(instructions_pre)
timeline.push(trial_pre_procedure_practice)
timeline.push(trial_share_pre_procedure)
timeline.push(trial_treatment_instructions)
timeline.push(trial_treatment_procedure)
timeline.push(trial_share_post_procedure)

timeline.push(instructions_crt)
timeline.push(crt_procedure)
timeline.push(crt_check)

timeline.push(screen1)

timeline.push(media_share_accuracy)
timeline.push(instructions_media_trust)
timeline.push(media_trust)

timeline.push(instructions_screen)
timeline.push(screen3)

timeline.push(instructions_support_economic_inequality)
timeline.push(support_economic_inequality_procedure)

timeline.push(instructions_subjective_inequality)
timeline.push(subjective_inequality_procedure)

timeline.push(demo_age)
timeline.push(demo_gender)
timeline.push(demo_education)
timeline.push(demo_houseincome)
timeline.push(demo_ethnicity)
timeline.push(demo_ethnicity_other)
timeline.push(demo_english)
timeline.push(demo_politicalpos)
timeline.push(demo_politicalpref)
timeline.push(demo_socialissues)
timeline.push(demo_economicissues)
timeline.push(demo_potus2020)

timeline.push(socialmedia_source)
timeline.push(socialmedia_source_other)
timeline.push(random_resp)
timeline.push(google_resp)

timeline.push(comments_procedure)

timeline.push(instructions_redirect)





// prevent people from completing again if they've previously failed the check
if (localStorage.getItem(taskinfo.uniquestudyid + '_qualify_check') == 'no') {
	timeline = [{
		type: 'instructions', allow_backward: false, button_label_next: '', show_clickable_nav: false, allow_keys: false,
		pages: ["Sorry. This survey is for people who use social media. This restriction is only for this survey, so please consider completing our future surveys.<br><br>Sorry again and all the best!"],
	}];
	stim_preload = [];
}

// don't alllow safari
var is_Safari = navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome');
if (is_Safari) {
	timeline = [{
		type: 'instructions', allow_backward: false, button_label_next: '', show_clickable_nav: false, allow_keys: false,
		pages: ["You might be using an incompatible web browser.<br><br>Please switch to <strong>Google Chrome</strong> or <strong>Firefox</strong> for a better experience."],
	}];
	stim_preload = [];
}



// run task
jsPsych.init({
	timeline: timeline,
	preload_images: stim_preload,
	experiment_width: stim_width + 160,
	on_finish: function () {
		jsPsych.data.get().addToAll({ // add parameters to all trials
			total_time: jsPsych.totalTime() / 60000,
			complete: 1  // indicate whether completed task
		});
		if (debug) {
			jsPsych.data.displayData();
		} else {  // redirect
			window.location.href = taskinfo.redirect_url;
		}
	}
})