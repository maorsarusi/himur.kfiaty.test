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

function convertToString(elem) {
    var str = '';
    for (var i = 0; i < elem.length; i++) {
        str += (i == 0 ? '' : "\'") + elem[i] + "\'" + '\n';
    }
    return str;
}

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

function filteringSelectByBet() {
    var select = document.getElementById("chooseFilter");
    var selectVal = select.value;
    var filterArr = StaticForFirebase.betByUser;
    chosenForFilter = selectVal;
    var trSelected = [];
    // console.log(filterArr[usersTrs[i]])
    for (var i in filterArr) {
        {
            for (var j in filterArr[i]) {

                if (document.getElementById(i + j)) {
                    var elemForWrite = document.getElementById(i + j);
                    var id = document.getElementById("id" + i + j).innerHTML;
                    //var name = getKeyByValue(usersTrs, i)
                    trs[i + j] = [elemForWrite.innerHTML, filterArr[i][j]["id"], getKeyByValue(filterArr, i)];
                    elemForWrite.innerHTML = "";
                    elemForWrite.remove();
                }
            }
        }
    }

    for (var i in trs) {
        if (String(trs[i][1]) == selectVal) {
            trSelected[i] = trs[i][0];
        }
    }
    var table = document.getElementById("betsAllUsers");
    for (var i in trSelected) {
        var row = table.insertRow();
        row.id = i;
        document.getElementById(i).innerHTML = trSelected[i];
        id = document.getElementById("id" + i).innerHTML;
        row.setAttribute("name", id + getKeyByValue(filterArr, trSelected[i]))
    }
    betsTrs = [];
    betsTrs[0] = selectVal;
    isFiltered = true;
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => value.includes(key));
}

function filteringSelectByUser() {
    var select = document.getElementById("chooseFilter");
    var selectVal = select.value;
    var filterArr = StaticForFirebase.betByUser;
    chosenForFilter = selectVal;
    var trSelected = [];
    for (var i in usersTrs) {
        // console.log(filterArr[usersTrs[i]])
        for (var j in filterArr[usersTrs[i]]) {
            var id = filterArr[usersTrs[i]][j]["id"];
            var elemForWrite = document.getElementById(usersTrs[i] + j);
            trs[usersTrs[i] + j] = [elemForWrite.innerHTML, usersTrs[i] + j, usersTrs[i]];
            elemForWrite.innerHTML = "";
            elemForWrite.remove();
        }
    }

    for (var i in trs) {
        if (i.includes(selectVal)) {
            trSelected[i] = trs[i][0];
        }
    }
    var table = document.getElementById("betsAllUsers");
    for (var i in trSelected) {
        var row = table.insertRow();
        row.id = i;
        document.getElementById(i).innerHTML = trSelected[i];
        id = document.getElementById("id" + i).innerHTML;
        row.setAttribute("name", id + i);
        row.setAttribute("username", i);
    }
    usersTrs = [];
    usersTrs[0] = selectVal;
    isFiltered = true;
}

function getAllBets() {
    var count = 0;
    var ref = new Firebase('https://himur-cfiyati-default-rtdb.firebaseio.com/');
    ref.on("value", function(snapshot) {
        var data = snapshot.val();
        var jstring = JSON.stringify(data);
        json1 = JSON.parse(jstring);
        console.log(json1["הימור"]);
        for (var i in json1["הימור"]) {
            StaticForFirebaseUser.allBets[count] = json1["הימור"][i];
            count++;
        }
    });
}

function filteringByUser() {
    if (isFiltered) {
        insertAllTable();
    }
    isUser = true;
    usersTrs = [];
    var select = document.getElementById("chooseFilter");
    select.innerHTML = '';
    for (var i in StaticForFirebase.betByUser) {
        if (!document.getElementById(i + "All"))
            insertIntoSelect(select, i, "All");
    }
    usersTrs = Object.keys(StaticForFirebase.betByUser);
    betsTrs = createNumArray(StaticForFirebase.UsersByBet);
}

