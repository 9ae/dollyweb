function show(acorn){
	document.getElementById("infoCell").innerHTML = document.getElementById(acorn).innerHTML;
}

function clearField(thefield){
	if (thefield.defaultValue == thefield.value) 
		thefield.value = "";
}

function toggleConst(){
	if(document.getElementsByName("Constraints")[0].checked) allConstraints();
	else nullConstraints();
}
