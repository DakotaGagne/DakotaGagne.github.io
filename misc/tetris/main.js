
//Game critical vars
var resumeTimer = 3000
var gameState = 'paused'
var highscore
var score
var prevLine = [0,0]
var combo
var comboCount
var lastLinesCleared
var mobile
var buttons
var delays = [1000,800,600,500,400,300,200,175,150,125,90]
var level
var lines
var lineCnt = [0, 1, 3, 5, 8]
var scores = [0, 100, 300, 500, 800]
var currTime
var msgTimeout
var board = {
	width: 10,
	height: 24,
	squareSize: 0
}

var groundCol
var grid
var staticGrid = []
var currBlock
var ghostBlock
var blockBag
var heldBlock = ''
var holdAllowed = true
var floorKickAllowed = true

//Game Style vars
var gridLineCol = '#670EB9'
var gridBackCol = '#19032C'
var gridBorderCol = '#937393'
var backGroundCol = '#33033D'
var lineWidth = 2
var borderSize


function renderGameArea(){
	//Reset All
	ctx.beginPath()
	ctx.fillStyle = backGroundCol
	ctx.fillRect(0,0,c.width, c.height)
	ctx.closePath()
	//Reset Area
	ctx.beginPath()
	ctx.strokeStyle = gridBorderCol
	ctx.lineWidth = borderSize
	ctx.rect(gameArea[0], gameArea[1], gameArea[2], gameArea[3])
	ctx.stroke()
	ctx.closePath()
	renderGrid()
	renderNext()
	renderHold()
	requestAnimationFrame(renderGameArea)
}

var keys = {
	left: ['a','arrowleft','j'],
	right: ['d','arrowright','l'],
	down: ['s','arrowdown','k'],
	rotate: ['w','arrowup','i'],
	hold: ['e','h','o', 'control'],
	slam: ['x', ',', ' '],
	pause: ['escape', 'p']
}
var keyPressed = {
	left: false,
	right: false,
	down: false,
	rotate: false,
	hold: false,
	slam: false,
	pause: false
}

var touch = {x: 0, y: 0}
var touching = false
var touchMoved = false
var touchEnabled = false
document.addEventListener('touchstart', e=>{
	touch.x = e.touches[0].clientX
	touch.y = e.touches[0].clientY
	touching = true
	touchMoved = false
	touchEnabled = true
	if(checkColHold(touch.x, touch.y)&&holdAllowed)holdBlock(), holdAllowed=false
})

document.addEventListener('mousedown', e=>{
	if(!touching){
		touch.x = e.clientX
		touch.y = e.clientY
		touching = true
		touchMoved = false
		if(checkColHold(touch.x, touch.y)&&holdAllowed)holdBlock(), holdAllowed=false
	}
})

document.addEventListener('touchend',  e=>{
	if(!touchMoved)moveBlock('rotate')
	touching=false
})

document.addEventListener('mouseup', e=>{
	if(!touchEnabled){
		if(!touchMoved)moveBlock('rotate')
		touching=false
	}
})

document.addEventListener('touchmove', e =>touchMove(e.touches[0].clientX, e.touches[0].clientY, 2))
document.addEventListener('mousemove', e =>touchMove(e.clientX, e.clientY, 2))

function touchMove(x, y, sensitivity){
	if(touching){
		if(x-touch.x>board.squareSize*sensitivity){
			var origX = currBlock.origin[1]
			moveBlock('right')
			if(origX!=currBlock.origin[1])touch.x+=board.squareSize,touchMoved = true
		} else if(touch.x-x>board.squareSize*sensitivity){
			var origX = currBlock.origin[1]
			moveBlock('left')
			if(origX!=currBlock.origin[1])touch.x-=board.squareSize,touchMoved = true
		}

		if(y-touch.y>board.squareSize*3*sensitivity){
			moveBlock('slam')
			touch.y+=board.squareSize*3*sensitivity
			touching=false
			touchMoved = true
		} else if(y-touch.y>board.squareSize*sensitivity){
			moveBlock('down')
			touch.y+=board.squareSize
			touchMoved = true
		}
	}
}

document.addEventListener('keyup',e=>{
	key = e.key.toLowerCase()
	keys.left.forEach(k=>{if(k==key)keyPressed.left=false})
	keys.right.forEach(k=>{if(k==key)keyPressed.right=false})
	keys.down.forEach(k=>{if(k==key)keyPressed.down=false})
	keys.rotate.forEach(k=>{if(k==key)keyPressed.rotate=false})
	keys.hold.forEach(k=>{if(k==key)keyPressed.hold=false})
	keys.slam.forEach(k=>{if(k==key)keyPressed.slam=false})
	keys.pause.forEach(k=>{if(k==key)keyPressed.pause=false})

})

document.addEventListener('keydown',e=>{
	key = e.key.toLowerCase()
	if(gameState == 'normal'){
		keys.left.forEach(k=>{if(k==key&&!keyPressed.left)keyPressed.left=true, moveBlock('left')})
		keys.right.forEach(k=>{if(k==key&&!keyPressed.right)keyPressed.right=true, moveBlock('right')})
		keys.down.forEach(k=>{if(k==key&&!keyPressed.down)keyPressed.down=true})
		keys.rotate.forEach(k=>{if(k==key&&!keyPressed.rotate)keyPressed.rotate=true, moveBlock('rotate')})
		keys.hold.forEach(k=>{if(k==key&&!keyPressed.hold&&holdAllowed)keyPressed.hold=true, holdBlock(), holdAllowed=false})
		keys.slam.forEach(k=>{if(k==key&&!keyPressed.slam)keyPressed.slam=true, moveBlock('slam')})
	}
	keys.pause.forEach(k=>{
		if(k==key&&!keyPressed.pause){
			keyPressed.pause=true
			if(gameState=='normal')pause()
			else if(gameState=='paused')resume()
		}
	})

})