function filteringByBet() {
    if (isFiltered) {
        insertAllTable();
    }
    isUser = false;
    usersTrs = [];
    var select = document.getElementById("chooseFilter");
    select.innerHTML = '';
    for (var i in StaticForFirebase.UsersByBet) {
        if (!document.getElementById(i + "All"))
            insertIntoSelect(select, i, "All");
    }
    betsTrs = createNumArray(StaticForFirebase.UsersByBet);
    usersTrs = Object.keys(StaticForFirebase.betByUser);

}

function getUsersByBet(ids) {
    var usersByBet = [];
    var ref = new Firebase('https://himur-kfiaty-users-bets-default-rtdb.firebaseio.com/');
    ref.on("value", function(snapshot) {
        var data = snapshot.val();
        var count = 0;
        var jstring = JSON.stringify(data);
        json1 = JSON.parse(jstring);
        for (var i in json1) {
            for (var j in json1[i]) {
                if (ids.includes(json1[i][j]["id"])) {
                    json1[i][j]["user"] = i;
                    usersByBet[count] = [json1[i][j]["id"], json1[i][j]];
                    count++;
                }
            }
        }
    });
    for (var i in usersByBet) {
        if (!StaticForFirebase.UsersByBet[usersByBet[i][0]]) {
            StaticForFirebase.UsersByBet[usersByBet[i][0]] = [];
        }
        StaticForFirebase.UsersByBet[usersByBet[i][0]].push(usersByBet[i][1])

    }
}

function getBetsByUser(ids, metadata, user) {
    var ref = new Firebase('https://himur-kfiaty-users-bets-default-rtdb.firebaseio.com/');
    ref.on("value", function(snapshot) {
        var data = snapshot.val();
        var all = [];
        var jstring = JSON.stringify(data);
        json1 = JSON.parse(jstring);
        for (var i in json1) {
            for (var j in json1[i]) {
                if (ids.includes(json1[i][j]["id"])) {
                    all.push(json1[i][j]);
                }
            }
            StaticForFirebase.betByUser[i] = all;
            all = [];
        }
    });

    var table = document.getElementById("betsAllUsers");
    var count = 0;

    for (var i in StaticForFirebase.betByUser) {
        document.getElementById("allUsersBetTitle").innerHTML = "שלום " + breakline + user;
        document.getElementById("allUsersBetTitle").style.textAlign = "center";
        console.log(document.getElementById(i));

        for (var j in StaticForFirebase.betByUser[i]) {
            if (!document.getElementById(i + j)) {
                var row = table.insertRow();
                var data = StaticForFirebase.betByUser[i][j];
                var type = data["type"];
                var id = data["id"];
                row.id = i + j;
                var result = getBetById(id, type, metadata[id][4], StaticForFirebase.betByUser[i])
                console.log(StaticForFirebase.betByUser[i][j]);
                insertRowToTable(row, i, 0, "user", i + j, "betsCalass", 0);
                colored_staus_background("user" + i + j, colors[count]);
                insertRowToTable(row, id, 1, "id", i + j, "betsCalass", 0);
                colored_staus_background("id" + i + j, colors[count]);
                insertRowToTable(row, type, 2, "type", i + j, "betsCalass", 0);
                colored_staus_background("type" + i + j, colors[count]);
                insertRowToTable(row, createTimer(metadata[id][0], i + j), 3, "hour", i + j, "betsCalass", 0);
                colored_staus_background("hour" + i + j, colors[count]);
                insertRowToTable(row, metadata[id][1], 4, "home", i + j, "betsCalass", 1);
                colored_staus_background("home" + i + j, colors[count]);
                insertRowToTable(row, metadata[id][2], 5, "away", i + j, "betsCalass", 1);
                colored_staus_background("away" + i + j, colors[count]);
                var elem = document.getElementById("type" + i + j);
                elem.setAttribute("betType", type);
                var body = type == 'soccer bet' ? metadata[id][3] : convertToString(metadata[id][3]);
                var maorBtn = type == 'soccer bet' ? body : `<button id="buttonMaor${id}" onclick="alert('${body}')">צפה</button>`;
                insertRowToTable(row, maorBtn, 6, "body", i + j, "betsCalass", 0);
                colored_staus_background("body" + i + j, colors[count]);
                insertRowToTable(row, result, 7, "Status", i + j, "betsCalass", 0);
                colored_staus_background("Status" + i + j, colors[count]);
                row.setAttribute("name", id + i);
                row.setAttribute("username", i);
            }
        }
        count++;
    }
}

