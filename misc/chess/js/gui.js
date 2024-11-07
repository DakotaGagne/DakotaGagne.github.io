/*------------------------------

	Handles anything related
	to the gui


------------------------------*/
/*
TO DO
? - flipped board
Improve gui
	- needs better resizing and adjectment of non board elements
	- board needs to be tweaked a bit more
blacks movement detection is buggy, and nothing is adapted for a board flip
make attacks toggleable and moves
*/

	//dark: "#786453",
	//light: "#e8bd99"


// Tile Color Object
var tileCol = {}
tileCol.dark = {};
tileCol.light = {};
tileCol.dark.def = "#786453"
tileCol.light.def = "#e8bd99"
tileCol.dark.sel = "#ab9887"
tileCol.light.sel = "#cbbeb4"
tileCol.dark.att = "#ae3c32"
tileCol.light.att = "#f26854"


//Screen dimension objectpar

var GUIController = {}
GUIController.showAttacked = true;
GUIController.showEngineOut = true;
GUIController.showMoves = true;
GUIController.showFen = true;


var screenDims = {
	x: 0,
	y: 0,
	size:600
}



$( window ).resize(function() {
  console.log("Resizing...")
  resetDims();
});

function resetDims(){

	// May want to tweak the values of this function
	var innerW = window.innerWidth
	var innerH = window.innerHeight
	var innerSize = innerW * 0.9;
	if(innerH < innerW) innerSize = innerH;
	screenDims.y = Math.round(innerSize * 0.1);
	screenDims.size = Math.round(innerSize * 0.75)
	updateScreen();

} // end resetDims()

function setDimsToScreen(){

	var r = screen.getBoundingClientRect();
	screenDims.x = r.left;
	screenDims.y = r.top;
	if(screen.width>screen.height)screenDims.size = screen.height;
	else screenDims.size = screen.width;

} // end setDimsToScreen()

function setScreenToDims(){
	screen.style.left = screenDims.x+"px";
	screen.style.top = screenDims.y+"px";
	screen.width = screenDims.size;
	screen.height = screenDims.size;
}  // end setScreenToDims

function updateScreen(){
	setScreenToDims();
	tileSize = Math.floor(screenDims.size/8)
	drawBoard()
}

var piecesImg = {
	img: $("#pieces_image")[0],
	w: 0,
	h: 0,
	pW: 0,
	pH: 0,
	offsetX: 0,
	offsetY: 0,
	init: function(){
		this.w = this.img.width 
		this.h = this.img.height
		this.pW = this.w / 6
		this.pH = this.h / 2
	},
	fetchPiece: function(pce){
		switch(pce){
			case PIECES.wP: return [5,0];
			case PIECES.wN: return [3,0];
			case PIECES.wB: return [2,0];
			case PIECES.wR: return [4,0];
			case PIECES.wQ: return [1,0];
			case PIECES.wK: return [0,0];
			case PIECES.bP: return [5,1];
			case PIECES.bN: return [3,1];
			case PIECES.bB: return [2,1];
			case PIECES.bR: return [4,1];
			case PIECES.bQ: return [1,1];
			case PIECES.bK: return [0,1];
		} // end switch
	} // end fetchPiece()
}

var tileSize;
function drawPiece(p, f, r){
	var imgPos = piecesImg.fetchPiece(p)
	ctx.drawImage(piecesImg.img, imgPos[0]*piecesImg.pW, imgPos[1]*piecesImg.pH, piecesImg.pW, piecesImg.pH, f*tileSize, r*tileSize, tileSize, tileSize)
	//console.log(piecesImg)
} // end drawPiece()


var screen = $("#screen")[0]
var ctx
function ScreenInit(){
	ctx = screen.getContext('2d')
	piecesImg.init();
	updateScreen();
} // end ScreenInit()
//var PIECES =  { EMPTY : 0, wP : 1, wN : 2, wB : 3,wR : 4, wQ : 5, wK : 6, bP : 7, bN : 8, bB : 9, bR : 10, bQ : 11, bK : 12  };

