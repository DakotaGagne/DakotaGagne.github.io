// elevens class
var Elevens=function(){
	var width = 800;
	var height = 300;
	var dip = new Deck(),
	SelectedCards = [],
	imgWidth=85
	
	c.addEventListener("click", (e)=>{
		  var x = e.x - c.offsetLeft + document.body.scrollLeft + document.documentElement.scrollLeft;
		  var y = e.y - c.offsetTop + document.body.scrollTop + document.documentElement.scrollTop;
		  if(y<=200 && y>=100) { // need to compensate these coordinates for scrolling
			  for (i=0;i<dip.getSize();i++){
				  if((x>=i*imgWidth+20)&& x<=((i+1)*imgWidth+20)){
					  if(dip.getCard(i).getValue()>0){
						  selected = false;
						  for(ii=0;ii<SelectedCards.length;ii++){
							  if(i===SelectedCards[ii]){
								selected = true;
								break;
							  }//end of if
						  }//end of for
						  if(selected)SelectedCards.splice(ii,1);
						  else SelectedCards.splice(ii,0,i);
						  dip.getCard(i).draw((i*imgWidth+20),100,!selected);	  
					  }
					  return;
				  }
			  }
		  }//end of if y
		})// end of GetPosition

	this.Setup = function(){
		/*
			-Privledged method to start the game
			-9 cards will be removed from deck and added to dip
			-draw each of the cards in dip on the elevens board 
		*/
		ctx.beginPath();
		ctx.fillStyle = "green";
		ctx.fillRect(0,0,c.width,c.height);
		ctx.closePath();
		d.shuffle();
		SelectedCards=[];
		for(i=0;i<9;i++){
			tc=d.deal();
			dip.addCard(tc,i);
			tc.draw((i*imgWidth+20),100,false);
		}//end of for
		document.getElementById("deckcnt").innerHTML = "Cards Left In Deck: " + d.getSize();
	}// end of Setup
	
	
	this.checkWin=()=>{
		if(d.isEmpty){
			for(i=0;i<dip.getSize();i++)if(dip.getCard(i).getValue()>0)return false
			return true
		}
	}// end of checkWin
	this.makeMove=function(){
		SelectedCards.forEach(elem=>{
			dip.removeCard(elem);
			if(!d.isEmpty()){
				tc = d.deal();
				dip.addCard(tc,elem);
				tc.draw((elem*imgWidth+20),100,false)
			} else {
				dip.addCard(new Card("","",0,"",""),elem);
				ctx.beginPath();
				ctx.fillStyle = "green";
				ctx.fillRect(elem*imgWidth+20,0,imgWidth,height);
				ctx.closePath();
			}//end of if else
		})//end of forEach
		SelectedCards=[];
		document.getElementById("deckcnt").innerHTML = "Cards Left In Deck: " + d.getSize();
	} // end of makeMove
	
	this.isLegal=()=>{
		len = SelectedCards.length
		return len==2&&containsSum11(SelectedCards)||len==3&&containsJQK(SelectedCards);
	} // end of isLegal
	
	var containsSum11=card=>((dip.getCard(card[0]).getValue()+dip.getCard(card[1]).getValue())==11)
	
	var containsJQK=card=>{
		q=k=j=false
		card.forEach(elem=>{
			rank=dip.getCard(elem).getRank()
			if(rank=="j")j=true
			if(rank=="q")q=true
			if(rank=="k")k=true
		})
		return j&&q&&k
	}
	
	
	this.anotherPlayIsPossible=()=>(Sum11Exists(dip)||JQKExists(dip));
	
	var Sum11Exists=dip=>{
		for(i=0;i<dip.getSize();i++){
			for(j=0;j<dip.getSize();j++){
				if((dip.getCard(i).getValue()+dip.getCard(j).getValue())==11){
					return true;
				}
			}
		}
		return false;
	}

	var JQKExists=dip=>{
		fJ=fQ=fK=false;
		for(i=0;i<dip.getSize();i++){
			if(dip.getCard(i).getRank() == "j")fJ = true;
			if(dip.getCard(i).getRank() == "q")fQ = true;
			if(dip.getCard(i).getRank() == "k")fK = true;
		}//end of for
		return fJ&&fQ&&fK;
	}

	this.emptyDeck=function(){
		while(!d.isEmpty())d.removeCard(0);
		document.getElementById("deckcnt").innerHTML="Cards Left In Deck: " + d.getSize();
	}//end of emptyDeck
}// end of elevens constructor
