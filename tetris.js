main();
//
// Start here
//
function main() {
    const canvas = document.querySelector('#glcanvas');
    const gl = canvas.getContext('webgl');

    // If we don't have a GL context, give up now

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    // Vertex shader program

    const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) {
	  
	  vec2 uPosition = vec2(0.0,0.0);
	  uPosition.x = aVertexPosition.x;
      uPosition.y = aVertexPosition.y;
	
      gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(uPosition.x,uPosition.y,0.0,1.0);
      vColor = aVertexColor;
    }
  `;

    // Fragment shader program

    const fsSource = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
  `;

    // Initialize a shader program; this is where all the lighting
    // for the vertices and so forth is established.
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    // Collect all the info needed to use the shader program.
    // Look up which attributes our shader program is using
    // for aVertexPosition, aVevrtexColor and also
    // look up uniform locations.
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        },
    };

    // Here's where we call the routine that builds all the
    // objects we'll be drawing.
    const buffers = initBuffers(gl);
    updateIndexBuffer(gl, buffers);
    // updateColorBuffer(gl, buffers);
    // Draw the scene
    drawScene(gl, programInfo, buffers);
}

function updateIndexBuffer(gl, buffers) {
    indices = [0,1,11,0,11,10];
    //         //set element vertices
    //         square_position = [
    //             origin[0], origin[1], 0,
    //             origin[0], origin[1] - height_inc, 0,
    //             origin[0] + width_inc, origin[1], 0,
    //             origin[0] + width_inc, origin[1] - height_inc, 0
    //         ]
    //         positions = positions.concat(square_position)
    //         //set element indexes
    //         base_index = (h * 10 + w) * 4
    //         square_indices = [base_index, base_index+1, base_index+2, 
    //                         base_index+1, base_index+2, base_index+3]
    //         indices = indices.concat(square_indices)
    //     }
    // }
    // set up element array indices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
}

function updateColorBuffer(gl, buffers){
        // Now set up the colors for the vertices
        var colors = [
            1.0, 1.0, 1.0, 1.0,    // white
            1.0, 0.0, 0.0, 1.0,    // red
            0.0, 1.0, 0.0, 1.0,    // green
            0.0, 0.0, 1.0, 1.0,    // blue
            0.0, 1.0, 0.0, 1.0,    // green
            0.0, 1.0, 0.0, 1.0,    // green
            0.0, 1.0, 0.0, 1.0,    // green
            0.0, 1.0, 0.0, 1.0,    // green
            0.0, 0.0, 1.0, 1.0,    // blue
            0.0, 0.0, 1.0, 1.0,    // blue
            0.0, 0.0, 1.0, 1.0,    // blue
            0.0, 0.0, 1.0, 1.0,    // blue
        ];
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

}
//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple two-dimensional square.
//
function initBuffers(gl) {

    //vertices generated from top left to bottom right
    const POSITION_WIDTH = 3;
    const POSITION_HEIGHT = 6.5;
    const width_inc = POSITION_WIDTH / 10;
    const height_inc = POSITION_HEIGHT / 20;

    var vertices = [];
    for(var h = 0; h <= 20; h++)
    {        
        for(var w = 0; w <= 10; w++)
        {
            base_i = (h*11 + w) * 3;
            vertices[base_i]   = 0 - POSITION_WIDTH / 2 + width_inc * w;
            vertices[base_i+1] = POSITION_HEIGHT / 2 - height_inc * h;
            vertices[base_i+2] = 0;
        }
    }

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    //indices for gridlines
    gridIndices = [];
    for(var h = 0; h <= 20; h++)
    {
        gridIndices[h*2] = h*11;
        gridIndices[h*2+1] = h*11 + 10;
    }
    for(var w = 0; w <= 10; w++)
    {
        gridIndices[42 + w*2] = w;
        gridIndices[43 + w*2] = 220 + w;
    }

    const gridBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gridBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(gridIndices), gl.STATIC_DRAW);


    // element array indices
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([]), gl.STATIC_DRAW);

    //vertex color values
    colors = [];
    //4 ints per color * 30 lines * 2 vertex per line
    for(var i = 0; i < 240; i++){
        if (i % 4 == 0){
            colors[i] = 1;
        } else {
            colors[i] = 4;
        }
    }
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    return {
        vertex: vertexBuffer,
        grid: gridBuffer,
        color: colorBuffer,
        indices: indexBuffer,
    };
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, buffers) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    // Clear the canvas before we start drawing on it.

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.

    const fieldOfView = 60 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar);

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create();

    // Now move the drawing position a bit to where we want to
    // start drawing the square.

    mat4.translate(modelViewMatrix,     // destination matrix
        modelViewMatrix,     // matrix to translate
        [-0.0, 0.0, -6.0]);  // amount to translate

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute
    {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertex);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexPosition);
    }

    // Tell WebGL how to pull out the colors from the color buffer
    // into the vertexColor attribute.
    {
        const numComponents = 4;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexColor,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexColor);
    }

    //   // Tell WebGL how to pull out the rotations from the rotation buffer
    //   // into the vertexRotation attribute.
    //   {
    //     const numComponents = 1;
    //     const type = gl.FLOAT;
    //     const normalize = false;
    //     const stride = 0;
    //     const offset = 0;
    //     gl.bindBuffer(gl.ARRAY_BUFFER, buffers.rotation);
    //     gl.vertexAttribPointer(
    //         programInfo.attribLocations.vertexRotation,
    //         numComponents,
    //         type,
    //         normalize,
    //         stride,
    //         offset);
    //     gl.enableVertexAttribArray(
    //         programInfo.attribLocations.vertexRotation);
    //   }


    // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program);

    // Set the shader uniforms

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);

      // Tell WebGL which indices to use to index the vertices
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.grid);

    {
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.LINES, count=64, type, offset);
    }
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    // Send the source to the shader object

    gl.shaderSource(shader, source);

    // Compile the shader program

    gl.compileShader(shader);

    // See if it compiled successfully

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

