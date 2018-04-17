let intervalID = 0
let time = Math.random() * (5 - 2) + 2
let angle = Math.random() * (180 - 20) + 20
/*******************************************/
function removeCSS()
{
    var el = document.getElementsByTagName("header")
    el[0].classList.add("empty")
    el = document.getElementsByTagName("aside")
    el[0].classList.add("empty")
    el = document.getElementsByTagName("footer")
    el[0].classList.add("empty")
    el = document.getElementsByTagName("nav")
    el[0].classList.add("empty")
    el = document.getElementsByTagName("main")
    el[0].classList.add("empty")
    el = document.getElementsByTagName("ul")
    el[0].classList.add("empty")
}
/*******************************************/
function addCSS()
{
    var el = document.getElementsByTagName("header")
    el[0].classList.remove("empty")
    el = document.getElementsByTagName("aside")
    el[0].classList.remove("empty")
    el = document.getElementsByTagName("footer")
    el[0].classList.remove("empty")
    el = document.getElementsByTagName("nav")
    el[0].classList.remove("empty")
    el = document.getElementsByTagName("main")
    el[0].classList.remove("empty")
    el = document.getElementsByTagName("ul")
    el[0].classList.remove("empty")
}
/*******************************************/
function rotate()
{
    console.log("Rotating")
    let main = document.getElementsByTagName("main")
    let aside = document.getElementsByTagName("aside")
    angle = (angle*2) % 360

    main[0].style.transform = "rotateZ("+ angle + "deg)"

    aside[0].style.transform = "rotateZ("+ -angle + "deg)"
}
/*******************************************/
function addTask()
{
    intervalID = setInterval(rotate, 1000*time)
}
/*******************************************/
function deleteTask()
{
    clearInterval(intervalID)
}
/*******************************************/
