let oldDisplay = 0;
let newDisplay = 0;
let lastOperation = -3;
let memNum = 0;
let isDec = 0;
let isMemDec = 0;
let isNewNum = 1;
let lastEqual = 0;
let memory = "";

function showNewDisplay(){
    console.log("showNewDisplay():"+newDisplay);
    document.getElementById("display").innerHTML = newDisplay;
}

function showOldDisplay(){
    console.log("showOldDisplay():"+oldDisplay);
    document.getElementById("display").innerHTML = oldDisplay;
}

function showMemory(str){
    document.getElementById("memory").innerHTML += str;
    document.getElementById("memory").scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function theNumber(number){
    if(isNewNum == 1){
        console.log("newNum");
        newDisplay = 0;
        isNewNum = 0;
        isDec = 0;
        if(lastEqual == 1){
            lastOperation = -3;
            lastEqual = 0;
        }
    }
    if(isDec == 0){ //not a decimal number
        newDisplay *= 10;
        newDisplay += Number(parseFloat(number));
        showNewDisplay();
    }
    else {
        newDisplay = String(newDisplay)+number;
        newDisplay = newDisplay;
        showNewDisplay();
        console.log("theNumber():"+newDisplay);
    }
}

function addDecimal(){
    if(isNewNum == 1){
        newDisplay = 0;
        isNewNum = 0;
        isDec = 0;
        if(lastEqual == 1){
            lastOperation = -3;
            lastEqual = 0;
        }
    }
    if(isDec !=1){
        newDisplay = newDisplay+'.';
        isDec = 1;
    }
    showNewDisplay();
}

function operation(newOperation){
    /*operations key:
    -3 sentinel first operation
    -2 CE
    -1 C
    0 =
    1 +
    2 -
    3 *
    4 /
    5 +/-
    6 %
    7 ^
    8 MC
    9 MR
    10 M+
    11 M-
    12 MS
    13 1/x
    14 root x
    15 10^x */
    
    console.log("operation start oldDisplay:"+oldDisplay+" newDisplay:"+newDisplay+" newOperation:"+newOperation+" lastOperation:"+lastOperation);

    if(newOperation == -2){ //CE
        oldDisplay = 0;
        newDisplay = 0;
        isDec = 0;
        showNewDisplay();
        lastOperation = -3;
        isNewNum = 1;
        console.log("**************CE************");
        showMemory("CE<br>");
        return;
    }

    if(newOperation == -1){ //C
        newDisplay = 0;
        isDec = 0;
        isNewNum = 1;
        showNewDisplay();
        showMemory("*C*");
        return;
    }

    if(newOperation == 5){ // -/+
        
        for(var i = 0; i < newDisplay.length; i++)
            showMemory("\d");
        newDisplay *= -1;
        showMemory("x-1="+newDisplay);
        showNewDisplay();

        return;
    }

    if(newOperation == 8){ // mem clear
        memNum = 0;
        isMemDec = 0;
        showMemory("(MC)");
        return;
    }

    if(newOperation == 9){ // mem return
        newDisplay = memNum;
        isDec = isMemDec;
        isNewNum = 0;
        showNewDisplay();
        showMemory("(MR)"+newDisplay);
        return;
    }

    if(newOperation == 10){ // mem +
        oldDisplay = newDisplay + memNum;
        isNewNum = 1;
        showOldDisplay();
        showMemory("(M+)+"+oldDisplay);
        return;
    }

    if(newOperation == 11){ // mem -
        oldDisplay = newDisplay - memNum;
        isNewNum = 1;
        showOldDisplay();
        showMemory("(M-)-"+oldDisplay);
        return;
    }

    if(newOperation == 12){ // mem store
        if(lastEqual == 0){ // not = pressed last
            memNum = newDisplay;
            newDisplay = 0;
            isNewNum = 1;
            showMemory("*MS*");
            showNewDisplay();
        }
        else{
            memNum = oldDisplay;
            oldDisplay = 0;
            showMemory("*MS*");
            showOldDisplay();
        }
        isMemDec = isDec;
        lastOperation = -3;
        lastEqual = 0;
        return;
    }

    if(newOperation == 13){ //1/x
        if(newDisplay == 0){
            document.getElementById("display").innerHTML = "ErrorDiv0 ";
            showMemory("ErrorDiv0");
            oldDisplay = 0;
            newDisplay = 0;
            isDec = 0;
            lastOperation = -3;
            isNewNum = 1;
            return;
        }
        newDisplay = 1/newDisplay;
        isNewNum = 1;
        showNewDisplay();
        showMemory(oldDisplay);
        return;
    }

    if(isDec == 1){
        let len = newDisplay.length;
        newDisplay = parseFloat(newDisplay);;
        newDisplay = newDisplay.toPrecision(len);
    }

    if(lastEqual == 0){
        switch(newOperation){
            case 1:
                showMemory(newDisplay+"+");
                break;
            case 2:
                showMemory(newDisplay+"-");
                break; 
            case 3:
                showMemory(newDisplay+"x");
                break;           
            case 4:
                showMemory(newDisplay+"/");
                break;
            case 6:
                showMemory(newDisplay+"%");
                break;
            case 7:
                showMemory(newDisplay+"^");
                break;
            case 14:
                showMemory(newDisplay+"&#8730");
                break;
            case 15:
                showMemory(newDisplay+"x10^")
        }
    }

    if(lastEqual == 1){
        switch(newOperation){
            case 1:
                showMemory(oldDisplay+"+");
                break;
            case 2:
                showMemory(oldDisplay+"-");
                break; 
            case 3:
                showMemory(oldDisplay+"x");
                break;           
            case 4:
                showMemory(oldDisplay+"/");
                break;
            case 6:
                showMemory(oldDisplay+"%");
                break;
            case 7:
                showMemory(oldDisplay+"^");
                break;
            case 14:
                showMemory(oldDisplay+"&#8730");
                break;
            case 15:
                showMemory(oldDisplay+"x10^")
        }
    }


    if(isNewNum != 1 || (lastEqual == 1 && newOperation == 0)){ //not a new number and = pressed
        var str = "";
        switch(lastOperation){
            case -3:
                oldDisplay = parseFloat(newDisplay); 
                console.log("case -3 sentinel oldDisplay:"+oldDisplay);
                newDisplay = 0;
                break;
            case 1: // +
                console.log("++++  "+oldDisplay+"+"+newDisplay);
                oldDisplay += parseFloat(newDisplay);
                showOldDisplay();
                str = "+";
                break;
            case 2: // -
                console.log("----  "+oldDisplay+"-"+newDisplay);
                oldDisplay -= parseFloat(newDisplay);
                showOldDisplay();
                str = "-";
                break;
            case 3: // *
                console.log("****  "+oldDisplay+"*"+newDisplay);
                oldDisplay *= parseFloat(newDisplay);
                showOldDisplay();
                str = "x";
                break;
            case 4: // /
                console.log("////  "+oldDisplay+"/"+newDisplay);
                console.log("operation / oldDisplay:"+oldDisplay+" newDisplay:"+newDisplay+" newOperation:"+newOperation+" lastOperation:"+lastOperation);
                if(newDisplay == 0){
                    document.getElementById("display").innerHTML = "ErrorDiv0 ";
                    showMemory("ErrorDiv0");
                    oldDisplay = 0;
                    newDisplay = 0;
                    isDec = 0;
                    lastOperation = -3;
                    isNewNum = 1;
                    return;
                }
                oldDisplay /= parseFloat(newDisplay);
                showOldDisplay();
                str = "/";
                break;
            case 6:
                oldDisplay = parseFloat(oldDisplay % newDisplay);
                showOldDisplay();
                str = "%";
                break;
            case 7:
                oldDisplay = parseFloat(oldDisplay ** newDisplay);
                showOldDisplay();
                str = "^";
                break;
            case 14: // x root y
                oldDisplay = parseFloat(oldDisplay**(1/newDisplay));
                showOldDisplay();
                str = "&#8730";
                break;
            case 15: // 10^x
                oldDisplay = parseFloat(oldDisplay*(10**newDisplay));
                showOldDisplay();
                str = "x10^";
                break;
        }
        if((lastEqual == 1 && newOperation == 0)) showMemory(str);
    }

    if(newOperation == 0){ // =
        console.log("= operation");
        showMemory(newDisplay+"="+oldDisplay+"<br>");
        showOldDisplay();
        lastEqual = 1;
    }
    else{
        lastOperation = newOperation;
        lastEqual = 0;
    }

    isDec = 0;
    isNewNum = 1;

    console.log("operation end oldDisplay:"+oldDisplay+" newDisplay:"+newDisplay+" newOperation:"+newOperation+" lastOperation:"+lastOperation);

}


