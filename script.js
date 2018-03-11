var gl;

var skyboxShader;
var cubeShader;

var uPMatrix = mat4.create();
var uMVMatrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
var uNMatrix = mat3.create();
var invVT = mat3.create();

var texture;
var skybox;
var centerCube;

var sb = new Skybox(1000);
var cb = new Cube(20);

var xRot = 20.0, yRot = 0, zRot = 0;

function initGL(canvas) {

    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }

    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

// initialize the shaders
function initShaders() {

    // skybox shader
    skyboxShader = createProgram("shader-fs", "shader-vs");

    skyboxShader.positionAttribute =  gl.getAttribLocation(skyboxShader, "aPosition");
    skyboxShader.mvMatrixUniform = gl.getUniformLocation(skyboxShader, "uMVMatrix");
    skyboxShader.pMatrixUniform = gl.getUniformLocation(skyboxShader, "uPMatrix");

    // cube shader
    cubeShader = createProgram("cubeShader-fs", "cubeShader-vs");

    cubeShader.positionAttribute =  gl.getAttribLocation(cubeShader, "aPosition");
    cubeShader.normalAttribute =  gl.getAttribLocation(cubeShader, "aNormal");
    cubeShader.mvMatrixUniform = gl.getUniformLocation(cubeShader, "uMVMatrix");
    cubeShader.pMatrixUniform = gl.getUniformLocation(cubeShader, "uPMatrix");
    cubeShader.nMatrixUniform = gl.getUniformLocation(cubeShader, "uNMatrix");
    cubeShader.uInvVT = gl.getUniformLocation(cubeShader, "invVT");
}

function createProgram(fs, vs) {

    var fragmentShader = getShader(gl, fs);
    var vertexShader = getShader(gl, vs);

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    return program;
}

function getShader(gl, id) {

    var shaderScript = document.getElementById(id);

    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;

    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;

    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

// create the buffers for the objects
function initBuffers() {

    sb.initSkybox();
    cb.initCube();
}

// load the textures
function initTextures(urls) {

    var ct = 0;
    var img = new Array(6);
    var urls = [
       "cubemap/front.jpg", "cubemap/back.jpg", // x
       "cubemap/top.jpg", "cubemap/bottom.jpg", // z
       "cubemap/right.jpg", "cubemap/left.jpg"  // y
    ];
    for (var i = 0; i < 6; i++) {
        img[i] = new Image();
        img[i].onload = function() {
            ct++;
            if (ct == 6) {
                texture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                var targets = [
                   gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 
                   gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 
                   gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z 
                ];
                for (var j = 0; j < 6; j++) {
                    gl.texImage2D(targets[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img[j]);
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                }
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                tick();
            }
        }
        img[i].src = urls[i];
    }
}

function draw() {

    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(uPMatrix, Math.PI/3, gl.viewportWidth / gl.viewportHeight, gl.viewportWidth / gl.viewportHeight, 2000);

    mat4.identity(uMVMatrix);
    mat4.translate(uMVMatrix, uMVMatrix, [0, 0.0, -40.0]);

    mat4.rotateX(uMVMatrix, uMVMatrix, degToRad(xRot));
    mat4.rotateY(uMVMatrix, uMVMatrix, degToRad(yRot));
    mat4.rotateZ(uMVMatrix, uMVMatrix, degToRad(zRot));

    mat3.normalFromMat4(uNMatrix, uMVMatrix);

    // Draw the skybox
    sb.drawSkybox();

    // Draw the cube.
    cb.drawCube();
}

function degToRad(degrees) {

    return degrees * Math.PI  / 180;
}

// rotate the cube
var lastTime = 0;
function animate() {

    var timeNow = new Date().getTime();

    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;

        // xRot += (90 * elapsed) / 1000.0 / 10.0;
        yRot += (90 * elapsed) / 1000.0 / 10.0;
        // zRot += (90 * elapsed) / 1000.0 / 10.0;
    }

    lastTime = timeNow;
}

function tick() {

    requestAnimationFrame(tick);
    draw();
    animate();
}

function webGLStart() {

    var canvas = document.getElementById("myCanvas");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    initGL(canvas);
    initShaders();
    initBuffers();
    initTextures();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    tick();
}
