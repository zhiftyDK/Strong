const name = document.getElementById("name");
const purpose = document.getElementById("purpose");
const nextbtn = document.getElementById("nextbtn");
const backbtn = document.getElementById("backbtn");

if(localStorage.getItem("jsonwebtoken")) {
    document.getElementById("loggedout").remove();
    document.getElementById("loggedin").style.display = "flex";
}

let i = 0;

nextbtn.addEventListener("click", () => {
    if(name.value.length == 0 || purpose.value.length == 0) return console.log("You cant have empty fields!");
    backbtn.removeAttribute("disabled");
    if(i < 2) {
        i++;
    }
    if(i == 1) {
        nextbtn.innerText = "Opret træningsprogram";
    }
    if(i == 2) {
        fetch("/exercises.json")
        .then(response => response.json())
        .then(data => {
            const selectedExercises = [];
            data.exercises.forEach(exercise => {
                if(!document.getElementById(exercise.name.replaceAll(" ", "")).classList.contains("btn-bg-main")) {
                    const setsreps = [];
                    document.querySelectorAll(`#${exercise.name.replaceAll(" ", "")} .setsreps`).forEach(element => {
                        setsreps.push(element.value);
                    });
                    selectedExercises.push({
                        name: exercise.name,
                        reps: setsreps[0],
                        sets: setsreps[1]
                    });
                }
            });
            fetch("http://localhost:3000/trainingprogram/create", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    jsonwebtoken: localStorage.getItem("jsonwebtoken"),
                    name: name.value,
                    purpose: purpose.value,
                    exercises: selectedExercises
                })
            }).then(response => response.json())
            .then(data => {
                console.log(data.message);
                location.assign("/index.html");
            });
        });
    } else {
        renderPage();
    }
});

backbtn.addEventListener("click", () => {
    nextbtn.innerText = "Næste ->";
    if(i > 0) {
        i--;
    }
    if(i == 0) {
        backbtn.setAttribute("disabled", true);
    }
    renderPage();
});

function renderPage() {
    const pages = [].slice.call(document.getElementById("pages").children);
    pages.forEach(page => {
        page.style.display = "none";
        page.classList.add("fade-in");
    });
    const page = document.getElementById("page" + i);
    page.style.display = "block";
}

fetch("/exercises.json")
.then(response => response.json())
.then(data => {
    data.exercises.forEach(exercise => {
        const li = document.createElement("li");
        li.classList = "list-group-item btn-bg-main color-main";
        li.style.padding = "1.5rem";
        li.id = exercise.name.replaceAll(" ", "")
        li.onclick = function (e) {
            if(!e.target.classList.contains("setsreps")) {
                if(document.getElementById(exercise.name.replaceAll(" ", "")).classList.contains("btn-bg-main")) {
                    document.getElementById(exercise.name.replaceAll(" ", "")).classList.remove("btn-bg-main");
                    document.getElementById(exercise.name.replaceAll(" ", "")).style.backgroundColor = "#0D6EFD";
                    document.querySelectorAll(`#${exercise.name.replaceAll(" ", "")} .setsreps`).forEach(element => {
                        element.style.display = "block";
                    });
                } else {
                    document.getElementById(exercise.name.replaceAll(" ", "")).classList.add("btn-bg-main");
                    document.getElementById(exercise.name.replaceAll(" ", "")).style.backgroundColor = "#ffffff";
                    document.querySelectorAll(`#${exercise.name.replaceAll(" ", "")} .setsreps`).forEach(element => {
                        element.style.display = "none";
                    });
                }
            }
        }
        li.innerHTML = `
        <img src="${exercise.imageLink}" style="width: 3rem;">
        <label class="form-check-label">${exercise.name}</label>
        <input type="number" class="form-control setsreps mt-2" style="display: none;" onkeypress="return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57" placeholder="Reps">
        <input type="number" class="form-control setsreps mt-2" style="display: none;" onkeypress="return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57" placeholder="Sets">
        `;
        document.getElementById("exercises").appendChild(li);
    });
});