// INCOMPLETE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function drawTiles(){
	var use_dark = true;
	var selMoves = [];
	var selected = UserMove.from;
	if(selected != SQUARES.NO_SQ){
		var selPce = brd_pieces[selected]
		var selPceDir = PceDir[selPce]
		if(PieceCol[selPce] == COLOURS.WHITE){
			if(PiecePawn[selPce] == BOOL.TRUE){
				if(ParseMove(selected, selected + 10) != NOMOVE)selMoves.push(selected + 10)
				if(ParseMove(selected, selected + 20) != NOMOVE && RanksBrd[selected] == RANKS.RANK_2)selMoves.push(selected + 20)
				if(PieceCol[brd_pieces[selected + 9]] == COLOURS.BLACK) selMoves.push(selected + 9);
				if(PieceCol[brd_pieces[selected + 11]] == COLOURS.BLACK) selMoves.push(selected + 11);
				
				// enPassant
				if(PieceCol[brd_pieces[selected-1]] == PIECES.bP && brd_pieces[selected+9] == PIECES.EMPTY) selMoves.push(selected + 9);
				if(PieceCol[brd_pieces[selected+1]] == PIECES.bP && brd_pieces[selected+11] == PIECES.EMPTY) selMoves.push(selected + 11);

			} else if(selPce == PIECES.wN || selPce == PIECES.wK){
				for(var i = 0; i < selPceDir.length; i++){

					if(ParseMove(selected, selected + selPceDir[i]) != NOMOVE){
						selMoves.push(selected + selPceDir[i])
					} // end if
				} // end for

				if(PieceKing[selPce] == BOOL.TRUE){

					//castle perm
					if(brd_castlePerm & CASTLEBIT.WKCA) {
						if(brd_pieces[SQUARES.F1] == PIECES.EMPTY && brd_pieces[SQUARES.G1] == PIECES.EMPTY) {
							if(SqAttacked(SQUARES.E1,COLOURS.BLACK) == BOOL.FALSE && SqAttacked(SQUARES.F1,COLOURS.BLACK) == BOOL.FALSE) {
								selMoves.push(selected + 2);
							}// end if
						}// end if
					}// end if
		
					if(brd_castlePerm & CASTLEBIT.WQCA) {
						if(brd_pieces[SQUARES.D1] == PIECES.EMPTY && brd_pieces[SQUARES.C1] == PIECES.EMPTY && brd_pieces[SQUARES.B1] == PIECES.EMPTY) {
							if(SqAttacked(SQUARES.E1,COLOURS.BLACK) == BOOL.FALSE && SqAttacked(SQUARES.D1,COLOURS.BLACK) == BOOL.FALSE ) {
								selMoves.push(selected - 2);
							}// end if
						}// end if
					}// end if
				}
			} else {
				for(var i = 0; i < selPceDir.length; i++){
					var t_dir = selPceDir[i];
					var chg = 0;
					while(ParseMove(selected, selected + selPceDir[i] + chg) != NOMOVE){
						selMoves.push(selected + selPceDir[i] + chg);
						chg+=t_dir;
					} // end while
				} // end for
			}// end if else
		} else {
			if(PiecePawn[selPce] == BOOL.TRUE){
				if(ParseMove(selected, selected - 10) != NOMOVE)selMoves.push(selected - 10)
				if(ParseMove(selected, selected - 20) != NOMOVE && RanksBrd[selected] == RANKS.RANK_7) selMoves.push(selected - 20)
				if(PieceCol[brd_pieces[selected - 9]] == COLOURS.WHITE) selMoves.push(selected - 9);
				if(PieceCol[brd_pieces[selected - 11]] == COLOURS.WHITE) selMoves.push(selected - 11);
				
				// enPassant
				if(PieceCol[brd_pieces[selected-1]] == PIECES.wP && brd_pieces[selected-9] == PIECES.EMPTY) selMoves.push(selected - 9);
				if(PieceCol[brd_pieces[selected+1]] == PIECES.wP && brd_pieces[selected-11] == PIECES.EMPTY) selMoves.push(selected - 11);

			} else if(selPce == PIECES.bN || selPce == PIECES.bK){
				for(var i = 0; i < selPceDir.length; i++){

					if(ParseMove(selected, selected + selPceDir[i]) != NOMOVE){
						selMoves.push(selected + selPceDir[i])
					} // end if
				} // end for

				if(PieceKing[selPce] == BOOL.TRUE){

					//castle perm
					if(brd_castlePerm & CASTLEBIT.BKCA) {
						if(brd_pieces[SQUARES.F8] == PIECES.EMPTY && brd_pieces[SQUARES.G8] == PIECES.EMPTY) {
							if(SqAttacked(SQUARES.E8,COLOURS.WHITE) == BOOL.FALSE && SqAttacked(SQUARES.F8,COLOURS.WHITE) == BOOL.FALSE) {
								selMoves.push(selected + 2);
							} // end if
						} // end if
					} // end if
					
					if(brd_castlePerm & CASTLEBIT.BQCA) {
						if(brd_pieces[SQUARES.D8] == PIECES.EMPTY && brd_pieces[SQUARES.C8] == PIECES.EMPTY && brd_pieces[SQUARES.B8] == PIECES.EMPTY) {
							if(SqAttacked(SQUARES.E8,COLOURS.WHITE) == BOOL.FALSE && SqAttacked(SQUARES.D8,COLOURS.WHITE) == BOOL.FALSE ) {
								selMoves.push(selected - 2);
							} // end if
						} // end if
					} // end if	
				} // end if
			} else {
				for(var i = 0; i < selPceDir.length; i++){
					var t_dir = selPceDir[i];
					var chg = 0;
					while(ParseMove(selected, selected - selPceDir[i] - chg) != NOMOVE){
						selMoves.push(selected - selPceDir[i] - chg);
						chg-=t_dir;
					} // end while
				} // end for
			} // end if else
		} // end if else
	} // end if

	var file = 0;
	var rank = 7;
	brd_pieces.forEach((pce) => {
		if(pce!=SQUARES.OFFBOARD){
			if(use_dark){
				ctx.fillStyle = tileCol.dark.def
				if(GUIController.showMoves){
					if(selected!=SQUARES.NO_SQ){
						if(FilesBrd[selected] == file && 7 - RanksBrd[selected] == rank)ctx.fillStyle = tileCol.dark.sel
					} // end if
					if(selMoves.length>0){
						for(var i=0; i<selMoves.length; i++){
							if(FilesBrd[selMoves[i]] == file && 7 - RanksBrd[selMoves[i]] == rank)ctx.fillStyle = tileCol.dark.sel
						} // end for
					} // end if
				} // end if
				// make toggleable
				if(PieceCol[pce] == COLOURS.WHITE){
					if(SqAttacked(FR2SQ(file, 7-rank), COLOURS.BLACK) == BOOL.TRUE && pce != PIECES.EMPTY){
						ctx.fillStyle = tileCol.dark.att;
					} // end if
				} else {
					/*if(SqAttacked(FR2SQ(file, rank), COLOURS.WHITE) == BOOL.TRUE && pce != PIECES.EMPTY){
						ctx.fillStyle = tileCol.dark.att;
					}*/
				} // end if else
			} else {
				ctx.fillStyle = tileCol.light.def
				if(GUIController.showMoves){
					if(selected!=SQUARES.NO_SQ){
						if(FilesBrd[selected]==file && 7-RanksBrd[selected]==rank)ctx.fillStyle=tileCol.light.sel
					} // end if
					if(selMoves.length>0){
						for(var i=0; i<selMoves.length; i++){
							if(FilesBrd[selMoves[i]]==file && 7-RanksBrd[selMoves[i]]==rank)ctx.fillStyle=tileCol.light.sel
						} // end for
					} // end if
				} // end if
				if(PieceCol[pce] == COLOURS.WHITE){
					if(SqAttacked(FR2SQ(file, 7-rank), COLOURS.BLACK) == BOOL.TRUE && pce != PIECES.EMPTY){
						ctx.fillStyle = tileCol.light.att;
					}
				} else {
					/*if(SqAttacked(FR2SQ(file, rank), COLOURS.WHITE) == BOOL.TRUE && pce != PIECES.EMPTY){
						ctx.fillStyle = tileCol.light.att;
					}*/
				}
			}
			use_dark=!use_dark
			ctx.fillRect(file*tileSize, rank*tileSize, tileSize, tileSize)
			file++;
			if(file>7)file=0,use_dark=!use_dark, rank--;
		} // end if
	});
} // end drawTiles()


