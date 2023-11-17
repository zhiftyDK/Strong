function ValidateEmail(input) {
    var validRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (input.value.match(validRegex)) {
        return true;
    } else {
        return false;
    }
}

if(document.getElementById("loginbtn")) {
    document.getElementById("loginbtn").addEventListener("click", () => {
        const email = document.getElementById("email");
        const password = document.getElementById("password");
        if(!ValidateEmail(email)) {
            email.classList.add("is-invalid");
        } else {
            email.classList.remove("is-invalid");
        }
        fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        }).then(response => response.json())
        .then(data => {
            if(data.error) {
                console.log(data.message);
                return;
            }
            if(data.message == "User does not exist!") {
                location.assign("/register.html");
            }
            localStorage.setItem("jsonwebtoken", data.jsonwebtoken);
            location.assign("/index.html");
        });
    });
}

if(document.getElementById("registerbtn")) {
    document.getElementById("registerbtn").addEventListener("click", () => {
        const name = document.getElementById("name");
        const email = document.getElementById("email");
        const password = document.getElementById("password");
        if(name.value.length == 0 || email.value.length == 0 || password.value.length == 0) {
            console.log("All fields should be filled!");
            return;
        }
        if(!ValidateEmail(email)) {
            email.classList.add("is-invalid");
        } else {
            email.classList.remove("is-invalid");
        }
        fetch("http://localhost:3000/register", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name: name.value,
                email: email.value,
                password: password.value
            })
        }).then(response => response.json())
        .then(data => {
            if(data.error) {
                console.log(data.message);
            }
            location.assign("/login.html");
        });
    });
}

if(document.getElementById("deletebtn")) {
    document.getElementById("deletebtn").addEventListener("click", () => {
        console.log("Adding feature soon!");
        fetch("http://localhost:3000/deleteuser", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                jsonwebtoken: localStorage.getItem("jsonwebtoken")
            })
        }).then(response => response.json())
        .then(data => {
            if(data.error) {
                console.log(data.message);
            }
            localStorage.removeItem("jsonwebtoken");
            location.assign("/index.html");
        });
    });
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

function logout() {
    localStorage.removeItem("jsonwebtoken");
    location.assign("/login.html");
}

if(document.getElementById("account")) {
    if(localStorage.getItem("jsonwebtoken")) {
        document.querySelectorAll("#account a").forEach(btn => {
            btn.remove();
        });
        const payload = parseJwt(localStorage.getItem("jsonwebtoken"));
        const a = document.createElement("div");
        a.innerHTML = `
        <button class="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            ${payload.name}
        </button>
        <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="/account.html">Account</a></li>
            <li><a class="dropdown-item" href="javascript:logout()">Logout</a></li>
        </ul>
        `;
        a.classList.add("dropdown");
        document.getElementById("account").appendChild(a);
    }
}

window.addEventListener("load", () => {
    const current = new Date();
    if(Number(current.getTime().toString().substring(0, 10)) > parseJwt(localStorage.getItem("jsonwebtoken")).exp) {
        localStorage.removeItem("jsonwebtoken");
        location.assign("/login.html");
    }
});

const page = location.href.split("/")[location.href.split("/").length - 1];
if(page == "account.html") {
    if(localStorage.getItem("jsonwebtoken")) {
        const payload = parseJwt(localStorage.getItem("jsonwebtoken"));
        document.getElementById("name").value = payload.name;
        document.getElementById("email").value = payload.email;
    }
}