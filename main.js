
var defFont = 'Trebuchet MS'
var defColour = '#BAFF00'
var offsetX = 0;
var offsetY = 0;
var maxTravel = 50;
var starDensity = 0.25;
var displayMode='SplashScreen'
var c,ctx,stars,updateTimer;

var fps = 60
var fadeTime = 1
var SplashScreen = []
var Menu = []
var Misc = []
var defColourGrad
var textGrad = ['#BAFF00', '#011601']
// var textGrad = ['red', 'blue']


function init(){
	c = getElem('canvas')
	ctx = c.getContext('2d')
	if(window.innerHeight>window.innerWidth){
		c.height = 1920
		c.width = window.innerWidth/window.innerHeight*c.height
	} else {
		c.width = 1920
		c.height = window.innerHeight/window.innerWidth*c.width
	}
	gradSize = [-c.width, c.width]
	defColourGrad = ctx.createLinearGradient(0,0,c.width,0)
	textGrad.forEach((elem, index)=>{
		defColourGrad.addColorStop(index/(textGrad.length-1), elem)
	})
	generateGalaxy()
	updateTimer = setInterval(update,1000/fps)
	generateSplashScreen()
	generateMenu()
	generateMisc()
}


function generateSplashScreen(){
	SplashScreen = []
	SplashScreen.push(new Text((canvas.width-maxTravel)/2, canvas.height*0.3, 'Stryker Games', 100, defFont, defColourGrad, 'bold'))
	SplashScreen.push(new Text((canvas.width-maxTravel)/2, canvas.height*0.5, 'Enter', 60, defFont, defColourGrad))
	SplashScreen[1].selectable = true
}

function generateMenu(){
	Menu = []
	Menu.push(new Text((c.width-maxTravel)*0.5, c.height*0.2, ' Machine Learning ', 100, defFont, defColourGrad, 'bold'))
	Menu.push(new Text((c.width-maxTravel)*0.35, c.height*0.35, ' Misc ', 90, defFont, defColourGrad, 'bold'))
	Menu.push(new Text((c.width-maxTravel)*0.65, c.height*0.35, ' About ', 90, defFont, defColourGrad, 'bold'))
	Menu.push(new Text((c.width-maxTravel)*0.50, c.height*0.5, ' Back ', 60, defFont, defColourGrad))
	Menu.forEach(elem=>{
		elem.selectable = true
		if(displayMode!='Menu')elem.alpha = 0
	})
}

function generateMisc(){
	Misc = []
	Misc.push(new Text((c.width-maxTravel)*0.35, c.height*0.2, 'Ballz', 80, defFont, defColourGrad, 'bold'))
	Misc[0].link = './misc/ballz'
	Misc.push(new Text((c.width-maxTravel)*0.65, c.height*0.2, 'Tetris', 80, defFont, defColourGrad, 'bold'))
	Misc[1].link = './misc/tetris'
	Misc.push(new Text((c.width-maxTravel)*0.35, c.height*0.35, 'Elevens', 80, defFont, defColourGrad, 'bold'))
	Misc[2].link = './misc/elevens'
	Misc.push(new Text((c.width-maxTravel)*0.65, c.height*0.35, 'Shooter', 80, defFont, defColourGrad, 'bold'))
	Misc[3].link = './misc/TopDownShooter'
	Misc.push(new Text((c.width-maxTravel)*0.5, c.height*0.5, 'Back', 60, defFont, defColourGrad))
	Misc.forEach(elem=>{
		if(displayMode!='Misc')elem.alpha=0
		elem.selectable = true
	})
}

function generateGalaxy(){
	stars = []
	var starCnt = (c.width+maxTravel)*(c.height+maxTravel)*(starDensity**2/100)
	for(i=0; i<starCnt; i++){
		x = randRange(c.width+3*maxTravel, -maxTravel)
		y = randRange(c.height+3*maxTravel, -maxTravel)
		r = randRange(4, 1)
		stars.push(new Star(x, y, r))
	}

}

function randRange(h,l=0){ return Math.floor(Math.random()*h)+l }

var shootingStars = []
function update(){
	ctx.clearRect(0,0,c.width,c.height)
	renderGrad()
	stars.forEach(star=>star.render())
	
	shootingStars.forEach((elem, index)=>{
		if(elem.render() == 'done'){
			shootingStars.splice(index,1)
		}
	})
	if(displayMode=='SplashScreen' || displayMode=='SplashToMenu' || displayMode=='MenuToSplash')SplashScreen.forEach(elem=>elem.render())
	if(displayMode=='Menu' || displayMode=='SplashToMenu' || displayMode=='MenuToSplash' || displayMode=='MenuToMisc' || displayMode=='MiscToMenu')Menu.forEach(elem=>elem.render())
	if(displayMode=='Misc' || displayMode=='MenuToMisc' || displayMode=='MiscToMenu')Misc.forEach(elem=>elem.render())
	checkDisplayMode()
	
}

var gradSpd = 5
var gradDir = 1
var gradient = ['#110126','#1C0038', '#5F005C','#9C025D','#5F005C','#010C36','#110126']
var gradSize

function renderGrad(){
	var grd = ctx.createLinearGradient(gradSize[0], gradSize[0], gradSize[1], gradSize[1])
	gradient.forEach((elem, index)=>{
		grd.addColorStop(index/(gradient.length-1), elem)
	})
	ctx.beginPath()
	ctx.fillStyle = grd
	ctx.fillRect(0,0,c.width,c.height)
	ctx.closePath()
	var pChg = gradDir * c.width/(fps*gradSpd)
	gradSize[0] += pChg
	gradSize[1] += pChg
	if(gradSize[0]>=0){
		gradSize[0]=0
		gradDir = -1
	} else if(gradSize[1]<=c.width){
		gradSize[1]=c.width
		gradDir = 1
	}
}