function drawBoard(){
	ctx.clearRect(0, 0, screen.width, screen.height)
	// console.log("drawBoard Called")
	drawTiles()
	
	var file = 0;
	var rank = 7;
	brd_pieces.forEach((pce) => {
		if(pce!=SQUARES.OFFBOARD){
			if(pce!=PIECES.EMPTY)drawPiece(pce, file, rank)
			file++;
			if(file>7)file=0, rank--;
		} // end if
	});
} // end drawBoard()






var UserMove = {};
UserMove.from = SQUARES.NO_SQ;
UserMove.to = SQUARES.NO_SQ;



$("#SetFen").click(function () {
	var fenStr = $("#fenIn").val();	
	ParseFen(fenStr);
	PrintBoard();		
	//SetInitialBoardPieces();	
	GameController.PlayerSide = brd_side;	
	CheckAndSet();	
	EvalPosition();	
	//PerftTest(5);
	//newGameAjax();
	drawBoard() 
});

function CheckResult() {

    if (brd_fiftyMove > 100) {
     $("#GameStatus").text("GAME DRAWN {fifty move rule}"); 
     return BOOL.TRUE;
    } // end if

    if (ThreeFoldRep() >= 2) {
     $("#GameStatus").text("GAME DRAWN {3-fold repetition}"); 
     return BOOL.TRUE;
    } // end if
	
	if (DrawMaterial() == BOOL.TRUE) {
     $("#GameStatus").text("GAME DRAWN {insufficient material to mate}"); 
     return BOOL.TRUE;
    } // end if
	
	console.log('Checking end of game');
	GenerateMoves();
      
    var MoveNum = 0;
	var found = 0;
	for(MoveNum = brd_moveListStart[brd_ply]; MoveNum < brd_moveListStart[brd_ply + 1]; ++MoveNum)  {	
       
        if ( MakeMove(brd_moveList[MoveNum]) == BOOL.FALSE)  {
            continue;
        } // end if
        found++;
		TakeMove();
		break;
    } // end for
    
    $("#currentFenSpan").text(BoardToFen()); 
	
	if(found != 0) return BOOL.FALSE;
	var InCheck = SqAttacked(brd_pList[PCEINDEX(Kings[brd_side],0)], brd_side^1);
	console.log('No Move Found, incheck:' + InCheck);
	
	if(InCheck == BOOL.TRUE)	{
	    if(brd_side == COLOURS.WHITE) {
	      $("#GameStatus").text("GAME OVER {black mates}");return BOOL.TRUE;
        } else {
	      $("#GameStatus").text("GAME OVER {white mates}");return BOOL.TRUE;
        }
    } else {
      $("#GameStatus").text("GAME DRAWN {stalemate}");return BOOL.TRUE;
    } // end if else
    console.log('Returning False');
	return BOOL.FALSE;	
} // end CheckResult()

