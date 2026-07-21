var MAXCARDS = 52;
var MAXHAND = 11;
var myGame;
var names;
var hands;
var values;
var passed = true;

function startGame() {
    document.getElementById("winner").innerHTML = " ";
    names = document.getElementsByName("name");
    hands = document.getElementsByName("hand");
    values = document.getElementsByName("value");
    passed = false;
    for (var i = 0; i < 5; i++) {
        names[i].innerHTML = "";
        hands[i].innerHTML = "";
        values[i].innerHTML = "";
        values[i].removeAttribute("id");
    }
    document.getElementById("btStartGame").innerHTML = "Restart Game";
    myGame = new Game(parseInt(Array.from(document.getElementsByName("playerNum")).find(r => r.checked).value));
    myGame.shuffleDeck();
    myGame.beforePlayersTurn();
    displayPlayerNames();
    displayHands();
    values[myGame.currentSeat].innerHTML = myGame.getPlayerHandTotal(myGame.getPlayerHand(myGame.currentSeat));
}

class Game {

    myHands = new Array();
    myDeck = new Array();
    playerNum;
    currentSeat;

    constructor(playerNum) {
        this.playerNum = playerNum;
        console.log("playerNum:" + playerNum);
        var suit = "Spades";
        for (var i = 0; i < MAXCARDS; i++) {
            this.myDeck[i] = new Card((i % 13 + 1), suit);
            if (i == 39) suit = "Diamonds";
            else if (i == 26) suit = "Clubs";
            else if (i == 13) suit = "Hearts";
        }
        this.currentSeat = Math.floor(Math.random() * playerNum) + 1;
        console.log("constructor length" + this.myDeck.length);
    }

    shuffleDeck() {
        //shuffles cards by creating a random number array, 
        //assigning each card from the default list to the
        //random value in the array, then copies the randomized
        //array back to the orignial myDeck array

        var randDeck = new Array;
        randDeck[0] = Math.floor(Math.random() * 52);
        console.log("shuffleDeck i:0 randNum:" + randDeck[0]);
        for (var i = 1; i < MAXCARDS; i++) {
            var j = 0;
            var randNum = Math.floor(Math.random() * 52);
            while (true) {
                if (j == i) {
                    randDeck[i] = randNum;
                    console.log("shuffleDeck i:" + i + " randNum:" + randDeck[i]);
                    break;
                }
                else if (randDeck[j] == randNum) {
                    randNum = Math.floor(Math.random() * 52);
                    j = 0;
                }
                else j++;
            }
        }
        console.log("shuffleDeck length" + randDeck.length);
        var tempDeck = new Array;
        for (var i = 0; i < randDeck.length; i++) {
            tempDeck[i] = this.myDeck[randDeck[i]];
            console.log("shuffleDeck i:" + i + " " + tempDeck[i].cardNumber + tempDeck[i].cardSuit);
        }
        this.myDeck = tempDeck;
        this.dealCards();
    }

    dealCards() {
        //deals cards to the dealer and all players
        //dealer is index 0 of an array of cards
        //each player is their player number 

        console.log("dealCards currentSeat:" + this.currentSeat + " playerNum+1:" + (this.playerNum + 1));
        for (var i = 0; i < this.playerNum + 1; i++) {//deals all players one card face down
            this.myHands[i] = new Array;
            this.myHands[i][0] = this.myDeck.pop();
            if (i != this.currentSeat) this.myHands[i][0].cardShown = false;
        }
        for (var i = 0; i < this.playerNum + 1; i++)  //deals all players one card face up
            this.myHands[i][1] = this.myDeck.pop();

        this.logAllHands();

    }

    logAllHands() { //log to check the cards being passed out
        for (var i = 0; i < this.playerNum + 1; i++)
            for (var j = 0; j < this.myHands[i].length; j++)
                console.log("player " + i + " " + this.myHands[i][j].getCardNumSuitShown())
    }

