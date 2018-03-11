class Cube {

    constructor(size) {
        this.size = size;
        this.modelData = this.cube(size);
        this.centerCube = {};
    }

    cube(size) {

        var vertices = [
            // Front face
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0,  1.0, 1.0,
            -1.0,  1.0, 1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
            1.0,  1.0, -1.0,
            1.0, -1.0, -1.0,

            // Top face
            -1.0, 1.0, -1.0,
            -1.0, 1.0,  1.0,
            1.0, 1.0,  1.0,
            1.0, 1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,

            // Right face
            1.0, -1.0, -1.0,
            1.0,  1.0, -1.0,
            1.0,  1.0,  1.0,
            1.0, -1.0,  1.0,

            // Left fae
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0
        ];
        for (var i = 0; i < vertices.length; i++) {
            vertices[i] *= (size / 2);
        }

        var vertexNormals = [
            // Front face
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,

            // Back face
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,

            // Top face
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,

            // Bottom face
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,

            // Right face
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,

            // Left face
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
        ];

        var textureCoords = [
            // Front face
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,

            // Back face
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,

            // Top face
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,

            // Bottom face
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,

            // Right face
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,

            // Left face
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0
        ];

        var cubeVertexIndices = [
            0,  1,  2,      0,  2,  3, // Front face
            4,  5,  6,      4,  6,  7, // Back face
            8,  9, 10,      8, 10, 11, // Top face
            12, 13, 14,     12, 14, 15, // Bottom face
            16, 17, 18,     16, 18, 19, // Right face
            20, 21, 22,     20, 22, 23  // Left face
        ];

        return {
            vertexPositions: new Float32Array(vertices),
            vertexNormals: new Float32Array(vertexNormals),
            vertexTextureCoords: new Float32Array(textureCoords),
            indices: new Uint16Array(cubeVertexIndices)
        }
    }

    initCube() {

        this.centerCube.positionBuffer = gl.createBuffer();
        this.centerCube.normalBuffer = gl.createBuffer();
        this.centerCube.indexBuffer = gl.createBuffer();
        this.centerCube.count = this.modelData.indices.length;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.centerCube.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.modelData.vertexPositions, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.centerCube.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.modelData.vertexNormals, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.centerCube.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.modelData.indices, gl.STATIC_DRAW);
    }

    drawCube() {

        gl.useProgram(cubeShader);

        gl.uniformMatrix4fv(cubeShader.pMatrixUniform, false, uPMatrix);

        if (texture) {
            gl.enableVertexAttribArray(cubeShader.positionAttribute);
            gl.enableVertexAttribArray(cubeShader.normalAttribute);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.centerCube.positionBuffer);
            gl.vertexAttribPointer(cubeShader.positionAttribute, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.centerCube.normalBuffer);
            gl.vertexAttribPointer(cubeShader.normalAttribute, 3, gl.FLOAT, false, 0, 0);

            gl.uniformMatrix4fv(cubeShader.mvMatrixUniform, false, uMVMatrix);
            gl.uniformMatrix3fv(cubeShader.nMatrixUniform, false, uNMatrix);
            gl.uniformMatrix3fv(cubeShader.uInvVT, false, invVT);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.centerCube.indexBuffer);

            gl.drawElements(gl.TRIANGLES, this.centerCube.count, gl.UNSIGNED_SHORT, 0);

            gl.disableVertexAttribArray(cubeShader.positionAttribute);
            gl.disableVertexAttribArray(cubeShader.normalAttribute);
        }
    }

}