function insertAllTable() {
    var TRs = isUser ? usersTrs : betsTrs;
    var table = document.getElementById("betsAllUsers");
    for (var i in TRs) {
        for (j in trs) {
            if (isUser) {
                if (j.includes(TRs[i])) {
                    var elem = document.getElementById(j);
                    elem.innerHTML = "";
                    elem.remove();
                }
            } else {
                if (trs[j][1].toString() == TRs[i]) {
                    var elem = document.getElementById(j);
                    elem.innerHTML = "";
                    elem.remove();
                }


            }
        }
    };
    for (i in trs) {
        var row = table.insertRow()
        row.id = i;
        row.innerHTML = trs[i][0];
    }
    isFiltered = false;
}

function filteringSelect() {
    isUser ? filteringSelectByUser() : filteringSelectByBet();
}

function getBetById(id, type, includes, arr) {
    var flag = false;
    var body = [];
    for (var i in arr) {
        if (id == arr[i]["id"]) {
            body[0] = arr[i];
            flag = true;
            break;
        }
    }
    var bet = "";
    if (flag) {
        if (type == 'basketball bet') {
            bet = body[0]["body"];
            bet += `${breakline} (${body[0]["bool"]} הפרש)`
        } else {
            if (includes) {
                bet = `מחצית:  ${body[0]["homeScoreht"]} - ${body[0]["awayScoreht"]} ${body[0]["winnerht"]}${breakline}`
            }
            bet += `סיום:  ${body[0]["homeScore"]} - ${body[0]["awayScore"]} ${body[0]["winner"]}`
        }
    } else {
        bet = '';
    }
    return bet;
}


function getBodyBasketball(body, difference, ishome) {
    var abs = Math.abs(difference);
    var betsByWinner = ishome ? ([body[0], body[1]]) : ([body[2], body[3]]);
    var bet = abs >= getLimit(betsByWinner[0]) ? betsByWinner[0] : betsByWinner[1];
    alert(`ההימור שלך הוא:  ${bet} (${abs} הפרש)`)
    return bet;
}

function getSepcificBetBAsketball(idBet, reChild) {
    var body = document.getElementById("body" + idBet).innerHTML;
    var bodyVals = body.split("<br>");
    var homeScore = document.getElementById("Home" + idBet).value;
    var awayScore = document.getElementById("Away" + idBet).value;
    var home = document.getElementById("betH" + idBet);
    var away = document.getElementById("betA" + idBet);
    var type = document.getElementById("type" + idBet).getAttribute("bettype");
    var homeTeam = home.getAttribute("homeTeam");
    var awayTeam = away.getAttribute("awayTeam");
    var alert1 = getAlert(homeScore, awayScore, 'סיום');
    var bet = {}
    bet["type"] = type;
    bet["id"] = parseInt(idBet);
    if (alert1 != "") {
        alert(alert1);
    } else {
        var difference = parseInt(homeScore) - parseInt(awayScore);
        var ishome = false;
        winner = difference == 0 ? "תיקו" : (difference > 0 ? (ishome = true, homeTeam) : awayTeam);
        if (difference == 0) {
            bet["body"] = bodyVals[4];
        } else {
            bet["body"] = getBodyBasketball(bodyVals, difference, ishome);
        }
        bet["winner"] = winner;
        bet["bool"] = `${Math.abs(difference)}`;
        reChild.push(bet);
        createChangeFormat(idBet, false, bet);
    }
}


function changeSpecificBet(btn) {
    var data = "";
    var user = StaticForFirebase.user;
    var ref = new Firebase('https://himur-kfiaty-users-bets-default-rtdb.firebaseio.com/');
    var refChild = ref.child(user);
    refChild.on("value", function(snapshot) {
        data = snapshot.val();
    });
    var id = parseInt(btn.getAttribute("idbet"));
    var idBet = "";
    for (var i in data) {
        if (data[i]["id"] == id) {
            idBet = i;
            break;
        }
    }
    if (idBet == "") {
        alert("שים לב ישנה בעיה כלשהיא");
    } else {
        var type = document.getElementById("type" + id).getAttribute("bettype");
        updateSpecificValues(type, idBet, id, refChild, user);
    }
}

