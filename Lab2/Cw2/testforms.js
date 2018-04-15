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
            delete j;
        }
    }
    if(!stu)
    {
        console.log("New student");
        students.push(new Student(studentname));
        students[students.length-1].subjects.push(new Subject(name, grade));
    }
    delete i;
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
    delete i;
    return Number(sum/id);
}

function mediana(student)
{
    var grades = [];
    for(var i = 0 ; i < student.subjects.length ; i++)
    {
        grades.push(student.subjects[i].grade);
    }
    delete i;
    grades.sort();
    if(grades.length % 2 == 0)
    {
        return (parseInt(grades[parseInt(grades.length / 2 - 1)]) + parseInt(grades[parseInt(grades.length / 2)])) / 2;
    }
    else
    {
        return Number(grades[parseInt(grades.length / 2)]);
    }
}

function odchylenie(student)
{
    var sum = 0;
    var id = 0;
    for(var i = 0 ; i < student.subjects.length ; i++)
    {
        sum += Number(student.subjects[i].grade);
        id++;
    }
    sum /= id;

    var s2 = 0;
    for(var i = 0 ; i < student.subjects.length ; i++)
    {
        s2 += (Number(student.subjects[i].grade) - sum)^2;
        id++;
    }
    s2 /= id;
    s2 = Math.sqrt(s2);
    return Number(s2);
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
    addgrade(inf[0], inf[1], inf[2]);
}

function show()
{
    for(var i = 0 ; i < students.length ; i++)
    {
        showstudent(students[i]);
    }
}
/*****************************************************/
describe('Funkcja cyfry(), litery() i suma()', function()
{
    it('Pierwsza ocena', function()
    {
        addgrade("t", "r", "1");
        expect(srednia(students[0])).to.equal(1);
        expect(mediana(students[0])).to.equal(1);
        expect(odchylenie(students[0])).to.equal(1);
    });
    it('Druga ocena', function()
    {
        addgrade("t", "s", "2");
        expect(srednia(students[0])).to.equal(1.5);
        expect(mediana(students[0])).to.equal(1.5);
        expect(odchylenie(students[0])).to.equal(1);
    });
    it('Trzecia ocena', function()
    {
        addgrade("t", "g", "4");
        expect(srednia(students[0])).to.equal(2.3333333333333335);
        expect(mediana(students[0])).to.equal(2);
        expect(odchylenie(students[0])).to.equal(0.5773502691896257);
    });
});