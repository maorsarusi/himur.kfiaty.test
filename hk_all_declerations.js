var currentBet = {};
var basketBallNum = "";
var space = "&nbsp;"
var intervalId = 0;
var breakline = '</br>'
var trs = {};
var usersTrs = [];
var betsTrs = [];
var isUser = true;
var isFiltered = false;
var chosenForFilter = "";
class StaticForFirebase {
    static names = [];
    static passwords = [];
    static ids = [];
    static user = "";
    static currentId = "";
    static results = [];
    static sorted = "";
    static betByUser = [];
    static UsersByBet = [];
}

class StaticForFirebaseUser {
    static allBets = [];
    static allByUser = [];
    static allByUserId = [];
}
var userBets = [];
var colors = ['#ADD8E6', 'yellow', 'grey', 'orange', '#FFF8DC', 'purple', '#7CFC00', '#00CED1'];