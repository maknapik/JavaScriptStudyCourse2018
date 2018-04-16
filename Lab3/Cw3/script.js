let variable = 5

function update()
{
    variable = document.forms[0].elements[0].value
}
/****************************************/
function action()
{
    let div1 = document.getElementById("d1")
    let div2 = document.getElementById("d2")
    let el1 = div1.getElementsByTagName("span")
    let el2 = div2.getElementsByTagName("span")
    let v = variable
    for(let i = 0 ; i < el1.length ; i++)
    {
        el1[i].textContent = variable
    }
    for(let i = el2.length - 1 ; i >= 0 & v > 0 ; i--)
    {
        el2[i].textContent = parseInt(v % 10)
        v /= 10;
    }
    if(variable == 0)
    {
        document.forms[0].elements[0].value = "0"
    }
    if(variable > 0) variable--
}