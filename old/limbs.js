function Limb(){
   // this.name = name;
    
 /*  this.vert = [];
    this.norm = [];
    this.uv = [];
    this.face = [];
*/
    this.rot = [0,0,0,0];this.trans = [0,0,0];

    this.faceBuffer = 0;
    this.vertBuffer = 0;
    this.normBuffer = 0;
    this.uvBuffer = 0;
	this.numIndices = 0;
	this.groups = 0;
	
	this.loaded = false;
	this.binded = false;
	this.ctx = null;

}

Limb.prototype.setRot = function(a, x,y,z){
    this.rot = [a,x,y,z];
}

Limb.prototype.setTrans = function(x,y,z){
    this.trans = [x,y,z];
}

function loadObj(ctx,url)
{
    var obj = new Limb();
    obj.ctx = ctx;
    var req = new XMLHttpRequest();
    req.obj = obj;
    req.onreadystatechange = function () { processLoadObj(req) };;
    req.open("GET", url, true);
    req.send(null);
    return obj;
}

function processLoadObj(req)
{
    console.log("req="+req);
    // only if req shows "complete"
    if (req.readyState == 4) {
        req.obj.doLoadObj(req.responseText);
    }
	else console.log("loading...")
}

Limb.prototype.doLoadObj = function(text)
{console.log("begin parsing obj...");
    vertexArray = [ ];
    normalArray = [ ];
    textureArray = [ ];
    indexArray = [ ];

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
            currentGroup = [indexArray.length, 0];
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
                this.ctx.console.log("*** Error: face '"+line+"' not handled");
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
                        this.ctx.console.log("*** Error: did not understand face '"+array[i]+"'");
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
                    vertexArray.push(x);
                    vertexArray.push(y);
                    vertexArray.push(z);

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
                    textureArray.push(u);
                    textureArray.push(v);

                    // do the normals
                    x = 0;
                    y = 0;
                    z = 1;
                    if (nor * 3 + 2 < normal.length) {
                        x = normal[nor*3];
                        y = normal[nor*3+1];
                        z = normal[nor*3+2];
                    }
                    normalArray.push(x);
                    normalArray.push(y);
                    normalArray.push(z);

                    facemap[array[i]] = index++;
                }

                indexArray.push(facemap[array[i]]);
                currentGroup[1]++;
            }
        }
    }

	console.log("finish parsing obj! begin creating buffers.");
    // set the VBOs
    this.normBuffer = this.ctx.createBuffer();
    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.normBuffer);
    this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(normalArray), this.ctx.STATIC_DRAW);

    this.uvBuffer = this.ctx.createBuffer();
    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.uvBuffer);
    this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(textureArray), this.ctx.STATIC_DRAW);

    this.vertBuffer = this.ctx.createBuffer();
    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vertBuffer);
    this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(vertexArray), this.ctx.STATIC_DRAW);

    this.numIndices = indexArray.length;
    this.faceBuffer = this.ctx.createBuffer();
    this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, this.faceBuffer);
    this.ctx.bufferData(this.ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexArray), this.ctx.STREAM_DRAW);

    this.groups = groups;

    this.loaded = true;
	console.log("finish creating buffers!");
}

Limb.prototype.bindBuffers = function(){
if(!this.loaded) return;
console.log("binding obj");
         this.ctx.enableVertexAttribArray(0);
                this.ctx.enableVertexAttribArray(1);
                this.ctx.enableVertexAttribArray(2);

                this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.normBuffer);
                this.ctx.vertexAttribPointer(0, 3, this.ctx.FLOAT, false, 0, 0);

                this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.uvBuffer);
                this.ctx.vertexAttribPointer(1, 2, this.ctx.FLOAT, false, 0, 0);

                this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vertBuffer);
                this.ctx.vertexAttribPointer(2, 3, this.ctx.FLOAT, false, 0, 0);

                this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, this.faceBuffer);
this.binded = true;
    }
	
Limb.prototype.drawMe = function(){
	if(!this.binded) this.bindBuffers();
	console.log("drawing obj");
	mvMatrix.translate(this.trans[0],this.trans[1],this.trans[2]);
	this.ctx.drawElements(this.ctx.TRIANGLES, this.numIndices, this.ctx.UNSIGNED_SHORT, 0);
}
