//Main Js
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var BALLZARR = [];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var XMIN = (canvas.width*0.2);
var XMAX = (canvas.width*0.8);
var YMIN = (canvas.height*0.2);
var YMAX = (canvas.height*0.8);
var X = XMIN;
var Y = YMIN;
var R = 7;
var COL = "";
var SOI = 80;
var Mouse = new Ball(-100,-100,SOI,"white");
var LOAD = false;
var RANDOM = true;
var EXPLOSION = false;

function init(){
	BALLZARR.length = 0;
	if(!LOAD){
		closeMenu();
		$( "#drag" ).draggable();
	}//end of if
	LOAD = true;
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	XMIN = (canvas.width*0.2);
	XMAX = (canvas.width*0.8);
	YMIN = (canvas.height*0.2);
	YMAX = (canvas.height*0.8);
	X = XMIN;
	Y = YMIN;
	
	var i;
	var spacing;
	Mouse.r = SOI;
	if(R===1){
		spacing = 5;
	} else if(R===2){
		spacing = 4;
	} else if(R===3){
		spacing = 2;
	} else if(R<5){
		spacing = 1;
	} else {
		spacing = 0;
	}//end of if else
	
	for(i=0;Y<YMAX;i++){
		if(RANDOM === true){
			COL = getColor();
		} else {
			COL = document.getElementById("colPick").value;
		}//end of if else
		BALLZARR[i] = new Ball(X,Y,R,COL);
		X+=(R*2+spacing);
		if(X>XMAX){
			X=XMIN;
			Y+=(R*2+2);
		}//end of if
	}//end of for
	Mouse.x = -100;
	Mouse.y = -100;
}//end of init

function getColor(){
	var hex = ["0","1","2","3" ,"4","5","6","7","8","9","0","A","B","C","D","E","F"];
	var color = ["#"];
	var i;
	for(i=1;i<=6;i++){
		color[i] = hex[randomFromInterval(hex.length,1)];
	}//end of for
	return color.join("");
}//end of getColor

function randomFromInterval(high, low){// start of RandomFromInterval
	/*
	INPUTS
		int high- highest allowed value
		int low- lowest allowed value
	OUTPUTS
		A random number within parameters to be used as the number user has to guess
	*/
	return Math.floor(Math.random()*(high-low))+low;
}//end of RandomFromInterval

function animate(){
	requestAnimationFrame(animate);
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var i;
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.beginPath();
	ctx.rect(XMIN-15,YMIN-15,(XMAX+10)-(XMIN-15),(YMAX+10)-(YMIN-15));
	ctx.fillStyle = "white";
	ctx.fill();
	ctx.closePath();
	drawBox();
	//colorBack();
	for(i=0;i<BALLZARR.length;i++){
		BALLZARR[i].update();
	}//end of for
}//end of animate

function drawBox(){
	ctx.beginPath();
	ctx.moveTo(XMIN-15,YMIN-15);
	ctx.lineTo(XMAX+10,YMIN-15);
	ctx.lineTo(XMAX+10,YMAX+10);
	ctx.lineTo(XMIN-15,YMAX+10);
	ctx.lineTo(XMIN-15,YMIN-15);
	ctx.lineWidth = 5;
	ctx.stroke();
	ctx.closePath();
}//end of function

function clicked(){
    var menu = document.getElementById("wrapper").getBoundingClientRect();
    if(!EXPLOSION && !(Mouse.x>=menu.left && Mouse.x<=menu.right && Mouse.y>=menu.top && Mouse.y<=menu.bottom)){
		EXPLOSION = true;
		window.setTimeout(function(){EXPLOSION=false;},1000);
	}//end of if
}//end of function


window.addEventListener('mousemove', function(event) {
    Mouse.x = event.clientX;
    Mouse.y = event.clientY - canvas.offsetTop + window.scrollY;
});
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});



animate();



