function Deck(cards=[]){
	var cards = cards;
	var i,tc,r;
	this.shuffle=()=>cards=cards.reduce((a,v)=>a.splice(Math.floor(Math.random()*a.length),0,v)&&a,[])
	this.getCard=i=>cards[i]
	this.getSize=()=>cards.length
	this.isEmpty=()=>cards.length==0
	this.removeCard=i=>cards.splice(i,1)
	this.addCard=(card,i)=>cards.splice(i,0,card);
	this.deal=()=>cards.shift()
}// end of Deck constructor

var random=(h,l)=>Math.floor(Math.random()*h)+l