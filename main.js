
const currentDisplay = document.getElementById("current");
const previousDisplay = document.getElementById("previous");

const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");

const clearButton = document.querySelector('[data-action="clear"]');
const deleteButton = document.querySelector('[data-action="delete"]');

let currentNumber = "0";
let previousNumber = "";
let operation = null;
let shouldReset = false;

// Update display
function updateDisplay() {
    currentDisplay.textContent = currentNumber;

    previousDisplay.textContent = operation
        ? `${previousNumber} ${operation}`
        : "";
    
    operationButtons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.operation === operation
        );
    });
}

// Add numbers
function appendNumber(number) {

    if (shouldReset) {
        currentNumber = number === "." ? "0." : number;
        shouldReset = false;
        return;
    }

    if (number === "." && currentNumber.includes(".")) {
        return;
    }

    if (currentNumber === "0" && number !== ".") {
        currentNumber = number;
    } else {
        currentNumber += number;
    }
}

// Choose operation
function chooseOperation(op) {

    if (currentNumber === "Error") return;

    if (operation && !shouldReset) {
        calculate();
    }

    if (currentNumber === "Error") return;

    previousNumber = currentNumber;
    operation = op;
    shouldReset = true;
}

// Calculate result
function calculate() {

    if (!operation || shouldReset) return;

    const prev = parseFloat(previousNumber);
    const current = parseFloat(currentNumber);

    let result;

    switch (operation) {

        case "+":
            result = prev + current;
            break;

        case "-":
            result = prev - current;
            break;

        case "×":
            result = prev * current;
            break;

        case "÷":

            if (current === 0) {
                currentNumber = "Error";
                previousNumber = "";
                operation = null;
                shouldReset = true;
                return;
            }

            result = prev / current;
            break;
    }

    // Avoid long decimal results
    const formattedResult = parseFloat(result.toPrecision(12));

    // Show previous calculation
    previousNumber = `${prev} ${operation} ${current} =`;

    currentNumber = String(formattedResult);

    operation = null;
    shouldReset = true;
}

// Clear calculator
function clearCalculator() {

    currentNumber = "0";
    previousNumber = "";
    operation = null;
    shouldReset = false;
}

// Delete last digit
function deleteNumber() {

    if (shouldReset || currentNumber === "Error") {
        currentNumber = "0";
        shouldReset = false;
        return;
    }

    currentNumber = currentNumber.length > 1
        ? currentNumber.slice(0, -1)
        : "0";

    if (currentNumber === "-") {
        currentNumber = "0";
    }
}

// Number button events
numberButtons.forEach(button => {

    button.addEventListener("click", () => {

        appendNumber(button.dataset.number);
        updateDisplay();

    });

});

// Operation button events
operationButtons.forEach(button => {

    button.addEventListener("click", () => {

        const op = button.dataset.operation;

        if (op === "=") {
            calculate();
        } else {
            chooseOperation(op);
        }

        updateDisplay();

    });

});

// Clear button
clearButton.addEventListener("click", () => {

    clearCalculator();
    updateDisplay();

});

// Delete button
deleteButton.addEventListener("click", () => {

    deleteNumber();
    updateDisplay();

});

// Keyboard support
document.addEventListener("keydown", event => {

    if (event.key >= "0" && event.key <= "9") {
        appendNumber(event.key);

    } else if (event.key === ".") {
        appendNumber(".");

    } else if (event.key === "+") {
        chooseOperation("+");

    } else if (event.key === "-") {
        chooseOperation("-");

    } else if (event.key === "*") {
        chooseOperation("×");

    } else if (event.key === "/") {
        event.preventDefault();
        chooseOperation("÷");

    } else if (event.key === "Enter" || event.key === "=") {
        calculate();

    } else if (event.key === "Backspace") {
        deleteNumber();

    } else if (event.key === "Escape") {
        clearCalculator();
    }

    updateDisplay();

});

// Initial display
updateDisplay();
