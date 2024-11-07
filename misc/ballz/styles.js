function menu(id){
	$("#rad").fadeOut(1);
	$("#soi").fadeOut(1);
	$("#col").fadeOut(1);
	$(id).fadeIn(1);
}//end of menu

function openMenu(){
	$("#menuClose").fadeOut(1);
	$("#options").fadeIn(1);
	menu("#rad");
}//end of open menu

function closeMenu(){
	$("#options").fadeOut(1);
	$("#menuClose").fadeIn(1);
}//end of close menu

function setRad(){
	var val = document.getElementById("txtRad").value;
	document.getElementById("txtRad").value = "";
	if(val>10){
		val = 10;
	} else if(val<1){
		val = 1;
	}//end of if else if
	R = parseFloat(val);
	init();
	document.getElementById("currentRad").innerHTML = "Currently, Radius is " + R;
}//end of setRad

function setSOI(){
	var val = document.getElementById("txtSOI").value;
	document.getElementById("txtSOI").value = "";
	if(val>200){
		val = 200;
	} else if(val<20){
		val = 20;
	}//end of if else if
	SOI = parseFloat(val);
	init();
	document.getElementById("currentSOI").innerHTML = "Currently, SOI is " + SOI;
}//end of setRad

function togRand(){
	if(RANDOM){
		RANDOM = false;
		document.getElementById("colRand").innerHTML = "Currently, random is disabled";
	} else {
		RANDOM = true;
		document.getElementById("colRand").innerHTML = "Currently, random is enabled";
	}//end of if else
	init();
}//end of function

function changeCol(){
	if(!RANDOM){
		init();
	}//end of if
}//end of changeCol