function createNumArray(arr) {
    var arrNum = [];
    for (var i in arr) {
        arrNum.push(i);
    }
    return arrNum;
}

function watchAllBets(user) {
    displayElement("pass", "none");
    displayElement("betsAllUsers", "flex");
    getAllBets();
    var ids = [];
    var metadata = {};
    for (var i in StaticForFirebaseUser.allBets) {
        var id = StaticForFirebaseUser.allBets[i]["totalId"];
        ids.push(id);
        var isPlus = StaticForFirebaseUser.allBets[i]["body"].includes('+');
        metadata[id] = [StaticForFirebaseUser.allBets[i]["hour"], StaticForFirebaseUser.allBets[i]["home"], StaticForFirebaseUser.allBets[i]["away"], StaticForFirebaseUser.allBets[i]["body"], isPlus];
    }
    console.log(StaticForFirebase.betByUser.length)
    if ((StaticForFirebase.betByUser == 0 && StaticForFirebase.UsersByBet == 0)) {
        getBetsByUser(ids, metadata, user);
        getUsersByBet(ids);
    }
}

function getUsers() {
    var select = document.getElementById("username")
    var ref = new Firebase('https://himur-kfiaty-users-default-rtdb.firebaseio.com/');
    ref.on("value", function(snapshot) {
        let name;
        var data = snapshot.val();
        var jstring = JSON.stringify(data);
        json = JSON.parse(jstring);
        for (var i in json["Users"]) {
            name = json["Users"][i]["user"]
            insertIntoSelect(select, name, "")
        }
    });
}

function colored_staus(status, color) {
    document.getElementById(status).style.color = color;
}

function colored_staus_background(status, color) {
    document.getElementById(status).style.backgroundColor = color;
}

function watchTable() {
    getResults();
    var status_dict = { 'NB': 'לא הימר משחק אחרון', 'W': 'הימור אחרון נכון', 'L': 'הימור אחרון לא נכון' }
    status_color = { 'NB': 'red', 'W': 'green', 'L': 'yellow', "Gold": '#DAA520', "Silver": '#C0C0C0', 'Bronze': '#CD7F32' }
    var count_dict = { 4: 'Cold', 3: 'Onfire', 2: 'Points', 5: 'Sleep', 6: 'Status', 1: 'User', 0: "Place" }
    displayElement("pass", "none");
    displayElement("scores", "flex");
    var table = document.getElementById("scores");
    var attcount = 0;
    for (var i in StaticForFirebase.sorted) {
        //StaticForFirebase.sorted[i]["Place"] = count_dict[i];
        let user = StaticForFirebase.sorted[i]
        var row = table.insertRow();
        row.id = i;
        let c = row.insertCell(0);
        c.innerHTML = attcount + 1;
        attcount++;
        c.setAttribute('class', 'results')
        for (var j = 1; j <= 6; j++) {
            var attribute = count_dict[j];
            let data = attribute == 'Status' ? status_dict[user[1][attribute]] : user[1][attribute];
            console.log(data)
            insertRowToTable(row, String(data).bold(), j, attribute, i, 'results', false);
            colored_staus(attribute + i, status_color[user[1][attribute]]);

            if (attribute != 'Status') {
                if (i == 0) {
                    colored_staus(attribute + i, status_color["Gold"]);
                } else if (i == 1) {
                    colored_staus(attribute + i, status_color["Silver"])
                } else if (i == 2) {
                    colored_staus(attribute + i, status_color["Bronze"])
                }

            }
        }
    }
}

