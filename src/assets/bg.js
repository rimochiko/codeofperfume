console.clear();
var noise2 = noise;
function setup() {
    createCanvas(windowWidth, windowHeight);
    noFill();
    strokeWeight(1);
    stroke(100)
}
var offset = 100;
var d = 0.003;
var c = 0.6;
var s = 8;
function getN(b, e) {
    var a = map(noise2.simplex2(b * d + (millis() * 0.0001), e * d), -1, 1, 1, 0);
    a = constrain(a, 0.3, 0.6);
    a *= offset;
    return a
}
function draw() {
    clear();
    for (var b = offset + 8; b < width - offset - 8; b += 8) {
        beginShape();
        for (var e = offset; e < height - offset; e += 8) {
            var a = getN(b, e);
            vertex(b + a, e + a - (offset / 2))
        }
        endShape()
    }
    for (var e = offset + 8; e < height - offset - 8; e += 8) {
        beginShape();
        for (var b = offset; b < width - offset; b += 8) {
            var a = getN(b, e);
            vertex(b + a, e + a - (offset / 2))
        }
        endShape()
    }
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    draw()
}
;