function generateShootingStar(){
	var rand = Math.random()
	if(rand>=0.5){
		var x = -maxTravel
		var y = randRange(c.height+maxTravel, -maxTravel)
		var dX = randRange(20, 8)
		var dY = randRange(10, -10)
	} else{
		var x = maxTravel+c.width
		var y = randRange(c.height+maxTravel, -maxTravel)
		var dX = -randRange(20, 8)
		var dY = randRange(10, -10)
	}
	var r = randRange(4, 1)
	shootingStars.push(new ShootingStar(x, y, r, dX, dY))
}

document.addEventListener('mousemove',e=>{
	offsetX = (window.innerWidth-e.clientX)/window.innerWidth*maxTravel-maxTravel/2
	offsetY = (window.innerHeight-e.clientY)/window.innerHeight*maxTravel-maxTravel/2
	mouseX = e.clientX/window.innerWidth*c.width
	mouseY = e.clientY/window.innerHeight*c.height
	checkHovers()
})

document.addEventListener('touchmove',e=>{
	mouseX = e.touches[0].clientX/window.innerWidth*c.width
	mouseY = e.touches[0].clientY/window.innerHeight*c.height
	checkHovers()
})

document.addEventListener('touchstart',e=>{
	mouseX = e.touches[0].clientX/window.innerWidth*c.width
	mouseY = e.touches[0].clientY/window.innerHeight*c.height
	checkHovers()
})


function checkHovers(){
	if(displayMode == 'SplashScreen'){
		checkHover(SplashScreen)
	} else if(displayMode == 'Menu'){
		checkHover(Menu)
	} else if(displayMode == 'Misc'){
		checkHover(Misc)
	}
}

function checkHover(arr){
	arr.forEach(elem=>{
		if(elem.selectable){
			var xDist = Math.abs(elem.x-mouseX)
			var yDist = Math.abs(elem.y-mouseY)
			if(xDist <= elem.boxWidth/2 && yDist <= elem.boxHeight/2){
				elem.hover = true
			} else {
				elem.hover = false
			}
		}
	})
}

document.addEventListener('click', e=>{
	mouseX = e.clientX/window.innerWidth*c.width
	mouseY = e.clientY/window.innerHeight*c.height
	checkCols()
})

document.addEventListener('touchend', e=>{
	checkCols()
})

function checkCols(){
	if(displayMode == 'SplashScreen'){
		checkSelect(SplashScreen, 'SplashToMenu')
	} else if(displayMode == 'Menu'){
		checkSelect(Menu, 'Menu', false)
	} else if(displayMode=='Misc'){
		checkSelect(Misc, 'Misc', false)
	}
	generateShootingStar()
}

function checkSelect(arr, nextMode, modeCertain=true){
	arr.forEach((elem, index)=>{
		if(elem.selectable){
			var xDist = Math.abs(elem.x-mouseX)
			var yDist = Math.abs(elem.y-mouseY)
			if(xDist <= elem.boxWidth/2 && yDist <= elem.boxHeight/2){
				if(modeCertain){
					displayMode = nextMode
				} else {
					if(nextMode=='Menu'){
						switch(index){
							case 0: /*displayMode='MenuToML'*/alert('Coming Soon...'); break
							case 1: displayMode='MenuToMisc'; break
							case 2: /*displayMode='MenuToAbout'*/alert('Coming Soon...'); break
							case 3: displayMode='MenuToSplash'; break
							default: alert('Unknown Index in Menu array, add it to checkSelect()')
						}
					} else if(nextMode=='Misc'){
						if(index==arr.length-1){
							displayMode = 'MiscToMenu'
						} else {
							window.location.href = elem.link
						}
					}
				}
			}
		}
	})
}



function getElem(elem){ return document.getElementById(elem) }


function checkDisplayMode(){
	if (displayMode == 'SplashToMenu' || displayMode == 'MenuToSplash') {
		faded = true
		var dir = 1
		var newDisp = 'Menu'
		if(displayMode=='MenuToSplash')dir = -1, newDisp = 'SplashScreen'
		SplashScreen.forEach(elem=>{
			elem.alpha-=dir/(fps*fadeTime)
			if(elem.alpha<=0 && dir==1)elem.alpha = 0
			else if(elem.alpha>=1 && dir==-1)elem.alpha = 1
			else faded = false
		})
		Menu.forEach(elem=>{
			elem.alpha+=dir/(fps*fadeTime)
			if(elem.alpha<=0 && dir==-1)elem.alpha = 0
			else if(elem.alpha>=1 && dir==1)elem.alpha = 1
			else faded = false
		})
		if(faded)displayMode = newDisp
	} else if(displayMode=='MenuToMisc' || displayMode=='MiscToMenu'){
		faded = true
		var dir = 1
		var newDisp = 'Misc'
		if(displayMode=='MiscToMenu')dir = -1, newDisp = 'Menu'
		Misc.forEach(elem=>{
			elem.alpha+=dir/(fps*fadeTime)
			if(elem.alpha<=0 && dir==-1)elem.alpha = 0
			else if(elem.alpha>=1 && dir==1)elem.alpha = 1
			else faded = false
		})
		Menu.forEach(elem=>{
			elem.alpha-=dir/(fps*fadeTime)
			if(elem.alpha<=0 && dir==1)elem.alpha = 0
			else if(elem.alpha>=1 && dir==-1)elem.alpha = 1
			else faded = false
		})
		if(faded)displayMode = newDisp
	} 
}

