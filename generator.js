'use strict';

// references to HTML elements
const canvas = document.getElementById("textureAtlas");
const ctx = canvas.getContext("2d");
const generateButton = document.getElementById("generateButton");
const downloadButton = document.getElementById("downloadButton");


// function to generate the texture atlas
function generateTextureAtlas() {
    if (!validateInputs()) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // get user input values
    const inputs = getInputs();
    const addGrayscale = inputs.addGrayscale;
    const behavior = inputs.behavior;
    const borders = inputs.borders;

    // calculate the number of rows and columns
    const numRows = inputs.luminanceSteps;
    const numCols = inputs.hueSteps * inputs.saturations.length + (addGrayscale ? 1 : 0);

    // calculate cell dimensions and assign pixel size to canvas
    let cellWidth = inputs.width / numCols;
    let cellHeight = inputs.height / numRows;
    let grayscaleExtraWidth = 0;
    canvas.width = inputs.width;
    canvas.height = inputs.height;

    // apply rounding behavior based on the selected option
    if (behavior === "shrink") {
        cellWidth = Math.floor(cellWidth);
        cellHeight = Math.floor(cellHeight);
    } else if (behavior === "expand grayscale" && addGrayscale) {
        cellHeight = Math.floor(cellHeight);
        const roundedWidth = Math.floor(cellWidth);
        const remainingCols = numCols - (addGrayscale ? 1 : 0);
        const colorSectionWidth = roundedWidth * remainingCols;
        cellWidth = roundedWidth;
        grayscaleExtraWidth = inputs.width - colorSectionWidth - cellWidth;
    }

    // render the grayscale column if enabled
    if (addGrayscale) {
        for (let lum = 0; lum < numRows; lum++) {
            const currentLuminance = (100 / (inputs.luminanceSteps - 1)) * lum;
            ctx.fillStyle = `hsl(0, 0%, ${currentLuminance}%)`;
            fillRect(0, lum, cellWidth, cellHeight, numCols, numRows, grayscaleExtraWidth, borders);
        }
    }

    // loop through hue, saturation, and luminance steps
    for (let satIdx = 0; satIdx < inputs.saturations.length; satIdx++) {
        for (let hue = 0; hue < inputs.hueSteps; hue++) {
            for (let lum = 0; lum < inputs.luminanceSteps; lum++) {
                // calculate hue and luminance for the current cell
                let currentHue = (inputs.hueOffset + (360 / inputs.hueSteps) * hue) % 360;
                if (inputs.hueRemap) {
                    currentHue = remapHue(currentHue);
                }
                const currentSaturation = inputs.saturations[satIdx];
                const currentLuminance = (100 / (inputs.luminanceSteps + 1)) * (lum + 1);

                // set the fill style for the cell
                ctx.fillStyle = `hsl(${currentHue}, ${currentSaturation}%, ${currentLuminance}%)`;

                // calculate the position for the current cell
                const colIdx = satIdx * inputs.hueSteps + hue + (addGrayscale ? 1 : 0);
                const rowIdx = lum;
                fillRect(colIdx, rowIdx, cellWidth, cellHeight, numCols, numRows, grayscaleExtraWidth, borders);
            }
        }
    }
}


// fills up one cell in the canvas, calculating the correct size
// depending on the border settings
function fillRect(colIdx, rowIdx, cellWidth, cellHeight, numCols, numRows, grayscaleExtraWidth, borders) {
    let xOffset = 0;
    let yOffset = 0;
    let xSizeDelta = 0;
    let ySizeDelta = 0;

    if (borders === 'both' || borders === 'columns') {
        xOffset = colIdx > 0 ? 1 : 0;
        xSizeDelta = (colIdx === 0 || colIdx === numCols - 1) ? -1 : -2;
    }

    if (borders === 'both' || borders === 'rows') {
        yOffset = rowIdx > 0 ? 1 : 0;
        ySizeDelta = (rowIdx === 0 || rowIdx === numRows - 1) ? -1 : -2;
    }

    // fill the cell
    ctx.fillRect(
        colIdx * cellWidth + (colIdx === 0 ? 0 : grayscaleExtraWidth) + xOffset,
        rowIdx * cellHeight + yOffset,
        cellWidth + xSizeDelta + (colIdx === 0 ? grayscaleExtraWidth : 0),
        cellHeight + ySizeDelta);
}


// function to download the texture atlas as a PNG file
function downloadTextureAtlas() {
    const dataURL = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = "texture_atlas.png";
    a.click();
}


// assign event listeners
downloadButton.addEventListener("click", downloadTextureAtlas);
generateButton.addEventListener("click", generateTextureAtlas);