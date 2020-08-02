const e = React.createElement;
const pallete = {
	white: '#FFFFFF',
	main: '#26A1FF',
	darkish: '#0391FE',
	dark: '#02508C',
	lightish: '#65BCFE',
	light: '#BBE0FD',
}

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

// TODO: have things change on highlight, make the mouse indicate that it's clickable, etc. and also include the rating in the detail view
function SkillBubble(props) {
	return e(
		'div',
		{
			className: 'skill-bubble',
			style: {
				width: (props.selected != null ? (50 + calculateWidth(props.title)) + 'px' : '33%'),
				backgroundColor: (props.selected == null ? null : (props.selected == props.id ? pallete.lightish : pallete.light)),
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
		if (!this.props.display) {
			// Should this.state.selected be reset if they look at another tab?
			return null;
		}

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

function SkillsSection(props) {
	const [tab, setTab] = React.useState(0);

	let titles = [];
	let children = [];
	for (let i = 0; i < props.fields.length; i++) {
		titles.push(e(
			'div',
			{
				className: 'skill-tab',
				onClick: () => { setTab(i) },
				style: {
					backgroundColor: (i == tab ? pallete.dark : pallete.light),
					color: (i == tab ? pallete.white : pallete.dark),
				}
			},
			props.fields[i].name,
		));

		children.push(e(
			SkillField,
			{
				skills: props.fields[i].skills,
				display: i == tab,
			}
		));
	}

	return e(
		'div',
		null,
		e(
			'div',
			{

			},
			...titles,
		),
		e(
			'div',
			{
				style: {
					border: '1px solid black',
					padding: '5px',
				}
			},
			...children,
		)
	)
}

function loadSkills() {
	const skillContainer = document.querySelector('#react-skill-bubble');
	ReactDOM.render(e(
		SkillsSection,
		// TODO: have a JSON file with all this data and just query it in?
		{
			fields: [
				{
					name: 'Programming Language',
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
				},
				{
					name: 'Language Languages',
					skills: [
						{
							title: 'English',
							percent: 100,
							desc: "English is my first language, and is therefore the reference point for what 100% proficiency looks like for all other skills listed in this section"
						},
						{
							title: 'German',
							percent: 75,
							desc: "My mom was born in Germany and moved to America when she was 23. We go there for family gatherings about once every year or so, so I've picked up a decent amount naturally. I tested into the third semester of German at St. Olaf, and completed that as well as the fourth semester. I'm now earning a German Studies concentration."
						},
						{
							title: 'Spanish',
							percent: 20,
							desc: "I took four years of Spanish in highschool, and I occasionally practice it so I don't lose my ability to speak it."
						},
						{
							title: 'French',
							percent: 5,
							desc: "Much like my Assembly abilities, I could decrypt the vague idea what it says if given enough time, but writing it myself isn't likely to go smoothly. If I'm being honest, this is mostly just here because the other skills tabs were so much bigger than this one."
						}
					]
				},
				{
					name: 'Other Skills',
					skills: [
						{
							title: 'Android Development',
							percent: 20,
							desc: "Messed around with it a little in highschool, and I've worked on simple apps for both the Engineering Team (see 'Extracurriculars' section below) as well as a project for my Robotics class."
						},
						{
							title: 'Familiarity with Linux',
							percent: 60,
							desc: "Hadn't used it before coming to college, but now I prefer it over Mac or Windows (my personal laptop runs on Ubuntu). Mainly familiar with Ubuntu/Debian, but I can find my way around other flavors too."
						},
						{
							title: 'Docker/Kubernetes',
							percent: 30,
							desc: "I've learned enough about Docker while working as a cluster manager to get by with it. We also work a small amount with Kubernetes, so I'm familiar with it, but haven't personally worked much with it. My internship at IBM was centered around containerized enterprise software, though"
						},
						{
							title: 'Unix Terminals',
							percent: 60,
							desc: "I use the terminal all the time for my cluster manager job, as the most convenient ways to access the machines is through SSH. I used the terminal app on Macs way before ever even touching Linux. I also frequently use it on my personal machine, as I find it to be a more convenient way of getting things done fast. I used to be the kind of person that used Emacs instead of an IDE every time, but I've since conceded to the conveniences of a more visual editor (VS Code, anyone?)"
						},
						{
							title: 'Computer Networking',
							percent: 40,
							desc: "As a cluster manager, I often need to work with networking. Whether it be physically plugging fiber-optic cables in, dealing with network interfaces on a machine, or SSHing into a switch, it's a fairly regular part of the job."
						},
						{
							title: 'Web Development',
							percent: 70,
							desc: "I'd say I've got a fair amount of web development experience. If you disagree with that rating, feel free to scroll down to the bottom of the page and tell me yourself"
						}
					]
				}
			]
		}
	), skillContainer);
}

$(document).ready(() => {
	loadCourses();
	loadSkills();
})