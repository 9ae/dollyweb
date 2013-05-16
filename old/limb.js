function Limb(name){
    this.name = name;
    
   this.vert = [];
    this.norm = [];
    this.uv = [];
    this.face = [];

    this.rot = [];this.trans = [];

    this.faceBuffer = 0;
    this.vertBuffer = 0;
    this.normBuffer = 0;
    this.uvBuffer = 0;
	
	this.readyParsed = false;
 this.readyBufferMade = false;
 this.readyBufferBind = false; 

}

Limb.prototype.setRot = function(x,y,z){
    this.rot = [x,y,z];
}

Limb.prototype.setTrans = function(x,y,z){
    this.trans = [x,y,z];
}

function loadJson(thing){
	 var request = new XMLHttpRequest();
    request.open("GET", thing.name);
    request.onreadystatechange = function() {
      if (request.readyState == 4) {
       var jtxt = JSON.parse(request.responseText);
	   this.vert = jtxt.vertexPositions;
	   this.norm = jtxt.vertexNormals;
	   this.uv = jtxt.vertexTextureCoords;
	   this.face = jtxt.indices;
      }
    }
    request.send();
}

function loadObj(thing)
{
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
     if (req.readyState == 4) {
        thing.doLoadObj(req.responseText);
    }
    };
    req.open("GET", thing.name, true);
    req.send(null);
}

Limb.prototype.doLoadObj = function(text)
{
    var vertex = [ ];
    var normal = [ ];
    var texture = [ ];
    var facemap = { };
    var index = 0;

    var lines = text.split("\n");
    for (var lineIndex in lines) {
        var line = lines[lineIndex].replace(/[ \t]+/g, " ").replace(/\s\s*$/, "");

        // ignore comments
        if (line[0] == "#")
            continue;

        var array = line.split(" ");
        if (array[0] == "v") {
            // vertex
            vertex.push(parseFloat(array[1]));
            vertex.push(parseFloat(array[2]));
            vertex.push(parseFloat(array[3]));
        }
        else if (array[0] == "vt") {
            // normal
            texture.push(parseFloat(array[1]));
            texture.push(parseFloat(array[2]));
        }
        else if (array[0] == "vn") {
            // normal
            normal.push(parseFloat(array[1]));
            normal.push(parseFloat(array[2]));
            normal.push(parseFloat(array[3]));
        }
        else if (array[0] == "f") {
            // face
            if (array.length != 4) {
                //obj.ctx.console.log("*** Error: face '"+line+"' not handled");
                continue;
            }

            for (var i = 1; i < 4; ++i) {
                if (!(array[i] in facemap)) {
                    // add a new entry to the map and arrays
                    var f = array[i].split("/");
                    var vtx, nor, tex;

                    if (f.length == 1) {
                        vtx = parseInt(f[0]) - 1;
                        nor = vtx;
                        tex = vtx;
                    }
                    else if (f.length == 3) {
                        vtx = parseInt(f[0]) - 1;
                        tex = parseInt(f[1]) - 1;
                        nor = parseInt(f[2]) - 1;
                    }
                    else {
                        //obj.ctx.console.log("*** Error: did not understand face '"+array[i]+"'");
                        return null;
                    }

                    // do the vertices
                    var x = 0;
                    var y = 0;
                    var z = 0;
                    if (vtx * 3 + 2 < vertex.length) {
                        x = vertex[vtx*3];
                        y = vertex[vtx*3+1];
                        z = vertex[vtx*3+2];
                    }
                    this.vert.push(x);
                    this.vert.push(y);
                    this.vert.push(z);

                    // do the textures
					var u = 0;
					var v = 0;
                    if (tex * 2 + 1 < texture.length) {
                        u = texture[tex*2];
                        v = texture[tex*2+1];
                    }
					if(u==0 && v==0) {
					u = x/Math.sqrt(x*x+y*y+z*z);
					v = x/Math.sqrt(x*x+y*y+z*z);}

                    this.uv.push(u);
                    this.uv.push(v);

                    // do the normals
                    x = 0;
                    y = 0;
                    z = 1;
                    if (nor * 3 + 2 < normal.length) {
                        x = normal[nor*3];
                        y = normal[nor*3+1];
                        z = normal[nor*3+2];
                    }
                    this.norm.push(x);
                    this.norm.push(y);
                    this.norm.push(z);

                    facemap[array[i]] = index++;
                }

                this.face.push(facemap[array[i]]);
            }
        }
    } 
/*
    var vertex = [ ];
    var normal = [ ];
    var texture = [ ];
    var facemap = { };
    var index = 0;

    // This is a map which associates a range of indices with a name
    // The name comes from the 'g' tag (of the form "g NAME"). Indices
    // are part of one group until another 'g' tag is seen. If any indices
    // come before a 'g' tag, it is given the group name "_unnamed"
    // 'group' is an object whose property names are the group name and
    // whose value is a 2 element array with [<first index>, <num indices>]
    var groups = { };
    var currentGroup = [-1, 0];
    groups["_unnamed"] = currentGroup;

    var lines = text.split("\n");
    for (var lineIndex in lines) {
        var line = lines[lineIndex].replace(/[ \t]+/g, " ").replace(/\s\s*$/, "");

        // ignore comments
        if (line[0] == "#")
            continue;

        var array = line.split(" ");
        if (array[0] == "g") {
            // new group
            currentGroup = [this.face.length, 0];
            groups[array[1]] = currentGroup;
        }
        else if (array[0] == "v") {
            // vertex
            vertex.push(parseFloat(array[1]));
            vertex.push(parseFloat(array[2]));
            vertex.push(parseFloat(array[3]));
        }
        else if (array[0] == "vt") {
            // normal
            texture.push(parseFloat(array[1]));
            texture.push(parseFloat(array[2]));
        }
        else if (array[0] == "vn") {
            // normal
            normal.push(parseFloat(array[1]));
            normal.push(parseFloat(array[2]));
            normal.push(parseFloat(array[3]));
        }
        else if (array[0] == "f") {
            // face
            if (array.length != 4) {
                gl.console.log("*** Error: face '"+line+"' not handled");
                continue;
            }

            for (var i = 1; i < 4; ++i) {
                if (!(array[i] in facemap)) {
                    // add a new entry to the map and arrays
                    var f = array[i].split("/");
                    var vtx, nor, tex;

                    if (f.length == 1) {
                        vtx = parseInt(f[0]) - 1;
                        nor = vtx;
                        tex = vtx;
                    }
                    else if (f.length = 3) {
                        vtx = parseInt(f[0]) - 1;
                        tex = parseInt(f[1]) - 1;
                        nor = parseInt(f[2]) - 1;
                    }
                    else {
                        gl.console.log("*** Error: did not understand face '"+array[i]+"'");
                        return null;
                    }

                    // do the vertices
                    var x = 0;
                    var y = 0;
                    var z = 0;
                    if (vtx * 3 + 2 < vertex.length) {
                        x = vertex[vtx*3];
                        y = vertex[vtx*3+1];
                        z = vertex[vtx*3+2];
                    }
                    this.vert.push(x);
                    this.vert.push(y);
                    this.vert.push(z);

                    // do the textures
                    x = 0;
                    y = 0;
                    if (tex * 2 + 1 < texture.length) {
                        x = texture[tex*2];
                        y = texture[tex*2+1];
                    }
                    this.uv.push(x);
                    this.uv.push(y);

                    // do the normals
                    x = 0;
                    y = 0;
                    z = 1;
                    if (nor * 3 + 2 < normal.length) {
                        x = normal[nor*3];
                        y = normal[nor*3+1];
                        z = normal[nor*3+2];
                    }
                   this.norm.push(x);
                    this.norm.push(y);
                  this.norm.push(z);

                    facemap[array[i]] = index++;
                }

				this.face.push(facemap[array[i]]);
                currentGroup[1]++;
            }
        }
    }
	*/
alert("finish parsing obj");
this.readyParsed = true;
}

