
const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl2');

if (!gl) {
    alert('WebGL is not available');
    throw('WebGL is not available');
}

// Define vertex and fragment shaders
const vertexShaderSource = `
    attribute vec4 a_position;
    attribute vec4 a_color;

    uniform mat4 u_matrix;

    varying vec4 v_color;

    void main() {
        gl_Position = u_matrix * a_position;
        v_color = a_color;
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    varying vec4 v_color;

    void main() {
        gl_FragColor = v_color;
    }
`;

// Compile shaders
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

// Create and link shader program
function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
        return null;
    }

    return program;
}

const program = createProgram(gl, vertexShader, fragmentShader);

const getRandomColor = () => {
    return [Math.random(), Math.random(), Math.random(), 1.0];
};

const setFaceColors = (vertices) => {
    const faceCount = vertices.length / (4 * 7);
    for (let i = 0; i < faceCount; i++) {
        const color1 = getRandomColor();
        const color2 = getRandomColor();
        for (let j = 0; j < 4; j++) {
            const color = (j < 2) ? color1 : color2;
            vertices.set(color, i * 4 * 7 + j * 7 + 3);
        }
    }
    return vertices;
}

// Cube vertices and colors
const cube1Vertices = setFaceColors(new Float32Array([
    // Front face
    -1.0, -1.0,  1.0,  0.0, 1.0, 0.0, 1.0,
    1.0, -1.0,  1.0,  0.0, 1.0, 0.0, 1.0,
    1.0,  1.0,  1.0,  0.0, 1.0, 0.0, 1.0,
    -1.0,  1.0,  1.0,  0.0, 1.0, 0.0, 1.0,
    // Back face
    -1.0, -1.0, -1.0, 0.0, 1.0, 0.0, 1.0,
    1.0, -1.0, -1.0, 0.0, 1.0, 0.0, 1.0,
    1.0,  1.0, -1.0, 0.0, 1.0, 0.0, 1.0,
    -1.0,  1.0, -1.0, 0.0, 1.0, 0.0, 1.0,
    // Top face
    -1.0,  1.0, -1.0, 0.0, 1.0, 0.0, 1.0,
	1.0,  1.0, -1.0, 0.0, 1.0, 0.0, 1.0,
    1.0,  1.0,  1.0, 0.0, 1.0, 0.0, 1.0,
    -1.0,  1.0,  1.0, 0.0, 1.0, 0.0, 1.0,
    // Bottom face
    -1.0, -1.0, -1.0, 0.0, 1.0, 0.0, 1.0,
    1.0, -1.0, -1.0, 0.0, 1.0, 0.0, 1.0,
    1.0, -1.0,  1.0, 0.0, 1.0, 0.0, 1.0,
    -1.0, -1.0,  1.0, 0.0, 1.0, 0.0, 1.0,
    // Right face
    1.0, -1.0, -1.0, 0.0, 1.0, 0.0, 1.0,
    1.0,  1.0, -1.0, 0.0, 1.0, 0.0, 1.0,
    1.0,  1.0,  1.0, 0.0, 1.0, 0.0, 1.0,
    1.0, -1.0,  1.0, 0.0, 1.0, 0.0, 1.0,
    // Left face
    -1.0, -1.0, -1.0, 0.0, 1.0, 0.0, 1.0,
    -1.0,  1.0, -1.0, 0.0, 1.0, 0.0, 1.0,
    -1.0,  1.0,  1.0, 0.0, 1.0, 0.0, 1.0,
    -1.0, -1.0,  1.0, 0.0, 1.0, 0.0, 1.0,
]));

const cube2Vertices = setFaceColors(new Float32Array([
    // Front face
    -1.0, -1.0,  1.0,  1.0, 1.0, 0.0, 1.0,
    1.0, -1.0,  1.0,  1.0, 1.0, 0.0, 1.0,
    1.0,  1.0,  1.0,  1.0, 1.0, 0.0, 1.0,
    -1.0,  1.0,  1.0,  1.0, 1.0, 0.0, 1.0,
    // Back face
    -1.0, -1.0, -1.0, 1.0, 1.0, 0.0, 1.0,
    1.0, -1.0, -1.0, 1.0, 1.0, 0.0, 1.0,
    1.0,  1.0, -1.0, 1.0, 1.0, 0.0, 1.0,
    -1.0,  1.0, -1.0, 1.0, 1.0, 0.0, 1.0,
    // Top face
    -1.0,  1.0, -1.0, 1.0, 1.0, 0.0, 1.0,
	1.0,  1.0, -1.0, 1.0, 1.0, 0.0, 1.0,
    1.0,  1.0,  1.0, 1.0, 1.0, 0.0, 1.0,
    -1.0,  1.0,  1.0, 1.0, 1.0, 0.0, 1.0,
    // Bottom face
    -1.0, -1.0, -1.0, 1.0, 1.0, 0.0, 1.0,
    1.0, -1.0, -1.0, 1.0, 1.0, 0.0, 1.0,
    1.0, -1.0,  1.0, 1.0, 1.0, 0.0, 1.0,
    -1.0, -1.0,  1.0, 1.0, 1.0, 0.0, 1.0,
    // Right face
    1.0, -1.0, -1.0, 1.0, 1.0, 0.0, 1.0,
    1.0,  1.0, -1.0, 1.0, 1.0, 0.0, 1.0,
    1.0,  1.0,  1.0, 1.0, 1.0, 0.0, 1.0,
    1.0, -1.0,  1.0, 1.0, 1.0, 0.0, 1.0,
    // Left face
    -1.0, -1.0, -1.0, 1.0, 1.0, 0.0, 1.0,
    -1.0,  1.0, -1.0, 1.0, 1.0, 0.0, 1.0,
    -1.0,  1.0,  1.0, 1.0, 1.0, 0.0, 1.0,
    -1.0, -1.0,  1.0, 1.0, 1.0, 0.0, 1.0,
]));

