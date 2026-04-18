async function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        const response = await fetch("http://localhost:8080/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.text();

        if (result === "Login Success") {
            localStorage.setItem("username", username);
            alert("Login Successful!");
            window.location.href = "dashboard.html";
        } else {
            alert("Invalid Credentials");
        }

    } catch (error) {
        console.error(error);
        alert("Error connecting to server");
    }
}


async function register() {
    const username = document.getElementById("regUsername").value.trim();
    const password = document.getElementById("regPassword").value.trim();

    try {
        const response = await fetch("http://localhost:8080/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.text();

        if (result === "Register Success") {
            alert("Account Created!");
            window.location.href = "login.html";
        } else {
            alert("Error in registration");
        }

    } catch (error) {
        console.error(error);
        alert("Server error");
    }
}


async function loadProfile() {

    const username = localStorage.getItem("username");

    if (!username) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/user/${username}`);
        const user = await response.json();

        document.getElementById("displayName").innerText = user.name || "Not Added";
        document.getElementById("displayUsername").innerText = user.username;
        document.getElementById("displayEmail").innerText = user.email || "Not Added";

        document.getElementById("name").value = user.name || "";
        document.getElementById("email").value = user.email || "";

    } catch (error) {
        console.error(error);
        alert("Error loading profile");
    }
}


async function updateProfile() {

    const username = localStorage.getItem("username");
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:8080/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                name,
                email,
                password
            })
        });

        const result = await response.text();
        alert(result);

    } catch (error) {
        console.error(error);
        alert("Error updating profile");
    }
}

async function transferMoney() {

    console.log("Transfer clicked");

    const sender = localStorage.getItem("username");
    const receiver = document.getElementById("receiver").value;
    const amount = document.getElementById("amount").value;

    try {
        const response = await fetch(`http://localhost:8080/transfer?sender=${sender}&receiver=${receiver}&amount=${amount}`, {
            method: "POST"
        });

        const result = await response.text();
        alert(result);
        loadBalance();

    } catch (error) {
        console.error(error);
        alert("Transfer failed");
    }
}
async function loadBalance() {

    const username = localStorage.getItem("username");

    const response = await fetch(`http://localhost:8080/balance/${username}`);
    const balance = await response.text();

    document.getElementById("balance").innerText = balance;
}

function logout() {
    localStorage.removeItem("username");
    window.location.href = "login.html";
}