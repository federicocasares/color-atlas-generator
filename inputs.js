// Source user inputs from html elements
function getInputs() {
    const width = parseInt(document.getElementById("width").value);
    const height = parseInt(document.getElementById("height").value);
    const hueSteps = parseInt(document.getElementById("hueSteps").value);
    const hueOffset = parseInt(document.getElementById("hueOffset").value);
    const luminanceSteps = parseInt(document.getElementById("luminanceSteps").value);
    const saturations = document.getElementById("saturations").value.split(",").map(Number);
    const addGrayscale = document.getElementById("addGrayscale").checked;
    const hueRemap = document.getElementById("hueRemap").checked;
    const behavior = document.getElementById("behaviorDropdown").value;
    const borders = document.getElementById("bordersDropdown").value;

    return {
        width, height, hueSteps, hueOffset, luminanceSteps,
        saturations, addGrayscale, hueRemap, behavior, borders
    };
}


// Input validation to check all numbers are integers and in the correct range
function validateInputs() {
    const inputs = getInputs();
    const width = inputs.width;
    const height = inputs.height;
    const hueSteps = inputs.hueSteps;
    const hueOffset = inputs.hueOffset;
    const luminanceSteps = inputs.luminanceSteps;
    const saturations = inputs.saturations;

    const errorContainer = document.getElementById("errorContainer");
    // clear any previous error messages
    errorContainer.innerHTML = "";

    if (isNaN(width) || isNaN(height) || isNaN(hueSteps) || isNaN(hueOffset) || isNaN(luminanceSteps)) {
        errorContainer.innerHTML = "Width, height, hue steps, hue offset, and luminance steps should be integers.";
        return false;
    }

    if (width < 16 || width > 4096 || height < 16 || height > 4096) {
        errorContainer.innerHTML = "Width and height should be between 16 and 4096.";
        return false;
    }

    if (hueSteps <= 0 || luminanceSteps <= 0) {
        errorContainer.innerHTML = "Hue steps and luminance steps should be greater than 0.";
        return false;
    }

    if (!saturations.every((s) => Number.isInteger(s) && s >= 0 && s <= 100)) {
        errorContainer.innerHTML = "Saturations should be integers between 0 and 100.";
        return false;
    }

    return true;
}