function getResults() {
    var ref = new Firebase('https://himur-kfiaty-results-default-rtdb.firebaseio.com/')
    ref.on("value", function(snapshot) {
        var data = snapshot.val();
        var json = JSON.stringify(data);
        var js = JSON.parse(json);
        if (js != null || js != '') {
            for (var i in js["Results"]) {
                StaticForFirebase.results[i] = js["Results"][i];
            }
        }
        console.log(StaticForFirebase.results)
        StaticForFirebase.sorted = sortByItem(StaticForFirebase.results, "Points");
        console.log(StaticForFirebase.sorted)
    });
}

function insertRowToTable(row, data, count, attribute, user, classChosen, isButton) {
    let c = row.insertCell(count)
    c.innerHTML = data;
    c.id = attribute + user;
    c.style.textAlign = 'center';
    // if (attribute != 'id') {
    if ((attribute == 'body' && document.getElementById("type" + user).getAttribute("bettype") == 'basketball bet') || attribute.includes('betH') | attribute.includes('betA')) {
        c.style.textAlign = 'right';
        //}
    }

    c.setAttribute('class', classChosen)
    if (isButton == 2) {
        c.setAttribute('onclick', 'navigateBetButton(this)')
        c.setAttribute(attribute + user, user)
    } else if (isButton == 1) {
        c.setAttribute('type', 'text');
        c.setAttribute('placeholder', data);
    }
}

function fillNames() {
    var ref = new Firebase('https://himur-kfiaty-users-default-rtdb.firebaseio.com/');
    ref.on("value", function(snapshot) {
        let name;
        var data = snapshot.val();
        var jstring = JSON.stringify(data);
        json = JSON.parse(jstring);
        var k = 0;
        if (json != null) {
            for (var i in json["Users"]) {
                name = json["Users"][i]["user"]
                StaticForFirebase.names[k] = name;
                pass = json["Users"][i]["password"]
                StaticForFirebase.passwords[k] = pass;
                k++;
            }
        }
    });
}

function returnZero(time) {
    return (time < 10 ? '0' : '');
}

function createTimer(date, id) {
    var countDownDate = new Date(date).getTime();
    clearInterval(intervalId);
    // Update the count down every 1 second
    var x = setInterval(function() {
        intervalId = x;
        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = countDownDate - now;
        if (document.getElementById("hour" + id)) {
            document.getElementById("hour" + id).innerHTML = "";
        }
        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        var time = returnZero(days) + days + "d " + returnZero(hours) + hours + "h " +
            returnZero(minutes) + minutes + "m " + returnZero(seconds) + seconds + "s ";
        if (minutes < 0 && days <= 0 && hours <= 0) {
            clearInterval(x);
            if (document.getElementById("click" + id)) {
                document.getElementById("click" + id).innerHTML = "זמן ההימור עבר";
            }
            document.getElementById("hour" + id).innerHTML = date;


        } else {
            if (document.getElementById("hour" + id)) {
                document.getElementById("hour" + id).innerHTML = `${time.bold()}`;

            }
        }

    }, 1000);
}

function returnBack(table) {
    displayElement(table, "none");
    displayElement("pass", "flex");
    document.getElementById("password").value = "";
}

function checkExistUser(user, users) {
    for (var i = 0; i < users.length; i++) {
        if (user == users[i]) {
            return true;
        }
    }
    return false;
}

function addUser() {
    var user = document.getElementById("usernameAdd").value;
    var password = document.getElementById("passwordAdd").value;
    if (user == "" || password == "") {
        alert("אחד הערכים חסרים");
    } else {
        if (checkExistUser(user, StaticForFirebase.names)) {
            alert("משתמש  קיים במערכת")
        } else {
            var ref = new Firebase('https://himur-kfiaty-users-default-rtdb.firebaseio.com/');
            var userRef = ref.child("Users");
            userRef.push({ password, user })
            alert(":המשתמש " + user + " נקלט בהצלחה")
        }
    }
}