    beforePlayersTurn() { //any players before current player go first
        console.log("beforePlayersTurn start");
        for (var i = 1; i < this.currentSeat; i++) { // starts at 1 to skip the dealer at 0
            var difficulty = Math.floor(Math.random() * 3) + 1;
            var risk = Math.floor(Math.random() * 3) + 1;
            console.log("beforePlayersTurn difficulty:" + difficulty + " risk:" + risk);
            while (this.getPlayerHandTotal(this.myHands[i]) <= (risk + difficulty + 12)) {
                this.hit(i);
                risk = Math.floor(Math.random() * 3) + 1;
            }
            console.log("beforePlayerTurn hand:" + this.getPlayerHandString(i))
        }
    }

    afterPlayersTurn() { //players after current player, then dealer
        for (var i = this.currentSeat + 1; i < this.myHands.length; i++) { // continues after player's turn
            var difficulty = Math.floor(Math.random() * 3) + 1;
            var risk = Math.floor(Math.random() * 3) + 1;
            while (this.getPlayerHandTotal(this.myHands[i]) <= (risk + difficulty + 12)) {
                this.hit(i);
                risk = Math.floor(Math.random() * 3) + 1; //risk changes for each hit
            }
        }
        while (this.getPlayerHandTotal(this.myHands[0]) < 17) { //dealer must hit until they reach 17 or higher
            this.hit(0);
        }
    }

    hit(player) {
        if (this.myDeck.length > 0) this.myHands[player].push(this.myDeck.pop());
        console.log("hit new card:" + this.myHands[player][this.myHands[player].length - 1].getCardNumSuitShown())
    }

    playerHit() {
        this.hit(this.currentSeat);
    }

    getPlayerHandTotal(hand) {
        var total = 0;
        for (var i = 0; i < hand.length; i++) {
            if (total + hand[i].getCardValueAceHigh() > 21) 
                total += hand[i].getCardValueAceLow();
            else 
                total += hand[i].getCardValueAceHigh();            
        }
        return total;
    }

    getPlayerHandString(player, shown) {
        var hand = "";
        for (var i = 0; i < this.myHands[player].length; i++) {
            hand += (this.myHands[player][i].getCardNumSuit(shown) + "");
            if (i + 1 < this.myHands[player].length) hand += "<br> ";
        }
        console.log("getPlayerHand " + hand);
        return hand;
    }

    getPlayerHand(player) {
        return this.myHands[player];
    }

} //end Game class

function playerHit() {
    if (!passed) {
        myGame.playerHit();
        displayHands();
        values[myGame.currentSeat].innerHTML = myGame.getPlayerHandTotal(myGame.getPlayerHand(myGame.currentSeat));
        if (myGame.getPlayerHandTotal(myGame.getPlayerHand(myGame.currentSeat)) > 21) {
            values[myGame.currentSeat].setAttribute("id", "bust");
            playerPass();
        }
    }
}

function playerPass() {
    if (!passed) {
        passed = true;
        myGame.afterPlayersTurn();
        displayHands(true);
        displayWinner();
    }
}

function displayPlayerNames() {
    names[0].innerHTML = "Dealer's Hand";
    for (var i = 1; i < myGame.playerNum + 1; i++) {
        if (i == myGame.currentSeat) names[i].innerHTML = "*Your Hand*";
        else names[i].innerHTML = ("Player " + i + "'s Hand");
    }
}

function displayHands(shown) {
    for (var i = 0; i < myGame.playerNum + 1; i++) {
        hands[i].innerHTML = myGame.getPlayerHandString(i, shown);
    }
}

