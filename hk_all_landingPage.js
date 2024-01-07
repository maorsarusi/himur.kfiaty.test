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

function writeResults(inputPre, id, team, time) {
    var elem = document.getElementById(inputPre + id);
    var writeElem = document.getElementById("resultWrite" + inputPre);
    console.log("resultWrite" + inputPre)
    var val = elem.value;
    val == '' ? writeElem.innerHTML = '' : writeElem.innerHTML = `${val} : ${team}  ${time}`;
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