function confirmBeforeChange() {
    var username = document.getElementById("usernameChange").value;
    var password = document.getElementById("passwordChange").value;
    var flag = false;
    console.log(StaticForFirebase.passwords)
    for (var i = 0; i < StaticForFirebase.passwords.length; i++) {
        if (StaticForFirebase.names[i] == username && StaticForFirebase.passwords[i] == password) {
            flag = true;
        }
    }
    if (!flag) {
        alert("שם המשתמש או הסיסמא אינם נכונים")
    } else {
        document.getElementById("changeUser").style.display = "flex";
        document.getElementById("passwordChange").value = "";
        document.getElementById("usernameChange").disabled = true;
        document.getElementById("confirmBefore").disabled = true;
    }
}

function changeUser() {
    var json = "";
    var ref = new Firebase('https://himur-kfiaty-users-default-rtdb.firebaseio.com/');
    var userRef = ref.child("Users");
    user = {}
    var place = -1;
    var password = document.getElementById("passwordChange").value;
    var username = document.getElementById("usernameChange").value;
    var userDetailes = [];
    ref.on("value", function(snapshot) {
        var data = snapshot.val();
        var jstring = JSON.stringify(data);
        json = JSON.parse(jstring);
        var i = 0;
        for (var k in json["Users"]) {
            userDetailes[i] = k;
            i++;
        }
    });
    if (password == "") {
        document.getElementById("alertNoPassword").innerText = "לא הוכנסה סיסמא";
    } else {
        if (username == "") {
            document.getElementById("alertNoPassword").innerText = "לא הוכנס שם משתמש";
        } else {
            for (var i = 0; i < userDetailes.length; i++) {
                if (json["Users"][userDetailes[i]]["user"] == username) {
                    place = i;
                    break;
                }
            }
            userRef.child(userDetailes[place]).update({ password: document.getElementById("passwordChange").value })
            document.getElementById("alertNoPassword").innerText = "";
            alert("שינוי הסיסמא בוצע בהצלחה");
        }
    }
}

function moveToButton(table, user, pass) {
    displayElement("pass", "none");
    displayElement(table, "flex");
    document.getElementById('usernameChange').disabled = false;
    document.getElementById(user).value = "";
    document.getElementById(pass).value = "";
    document.getElementById('confirmBefore').disabled = false;
    displayElement("changeUser", "none");
    fillNames();
}

function confirmPassword(table) {
    while (StaticForFirebaseUser.allByUserId == []) {
        console.log("while")
    }
    var user = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var json = "";
    var userDetailes = [];
    var flag = false;
    var ref = new Firebase('https://himur-kfiaty-users-default-rtdb.firebaseio.com/');
    ref.on("value", function(snapshot) {
        var data = snapshot.val();
        var i = 0;
        var jstring = JSON.stringify(data);
        json = JSON.parse(jstring);
        if (json == null) {
            alert("אין משתמשים רשומים במערכת")
        } else {
            for (var k in json["Users"]) {
                userDetailes[i] = json["Users"][k];
                i++;
            }
        }
    });
    for (var i = 0; i < userDetailes.length; i++) {
        if (userDetailes[i]["user"] == user && userDetailes[i]["password"] == password) {
            flag = true;
        }
    }
    if (flag) {
        displayElement(table, "flex");
        displayElement("pass", "none");
        StaticForFirebase.user = user;
        table == 'betsByUser' ? getBets(user) : watchAllBets(user);
    } else {
        alert("שם המשתמש לא מתאים לסיסמא!!!");
    }
}

