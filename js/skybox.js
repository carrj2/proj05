class Skybox {

        constructor() {
            this.data = 1;
        }

        // create the skybox
    initSkybox(size) {

            var modelData = cube(size);

            skybox = {};

            skybox.positionBuffer = gl.createBuffer();
            skybox.indexBuffer = gl.createBuffer();
            skybox.count = modelData.indices.length;

            gl.bindBuffer(gl.ARRAY_BUFFER, skybox.positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexPositions, gl.STATIC_DRAW);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skybox.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelData.indices, gl.STATIC_DRAW);
        }

    drawSkybox() {

        gl.useProgram(skyboxShader);

        gl.uniformMatrix4fv(skyboxShader.pMatrixUniform, false, uPMatrix);

        if (texture) {
            gl.enableVertexAttribArray(skyboxShader.positionAttribute);

            gl.bindBuffer(gl.ARRAY_BUFFER, skybox.positionBuffer);
            gl.vertexAttribPointer(skyboxShader.positionAttribute, 3, gl.FLOAT, false, 0, 0);

            gl.uniformMatrix4fv(skyboxShader.mvMatrixUniform, false, uMVMatrix);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skybox.indexBuffer);

            gl.drawElements(gl.TRIANGLES, skybox.count, gl.UNSIGNED_SHORT, 0);

            gl.disableVertexAttribArray(skyboxShader.positionAttribute);
        }

        mat3.fromMat4(invVT, uMVMatrix);
        mat3.invert(invVT,invVT);

        mat3.normalFromMat4(uNMatrix, uMVMatrix);
    }


}