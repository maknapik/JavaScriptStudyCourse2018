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
function addEvents()
{
    var el = document.getElementsByTagName("header")
    el[0].addEventListener('mouseover', showContent);
    el = document.getElementsByTagName("aside")
    el[0].addEventListener('mouseover', showContent);
    el = document.getElementsByTagName("footer")
    el[0].addEventListener('mouseover', showContent);
    el = document.getElementsByTagName("nav")
    el[0].addEventListener('mouseover', showContent);
    el = document.getElementsByTagName("main")
    el[0].addEventListener('mouseover', showContent);
    el = document.getElementsByTagName("ul")
    el[0].addEventListener('mouseover', showContent);
    
}
/*******************************************/
function showContent()
{
    sleep(1000)
    console.log(this.textContent)
}
/*******************************************/
function sleep(milliseconds) 
{
    let start = new Date().getTime();
    for (let i = 0; i < 1e7; i++) 
    {
        if ((new Date().getTime() - start) > milliseconds)
        {
            break;
        }
    }
}