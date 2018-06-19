function getValue(x, y) {
    return $("#board").find("tr:eq(" + x + ")").find("td:eq(" + y + ")").text();
}

function getCell(x, y) {
    return $("#board").find("tr:eq(" + x + ")").find("td:eq(" + y + ")");
}

function typeX() {
    let v = false;
    for(let x = 0 ; x < 3 ; x++)
    {
        for(let y = 0 ; y < 3 ; y++)
        {
            if(getCell(x, y).text() == "")
            {
                v = true;
            }
        }
    }

    if(!v) checkScore();
    else {
        while(true) {
            let x = Math.floor(Math.random()*(2-0+1)+0);
            let y = Math.floor(Math.random()*(2-0+1)+0);
            if(getCell(x, y).text() == "")
            {
                getCell(x, y).text("X");
                checkScore();
                return;
            }
        }
    }
}

function checkScore() {
    let sum = 0;
    for(let x = 0 ; x < 3 ; x++) {
        sum = 0;
        for(let y = 0 ; y < 3 ; y++) {
            if(getCell(x, y).text() == "X") sum++;
        }
        if(sum == 3) computerWon();
    }
    for(let x = 0 ; x < 3 ; x++) {
        sum = 0;
        for(let y = 0 ; y < 3 ; y++) {
            if(getCell(y, x).text() == "X") sum++;
        }
        if(sum == 3) computerWon();
    }
    for(let x = 0 ; x < 3 ; x++) {
        sum = 0;
        for(let y = 0 ; y < 3 ; y++) {
            if(getCell(x, y).text() == "O") sum++;
        }
        if(sum == 3) userWon();
    }
    for(let x = 0 ; x < 3 ; x++) {
        sum = 0;
        for(let y = 0 ; y < 3 ; y++) {
            if(getCell(y, x).text() == "O") sum++;
        }
        if(sum == 3) userWon();
    }
    sum = 0;
    for(let i = 0 ; i < 3 ; i++) {
        if(getCell(i, i).text() == "X") sum++;
    }
    if(sum == 3) computerWon();
    sum = 0;
    for(let x = 2, y = 0 ; x >= 0, y < 3 ; x--, y++) {
        if(getCell(x, y).text() == "X") sum++;
    }
    if(sum == 3) computerWon();
    sum = 0;
    for(let i = 0 ; i < 3 ; i++) {
        //console.log("i: " + i + " " + getCell(i, i).text());
        if(getCell(i, i).text() == "O") sum++;
    }
    if(sum == 3) userWon();
    sum = 0;
    sum = 0;
    for(let x = 2, y = 0 ; x >= 0, y < 3 ; x--, y++) {
        if(getCell(x, y).text() == "O") sum++;
    }
    if(sum == 3) userWon();
}

function clearTable() {
    for(let x = 0 ; x < 3 ; x++)
    {
        for(let y = 0 ; y < 3 ; y++)
        {
            getCell(x, y).text("");
        }
    }
    $("#result").text("");
}

function userWon() {
    let old = parseInt($("#score").find("tr:eq(1)").find("td:eq(0)").text());
    $("#score").find("tr:eq(1)").find("td:eq(0)").text(++old);
    $("#result").text("User won!");
    setTimeout(clearTable, 1000);
}

function computerWon() {
    let old = parseInt($("#score").find("tr:eq(1)").find("td:eq(1)").text());
    $("#score").find("tr:eq(1)").find("td:eq(1)").text(++old);
    $("#result").text("Computer won!");
    setTimeout(clearTable, 1000);
}