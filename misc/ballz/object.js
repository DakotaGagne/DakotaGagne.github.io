//Object Js
var Ball = function(x,y,r,col = black){
	this.x = canvas.width/2;
	this.y = canvas.height/2;
	this.r = r;
	this.color = col;
	this.xAbs = x;
	this.yAbs = y;
	this.speed = 3;
	this.init = true;
	
	
	this.draw = function(){//Used to draw circle on page
		var canvas = document.getElementById("canvas");
		var ctx = canvas.getContext("2d");
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.closePath();
	}//end of draw
	
	this.update = function(){
		if(this.x>Mouse.x-Mouse.r && this.x<Mouse.x+Mouse.r && this.y>Mouse.y-Mouse.r){
			var dx = Mouse.x - this.x;
			var dy = Mouse.y - this.y;
			var L = Math.sqrt(dx*dx+dy*dy);
			var step = this.r + Mouse.r - L;
			if(step>0 && !(L==0)){
				dx /= L;
				dy /= L;
				this.x-=dx*step;
				this.y-=dy*step;
			}//end of if
		}//end of if
		
		if(EXPLOSION){
		 	dx = this.x-Mouse.x;
			dy = this.y-Mouse.y;
			if(dx<0){
				var xdir = -1;
				dx*=-1;
			} else {
				var xdir = 1;
			}//end of if else
			if(dy<0){
				var ydir = -1;
				dy*=-1;
			} else {
				var ydir = 1;
			}//end of if else
			
			L = Math.sqrt(dx*dx+dy*dy);
			var angle = Math.atan(dy/dx);
			this.x += xdir*(Math.cos(angle)*(this.speed*(L*0.1)));
			this.y += ydir*(Math.sin(angle)*(this.speed*(L*0.1)));
		}//end of if 
		
		dx = Mouse.x-this.x;
		dy = Mouse.y-this.y;
		L = Math.sqrt(dx*dx+dy*dy);
		
		if(L>(Mouse.r+6)){
			this.init = "false";
			
			
			if(this.x === this.xAbs){
			} else if(this.x<this.xAbs){
				this.x+=this.speed*((this.xAbs-this.x)/50);
			} else {
				this.x-=this.speed*((this.x-this.xAbs)/50);
			}//end of if else

			if(this.y == this.yAbs){
			} else if(this.y<this.yAbs){
				this.y+=this.speed*((this.yAbs-this.y)/50);
			} else {
				this.y-=this.speed*((this.y-this.yAbs)/50);
			}//end of if else
		}//end of if
		
		this.draw();
	}//end of update
}//end of Ball