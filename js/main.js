var debug=false;

var ptr=0;
var memArr=[0];
var loopPtr=-1;
var loopStack=[];
var code;
var inputPtr=0;
var input;
var outputStr="";

var uniConFlag=false;
var uniChar=[];

var unConvertedCode="";

var ini= function(){
    ptr=0;
    memArr=[0];
    loopPtr=-1;
    loopStack=[];
    code;
    inputPtr=0;
    input;
    outputStr="";

    uniConFlag=false;
    uniChar=[];
    
}

var opreatorCheck = function()
{
    
    for(i=0;i<operArr.length;i++){
        if(operArr[i].value==""){
            alert("operator error:operator can't be nothing");
            return 0;
        }
        for(j=0;j<operArr.length;j++){
            if(operArr[i].value==operArr[j].value)
            {
                if(i!=j){
                    alert("operator error:operator same symbol");
                    return 0;
                }
            }
        }        
    }
    return 1;
}

var scanner=function(){
    code=codeMain.value.replace(/\r\n|\n/g,"").split("");
    var errorFlag=false;
    for(i=0;i<code.length;i++){
        switch (code[i])
        {
            case ptrNextOper.value:
            case ptrLastOper.value:
            case plusOper.value:
            case minustOper.value:
            case charOutOper.value:
            case charInOper.value:
            case loopStartOper.value:
            case loopEndOper.value:
            case uniConOper.value:
            break;
            default:
                alert("syntax error:unkonw opreator",code[i]);
                return 0;
            break;
        }
    }
    return 1;    
}

var inputCheck=function(){
    if(inputData!=""){
    input=inputData.value.split(" ");
    for(i=0;i<input.length;i++)
    {
        if(input[i].length>1||input[i].charCodeAt(0)>127)
        {
            alert("input error",input[i]);
            return 0;
        }
    }
    input=input.map(
        element=>{
            return element.charCodeAt(0);
        }
    );
    debugLog(input);
    }
    return 1;
}

var parser = function()
{
    debugLog("parse");
    for(progressCounter=0;progressCounter<code.length;progressCounter++){
        debugLog(code[progressCounter],progressCounter);
        switch (code[progressCounter])
        {
            case ptrNextOper.value:
                ptr++;
                if(memArr.length<(ptr+1)){
                    memArr.push(0);
                }
                debugLog("ptrNextOper",ptr);
            break;
            case ptrLastOper.value:
                ptr--;
                debugLog("ptrLastOper",ptr);
            break;
            case plusOper.value:
                memArr[ptr]++;
                debugLog("plusOper", memArr[ptr]);
            break;
            case minustOper.value:
                memArr[ptr]--;
                debugLog("minustOper", memArr[ptr]);
            break;
            case charOutOper.value:
                if(!uniConFlag)
                {
                    debugLog("charOutOper",memArr[ptr]);
                    outputStr+=String.fromCharCode(memArr[ptr]);
                }
                else
                {
                    debugLog(memArr[ptr]);
                    uniChar.push(memArr[ptr]);
                }
            break;
            case charInOper.value:
                memArr[ptr]=input[inputPtr];
                inputPtr++;
            break;
            case loopStartOper.value:
                loopStack.push(progressCounter);
                loopPtr++;
            break;
            case loopEndOper.value:
                if(memArr[ptr]!=0){
                    debugLog("loop",loopStack,memArr[ptr]);
                    progressCounter=loopStack[loopPtr];
                }
                else
                {
                    loopStack.pop();
                    loopPtr--;
                    debugLog("loop pop",loopStack,memArr[ptr]);
                }
            break;
            case uniConOper.value:
            if(!uniConFlag){
                debugLog("uniConOper",uniConFlag);
                uniConFlag =true;
            }
            else
            {
                debugLog("uniConOper",uniConFlag);
                if(uniChar.length!=4){
                    alert("unicode error:invalid input number");
                    return;
                }
                for(i=0;i<uniChar.length;i++){
                    if(uniChar[i]>15||uniChar[i]<0){
                        alert("unicode error:invalid input code number"+uniChar[i]);
                        return;
                    }
                    uniChar[i]=uniChar[i].toString(16);
                }
                outputStr+=eval("'\\u"+uniChar[0]+uniChar[1]+uniChar[2]+uniChar[3]+"'");
                uniChar=[];
                uniConFlag=false;
            }
            break;
        }
    }
}

var excuteAll = function()
{
    if(!scanner()||!inputCheck()||!opreatorCheck())
    {
        return ;
    }
    ini();
    parser();
    output.value+=outputStr;
}

var operConvert = function(){

    if(opreatorCheck()){
        if(unConvertedCode==""){
            unConvertedCode=codeMain.value;
        }
        codeMain.value=unConvertedCode.replace(/\r\n|\n/g,"").replace(/>/g,ptrNextOper.value).replace(/</g,ptrLastOper.value)
        .replace(/\+/g,plusOper.value).replace(/-/g,minustOper.value).replace(/\./g,charOutOper.value)
        .replace(/,/g,charInOper.value).replace(/\[/g,loopStartOper.value).replace(/]/g,loopEndOper.value)
        .replace(/'/g,uniConOper.value);
    }
}

var operConvertRe= function(){
    codeMain.value=unConvertedCode;
}



var debugLog = function(){
    if(debug)
    {
        logStr="";
        for(i=0;i<arguments.length;i++){
            logStr+=arguments[i]+" ";
        }
        console.log(logStr);
    }
}