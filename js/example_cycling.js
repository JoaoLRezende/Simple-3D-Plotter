functions = [
    "sqrt(abs(x))*sin(5*t)*abs(x)*0.2",
    "sin(x*t*2)",
    "sin(x*t) + sin(z*t)",
    "sin(10*((x/3)+(z/3))-2*t)/10)",
    "sin(10*((x/3)**2+(z/3)**2)-2*t)/10",
    "1/(15*((x/10)**2+(z/10)**2))+sin(10*((x/3)**2+(z/3)**2)-10*t)/10",
    "1/(15*((x/10)**2+(z/10)**2))+sin(10*((x/3)**2+(z/3)**2)+10*t)/10",
    "(x**2+z**2)**2 + sin(t*5)*5",
    "Math.floor(x)"
]

lastFunction = -1;
function switchToNextFunction() {
    functionBox = document.getElementById("function-box");
    functionBox.value = functions[(lastFunction+1) % functions.length];
    lastFunction += 1;
    drawNewFunction({target: {value: functionBox.value}});
}

function setUpCycling() {
    window.addEventListener("keydown", function (event) {
        if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
        }
    
        if (event.key == "n") {
            switchToNextFunction();
        }
    
        event.preventDefault();
    }, true);
}