Limb.prototype.createBuffers = function(){ 
	
   this.normBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.norm), gl.STATIC_DRAW);
    this.normBuffer.itemSize = 3;
    this.normBuffer.numItems = this.norm.length / 3;

    this.uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uv), gl.STATIC_DRAW);
    this.uvBuffer.itemSize = 2;
    this.uvBuffer.numItems = this.uv.length / 2;

    this.vertBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vert), gl.STATIC_DRAW);
    this.vertBuffer.itemSize = 3;
    this.vertBuffer.numItems = this.vert.length / 3;

    this.faceBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.faceBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.face), gl.STREAM_DRAW);
    this.faceBuffer.itemSize = 1;
    this.faceBuffer.numItems = this.face.length;
	
	alert("buffers created");
	this.readyBufferMade = true;
    }

Limb.prototype.bindBuffers = function(){
	if (!this.readyBufferMade) 
		return;
	if (!this.readyBufferBind) {
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.faceBuffer);
	alert("buffers binded");
	this.readyBufferBind = true;
}
	setMatrixUniforms();
   gl.drawElements(gl.TRIANGLES, this.face.length, gl.UNSIGNED_SHORT, 0); 
  
  /*
  gl.enableVertexAttribArray(0);
  gl.enableVertexAttribArray(1);
  gl.enableVertexAttribArray(2);

               gl.bindBuffer(gl.ARRAY_BUFFER, this.normBuffer);
                gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

                gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
                gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

                gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
                gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);

                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.faceBuffer);
				setMatrixUniforms();
				gl.drawElements(gl.TRIANGLES, this.face.length, gl.UNSIGNED_SHORT, 0); */
	
	//alert("buffers binded");
  
    }