// Selecting Elements
const passwordInput = document.getElementById("password");
const generateBtn = document.getElementById("generateBtn");
const optimizeBtn = document.getElementById("optimizeBtn");
const copyBtn = document.getElementById("copyBtn");
const strengthText = document.getElementById("strengthText");
const breachText = document.getElementById("breachText");
const toggleBtn = document.getElementById("toggleBtn");

// Characters for Generator & Optimizer
const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowerCase = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const symbols = "@#$%^&*()_+!";
const allChars = upperCase + lowerCase + numbers + symbols;

// Local list of compromised passwords to satisfy NIST IA-5(1)
const compromisedPasswords = [
    "password123", "password", "12345678", "qwerty", 
    "admin123", "welcome", "letmein1", "password!"
];

// Generate Password Function (Control IA-5 Base Rule)
function generatePassword() {
    let password = "";

    // Add one of each type first to guarantee basic strength requirements
    password += upperCase[Math.floor(Math.random() * upperCase.length)];
    password += lowerCase[Math.floor(Math.random() * lowerCase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Loop to make it 12 characters long for good measure
    for(let i = 4; i < 12; i++){
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    passwordInput.value = password;
    checkStrength(password);
}

// Function to Optimize a user's weak custom password input
function optimizePassword() {
    let currentPassword = passwordInput.value;

    // If the input box is completely blank, just act like a generator
    if (currentPassword === "") {
        generatePassword();
        return;
    }

    // Step 1: Check if the user's password is an absolute security risk
    let isCompromised = false;
    for(let i = 0; i < compromisedPasswords.length; i++) {
        if(currentPassword.toLowerCase() === compromisedPasswords[i]) {
            isCompromised = true;
        }
    }

    // If it's a known leaked password, wipe it completely and offer a secure passphrase alternative
    if (isCompromised) {
        const structuralWords = ["Secure", "Crypto", "Shield", "Nist", "Matrix", "Vault", "Armor"];
        let word1 = structuralWords[Math.floor(Math.random() * structuralWords.length)];
        let word2 = structuralWords[Math.floor(Math.random() * structuralWords.length)];
        passwordInput.value = word1 + " " + word2 + " " + Math.floor(100 + Math.random() * 900) + "!";
        checkStrength(passwordInput.value);
        alert("CRITICAL: Your input was found on a compromised list. It has been replaced with a secure passphrase!");
        return;
    }

    // Step 2: If the password is too short, lengthen it cleanly
    if (currentPassword.length < 8) {
        currentPassword += "_Secure" + Math.floor(10 + Math.random() * 89);
    }

    // Step 3: Check for missing items and make minor structural updates to balance complexity
    if (!/[A-Z]/.test(currentPassword)) {
        currentPassword += upperCase[Math.floor(Math.random() * upperCase.length)];
    }
    if (!/[0-9]/.test(currentPassword)) {
        currentPassword += numbers[Math.floor(Math.random() * numbers.length)];
    }
    if (!/[@#$%^&*()_+!]/.test(currentPassword)) {
        currentPassword += symbols[Math.floor(Math.random() * symbols.length)];
    }

    // Return the updated string back to the user view
    passwordInput.value = currentPassword;
    checkStrength(currentPassword);
}

// Check Password Strength Function
function checkStrength(password){
    if(password === "") {
        strengthText.innerText = "Password Strength: ";
        breachText.innerText = "";
        return;
    }

    // Check compromised array
    let isCompromised = false;
    for(let i = 0; i < compromisedPasswords.length; i++) {
        if(password.toLowerCase() === compromisedPasswords[i]) {
            isCompromised = true;
        }
    }

    if(isCompromised) {
        strengthText.innerText = "Password Strength: CRITICAL RISK";
        strengthText.style.color = "darkred";
        breachText.innerText = "⚠️ REJECTED: Found on compromised list (NIST IA-5(1) Violation)";
        breachText.style.color = "red";
        return;
    } else {
        breachText.innerText = "✅ Pass: Not on basic compromised list";
        breachText.style.color = "green";
    }

    // Character Checks
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[@#$%^&*()_+!]/.test(password);
    const hasSpace = password.includes(" ");

    // NIST Rules Assessment
    if(hasSpace && password.length >= 12) {
        strengthText.innerText = "Password Strength: Strong (NIST Passphrase Compliant)";
        strengthText.style.color = "green";
    } 
    else if(password.length >= 8 && hasUpper && hasLower && hasNumber && hasSymbol) {
        strengthText.innerText = "Password Strength: Strong";
        strengthText.style.color = "green";
    } 
    else {
        strengthText.innerText = "Password Strength: Weak";
        strengthText.style.color = "red";
    }
}

// Event Listeners
generateBtn.addEventListener("click", generatePassword);
optimizeBtn.addEventListener("click", optimizePassword);

copyBtn.addEventListener("click", () => {
    if(passwordInput.value === "") {
        alert("Please generate or type a password first!");
    } else {
        navigator.clipboard.writeText(passwordInput.value);
        alert("Password Copied!");
    }
});

toggleBtn.addEventListener("click", () => {
    if(passwordInput.type === "password"){
        passwordInput.type = "text";
        toggleBtn.innerText = "Hide";
    } else {
        passwordInput.type = "password";
        toggleBtn.innerText = "Show";
    }
});

passwordInput.addEventListener("input", () => {
    checkStrength(passwordInput.value);
});