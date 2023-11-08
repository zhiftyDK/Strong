const express = require("express");
const app = express();

app.use(express.static("./src"))

app.post("/register", (req, res) => {
    const body = req.body;
});

app.listen(3000, () => {
    console.log("App is running strong! (pun intended)"); // Skriver dårlig humor til konsollen
});