function getMousePos(e) {
  var r = screen.getBoundingClientRect();
  return {
    x: e.clientX - r.left,
    y: e.clientY - r.top
  };
}

function ClickedScreenSquare(mouse) {
	console.log("Piece clicked at " + mouse.x + "," + mouse.y + " board top:" + screenDims.y + " board left:" + screenDims.x);
	var file = Math.floor((mouse.x/screenDims.size)*8)
	var rank = 7-Math.floor((mouse.y/screenDims.size)*8)
	var sq = FR2SQ(file, rank);
	if(GameController.BoardFlipped == BOOL.TRUE) {
		sq = MIRROR120(sq);
	} // end if
	// console.log("clicked:" + PrSq(sq));
	return sq;
} // end ClickedSquare()



function CheckAndSet() {
	if(CheckResult() != BOOL.TRUE) {
		GameController.GameOver = BOOL.FALSE;
		$("#GameStatus").text('');		
	} else {
		GameController.GameOver = BOOL.TRUE;
		GameController.GameSaved = BOOL.TRUE; // save the game here
	} // end if else
	//var fenStr = BoardToFen();
	 $("#currentFenSpan").text(BoardToFen());
} // end CheckAndSet()

function PreSearch() {
		
	if(GameController.GameOver != BOOL.TRUE) {				
		srch_thinking = BOOL.TRUE;
		setTimeout( function() {StartSearch(); }, 200);
	} // end if
} // end PreSearch

