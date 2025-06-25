data = localStorage.getItem("data");
edit = false;
current_tab = 0;
const theme = document.querySelector(':root').style;
const rgba2hex = (rgba) => `#${rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/).slice(1).map((n, i) => (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n)).toString(16).padStart(2, '0').replace('NaN', '')).join('')}`
//data = `data = {"d": [{"n": "Twitter", "u": "https://www.twitter.com"}]}`

console.log(data);


if (data) {
	update_data();
} else {
	dataobj = {
		d: [
			{
				title: "default",
				password: "",
				data: [
					[]
				]
			}
		],
		s: ["#000000","#dddddd","#222222","#333333"],
		i: {
			ver: 0,
			picker: true
		}
	};
	
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

function update_data() {
	data = localStorage.getItem("data");
	console.log("-- 7 --");
	console.log(data);
	console.log("-- 8 --");
	console.log(data);
	dataobj = window.atob(data);
	console.log("-- 9 --");
	console.log(dataobj);
	dataobj = JSON.parse(dataobj);

	console.log("checking for data updates...");
	if (dataobj.i === undefined) {
		console.log("Updating to version 0");
		let new_dataobj = {
			d: dataobj.d,
			s: dataobj.s,
			i: {
				ver: 0,
				picker: true
			}
		};
		
		dataobj = new_dataobj;
	}
	
	console.log("Update check complete.");
	console.log("-- 3 --");
	console.log(dataobj);
	data = JSON.stringify(dataobj);
	console.log("-- 4 --");
	console.log(data);
	data = window.btoa(data);
	console.log("-- 5 --");
	console.log(data);
	localStorage.setItem("data", data);
	
	if (edit) {
		load_editor();
	} else {
		load();
	}
	
}

function load() {
	document.getElementById('linklist').innerHTML = "";
	document.getElementById('navbar').innerHTML = "";
	
	linkstr = ""; // linklist html
	navbstr = ""; // navbar html
	for (i = 0; i < dataobj.d.length; i++) {
		navbstr += `<button data-pass="${dataobj.d[i].password}" id="tab_button${i}" onclick="switch_tab(${i})">${dataobj.d[i].title}</button>`
		if (dataobj.d.length <= 1) { //tabs
			document.getElementById("navbar").style.display = "none";
		} else {
			document.getElementById("navbar").style.display = "block";
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
	document.getElementById("navbar").innerHTML = navbstr;
	switch_tab(0);

	document.getElementById("color_bg").value = dataobj.s[0];
	document.getElementById("color_text").value = dataobj.s[1];
	document.getElementById("color_button").value = dataobj.s[2];
	document.getElementById("color_hover").value = dataobj.s[3];

	theme.setProperty('--c_bg', dataobj.s[0]);
	theme.setProperty('--c_text', dataobj.s[1]);
	theme.setProperty('--c_button', dataobj.s[2]);
	theme.setProperty('--c_hover', dataobj.s[3]);
}

function toggle_edit() {
	let editables = document.getElementsByClassName(`edit`);
	if (edit) {
		for (i = 0; i < editables.length; i++) {
			editables[i].style.display = "none";
		}
		edit = false;
		current_tab = 0;
		switch_tab(0);
		save(0);
	} else {
		for (i = 0; i < editables.length; i++) {
			editables[i].style.display = "block";
		}
		edit = true;
		current_tab = 0;
		switch_tab(0);
		load_editor();
	}
}

function load_editor() {
	document.getElementById('linklist').innerHTML = "";
	document.getElementById('navbar').innerHTML = "";
	document.getElementById("navbar").style.display = "block";

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
		navbstr += `<button data-pass="${dataobj.d[i].password}" id="tab_button${i}" onclick="switch_tab(${i})">${dataobj.d[i].title}</button>`

		linkstr += `<div id="tab${i}">`
		for (i2 = 0; i2 < dataobj.d[i].data.length; i2++) {
			linkstr += `<div>` // 
			if (i2 != 0) {
				linkstr += `<hr class="dragdisable" />` // add horizontal rule
			}
			linkstr += `<div>`
			for (i3 = 0; i3 < dataobj.d[i].data[i2].length; i3++) {
				linkstr += `<span class="edit_link" id="link${linkcount}" data-href="${dataobj.d[i].data[i2][i3].u}" data-name="${dataobj.d[i].data[i2][i3].n}" style="color: ${dataobj.d[i].data[i2][i3].c}; border-color: ${dataobj.d[i].data[i2][i3].c};">`;
				linkstr += `<span title="Click and drag to move the link">${dataobj.d[i].data[i2][i3].n}</span> <span class="editor_link_buttons"><button title="Delete link" onclick=delete_link('link${linkcount}')>X</button> `;
				linkstr += `<button title="Copy to bookmark editor" onclick=copy_link('link${linkcount}')>^</button></span></span>`;
				console.log(`Adding ${dataobj.d[i].data[i2][i3].n}`)
				//linkstr += `<a id="link${linkcount}" href="${dataobj.d[i].data[i2][i3].u}" style="color: ${dataobj.d[i].data[i2][i3].c}; border-color: ${dataobj.d[i].data[i2][i3].c};">${dataobj.d[i].data[i2][i3].n}</a>`
				linkcount++;
			}

			linkstr += `</div>`
			if (i2 != 0) {
				linkstr += `<button title="Delete section and its items" onclick="delete_section(${i2})" class="delete" style="display: block;" class="dragdisable">Delete Section</button>`
			}
			linkstr += `</div>`
		}

		linkstr += `</div>`
	}
	navbstr += `<button id="create_tab_button" onclick="create_tab()">+</button>`
	document.getElementById("linklist").innerHTML = linkstr;
	document.getElementById("navbar").innerHTML = navbstr;

	generate_sortables();

	switch_tab(current_tab);

	document.getElementById('save_data').value = data;

	document.getElementById("color_bg").value = dataobj.s[0];
	document.getElementById("color_text").value = dataobj.s[1];
	document.getElementById("color_button").value = dataobj.s[2];
	document.getElementById("color_hover").value = dataobj.s[3];
	
	let color_pickers = ["input_color","color_bg","color_text","color_button","color_hover"];
	if (dataobj.i.picker) {
		document.getElementById("color_picker_toggle").checked = true;
		for (let i = 0; i < color_pickers.length; i++) {
			document.getElementById(color_pickers[i]).type = "text";
			document.getElementById(color_pickers[i]).style = "";
		}
	} else {
		document.getElementById("color_picker_toggle").checked = false;
		for (let i = 0; i < color_pickers.length; i++) {
			document.getElementById(color_pickers[i]).type = "color";
			document.getElementById(color_pickers[i]).style = "height: 20px";
		}
	}

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
		s: ["#000000", "#dddddd", "#222222", "#333333"],
		i: {
			ver: dataobj.i.ver,
			picker: dataobj.i.picker
		}
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
	
	dataobj = newobj;

	console.log("-- 3 --");
	console.log(dataobj);
	data = JSON.stringify(dataobj);
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
	save(1);
}

function delete_link(siteid) {
	document.getElementById(siteid).remove();
}

function copy_link(siteid) {
	document.getElementById("input_name").value = document.getElementById(siteid).getAttribute('data-name');
	document.getElementById("input_url").value = document.getElementById(siteid).getAttribute('data-href');
	document.getElementById("input_color").value = rgba2hex(document.getElementById(siteid).style.color);
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

function switch_tab(tabid) { // switching to a new tab
	console.log(`tabid = ${tabid} --- current_tab = ${current_tab}`)
	console.log(`tabid == current_tab --- ${tabid == current_tab}`)
	// I forgot what this code segment was for but it was causing a bug.
	/*
	if (tabid == current_tab) {
		return;
	}*/
	
	if (document.getElementById(`tab_button${tabid}`).getAttribute('data-pass') && (tabid != current_tab)) {
		let passwordentry = prompt("Please enter the password:", "");
		if (passwordentry != document.getElementById(`tab_button${tabid}`).getAttribute('data-pass')) {
			return;
		}
	}
	current_tab = tabid;
	document.getElementById(`input_tab_name`).value = document.getElementById(`tab_button${tabid}`).innerHTML;
	document.getElementById(`input_tab_pass`).value = document.getElementById(`tab_button${tabid}`).getAttribute('data-pass');
	
	if (current_tab == 0) {
		document.getElementById(`input_tab_pass`).readOnly = true;
		document.getElementById(`input_tab_pass`).title = "The first tab cannot have a password";
	} else {
		document.getElementById(`input_tab_pass`).readOnly = false;
		document.getElementById(`input_tab_pass`).title = "Tab Password";
	}
	let tabcount = document.getElementById("linklist").childElementCount;
	for (i = 0; i < tabcount; i++) {
		document.getElementById("linklist").childNodes[i].style.display = "none";
	}
	document.getElementById(`tab${tabid}`).style.display = "block";
}

function change_tab() { // changing a tab's settings
	document.getElementById(`tab_button${current_tab}`).innerHTML = document.getElementById(`input_tab_name`).value;
	document.getElementById(`tab_button${current_tab}`).setAttribute('data-pass', document.getElementById(`input_tab_pass`).value)
	save(1);
}

function delete_tab() { 
	let tabcount = document.getElementById("linklist").childElementCount;
	if (tabcount == 1) {
		return;
	}
	document.getElementById(`tab${current_tab}`).remove();
	document.getElementById(`tab_button${current_tab}`).remove();
	switch_tab(0);
}

function create_tab() {
	let tabcount = document.getElementById("linklist").childElementCount;
	let tname = `Tab ${tabcount}`;
	document.getElementById("create_tab_button").remove();
	document.getElementById("linklist").innerHTML += `<div id="tab${tabcount}"><div><div></div></div></div>`;
	document.getElementById("navbar").innerHTML += `<button data-pass="" id="tab_button${tabcount}" onclick="switch_tab(${tabcount})">${tname}</button>`;
	save(1);
}

function applytheme() {
	c1 = document.getElementById("color_bg").value;
	c2 = document.getElementById("color_text").value;
	c3 = document.getElementById("color_button").value;
	c4 = document.getElementById("color_hover").value;

	dataobj.s[0] = c1;
	dataobj.s[1] = c2;
	dataobj.s[2] = c3;
	dataobj.s[3] = c4;

	save(1);
}

function applysettings() {
	if (document.getElementById("color_picker_toggle").checked) {
		dataobj.i.picker = true;
	} else {
		dataobj.i.picker = false;
	}

	save(1);
}

function delete_data() {
	let passwordentry = prompt("Are you sure you want to delete all data? This cannot be undone. Type 'delete' to confirm", "");
	if (passwordentry != "delete") {
		return;
	}
	localStorage.removeItem("data");
	document.body.innerHTML = `<h1>New Tab</h1>`
	document.body.innerHTML += `<p>Data Deleted. Refresh to restart.</p>`
}

function import_data() {
	let passwordentry = prompt("Are you sure you want to import and replace your data? This cannot be undone. Type 'import' to confirm", "");
	if (passwordentry != "import") {
		return;
	}
	console.log('Importing data...');
	data = document.getElementById('save_data').value;
	localStorage.setItem("data", data);
	update_data();
}