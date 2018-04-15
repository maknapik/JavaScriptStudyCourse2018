function Student(name)
{
    this.name = name;
    this.subjects = [];
}
function Subject(name, grade)
{
    this.name = name;
    this.grade = grade;
}

var students = [];

function addgrade(studentname, name, grade)
{
    var sub = false;
    var stu = false;
    for(i = 0 ; i < students.length ; i++)
    {
        if(students[i].name == studentname)
        {
            stu = true;
            for(j = 0 ; j < students[i].subjects.length ; j++)
            {
                if(students[i].subjects[j].name == name)
                {
                    sub = true;
                    students[i].subjects[j].grade = grade;
                }
            }
            if(!sub)
            {
                console.log("New subject");
                students[i].subjects.push(new Subject(name, grade));
            }
        }
    }
    if(!stu)
    {
        console.log("New student");
        students.push(new Student(studentname));
        students[students.length-1].subjects.push(new Subject(name, grade));
    }
}

function showstudent(student)
{
    console.log("Name: " + student.name);
    showsubjects(student);
    srednia(student);
    mediana(student);
    odchylenie(student);
}

function showsubjects(student)
{
    for(var i = 0 ; i < student.subjects.length ; i++)
    {
        console.log("Name: " + student.subjects[i].name + ", grade: " + student.subjects[i].grade);
    }
}

function srednia(student)
{
    var sum = 0;
    var id = 0;
    for(var i = 0 ; i < student.subjects.length ; i++)
    {
        sum += parseInt(student.subjects[i].grade);
        id++;
    }
    console.log("Srednia: " + sum / id);
}

function mediana(student)
{
    var grades = [];
    for(var i = 0 ; i < student.subjects.length ; i++)
    {
        grades.push(student.subjects[i].grade);
    }
    grades.sort();
    if(grades.length % 2 == 0)
    {
        console.log("Mediana: " + (parseInt(grades[parseInt(grades.length / 2 - 1)]) + parseInt(grades[parseInt(grades.length / 2)])) / 2);
    }
    else
    {
        console.log("Mediana: " + grades[parseInt(grades.length / 2)]);
    }
}

function odchylenie(student)
{
    var sum = 0;
    var id = 0;
    for(var i = 0 ; i < student.subjects.length ; i++)
    {
        sum += parseInt(student.subjects[i].grade);
        id++;
    }
    sum /= id;

    var s2 = 0;
    for(var i = 0 ; i < student.subjects.length ; i++)
    {
        s2 += (parseInt(student.subjects[i].grade) - sum)^2;
        id++;
    }
    s2 /= id;
    s2 = Math.sqrt(s2);
    console.log("Odchylenie: " + s2);
}

function work()
{
    var str = document.forms[0].elements[0].value;
    var inf = str.split(",");
    if(inf.length < 3)
    {
        window.alert("Wrong number of arguments!");
        return;
    }
    addStudentToList(inf[0]);
    addgrade(inf[0], inf[1], inf[2]);
    addSubjectToList(inf[1]);
}

function show()
{
    for(var i = 0 ; i < students.length ; i++)
    {
        showstudent(students[i]);
    }
}

function addStudentToList(s)
{
    var select = document.getElementById("selectStudent");
    for(var i = 0 ; i < students.length ; i++)
    {
        if(s == students[i].name) return;
    }
    var opt = s;
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select.appendChild(el);
}

var subjects = [];

function addSubjectToList(s)
{
    var select = document.getElementById("selectSubject");
    for(var i = 0 ; i < students.length ; i++)
    {
        if(subjects.indexOf(s) != -1) return;
    }
    subjects.push(s);
    var opt = s;
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select.appendChild(el);
}

function convertGrades(student)
{
    var grades = [0, 0, 0, 0, 0, 0];
    var names = ["ndst", "dop", "dst", "db", "bdb", "cel"];
    var subjects = [];

    for(var i = 0 ; i < student.subjects.length ; i++)
    {
        grades[student.subjects[i].grade - 1] += 1;
    }
    for(var i = 0 ; i < 6 ; i++)
    {
        subjects.push(new Subject(names[i], grades[i]));
    }
    return subjects;
}

function convertGradesSubject(subject)
{
    var grades = [0, 0, 0, 0, 0, 0];
    var names = ["ndst", "dop", "dst", "db", "bdb", "cel"];
    var subjects = [];
    for(var i = 0 ; i < students.length ; i++)
    {
        for(var j = 0 ; j < students[i].subjects.length ; j++)
        {
            if(students[i].subjects[j].name == subject)
            {
                grades[students[i].subjects[j].grade - 1] += 1;
            }
        }
    }
    for(var i = 0 ; i < 6 ; i++)
    {
        subjects.push(new Subject(names[i], grades[i]));
    }
    return subjects;
}

function student(f)
{
    var form = document.getElementById("selectSubject")
    form.selectedIndex = 0
    var ctx = document.getElementById("chart");
    for(var i = 0 ; i < students.length ; i++)
    {
        if(f.value == students[i].name)
        {
            drawChart(ctx, convertGrades(students[i]));
        }
    }
}

function subject(f)
{
    var form = document.getElementById("selectStudent")
    form.selectedIndex = 0
    var ctx = document.getElementById("chart");
    for(var i = 0 ; i < subjects.length ; i++)
    {
        if(f.value == subjects[i])
        {
            drawChart(ctx, convertGradesSubject(f.value));
        }
    }
}

/*********************WYKRES***************************/

function drawSlice(ctx, centerX, centerY, radius, startAngle, endAngle, color)
{
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
}
var colors = ["#fde23e", "#f16e23", "#57d9ff", "#937e88", "#18e03d", "#0019ff"]

function drawChart(ctx, data)
{
    var total = 0;
    var cind = 0;

    for(s in data)
    {
        var val = parseInt(data[s].grade);
        total += val
    }
    var startAngle = 0;

    for(s in data)
    {
        var sliceAngle = 2 * Math.PI * parseInt(data[s].grade) / total;

        var sliceRadius = Math.min(ctx.width/2,ctx.height/2);
        var labelX = ctx.width/2 + (sliceRadius / 2) * Math.cos(startAngle + sliceAngle/2);
        var labelY = ctx.height/2 + (sliceRadius / 2) * Math.sin(startAngle + sliceAngle/2);

        drawSlice(ctx.getContext("2d"), ctx.width/2, ctx.height/2, Math.min(ctx.width/2,ctx.height/2),
        startAngle, startAngle + sliceAngle, colors[cind]);

        var labelText = Math.round(100 * parseInt(data[s].grade) / total);
        if(labelText > 0)
        {
            var c = ctx.getContext("2d");
            c.fillStyle = "white";
            c.font = "bold 20px Arial";
            c.fillText(labelText+"%", labelX,labelY);
        }

        startAngle += sliceAngle;
        cind++;
    }

    cind = 0;
    var legendHTML = "";
    var legend = document.getElementById("legend");
    for (var i = 0 ; i < data.length ; i++)
    {
        legendHTML += "<div><span style='display:inline-block;width:20px;background-color:"+this.colors[cind++]+";'>&nbsp;</span> "+data[i].name+"</div>";
    }
    legend.innerHTML = legendHTML;
}