const cubeIndices = new Uint16Array([
    0,  1,  2,  0,  2,  3, // Front face
    4,  5,  6,  4,  6,  7, // Back face
    8,  9, 10,  8, 10, 11, // Top face
    12, 13, 14, 12, 14, 15, // Bottom face
    16, 17, 18, 16, 18, 19, // Right face
    20, 21, 22, 20, 22, 23, // Left face
]);

// Create and bind VAO
const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

// Cube 1
const cube1VertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, cube1VertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, cube1Vertices, gl.STATIC_DRAW);
// Cube 2
const cube2VertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, cube2VertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, cube2Vertices, gl.STATIC_DRAW);

// Create, bind and fill IBO with indices data
const ibo = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cubeIndices, gl.STATIC_DRAW);

// Set up vertex attributes
const a_position = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(a_position);
gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 7 * Float32Array.BYTES_PER_ELEMENT, 0);

const a_color = gl.getAttribLocation(program, "a_color");
gl.enableVertexAttribArray(a_color);
gl.vertexAttribPointer(a_color, 4, gl.FLOAT, false, 7 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);

// Create and bind Z-buffer
const depthBuffer = gl.createRenderbuffer();
gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, canvas.width, canvas.height);
gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

// Use the program
gl.useProgram(program);

// Set up uniforms
const u_matrix = gl.getUniformLocation(program, "u_matrix");

// Set up projection, view, and model matrices
const projectionMatrix = mat4.create();
const viewMatrix = mat4.create();
const modelMatrix = mat4.create();

mat4.perspective(projectionMatrix, (45 * Math.PI) / 180, canvas.width / canvas.height, 0.1, 100);
mat4.lookAt(viewMatrix, [0, 0, 10], [0, 0, 0], [0, 1, 0]);

// Variables to track mouse movement
let isDragging = false;
let prevMouseX = 0;
let prevMouseY = 0;
let rotationAngleX = 0;
let rotationAngleY = 0;
let rotationAngleZ = 0;

// Handle mouse down event
const handleMouseDown = (event) => {
    isDragging = true;
    prevMouseX = event.clientX;
    prevMouseY = event.clientY;
}

// Handle mouse up event
const handleMouseUp = (event) => {
    isDragging = false;
}

// Handle mouse move event
const handleMouseMove = (event) => {
    if (!isDragging) {
        return;
    }

    const deltaX = event.clientX - prevMouseX;
    const deltaY = event.clientY - prevMouseY;

    const sensitivity = 0.005;
    rotationAngleX += sensitivity * deltaY;
    rotationAngleY += sensitivity * deltaX;

    prevMouseX = event.clientX;
    prevMouseY = event.clientY;

    newCubesRender();
}

// Mouse event listeners
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('mousemove', handleMouseMove);


const newCubesRender = () => {
    // See: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearColor
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Set background color to black
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);

    mat4.identity(modelMatrix);
    mat4.rotate(modelMatrix, modelMatrix, rotationAngleX, [1, 0, 0]);
    mat4.rotate(modelMatrix, modelMatrix, rotationAngleY, [0, 1, 0]);
    mat4.rotate(modelMatrix, modelMatrix, rotationAngleZ, [0, 0, 1]);

    let mvpMatrix = mat4.create();
    mat4.multiply(mvpMatrix, projectionMatrix, viewMatrix);
    mat4.multiply(mvpMatrix, mvpMatrix, modelMatrix);

    gl.uniformMatrix4fv(u_matrix, false, mvpMatrix);
    gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);

    // Adding a second cube for depth
    const modelMatrix2 = mat4.create();
    const scaleMatrix = mat4.create();
    const translationMatrix = mat4.create();
    const rotationMatrix = mat4.create();

    mat4.scale(scaleMatrix, scaleMatrix, [0.7, 0.7, 0.7]); // make it slightly smaller
    mat4.translate(translationMatrix, translationMatrix, [2, 2, -3.5]); // set it behind the big cube
    mat4.rotate(rotationMatrix, modelMatrix, rotationAngleX, [1, 0, 0]);
    mat4.rotate(rotationMatrix, rotationMatrix, rotationAngleY, [0, 1, 0]);
    mat4.rotate(rotationMatrix, rotationMatrix, rotationAngleZ, [0, 0, 1]);

    mat4.multiply(modelMatrix2, translationMatrix, rotationMatrix);
    mat4.multiply(modelMatrix2, scaleMatrix, modelMatrix2);

    mvpMatrix = mat4.create();
    mat4.multiply(mvpMatrix, projectionMatrix, viewMatrix);
    mat4.multiply(mvpMatrix, mvpMatrix, modelMatrix2);

    gl.uniformMatrix4fv(u_matrix, false, mvpMatrix);
    gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(newCubesRender);
}


newCubesRender();