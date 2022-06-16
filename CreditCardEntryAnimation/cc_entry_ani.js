console.log('js loaded');
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var d = new Date();
console.log(d);
var currMonth = d.getMonth();
console.log(currMonth);
console.log( months[currMonth]);
var currYear = d.getFullYear();
console.log(currYear);

var yearList=[];
for(var i=0;i<20;i++){
	yearList[i] = currYear+i;
}

document.addEventListener("DOMContentLoaded", ready);

function ready(){
	console.log("dom Ready Event called");selected=
	document.getElementById("expMonth").selectedIndex = currMonth;
	var selectYear = document.getElementById("expYear");

	for (const val of yearList) {
		var option = document.createElement("option");
		option.value = (val % 100) + "";
		option.text = val;
		selectYear.appendChild(option);
	}
}
function replaceHolderText(event){
      document.getElementById("holdertext").innerHTML = document.getElementById("holdername").value;
}
function replaceExpiryText(event){
      document.getElementById("expirytext").innerHTML = document.getElementById("expMonth").value + '/'+ document.getElementById("expYear").value;
}
function replaceCC1Text(event){
      document.getElementById("cc1text").innerHTML = document.getElementById("cc1").value;
}
function replaceCC2Text(event){
      document.getElementById("cc2text").innerHTML = document.getElementById("cc2").value;
}
function replaceCC3Text(event){
      document.getElementById("cc3text").innerHTML = document.getElementById("cc3").value;
}
function replaceCC4Text(event){
      document.getElementById("cc4text").innerHTML = document.getElementById("cc4").value;
}
function replaceCCVText(event){
      document.getElementById("ccvtext").innerHTML = document.getElementById("ccv").value;
}
function displayBack() {
	document.getElementById("ccfront").style="display:none;";
	document.getElementById("ccback").style="display: ;";
}
function displayFront(){
	document.getElementById("ccfront").style="display:block;";
	document.getElementById("ccback").style="display:none;";
}
function flip(){
	document.getElementById('card').classList.toggle('flipped');
}

