class Skybox {

        constructor(size) {
            this.cube = new Cube(size);
            this.skybox = {};
        }

    // create the skybox
    initSkybox() {
        this.skybox.positionBuffer = gl.createBuffer();
        this.skybox.indexBuffer = gl.createBuffer();
        this.skybox.count = this.cube.modelData.indices.length;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.skybox.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.cube.modelData.vertexPositions, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.skybox.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.cube.modelData.indices, gl.STATIC_DRAW);
        }

    drawSkybox() {

        gl.useProgram(skyboxShader);

        gl.uniformMatrix4fv(skyboxShader.pMatrixUniform, false, uPMatrix);

        if (texture) {
            gl.enableVertexAttribArray(skyboxShader.positionAttribute);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.skybox.positionBuffer);
            gl.vertexAttribPointer(skyboxShader.positionAttribute, 3, gl.FLOAT, false, 0, 0);

            gl.uniformMatrix4fv(skyboxShader.mvMatrixUniform, false, uMVMatrix);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.skybox.indexBuffer);

            gl.drawElements(gl.TRIANGLES, this.skybox.count, gl.UNSIGNED_SHORT, 0);

            gl.disableVertexAttribArray(skyboxShader.positionAttribute);
        }

        mat3.fromMat4(invVT, uMVMatrix);
        mat3.invert(invVT,invVT);

        mat3.normalFromMat4(uNMatrix, uMVMatrix);
    }


}