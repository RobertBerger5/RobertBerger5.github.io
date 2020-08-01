const e = React.createElement;

function listToRow(rows, list) {
	rows.push(e(
		'div',
		{
			className: 'row',
		},
		...list,
	))
}
function CourseList(props) {
	if (props.courses == null) {
		return null;
	}

	cols = 3;
	let rows = [];
	let current = [];

	for (let i = 0; i < props.courses.length; i++) {
		current.push(e(
			'div',
			{
				className: 'col-xs-' + (12 / cols),
			},
			e('p', null, props.courses[i]),
		));

		if (current.length == cols) {
			listToRow(rows, current);
			current = [];
		}
	}

	if (current != []) {
		listToRow(rows, current);
	}

	return e(
		'div',
		null,
		e('p', null, e('b', null, props.title + ":")),
		...rows,
	)
}

function loadCourses() {
	const courseListContainer = document.querySelector('#react-course-list');
	ReactDOM.render(e(
		'div',
		null,
		e(
			CourseList,
			{
				title: "Courses relevant to Computer Science",
				courses: [
					'Algorithms and Data Structures',
					'Parallel and Distributed Computing',
					'Programming Languages',
					'Software Design',
					'Mobile Computing Applications',
					'Robotics',
					'Linear Algebra',
					'Operating Systems',
					'Intro to Data Science',
					'Statistics',
					'Intro to Mathematical Reasoning',
					'Hardware Design',
				],
			}
		),
		e(
			CourseList,
			{
				title: "In Progress",
				courses: [
					'Senior Capstone',
					'Statistical Computing',
				],
			}
		)
	), courseListContainer);
}


// Absolutely disgusting that I couldn't find a better way to go about this but oh well
function calculateWidth(words) {
	text = document.createElement("span");
	document.body.appendChild(text);
	text.style.fontSize = 16 + "px";
	text.style.height = 'auto';
	text.style.width = 'auto';
	text.style.position = 'absolute';
	text.style.whiteSpace = 'no-wrap';
	text.innerHTML = words;
	let ret = Math.ceil(text.clientWidth);
	document.body.removeChild(text);
	return ret;
}

function SkillBubble(props) {
	return e(
		'div',
		{
			className: 'skill-bubble',
			style: {
				width: (props.selected != null ? (50 + calculateWidth(props.title)) + 'px' : '33%'),
				//backgroundColor: (props.selected == null ? 'rgba(255,255,255,0)' : props.selected == props.id ? 'rgba(255,0,0,1)' : 'rgba(0,0,255,1'),
			}
		},
		e(
			'button',
			{
				type: 'button',
				className: 'btn btn-primary',
				onClick: () => {
					if (props.selected == props.id) {
						props.selectSkill(null);
					} else {
						props.selectSkill(props.id);
					}
				},
			},
			props.title,
		),
		e(
			'div',
			{
				className: 'skillBar',
				style: {
					width: (props.selected == null ? '50pt' : '0pt'),
					height: (props.selected == null ? '10pt' : '0pt'),
				}
			},
			e(
				'span',
				{
					style: {
						width: props.percent + '%'
					}
				}
			)
		)
	)
}

class SkillField extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: null,
		}
	}

	render() {
		let skills = [];
		for (let i = 0; i < this.props.skills.length; i++) {
			const skill = this.props.skills[i];
			skills.push(e(
				SkillBubble,
				{
					id: i,
					title: skill.title,
					percent: skill.percent,
					selected: this.state.selected,
					selectSkill: (s) => {
						this.setState({ selected: s })
					},
				}
			));
		}

		let detailHTML = [null];
		if (this.state.selected != null) {
			detailHTML = [];
			detailHTML.push(e('h3', null, this.props.skills[this.state.selected].title));
			detailHTML.push(e('p', null, this.props.skills[this.state.selected].desc))
		}

		return e(
			'div',
			{
				width: '100%'
			},
			e(
				'div',
				{
					style: {
						width: "100%",
						overflowX: (this.state.selected == null ? 'visible' : 'scroll'),
						whiteSpace: (this.state.selected == null ? 'normal' : 'nowrap'),
					}
				},
				...skills,
			),
			e(
				'div',
				{
					className: 'skill-detail',
					style: {
						// TODO: Similar trick to calculateWidth() here?
						maxHeight: (this.state.selected == null ? 0 : 200 + 'pt'),
					}
				},
				...detailHTML,
			)
		)
	}
}

function loadSkills() {
	const skillContainer = document.querySelector('#react-skill-bubble');
	ReactDOM.render(e(
		SkillField,
		// TODO: have a JSON file with all this data and just query it?
		{
			skills: [
				{
					title: 'C++',
					percent: 80,
					desc: "My preferred programming language. Many computer science classes at St. Olaf are taught in it, including Algorithms and Data Structures, where I got most comfortable with the specifics of the language, including considering time and space complexity of implementing an algorithm in the language.",
				},
				{
					title: 'Java',
					percent: 60,
					desc: "Java is my second favorite programming language. I've never really had a class on it specifically, but I've messed around with it enough to be quite familiar with it. Its similarity to C++ also helps significantly.",
				},
				{
					title: 'Kotlin',
					percent: 30,
					desc: "The simple app I made for my final Robotics project consisted mostly of Kotlin. I hadn't worked with it much before, but my Java app development knowledge transferred over surprisingly well.",
				},
				{
					title: 'Python',
					percent: 65,
					desc: "I had a pretty good grasp on the language, which was increased during the Robotics class at St. Olaf, which used almost exclusively Python. See my GitHub project 'RoboDog' for a project I did using it.",
				},
				{
					title: 'C',
					percent: 40,
					desc: "Being such a low-level language, it was used a fair bit in the Hardware Design course, and my experience with C++ makes it fairly easy to pick up.",
				},
				{
					title: 'Assembly',
					percent: 5,
					desc: "All my knowledge of Assembly programming comes from Hardware Design, both from taking the course and helping students with it as a TA. Much like my French abilities, I could decrypt the vague idea what it says if given enough time, but writing it myself is likely a whole different story.",
				},
				{
					title: 'Bash Scripting',
					percent: 20,
					desc: "I can write fairly simple scripts to automoate otherwise arduous tasks.",
				},
				{
					title: 'JavaScript',
					percent: 80,
					desc: "JavaScript was the first programming language I ever picked up. We had to make wordpress sites in highschool, and had the option to make it a little more interactive. After using it, I found I enjoyed it, and made several (terribly thrown together) small projects with it. Then, I didn't touch it until my junior year of college, where my Mobile Computing Applications class dove really deep into the language - both for React Native and a Node.js backend. If that wasn't experience enough, my internship with IBM shortly thereafter dealt with React.js a lot too. After being so comfortable with React, I decided to turn much of this webpage into React components.",
				},
				{
					title: 'PHP',
					percent: 20,
					desc: "I started messing with PHP on this site (go explore the \"Other Skills section - Web Development if you haven't already), and gave myself more experience in it by writing the backend of my Tabby project in it."
				}
			]
		}
	), skillContainer);
}

$(document).ready(() => {
	loadCourses();
	loadSkills();
})