function updateSpecificValues(type, idBet, id, ref, user) {
    var homeScore = document.getElementById("Home" + id).value;
    var awayScore = document.getElementById("Away" + id).value;
    var bet = {};
    bet["id"] = id;
    var alert1 = getAlert(homeScore, awayScore, 'סיום');
    var body = document.getElementById("body" + id).innerHTML;
    var homeTeam = document.getElementById("betH" + id).getAttribute("hometeam");
    var awayTeam = document.getElementById("betA" + id).getAttribute("awayteam");
    if (type == "soccer bet") {
        var betForWrite = "ההימור שלך הוא: ";
        var includes = body.includes("+");
        if (includes) {
            var homeScoreHT = document.getElementById("HomeHT" + id).value;
            var awayScoreHT = document.getElementById("AwayHT" + id).value;
            var alert1 = getAlert(homeScoreHT, awayScoreHT, 'מחצית') + alert1;
            if (parseFloat(homeScoreHT) > parseFloat(homeScore)) {
                alert1 += 'תוצאת מחצית לקבוצת בית גדולה מתוצאת סיום\r\n'
            }
            if (parseFloat(awayScoreHT) > parseFloat(awayScore)) {
                alert1 += 'תוצאת מחצית לקבוצת חוץ גדולה מתוצאת סיום\r\n'
            }
            var winnerht = homeScoreHT == awayScoreHT ? "תיקו" : (homeScoreHT > awayScoreHT ? homeTeam : awayTeam);
            var htresult = `${homeScoreHT}:${awayScoreHT}`;
            betForWrite += `במחצית ${winnerht} ${htresult}\r\n`;
            if (alert1 == "") {
                ref.child(idBet).update({ winnerht: winnerht });
                ref.child(idBet).update({ htresult: htresult });
                ref.child(idBet).update({ homeScoreht: homeScoreHT });
                ref.child(idBet).update({ awayScoreht: awayScoreHT });
                bet["homeScoreht"] = homeScoreHT;
                bet["awayScoreht"] = awayScoreHT;
                bet["winnerht"] = winnerht;
                bet["htresult"] = htresult;
                document.getElementById("HomeHT" + id).value = '';
                document.getElementById("AwayHT" + id).value = '';
                document.getElementById("resultWriteHomeHT").innerHTML = '';
                document.getElementById("resultWriteAwayHT").innerHTML = '';
            }

        }
        var result = `${homeScore}:${awayScore}`;
        var winnergame = homeScore == awayScore ? "תיקו" : (homeScore > awayScore ? homeTeam : awayTeam);
        betForWrite += `סיום ${winnergame} ${result}\r\n`;
        if (alert1 == "") {
            alert1 = betForWrite;
            bet["homeScore"] = homeScore;
            bet["awayScore"] = awayScore;
            bet["winner"] = winnergame;
            bet["result"] = result;
            document.getElementById("Home" + id).value = '';
            document.getElementById("Away" + id).value = '';
            document.getElementById("resultWriteHome").innerHTML = '';
            document.getElementById("resultWriteAway").innerHTML = '';
            ref.child(idBet).update({ winner: winnergame });
            ref.child(idBet).update({ result: result });
            ref.child(idBet).update({ homeScore: homeScore });
            ref.child(idBet).update({ awayScore: awayScore });
            StaticForFirebaseUser.allByUser = [];
            StaticForFirebaseUser.allByUserId = [];
            console.log(StaticForFirebaseUser.allByUser);
            getUserBets(user);
            console.log(StaticForFirebaseUser.allByUser);
            document.getElementById("bodybet" + id).innerHTML = getBetById(id, type, includes, StaticForFirebaseUser.allByUser);
        }
        alert(alert1)
    } else {
        var body = document.getElementById("body" + id).innerHTML;
        var bodyVals = body.split("<br>");
        var homeScore = document.getElementById("Home" + id).value;
        var awayScore = document.getElementById("Away" + id).value;
        var home = document.getElementById("betH" + id);
        var away = document.getElementById("betA" + id);
        var homeTeam = home.getAttribute("homeTeam");
        var awayTeam = away.getAttribute("awayTeam");
        var alert1 = getAlert(homeScore, awayScore, 'סיום');
        var bet = {}
        if (alert1 != "") {
            alert(alert1);
        } else {
            var difference = parseInt(homeScore) - parseInt(awayScore);
            var ishome = false;
            winner = difference == 0 ? "תיקו" : (difference > 0 ? (ishome = true, homeTeam) : awayTeam);
            if (difference == 0) {
                bet["body"] = bodyVals[4];
                alert(`ההימור שלך הוא:  ${bet["body"]} (0 הפרש)`)
            } else {
                bet["body"] = getBodyBasketball(bodyVals, difference, ishome);
            }
            bet["winner"] = winner;
            bet["bool"] = `${Math.abs(difference)}`;
            ref.child(idBet).update({ body: bet["body"] });
            ref.child(idBet).update({ bool: Math.abs(difference) });
            ref.child(idBet).update({ winner: winner });
            document.getElementById("Home" + id).value = '';
            document.getElementById("Away" + id).value = '';
            document.getElementById("resultWriteHome").innerHTML = '';
            document.getElementById("resultWriteAway").innerHTML = '';
            StaticForFirebaseUser.allByUser = [];
            StaticForFirebaseUser.allByUserId = [];
            getUserBets(user);
            document.getElementById("bodybet" + id).innerHTML = getBetById(id, type, includes, StaticForFirebaseUser.allByUser);
        }
    }
}

