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