function renderGrid(){
	if(gameState=='normal'){
		var Delay = delays[level]
		if(keyPressed.down)Delay = delays[delays.length-1]
		if(Date.now()-currTime>=Delay){
			currTime=Date.now()
			moveBlock('down')
		}
		generateGrid()
		createGhost()
		placeBlock()
	} else if(gameState=='gameOver'){
		var text = 'Gameover'
		if(score>highscore)clearTimeout(msgTimeout),text='Highscore!!', localStorage.setItem('highscore',score)
		textList.message.content = text

		gameState = 'delayed'
		setTimeout(init, 3000)
	}
	
	var size = board.squareSize
	grid.forEach((y,i)=>{
		y.forEach((x,ii)=>{
			var l = ii * size
			var t = i * size
			ctx.beginPath()
			ctx.strokeStyle = gridLineCol
			ctx.lineWidth = lineWidth
			ctx.rect(l+gameArea[0],t+gameArea[1],size,size)
			if(x[0]!=0)ctx.fillStyle = x[1]
			else ctx.fillStyle = gridBackCol
			ctx.fill()
			ctx.stroke()
			ctx.closePath()
		})
	})
	renderText()
}


function renderNext(){
	if(mobile){
		var scale = 0.8
		var W = Math.round(board.squareSize*4*scale)
		var X = Math.round(c.width * 0.05)
		var Y = Math.round(gameArea[1])
	} else {
		var scale = 0.7
		var X = Math.round(gameArea[0] + gameArea[2] + c.width * 0.05)
		var Y = Math.round(c.height * 0.2)
		var W = Math.round(board.squareSize*4*scale)
	}
	var nextGrid = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]
	for(var y=0; y<blockBag[0].shape.length;y++){
		for(var x=0; x<blockBag[0].shape.length;x++){
			nextGrid[y][x] = blockBag[0].shape[y][x]
		}
	}
	ctx.beginPath()
	ctx.strokeStyle = gridBorderCol
	ctx.lineWidth = borderSize
	ctx.rect(X,Y,W,W)
	ctx.stroke()
	ctx.closePath()
	nextGrid.forEach((y,i)=>{
		y.forEach((x,ii)=>{
			ctx.beginPath()
			ctx.strokeStyle = gridLineCol
			ctx.fillStyle = blockBag[0].color
			ctx.lineWidth = lineWidth
			if(x==0)ctx.fillStyle=gridBackCol
			ctx.rect(X+board.squareSize*ii*scale,Y+board.squareSize*i*scale,board.squareSize*scale,board.squareSize*scale)
			ctx.fill()
			ctx.stroke()
			ctx.closePath()
		})
		
	})
	textList.next.x = X + W/2
	textList.next.y = Y + W*1.6
}

function checkColHold(x, y){
	var W = Math.round(board.squareSize * 4 * holdScale)
	if(mobile){
		var X = Math.round(c.width * 0.05)
		var Y = Math.round(c.height * 0.37)	
	} else {
		var X = Math.round(gameArea[0] - W - c.width * 0.05)
		var Y = Math.round(c.height * 0.2)
	}
	return x>=X&&x<=X+W&&y>=Y&&y<=Y+W
}

var holdScale = 0.8
function renderHold(){
	if(mobile){
		var W = Math.round(board.squareSize * 4 * holdScale)
		var X = Math.round(c.width * 0.05)
		var Y = Math.round(c.height * 0.37)
	} else {
		holdScale = 0.7
		var W = Math.round(board.squareSize * 4 * holdScale)
		var X = Math.round(gameArea[0] - W - c.width * 0.05)
		var Y = Math.round(c.height * 0.2)
	}
	var holdGrid = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]
	if(heldBlock!=''){
		for(var y=0; y<heldBlock.shape.length;y++){
			for(var x=0; x<heldBlock.shape.length;x++){
				holdGrid[y][x] = heldBlock.shape[y][x]
			}
		}
	}
	ctx.beginPath()
	ctx.strokeStyle = gridBorderCol
	ctx.lineWidth = borderSize
	ctx.rect(X,Y,W,W)
	ctx.stroke()
	ctx.closePath()
	holdGrid.forEach((y,i)=>{
		y.forEach((x,ii)=>{
			ctx.beginPath()
			ctx.strokeStyle = gridLineCol
			ctx.fillStyle = heldBlock.color
			ctx.lineWidth = lineWidth
			if(x==0)ctx.fillStyle=gridBackCol
			ctx.rect(X+board.squareSize*ii*holdScale,Y+board.squareSize*i*holdScale,board.squareSize*holdScale,board.squareSize*holdScale)
			ctx.fill()
			ctx.stroke()
			ctx.closePath()
		})
	})
	textList.hold.x = X + W/2
	textList.hold.y = Y + W*1.6
}


function pause(){
	clearTimeout(resumeDelay)
	gameState = 'paused'
	for(var i=0;i<5;i++){
		buttons[i].style.visibility = 'visible'
	}
}

var resumeDelay
function resume(){
	gameState='normal'
	for(var i=0;i<5;i++){
		buttons[i].style.visibility = 'hidden'
	}
}

function toggleExtra(){
	if(extraBlocks){
		extraBlocks=false
		getElem('extraBlocks').innerHTML = 'Extra Blocks: Off'
	} else {
		extraBlocks=true
		getElem('extraBlocks').innerHTML = 'Extra Blocks: On'
	}
}


var getElem = elem=>document.getElementById(elem)