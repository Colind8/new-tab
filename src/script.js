data = localStorage.getItem("data");
edit = false;
current_tab = 0;
const theme = document.querySelector(':root').style;
//data = `data = {"d": [{"n": "Twitter", "u": "https://www.twitter.com"}]}`

console.log(data);


if (data) {
	load();
} else {
	dataobj = JSON.parse(`{
		"d": [
			{
				"title": "default",
				"password": "",
				"data": [
					[]
				]
			}
		],
		"s": ["#000000","#dddddd","#222222","#333333"]
	}`);
	console.log("-- 3 --");
	console.log(dataobj);
	data = JSON.stringify(dataobj);
	console.log("-- 4 --");
	console.log(data);
	data = window.btoa(data);
	console.log("-- 5 --");
	console.log(data);
	localStorage.setItem("data", data);
	load();
}

function toggle_edit() {
	let editables = document.getElementsByClassName(`edit`);
	if (edit) {
		for (i = 0; i < editables.length; i++) {
			editables[i].style.display = "none";
		}
		edit = false;
		save();
	} else {
		for (i = 0; i < editables.length; i++) {
			editables[i].style.display = "block";
		}
		edit = true;
		load_editor();
	}
}

function load() {
	document.getElementById('linklist').innerHTML = "";
	document.getElementById('navbar').innerHTML = "";
	data = localStorage.getItem("data");
	console.log("-- 7 --");
	console.log(data);
	console.log("-- 8 --");
	console.log(data);
	dataobj = window.atob(data);
	console.log("-- 9 --");
	console.log(dataobj);
	dataobj = JSON.parse(dataobj);

	linkstr = ""; // linklist html
	navbstr = ""; // navbar html
	for (i = 0; i < dataobj.d.length; i++) {
		if (dataobj.d.length > 1) { //tabs
			navbstr += `<button onclick="switch_tab('tab${i}')">${dataobj.d[i].title}</button>`
		}
		linkstr += `<div id="tab${i}">`
		for (i2 = 0; i2 < dataobj.d[i].data.length; i2++) {
			if (i2 != 0) {
				linkstr += `<hr/>` // add horizontal rule
			}
			for (i3 = 0; i3 < dataobj.d[i].data[i2].length; i3++) {
				linkstr += `<a class="dragdisable" href="${dataobj.d[i].data[i2][i3].u}" style="color: ${dataobj.d[i].data[i2][i3].c}; border-color: ${dataobj.d[i].data[i2][i3].c};">${dataobj.d[i].data[i2][i3].n}</a>`
			}
		}

		linkstr += `</div>`
	}
	document.getElementById("linklist").innerHTML = linkstr;
	document.getElementById("navbar").value = navbstr;

	document.getElementById("color_bg").value = dataobj.s[0];
	document.getElementById("color_text").value = dataobj.s[1];
	document.getElementById("color_button").value = dataobj.s[2];
	document.getElementById("color_hover").value = dataobj.s[3];

	theme.setProperty('--c_bg', dataobj.s[0]);
	theme.setProperty('--c_text', dataobj.s[1]);
	theme.setProperty('--c_button', dataobj.s[2]);
	theme.setProperty('--c_hover', dataobj.s[3]);
}