function displayWinner() {
    for (var i = 0; i < myGame.playerNum + 1; i++) {
        values[i].innerHTML = myGame.getPlayerHandTotal(myGame.getPlayerHand(i));
        if (myGame.getPlayerHandTotal(myGame.getPlayerHand(i)) > 21) values[i].setAttribute("id", "bust");
    }

    var winners = new Array();
    var tiedDealerWinners = new Array();

    for (var i = 1; i < myGame.playerNum + 1; i++) {
        if (myGame.getPlayerHandTotal(myGame.getPlayerHand(i)) <= 21) {//didn't bust
            var dealerHand = myGame.getPlayerHandTotal(myGame.getPlayerHand(0));
            if(dealerHand > 21) dealerHand = 0;
            if(myGame.getPlayerHandTotal(myGame.getPlayerHand(i)) > dealerHand)
                winners.push(i);
            else if(myGame.getPlayerHandTotal(myGame.getPlayerHand(i)) == dealerHand)
                tiedDealerWinners.push(i);
            console.log("winners.length:" + winners.length + " tiedDealerWinners.length:" + tiedDealerWinners.length);
        }

    }
    var winnerName = "";
    if (winners.length == 1) { //one winner
        if (winners[0] == myGame.currentSeat) winnerName = "You";
        else if (winners[0] == 0) winnerName = "Dealer";
        else winnerName = ("Player " + winners[0]);
        document.getElementById("winner").innerHTML = (winnerName + " beat the dealer!");
    }
    else if (winners.length > 1) { //multiple winner game
        console.log("multiple winners, winners.length:" + winners.length);
        for (var i = 0; i < winners.length; i++) {
            if (winners[i] == myGame.currentSeat) winnerName += "You";
            else if (winners[i] == 0) winnerName += "Dealer";
            else winnerName += ("Player " + winners[i]);
            if (i == 0 && winners.length == 2) winnerName += " & ";
            else if (winners.length > 2) {
                if (i < winners.length - 2) winnerName += ", ";
                if (i == winners.length - 2) winnerName += ", & ";
            }

            document.getElementById("winner").innerHTML = (winnerName + " all beat the dealer!");
        }
    }
    else if(tiedDealerWinners.length > 0) { //push, dealer and player tied
        console.log("push, tiedDealerWinners.length:" + tiedDealerWinners.length);
        winnerName = "Dealer and Highest Player tied, that's called a push, and the wager is returned to ";
        for(var i = 0; i < tiedDealerWinners.length; i++){
            if (tiedDealerWinners[i] == myGame.currentSeat) winnerName += "You";
            else winnerName += ("Player " + tiedDealerWinners[i]);
            if (i == 0 && tiedDealerWinners.length == 2) winnerName += " & ";
            else if (tiedDealerWinners.length > 2) {
                if (i < tiedDealerWinners.length - 2) winnerName += ", ";
                if (i == tiedDealerWinners.length - 2) winnerName += ", & ";
            }
        }
        document.getElementById("winner").innerHTML = winnerName;
    }
    else if(myGame.getPlayerHandTotal(myGame.getPlayerHand(0)) <= 21) document.getElementById("winner").innerHTML = "Dealer has won";
    else document.getElementById("winner").innerHTML = "Everyone has bust!";

}

class Card {
    cardNumber;
    cardSuit;
    cardShown;
    cardNames = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"];

    constructor(n, s) {
        if (n > 0 && n < 14)
            this.cardNumber = parseInt(n);
        else this.cardNumber = 0;
        if (["Spades", "Hearts", "Clubs", "Diamonds"].includes(s))
            this.cardSuit = s;
        else this.cardSuit = "Error";
        this.cardShown = true; //default is face up, easier than changing it when hit() is called
        console.log("card " + this.cardNumber + " of " + this.cardSuit);
    }

    getCardNumSuitShown() { //only used for logs
        if (this) return this.cardNumber + " of " + this.cardSuit + " " + (this.cardShown ? "shown" : "hidden");
        else return "Out of Cards";
    }

    getCardNumSuit(shown) {
        if (shown) return (this.cardNames[this.cardNumber - 1] + " of " + this.cardSuit);
        return (this.cardShown ? (this.cardNames[this.cardNumber - 1] + " of " + this.cardSuit) : "/////");
    }

    getCardValueAceHigh() {
        return (this.cardNumber == 1 ? 11 : Math.min(10, this.cardNumber));
    }

    getCardValueAceLow() {
        return this.cardNumber == 1 ? 1 : Math.min(10, this.cardNumber);
    }
}