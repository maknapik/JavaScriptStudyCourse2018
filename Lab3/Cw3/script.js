var variable = 5

function update()
{
    variable = document.forms[0].elements[0].value
}
/****************************************/
function action()
{
    var el = document.getElementsByTagName("span")
    for(i = 0 ; i < el.length ; i++)
    {
        el[i].textContent = variable
    }
    if(variable == 0)
    {
        document.forms[0].elements[0].value = "0"
    }
    if(variable > 0) variable--
}