function MakeUserMove() {
	if(UserMove.from != SQUARES.NO_SQ && UserMove.to != SQUARES.NO_SQ) {
		console.log("User Move:" + PrSq(UserMove.from) + PrSq(UserMove.to));
		
		var parsed = ParseMove(UserMove.from,UserMove.to);
		
		console.log("Parsed:" + parsed);
		
		if(parsed != NOMOVE) {
			MakeMove(parsed);
			CheckAndSet();
			PreSearch();
		} // end if
		
		UserMove.from = SQUARES.NO_SQ;
		UserMove.to = SQUARES.NO_SQ; 	
	} // end if
	drawBoard()
} // end MakeUserMove()







// New On Click function

$(document).on('click','Canvas', function (e) {
	// console.log("Board Clicked")

	// console.log("e.pageX: " + e.pageX + " e.clientX: " + e.clientX)
	// console.log("e.pageY: " + e.pageY + " e.clientY: " + e.clientY);
	var mouse = getMousePos(e)
	// console.log(mouse)
	if(srch_thinking == BOOL.FALSE && GameController.PlayerSide == brd_side) {
		var sq = ClickedScreenSquare(mouse)
		if(UserMove.from == SQUARES.NO_SQ) {
			if(brd_pieces[sq]!=PIECES.EMPTY){
				UserMove.from = sq
				// console.log("UserMove.from: " + UserMove.from)
			}
		} else { 
			UserMove.to = sq
		} // end if else
		MakeUserMove();
	}
});


function StartSearch() {
	srch_depth = MAXDEPTH;
	var t = $.now();
	var tt = $('#ThinkTimeChoice').val();
	console.log("time:" + t + " TimeChoice:" + tt);
	srch_time = parseInt(tt) * 1000;
	SearchPosition();
	MakeMove(srch_best);
	drawBoard();
	CheckAndSet();
} // end StartSearch()

$("#TakeButton").click(function () {	
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 1 && srch_thinking==BOOL.FALSE) {
		TakeMove();
		brd_ply = 0;
		$("#currentFenSpan").text(BoardToFen());
		TakeMove();
		brd_ply = 0;
		$("#currentFenSpan").text(BoardToFen());
		$("#fenIn").text(BoardToFen());
		$("#GameStatus").text("");
		drawBoard()
	} // end if
});

$("#SearchButton").click(function () {	
	GameController.PlayerSide = brd_side^1;
	PreSearch();	
});
//Not ready to use
/*
$("#FlipButton").click(function () {	
	GameController.BoardFlipped ^= 1;
	console.log("Flipped:" + GameController.BoardFlipped);
	drawBoard()
});
*/

function NewGame() {
	ParseFen(START_FEN);
	PrintBoard();		
	//remove
	//SetInitialBoardPieces();
	GameController.PlayerSide = brd_side;
	CheckAndSet();	
	GameController.GameSaved = BOOL.FALSE;
	drawBoard();
} // end NewGame()

$("#NewGameButton").click(function () {	
	NewGame();
	newGameAjax();
});

function newGameAjax() {
	console.log('new Game Ajax');
	/*$.ajax({
		url : "insertNewGame.php",
		cache: false
		}).done(function( html ) {
		  console.log('result:' + html);
		});*/
} // end newGameAjax