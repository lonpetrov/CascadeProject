let counter = 0;
let debugMode = true;
let color = "#000000";

function Debugging(note, color) {
	if (debugMode) {
		counter++;
		let newElem = document.createElement("h4");
		const text = document.createTextNode(counter + ': ' + note);
		newElem.appendChild(text);
		newElem.style.color = color;
		document.body.appendChild(newElem);
	}
}