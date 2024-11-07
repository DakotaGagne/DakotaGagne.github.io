function loaded(){
	c = document.getElementById("elevens");
	c.width=800;
	c.height=500;
	ctx=c.getContext("2d");
	// need a Deck of 52 shuffled cards
	var mCards=[], suit, rank, value, src, selectedSrc;
	SelectedCards=[];
	suits = ["hearts", "diamonds", "clubs", "spades"]
	suits.forEach(elem=>{
		suit=elem;
		for(j=1;j<=13;j++){ // a-10, j,q,k
			switch(j){
				case 1:
					rank="a";
					value=1;
					src="ace"+suit+".gif";
					selectedSrc="ace"+suit+"S.gif";
					break;
				case 11:
					rank="j";
					value=11;
					src="jack" + suit + ".gif";
					selectedSrc="jack" + suit + "S.gif";
					break;
				case 12:
					rank="q";
					value=11;
					src="queen" + suit + ".gif";
					selectedSrc="queen" + suit + "S.gif";
					break;
				case 13:
					rank="k";
					value=11;
					src="king" + suit + ".gif";
					selectedSrc="king" + suit + "S.gif";
					break;
				default:
					rank=j; // need to switch to string value
					value=j;
					src=rank+suit+".gif";
					selectedSrc=rank+suit+"S.gif";
					break;
				}
		src="cards/" + src;
		selectedSrc="cards/"+selectedSrc;
		var nCard=new Card(rank,suit,value,src,selectedSrc);
		mCards.push(nCard);
		}//end of for
	})
	console.log(mCards)
	d=new Deck(mCards);
	e=new Elevens();
	e.Setup();
	if (!e.anotherPlayIsPossible())restart()
}// end of loaded

function replace(){
	if(e.isLegal()){
		e.makeMove();
		if(e.checkWin())document.getElementById("deckcnt").innerHTML="You Win! Press Restart Or Reload Page To Play Again!"
		else if (!e.anotherPlayIsPossible())document.getElementById("deckcnt").innerHTML="No More Moves. Better Luck Next Time!";
		return
	}
	alert("Illegal Move");
}//end of replace

restart=()=>window.location.reload()
 