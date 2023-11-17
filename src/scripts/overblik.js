function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

if(localStorage.getItem("jsonwebtoken")) {
    document.getElementById("loggedout").style.display = "none";
    fetch("http://localhost:3000/trainingprogram/getprivate", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            jsonwebtoken: localStorage.getItem("jsonwebtoken")
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.error) {
            console.log(data.message);
        }
        if(data.trainingprograms.length == 0) {
            document.getElementById("loggedout").style.display = "block";
            document.getElementById("loggedout").innerText = "Du har ikke oprettet et træningsprogram endnu!";
        } else {
            document.getElementById("loggedout").remove();
            document.getElementById("trainingprograms").innerHTML = "";
        }
        data.trainingprograms.forEach(program => {
            const div = document.createElement("div");
            div.classList = "card bg-lightdark";
            div.style.width = "18rem";
            div.style.color = "white";
            div.innerHTML = `
            <div class="card-body d-flex flex-column">
                <div class="d-flex justify-content-center mb-3" style="font-size: 50px;">
                    <i class="fa-solid fa-wifi"></i>
                </div>
                <h5 class="card-title text-center">${program.name}</h5>
                <p class="card-text text-center"><strong>Formål:</strong> ${program.purpose}</p>
                <p class="card-text text-center"><strong>Antal øvelser:</strong> ${program.exercises.length}</p>
                <button class="btn btn-primary mt-auto" data-bs-toggle="modal" data-bs-target="#trainingprogrammodal" onclick="openProgram('${program.id}')">Se Program</button>
                <button class="btn btn-danger mt-3" onclick="deleteProgram('${program.id}')">Slet</button>
            </div>
            `;
            document.getElementById("trainingprograms").appendChild(div);
        });
    });
}

function openProgram(id) {
    fetch("http://localhost:3000/trainingprogram/getprivate", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            jsonwebtoken: localStorage.getItem("jsonwebtoken")
        })
    })
    .then(response => response.json())
    .then(data => {
        const trainingprogram = data.trainingprograms.filter(obj => {return obj.id == id;})[0]
        document.getElementById("trainingprogramlabel").innerText = trainingprogram.name;
        fetch("/exercises.json")
        .then(response => response.json())
        .then(data => {
            document.getElementById("exercises").innerHTML = "";
            trainingprogram.exercises.forEach(exercise => {
                data.exercises.forEach(listExercise => {
                    if(exercise.name == listExercise.name) {
                        const li = document.createElement("li");
                        li.classList = "list-group-item btn-bg-main color-main";
                        li.style.padding = "1.5rem";
                        li.innerHTML = `
                        <img src="${listExercise.imageLink}" style="width: 3rem;">
                        <label class="form-check-label mx-3"><strong>Name:</strong> ${exercise.name} <strong>Reps:</strong> ${exercise.reps} <strong>Sets:</strong> ${exercise.sets}</label>
                        `;
                        document.getElementById("exercises").appendChild(li);
                    }
                });
            });
        });
    });
}

function deleteProgram(id) {
    fetch("http://localhost:3000/trainingprogram/delete", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            jsonwebtoken: localStorage.getItem("jsonwebtoken"),
            id: id
        })
    })
    .then(response => response.json())
    .then(data => {
        if(!data.error) {
            location.reload();
        }
        console.log(data.message);
    })
}