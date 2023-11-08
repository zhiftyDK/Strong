const name = document.getElementById("name");
const purpose = document.getElementById("purpose");
const nextbtn = document.getElementById("nextbtn");
const backbtn = document.getElementById("backbtn");

let i = 0;

nextbtn.addEventListener("click", () => {
    backbtn.removeAttribute("disabled");
    if(i < 1) {
        i++;
    }
    if(i == 1) {
        nextbtn.innerText = "Opret træningsprogram";
    }
    renderPage();
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