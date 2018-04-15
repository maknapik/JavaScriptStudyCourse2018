var timeFunInterval = 0
var timeFunTimeout = 0
var timeFunRequest = 0
/***************************************************/
var oldTimeInterval = 0
var oldTimeTimeout = 0
var oldTimeRequest = 0
/***************************************************/
var matrixA = []
var matrixB = []
/***************************************************/
var intervalID
var timeoutID
var requestID
/***************************************************/
function start()
{
    intervalID = setInterval(funInterval, 1000)
    timeoutID = window.setTimeout(funTimeout, 1000)
    requestID = window.requestAnimationFrame(funRequest)
}
/***************************************************/
function stop()
{
    clearInterval(intervalID)
    window.clearTimeout(timeoutID)
    window.cancelAnimationFrame(requestID)
}
/***************************************************/
function funInterval()
{
    //console.log("funInterval")
    multiplyMatrix()
    timeFunInterval = Date.now() - oldTimeInterval
    oldTimeInterval = Date.now()
    console.log("timeFunInterval: " + timeFunInterval)
}
/***************************************************/
function funTimeout()
{
    //console.log("funTimeout")
    multiplyMatrix()
    timeFunTimeout = Date.now() - oldTimeTimeout
    oldTimeTimeout = Date.now()
    console.log("timeFunTimeout: " + timeFunTimeout)
    timeoutID = window.setTimeout(funTimeout, 1000)
}
/***************************************************/
function funRequest()
{
    //console.log("funRequest")
    multiplyMatrix()
    sleep(1000)
    timeFunRequest = Date.now() - oldTimeRequest
    oldTimeRequest = Date.now()
    console.log("timeFunRequest: " + timeFunRequest)
    requestID = window.requestAnimationFrame(funRequest)
}
/***************************************************/
function generateArrays()
{
    for(var i = 0 ; i < 10000000 ; i++)
    {
        matrixA.push(i*100)
        matrixB.push(i*100)
    }
    console.log("Arrays generated")
}
/***************************************************/
function multiplyMatrix()
{
    var result = new Array();//declare an array   

    //var numColsRows=$("#matrixRC").val();
    numColsRows=2;
    
    //iterating through first matrix rows
    for (var i = 0; i < numColsRows; i++) 
    {
        //iterating through second matrix columns
        for (var j = 0; j < numColsRows; j++) 
        { 
            var matrixRow = new Array();//declare an array
            var rrr = new Array();
            var resu = new Array();
            //calculating sum of pairwise products
            for (var k = 0; k < numColsRows; k++) 
            {
                rrr.push(parseInt(matrixA[i][k])*parseInt(matrixB[k][j]));
            }//for 3
            resu.push(parseInt(rrr[i])+parseInt(rrr[i+1]));

            result.push(resu);
            //result.push(matrixRow);
        }//for 2
    }//for 1
    return result;
}// function multiplyMatrix
/***************************************************/
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }