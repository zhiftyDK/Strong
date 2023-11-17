fetch("http://localhost:3000/trainingprogram/getall", {
    method: "GET",
    headers: {"Content-Type": "application/json"}
}).then(response => response.json())
.then(data => {
    if(data.error) {
        console.log(data.message);
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
            <p class="card-text text-center"><strong>Oprettet af:</strong> ${program.author}</p>
            <button class="btn btn-primary mt-3" data-bs-toggle="modal" data-bs-target="#trainingprogrammodal" onclick="openProgram('${program.id}')">Se Program</button>
        </div>
        `;
        document.getElementById("trainingprograms").appendChild(div);
    });
});

function openProgram(id) {
    fetch("http://localhost:3000/trainingprogram/getall", {
        method: "GET",
        headers: {"Content-Type": "application/json"}
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