function load_editor() {
	document.getElementById('linklist').innerHTML = "";
	document.getElementById('navbar').innerHTML = "";

	data = localStorage.getItem("data");
	console.log("-- 7 --");
	console.log(data);
	console.log("-- 8 --");
	console.log(data);
	dataobj = window.atob(data);
	console.log("-- 9 --");
	console.log(dataobj);
	dataobj = JSON.parse(dataobj);

	linkstr = ""; // linklist html
	navbstr = ""; // navbar html
	linkcount = 0;
	for (i = 0; i < dataobj.d.length; i++) {
		navbstr += `<button data-pass="${dataobj.d[i].password}" id="tab_button${i}" onclick="switch_tab('tab${i}')">${dataobj.d[i].title}</button>`

		linkstr += `<div id="tab${i}">`
		for (i2 = 0; i2 < dataobj.d[i].data.length; i2++) {
			linkstr += `<div>`
			if (i2 != 0) {
				linkstr += `<hr class="dragdisable" />` // add horizontal rule
			}
			for (i3 = 0; i3 < dataobj.d[i].data[i2].length; i3++) {
				linkstr += `<span class="edit_link" id="link${linkcount}" data-href="${dataobj.d[i].data[i2][i3].u}" data-name="${dataobj.d[i].data[i2][i3].n}" style="color: ${dataobj.d[i].data[i2][i3].c}; border-color: ${dataobj.d[i].data[i2][i3].c};">${dataobj.d[i].data[i2][i3].n}</span>`
				console.log(`Adding ${dataobj.d[i].data[i2][i3].n}`)
				//linkstr += `<a id="link${linkcount}" href="${dataobj.d[i].data[i2][i3].u}" style="color: ${dataobj.d[i].data[i2][i3].c}; border-color: ${dataobj.d[i].data[i2][i3].c};">${dataobj.d[i].data[i2][i3].n}</a>`
				linkcount++;
			}
			linkstr += `</div>`
		}

		linkstr += `</div>`
	}
	navbstr += `<button onclick="create_tab()">+</button>`
	document.getElementById("linklist").innerHTML = linkstr;
	document.getElementById("navbar").innerHTML = navbstr;

	el = document.getElementById('tab0').firstChild;
	new Sortable(el, {
		filter: '.dragdisable',
		animation: 150
	});

	document.getElementById("color_bg").value = dataobj.s[0];
	document.getElementById("color_text").value = dataobj.s[1];
	document.getElementById("color_button").value = dataobj.s[2];
	document.getElementById("color_hover").value = dataobj.s[3];

	theme.setProperty('--c_bg', dataobj.s[0]);
	theme.setProperty('--c_text', dataobj.s[1]);
	theme.setProperty('--c_button', dataobj.s[2]);
	theme.setProperty('--c_hover', dataobj.s[3]);
}

function save() {
	let tab_count = document.getElementById('linklist').childElementCount;
	let newobj = {
		d: [
		],
		s: ["#000000", "#dddddd", "#222222", "#333333"]
	}

	for (i = 0; i < tab_count; i++) { // for every tab
		console.log(`Creating tab ${i}`);
		tabobj = {
			title: document.getElementById(`tab_button${i}`).innerHTML,
			password: document.getElementById(`tab_button${i}`).getAttribute("data-pass"),
			data: []
		}
		let section_count = document.getElementById(`tab${i}`).childElementCount;
		for (i2 = 0; i2 < section_count; i2++) { // for every section
			console.log(`Creating section ${i}`);
			sectionobj = [];
			let item_count = document.getElementById(`tab${i}`).childNodes[i2].childNodes.length;
			for (i3 = 0; i3 < item_count; i3++) { //for every item
				console.log(`Creating item ${i}`);
				let elink = document.getElementById(`tab${i}`).childNodes[i2].childNodes[i3];
				sectionobj.push({
					u: elink.getAttribute('data-href'),
					n: elink.getAttribute('data-name'),
					c: elink.style.color
				});

			}
			tabobj.data.push(sectionobj);
		}
		newobj.d.push(tabobj);
	}

	newobj.s = [
		document.getElementById("color_bg").value,
		document.getElementById("color_text").value,
		document.getElementById("color_button").value,
		document.getElementById("color_hover").value
	];

	console.log("-- 3 --");
	console.log(newobj);
	data = JSON.stringify(newobj);
	console.log("-- 4 --");
	console.log(data);
	data = window.btoa(data);
	console.log("-- 5 --");
	console.log(data);
	localStorage.setItem("data", data);
	load();
}

function add_site() {
	let slore = document.getElementById('tab0').firstChild;

	surl = document.getElementById("input_url").value;
	sname = document.getElementById("input_name").value;
	scolor = document.getElementById("input_color").value;

	slore.innerHTML += `<span class="edit_link" data-href="${surl}" data-name="${sname}" style="color: ${scolor}; border-color: ${scolor};">${sname}</span>`


	document.getElementById("input_color").value = "#00ff88";
	document.getElementById("input_name").value = "";
	document.getElementById("input_url").value = "";
}