function getUserBets(user) {
    if (StaticForFirebaseUser.allByUser.length == 0) {
        var json1 = {};
        var count = 0;
        var ref = new Firebase('https://himur-kfiaty-users-bets-default-rtdb.firebaseio.com/');
        ref.on("value", function(snapshot) {
            var data = snapshot.val();
            var jstring = JSON.stringify(data);
            json1 = JSON.parse(jstring);
            for (var i in json1[user]) {
                StaticForFirebaseUser.allByUser[count] = json1[user][i];
                StaticForFirebaseUser.allByUserId[count] = json1[user][i]["id"];
                count++;
            }

        });
    }
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

function createLabel(id, value) {
    return `<label for="${id}"> ${value} </label>`
}

function writeResults(inputPre, id, team, time) {
    var elem = document.getElementById(inputPre + id);
    var writeElem = document.getElementById("resultWrite" + inputPre);
    console.log("resultWrite" + inputPre)
    var val = elem.value;
    val == '' ? writeElem.innerHTML = '' : writeElem.innerHTML = `${val} : ${team}  ${time}`;
}

function watchMaor(bet) {
    var text = StaticForFirebaseUser.allBets[bet]["maor"].replaceAll('</br>', '');
    alert(text);

}

function getBets(user) {
    document.getElementById("h1").innerHTML = "שלום " + breakline + user;
    document.getElementById("h1").style.textAlign = "center";
    var maor = "";
    var body = "";
    var type = "";
    console.log(StaticForFirebaseUser.allByUser)
    var table = document.getElementById("betsByUser");
    for (var i in StaticForFirebaseUser.allByUser) {
        console.log(StaticForFirebaseUser.allByUser[i])
    }
    for (i in StaticForFirebaseUser.allBets) {
        var row = table.insertRow();
        id = StaticForFirebaseUser.allBets[i]["totalId"];
        type = StaticForFirebaseUser.allBets[i]["type"];
        var maorVal = StaticForFirebaseUser.allBets[i]["maor"];
        var maorBtn = `<button id="buttonMaor${id}" onclick="watchMaor('${i}')">צפה בפינה</button>`;
        maor = (typeof maorVal === 'undefined' || maorVal == '') ? 'אין פינה' : maorBtn;
        typeH = type == 'soccer bet' ? 'כדורגל' : 'כדורסל';

        var awaybet = StaticForFirebaseUser.allBets[i]["away"];
        var homebet = StaticForFirebaseUser.allBets[i]["home"];
        body = type == 'soccer bet' ? StaticForFirebaseUser.allBets[i]["body"] : StaticForFirebaseUser.allBets[i]["body"][0] + breakline +
            StaticForFirebaseUser.allBets[i]["body"][1] + breakline +
            StaticForFirebaseUser.allBets[i]["body"][2] + breakline +
            StaticForFirebaseUser.allBets[i]["body"][3] + breakline +
            StaticForFirebaseUser.allBets[i]["body"][4];
        var includes = body.includes("+");
        var userBet = getBetById(id, type, includes, StaticForFirebaseUser.allByUser);
        var time = StaticForFirebaseUser.allBets[i]["hour"];
        var flag = StaticForFirebaseUser.allByUserId.includes(StaticForFirebaseUser.allBets[i]["totalId"]) ? "הימר" : "לא הימר";
        var color = flag == 'הימר' ? 'green' : 'red';
        var ToDate = new Date().getTime();
        var thisDate = new Date(StaticForFirebaseUser.allBets[i]["hour"]).getTime();
        var operation = (ToDate > thisDate ? 'זמן ההימור עבר' : (color == 'red' ? 'המר' : 'שנה הימור'));
        let btn = operation != 'זמן ההימור עבר' ? `<button id="button${id}">` + operation + '</button>' : operation;
        let isButton = operation != 'זמן ההימור עבר' ? 2 : 0;
        let disabled = operation == 'זמן ההימור עבר' ? 'disabled' : '';
        var betAway = createLabel("Away", awaybet) + '<input type="text" inputmode="numeric" pattern="[0-9]*"' + 'id="Away' + id + `" onkeyup="writeResults('Away', ${id},'${awaybet}',',')" style="width : 25%; height: 25%; align-text: right" ${disabled}/>`;
        var betHome = createLabel("home", homebet) + '<input type="text" inputmode="numeric" pattern="[0-9]*"' + 'id="Home' + id + `" onkeyup="writeResults('Home', ${id},'${homebet}', ' - סיום')" style="width : 25%; align-text: right" ${disabled}/>`;
        var betAwayHT = "";
        var betHomeHT = "";
        if (includes) {
            betAwayHT = createLabel("Away", awaybet) + '<input type="text"' + 'id="AwayHT' + id + `" onkeyup="writeResults('AwayHT', ${id},'${awaybet}',',')" style="width :25%" ${disabled}/>`;
            betHomeHT = createLabel("home", homebet) + '<input type="text"' + 'id="HomeHT' + id + `" onkeyup="writeResults('HomeHT', ${id},'${homebet}', ' - מחצית')" style="width : 25%" ${disabled}/>`;
        }
        var idDisplay = `${id} / ${StaticForFirebaseUser.allBets[i]["perYear"]}`
        insertRowToTable(row, idDisplay, 0, "id", id, "betsCalass", 0)
        insertRowToTable(row, typeH, 1, "type", id, "betsCalass", 0)
        var elem = document.getElementById("type" + id);
        elem.setAttribute("betType", type);
        insertRowToTable(row, createTimer(time, id), 2, "hour", id, "betsCalass", 0);
        insertRowToTable(row, betHomeHT + breakline + betHome, 3, "betH", id, "betsCalass", 1);
        insertRowToTable(row, betAwayHT + breakline + betAway, 4, "betA", id, "betsCalass", 1);
        insertRowToTable(row, body, 5, "body", id, "betsCalass", 0);
        insertRowToTable(row, maor, 6, "bodyBet", id, "betsCalass", 0);
        insertRowToTable(row, flag, 7, "flag", id, "betsCalass", 0);
        colored_staus("flag" + id, color, "betsCalass");
        insertRowToTable(row, btn, 8, "click", id, "betsCalass", isButton);
        insertRowToTable(row, userBet, 9, "bodybet", id, "betsCalass", 0);
        document.getElementById("click" + id).innerHTML = btn;
        var elemH = document.getElementById("betH" + id);
        elemH.setAttribute("homeTeam", homebet);
        var elemH = document.getElementById("betA" + id);
        elemH.setAttribute("awayTeam", awaybet);
    }
}

function getLimit(str) {
    var matches = str.match(/(\d+)/);
    if (matches) {
        return matches[0];
    }
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

function navigateBetButton(btn) {
    var idBet = btn.getAttribute("idbet");
    var value = document.getElementById("button" + idBet).innerHTML;
    value == 'שנה הימור' ? changeSpecificBet(btn) : getSepcificBet(btn);
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

function createChangeFormat(idBet, includes, bet) {
    var betId = document.getElementById(parseInt(idBet) + 6);
    var homeTxt = 'Home';
    var awayTxt = 'Away';
    betId.innerHTML = 'הימר';
    betId.style.color = 'green';
    document.getElementById("button" + idBet).innerHTML = 'שנה הימור';
    document.getElementById("bodybet" + idBet).innerHTML = getBetById(idBet, bet["type"], includes, StaticForFirebaseUser.allByUser);
    document.getElementById(homeTxt + idBet).value = '';
    document.getElementById("resultWriteAway").innerHTML = '';
    document.getElementById("resultWriteHome").innerHTML = '';
    document.getElementById(awayTxt + idBet).value = '';
    if (includes) {
        document.getElementById(homeTxt + 'HT' + idBet).value = '';
        document.getElementById(awayTxt + 'HT' + idBet).value = '';
        document.getElementById("resultWriteAwayHT").innerHTML = '';
        document.getElementById("resultWriteHomeHT").innerHTML = '';
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

function displayElement(elem, situation) {
    document.getElementById(elem).style.display = situation;
}

function insertIntoSelect(select, elem, bonus) {
    var option = document.createElement('option');
    option.id = elem + bonus;
    var text1 = elem;
    option.text = text1;
    select.add(option);
}

function getAlert(home, away, word) {
    var alert1 = home == "" ? ` עבור קבוצת בית לא הכנסת תוצאת ${word}` + "\r\n" : "";
    alert1 += away == "" ? `עבור קבוצת חוץ לא הכנסת תוצאת ${word}` + "\r\n" : "";
    alert1 += isNaN(home) || isNaN(away) ? "חייב להכניס מספר לתוצאה" + "\r\n" : "";
    return alert1;
}

function sortByItem(results, item) {
    var ItemArray = Object.keys(results).map(function(key) {
        return [key, results[key]];
    });

    ItemArray.sort(function(a, b) { return b[1][item] - a[1][item] });
    return ItemArray;
}
