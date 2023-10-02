// Simple linear remapping between hues, to steal space away
// from green tones and give it to yellow and blue ones, as it
// usually looks crowded around the green tones when spacing
// hues in a completely linear way
function remapHue(hue) {
    // Define the remapping "curve"
    // (not much of a curve, really.. more like a bunch
    // of line segments, isn't it?)
    const remappingCurve = [
        { input: 0, output: 0 },
        { input: 60, output: 60 },
        { input: 120, output: 100 },
        { input: 180, output: 200 },
        { input: 240, output: 250 },
        { input: 300, output: 290 },
        { input: 360, output: 355 }
    ]; // values found via trial and error

    while (hue < 0 || hue > 360) {
        hue = (hue + 360) % 360;
    }

    // Find the two points on the curve that the hue falls between
    const startIndex = remappingCurve.findIndex((point, i) => hue >= point.input && hue <= remappingCurve[i + 1]?.input);
    const endIndex = startIndex + 1;

    // Calculate the interpolation factor based on the hue's position between the two points
    const inputRange = remappingCurve[endIndex].input - remappingCurve[startIndex].input;
    const interpolationFactor = (hue - remappingCurve[startIndex].input) / inputRange;

    // Perform linear interpolation to get the remapped hue
    const remappedHue = remappingCurve[startIndex].output + (remappingCurve[endIndex].output - remappingCurve[startIndex].output) * interpolationFactor;
    return remappedHue;
}