function getSepcificBet(btn) {
    console.log(btn)
    var user = StaticForFirebase.user
    var ref = new Firebase('https://himur-kfiaty-users-bets-default-rtdb.firebaseio.com/');
    var reChild = ref.child(user);
    var bet = {};
    var betForWrite = ` ההימור שלך הוא `;
    var alert1 = "";
    var idBet = btn.getAttribute("idbet");
    var type = document.getElementById("type" + idBet).getAttribute("bettype");
    console.log(type);
    if (type == 'basketball bet') {
        getSepcificBetBAsketball(idBet, reChild);
    } else {
        var home = document.getElementById("betH" + idBet);
        var away = document.getElementById("betA" + idBet);
        var homeScore = document.getElementById("Home" + idBet).value;
        var awayScore = document.getElementById("Away" + idBet).value;
        var homeTeam = home.getAttribute("homeTeam");
        var awayTeam = away.getAttribute("awayTeam");
        winner = homeScore == awayScore ? "תיקו" : (homeScore > awayScore ? homeTeam : awayTeam);
        alert1 = getAlert(homeScore, awayScore, "סיום");
        bet["home"] = homeTeam;
        bet["id"] = parseInt(idBet);
        bet["type"] = type;
        bet["winner"] = winner;
        var body = document.getElementById("body" + idBet).innerHTML;
        var includes = body.includes("+");
        if (includes) {
            var homeScoreht = document.getElementById("HomeHT" + idBet).value;
            var awayScoreht = document.getElementById("AwayHT" + idBet).value;
            if (parseFloat(homeScoreht) > parseFloat(homeScore)) {
                alert1 += 'תוצאת מחצית לקבוצת בית גדולה מתוצאת סיום\r\n'
            }
            if (parseFloat(awayScoreht) > parseFloat(awayScore)) {
                alert1 += 'תוצאת מחצית לקבוצת חוץ גדולה מתוצאת סיום\r\n'
            }
            var winnerht = homeScoreht == awayScoreht ? "תיקו" : (homeScoreht > awayScoreht ? homeTeam : awayTeam);
            alert1 += getAlert(homeScoreht, awayScoreht, "מחצית");
            bet["htresult"] = `${homeScoreht}:${awayScoreht}`;
            bet["homeScoreht"] = homeScoreht;
            bet["awayScoreht"] = awayScoreht;
            bet["winnerht"] = winnerht;
            betForWrite += `במחצית ${winnerht} ${bet["htresult"]}\r\n`;
        }
        bet["away"] = awayTeam;
        bet["homeScore"] = homeScore;
        bet["awayScore"] = awayScore;
        bet["result"] = `${homeScore}:${awayScore}`;
        winner = winner != 'תיקו' ? winner : "";
        betForWrite += `סיום ${winner} ${bet["result"]}\r\n`;
        console.log(alert1)
        if (alert1 != "") {
            alert(alert1);
        } else {
            reChild.push(bet);
            alert(betForWrite);
            createChangeFormat(idBet, includes, bet);
        }
    }
}

function insertIntoSelect(select, elem, bonus) {
    var option = document.createElement('option');
    option.id = elem + bonus;
    var text1 = elem;
    option.text = text1;
    select.add(option);
}
