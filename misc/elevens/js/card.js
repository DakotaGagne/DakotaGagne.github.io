function Card(rank, suit, value, src, selSrc){
	var rank = rank; //rank of card(a,2-10,j,q,k)
	var suit = suit; //suit of card(hearts,clubs,diamonds,spades)
	var value = value; //value of card(1-10,0,0,0)
	var src = src; // image source
	var selSrc = selSrc; // image source when selected
	this.getRank=()=>rank;
	this.getSuit=()=>suit;
	this.getValue=()=>value;
	this.setRank=r=>rank=r;
	this.setSuit=s=>suit=s;
	this.setValue=v=>value=v;
	var img=new Image();
	this.draw=function(x,y,sel){
		if(sel)img.src=selSrc
		else img.src=src
		img.onload=()=>ctx.drawImage(img,x,y);
	}// end of draw
}// end of Card Constructor