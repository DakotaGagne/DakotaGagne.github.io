

var Star = function(x, y, r){
	this.x = x
	this.y = y
	this.r = r || 4
	this.col = 'white'
	this.alpha = 1

	this.render = function(){
		var size = this.r
		if(Math.random()>0.9999){
			size*=2
		}
		ctx.beginPath()
		ctx.globalAlpha = this.alpha
		ctx.arc(this.x + offsetX, this.y + offsetY, size, 0, 2*Math.PI)
		ctx.fillStyle = this.col
		ctx.fill()
		ctx.globalAlpha = 1
		ctx.closePath()
	}

}

var ShootingStar = function(x, y, r, dX, dY){
	this.star = new Star(x, y, r)
	this.dX = dX
	this.dY = dY
	this.render = function(){
		this.star.x+=this.dX
		this.star.y+=this.dY
		this.star.render()
		
		if(this.star.x > c.width + this.star.r*2 && this.dX > 0){
			return 'done'
		}
		if(this.star.x < -this.star.r*2 && this.dX < 0){
			return 'done'
		}
		return ''
	}
}

var Text = function(x, y, text, size=10, font='Arial', col='white', bold='400'){
	this.text = text
	this.bold = bold
	this.italic = 'normal'
	this.variant = 'normal'
	this.x = x
	this.y = y
	this.font = `${this.italic} ${this.variant} ${this.bold} ${size}px ${font}`
	this.size = size
	this.col = col
	this.altCol = '#13F6E9'
	this.alpha = 1
	this.selectable = false
	this.hover = false
	this.boxWidth = text.length * size * 0.8
	this.boxHeight = size * 1.2
	this.showHitbox = false
	this.link = ''
	this.render = function(){
		ctx.beginPath()
		ctx.globalAlpha = this.alpha
		ctx.font = this.font
		if(this.hover) ctx.fillStyle = this.altCol
		else ctx.fillStyle = this.col
		ctx.textAlign = 'center'
		ctx.fillText(this.text, this.x + offsetX*0.5, this.y + offsetY*0.5)
		if(this.showHitbox){
			ctx.strokeStyle = this.col
			ctx.rect(this.x-this.boxWidth/2 + offsetX*0.5, this.y-this.boxHeight/1.3 + offsetY*0.5, this.boxWidth, this.boxHeight)
			ctx.lineWidth = 3
			ctx.stroke()
			ctx.closePath()
		}
		ctx.globalAlpha = 1;
	}
}




