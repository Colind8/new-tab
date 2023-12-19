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
		save(0);
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
			linkstr += `<div>` // 
			if (i2 != 0) {
				linkstr += `<hr class="dragdisable" />` // add horizontal rule
			}
			linkstr += `<div>`
			for (i3 = 0; i3 < dataobj.d[i].data[i2].length; i3++) {
				linkstr += `<span class="edit_link" id="link${linkcount}" data-href="${dataobj.d[i].data[i2][i3].u}" data-name="${dataobj.d[i].data[i2][i3].n}" style="color: ${dataobj.d[i].data[i2][i3].c}; border-color: ${dataobj.d[i].data[i2][i3].c};">${dataobj.d[i].data[i2][i3].n}</span>`
				console.log(`Adding ${dataobj.d[i].data[i2][i3].n}`)
				//linkstr += `<a id="link${linkcount}" href="${dataobj.d[i].data[i2][i3].u}" style="color: ${dataobj.d[i].data[i2][i3].c}; border-color: ${dataobj.d[i].data[i2][i3].c};">${dataobj.d[i].data[i2][i3].n}</a>`
				linkcount++;
			}

			linkstr += `</div>`
			if (i2 != 0) {
				linkstr += `<button onclick="delete_section(${i2})" style="display: block;" class="dragdisable">Delete Section</button>`
			}
			linkstr += `</div>`
		}

		linkstr += `</div>`
	}
	navbstr += `<button onclick="create_tab()">+</button>`
	document.getElementById("linklist").innerHTML = linkstr;
	document.getElementById("navbar").innerHTML = navbstr;

	generate_sortables();

	document.getElementById("color_bg").value = dataobj.s[0];
	document.getElementById("color_text").value = dataobj.s[1];
	document.getElementById("color_button").value = dataobj.s[2];
	document.getElementById("color_hover").value = dataobj.s[3];

	theme.setProperty('--c_bg', dataobj.s[0]);
	theme.setProperty('--c_text', dataobj.s[1]);
	theme.setProperty('--c_button', dataobj.s[2]);
	theme.setProperty('--c_hover', dataobj.s[3]);
}

function save(loadnum) {
	let tab_count = document.getElementById('linklist').childElementCount;
	let newobj = {
		d: [
		],
		s: ["#000000", "#dddddd", "#222222", "#333333"]
	}

	for (i = 0; i < tab_count; i++) { // for every tab
		console.log(`Saving tab ${i}`);
		tabobj = {
			title: document.getElementById(`tab_button${i}`).innerHTML,
			password: document.getElementById(`tab_button${i}`).getAttribute("data-pass"),
			data: []
		}
		let section_count = document.getElementById(`tab${i}`).childElementCount;
		for (i2 = 0; i2 < section_count; i2++) { // for every section
			console.log(`Saving -- section ${i2}`);
			sectionobj = [];
			if (i2 == 0) {
				nodenum = 0;
			} else {
				nodenum = 1;
			}
			let item_count = document.getElementById(`tab${i}`).childNodes[i2].childNodes[nodenum].childNodes.length;
			for (i3 = 0; i3 < item_count; i3++) { //for every item
				console.log(`Saving -- -- item ${i3}`);
				let elink = document.getElementById(`tab${i}`).childNodes[i2].childNodes[nodenum].childNodes[i3];
				console.log(elink.className);
				if ((elink.className != "dragdisable") && (elink.className)) {
					sectionobj.push({
						u: elink.getAttribute('data-href'),
						n: elink.getAttribute('data-name'),
						c: elink.style.color
					});
				}
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
	if (loadnum == 0) {
		load();
	} else {
		load_editor();
	}
	
}

function generate_sortables() {
	console.log("generating sortables");
	for (i = 0; i < dataobj.d.length; i++) { // for every tab
		for (i2 = 0; i2 < dataobj.d[i].data.length; i2++) { // for every section
			if (i2 == 0) {
				el = document.getElementById(`tab${i}`).childNodes[i2].childNodes[0];
			} else {
				el = document.getElementById(`tab${i}`).childNodes[i2].childNodes[1];
			}
			
			new Sortable(el, {
				filter: '.dragdisable',
				group: "sortgroup",
				animation: 150
			});
		}
	}

}

function add_site() {
	let slore = document.getElementById(`tab${current_tab}`).firstChild.firstChild;

	surl = document.getElementById("input_url").value;
	sname = document.getElementById("input_name").value;
	scolor = document.getElementById("input_color").value;

	slore.innerHTML += `<span class="edit_link" data-href="${surl}" data-name="${sname}" style="color: ${scolor}; border-color: ${scolor};">${sname}</span>`


	document.getElementById("input_color").value = "#00ff88";
	document.getElementById("input_name").value = "";
	document.getElementById("input_url").value = "";
}

function add_section() {
	console.log("Adding Section");
	linkstr = ""
	linkstr += `<div>` // 
	if (i2 != 0) {
		linkstr += `<hr class="dragdisable" />` // add horizontal rule
	}
	linkstr += `<div>`

	linkstr += `</div>`
	linkstr += `</div>`

	document.getElementById(`tab${current_tab}`).innerHTML += linkstr;
	save(1);
}

function delete_section(num) {
	console.log("Deleting section");
	document.getElementById(`tab${current_tab}`).childNodes[num].remove();
	save(1);
}