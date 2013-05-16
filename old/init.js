// List of global variables
var         width = -1;
 var       height = -1;
     var   loaded = false;

  var mvMatrix;
  var mvMatrixStack = [];
  var mvpMatrix;
  var normalMatrix;
  
      var mainRotationMatrix = Matrix.I(4);
  var anothermatrix = Matrix.I(4);
var zoomValue = -10;


// initWebGL
//
// Initialize the Canvas element with the passed name as a WebGL object and return the
// WebGLRenderingContext.
//
// Load shaders with the passed names and create a program with them. Return this program
// in the 'program' property of the returned context.
//
// For each string in the passed attribs array, bind an attrib with that name at that index.
// Once the attribs are bound, link the program and then use it.
//
// Set the clear color to the passed array (4 values) and set the clear depth to the passed value.
// Enable depth testing and blending with a blend func of (SRC_ALPHA, ONE_MINUS_SRC_ALPHA)
//
// A console function is added to the context: console(string). This can be replaced
// by the caller. By default, it maps to the window.console() function on WebKit and to
// an empty function on other browsers.
function initWebGL(canvasName, vshader, fshader, attribs, clearColor, clearDepth){
    var canvas = document.getElementById(canvasName);
    var gl = canvas.getContext("experimental-webgl");
    if (!gl) {
        alert("No WebGL context found");
        return null;
    }

    // Add a console
    gl.console = ("console" in window) ? window.console : {
        log: function(){
        }
    };
    // create our shaders
    var vertexShader = loadShader(gl, vshader);
    var fragmentShader = loadShader(gl, fshader);
    
    if (!vertexShader || !fragmentShader) 
        return null;
    
    // Create the program object
    gl.program = gl.createProgram();
    
    if (!gl.program) 
        return null;
    
    // Attach our two shaders to the program
    gl.attachShader(gl.program, vertexShader);
    gl.attachShader(gl.program, fragmentShader);
    
    // Bind attributes
    for (var i = 0; i < attribs.length; ++i) 
        gl.bindAttribLocation(gl.program, i, attribs[i]);
    
    // Link the program
    gl.linkProgram(gl.program);
    
    // Check the link status
    var linked = gl.getProgramParameter(gl.program, gl.LINK_STATUS);
    if (!linked) {
        // something went wrong with the link
        var error = gl.getProgramInfoLog(gl.program);
        gl.console.log("Error in program linking:" + error);
        
        gl.deleteProgram(gl.program);
        gl.deleteProgram(fragmentShader);
        gl.deleteProgram(vertexShader);
        
        return null;
    }
    
    gl.useProgram(gl.program);
    
    gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);
    gl.clearDepth(clearDepth);
    
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  
	gl.program.pMatrixUniform = gl.getUniformLocation(gl.program, "u_modelViewProjMatrix");
    gl.program.mvMatrixUniform = gl.getUniformLocation(gl.program, "u_modelViewMatrix");
	gl.program.nMatrixUniform = gl.getUniformLocation(gl.program, "u_normalMatrix");
	
    return gl;
}

//
// loadShader
//
// 'shaderId' is the id of a <script> element containing the shader source string.
// Load this shader and return the WebGLShader object corresponding to it.
//
function loadShader(ctx, shaderId){
    var shaderScript = document.getElementById(shaderId);
    if (!shaderScript) {
        ctx.console.log("*** Error: shader script '" + shaderId + "' not found");
        return null;
    }
    
    if (shaderScript.type == "x-shader/x-vertex") 
        var shaderType = ctx.VERTEX_SHADER;
    else 
        if (shaderScript.type == "x-shader/x-fragment") 
            var shaderType = ctx.FRAGMENT_SHADER;
        else {
            ctx.console.log("*** Error: shader script '" + shaderId + "' of undefined type '" + shaderScript.type + "'");
            return null;
        }
    
    // Create the shader object
    var shader = ctx.createShader(shaderType);
    if (shader == null) {
        ctx.console.log("*** Error: unable to create shader '" + shaderId + "'");
        return null;
    }
    
    // Load the shader source
    ctx.shaderSource(shader, shaderScript.text);
    
    // Compile the shader
    ctx.compileShader(shader);
    
    // Check the compile status
    var compiled = ctx.getShaderParameter(shader, ctx.COMPILE_STATUS);
    if (!compiled) {
        // Something went wrong during compilation; get the error
        var error = ctx.getShaderInfoLog(shader);
        ctx.console.log("*** Error compiling shader '" + shaderId + "':" + error);
        ctx.deleteShader(shader);
        return null;
    }
    
    return shader;
}

function setDirectionalLight(ctx, program, eyeVector, direction, ambient, diffuse, specular){
    var lightString = "u_light.";
    
    ctx.uniform4f(ctx.getUniformLocation(program, lightString + "ambient"), ambient[0], ambient[1], ambient[2], ambient[3]);
    ctx.uniform4f(ctx.getUniformLocation(program, lightString + "diffuse"), diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
    ctx.uniform4f(ctx.getUniformLocation(program, lightString + "specular"), specular[0], specular[1], specular[2], specular[3]);
    ctx.uniform4f(ctx.getUniformLocation(program, lightString + "position"), direction[0], direction[1], direction[2], direction[3]);
    
    // compute the half vector
    var halfVector = [eyeVector[0] + direction[0], eyeVector[1] + direction[1], eyeVector[2] + direction[2]];
    var length = Math.sqrt(halfVector[0] * halfVector[0] +
    halfVector[1] * halfVector[1] +
    halfVector[2] * halfVector[2]);
    if (length == 0) 
        halfVector = [0, 0, 1];
    else {
        halfVector[0] /= length;
        halfVector[1] /= length;
        halfVector[2] /= length;
    }
    
    ctx.uniform3f(ctx.getUniformLocation(program, lightString + "halfVector"), halfVector[0], halfVector[1], halfVector[2]);
}

function setMaterial(ctx, program, emission, ambient, diffuse, specular, shininess){
    var matString = "u_frontMaterial.";
    ctx.uniform4f(ctx.getUniformLocation(program, matString + "emission"), emission[0], emission[1], emission[2], emission[3]);
    ctx.uniform4f(ctx.getUniformLocation(program, matString + "ambient"), ambient[0], ambient[1], ambient[2], ambient[3]);
    ctx.uniform4f(ctx.getUniformLocation(program, matString + "diffuse"), diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
    ctx.uniform4f(ctx.getUniformLocation(program, matString + "specular"), specular[0], specular[1], specular[2], specular[3]);
    ctx.uniform1f(ctx.getUniformLocation(program, matString + "shininess"), shininess);
}


//
// loadImageTexture
//
// Load the image at the passed url, place it in a new WebGLTexture object and return the WebGLTexture.
//
function loadImageTexture(ctx, url){
    var texture = ctx.createTexture();
    texture.image = new Image();
    texture.image.onload = function(){
        doLoadImageTexture(ctx, texture.image, texture)
    }
    texture.image.src = url;
    return texture;
}

function doLoadImageTexture(ctx, image, texture){
    ctx.bindTexture(ctx.TEXTURE_2D, texture);
    ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, image);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
    //ctx.generateMipmap(ctx.TEXTURE_2D)
    ctx.bindTexture(ctx.TEXTURE_2D, null);
}

//
// Framerate object
//
// This object keeps track of framerate and displays it as the innerHTML text of the
// HTML element with the passed id. Once created you call snapshot at the end
// of every rendering cycle. Every 500ms the framerate is updated in the HTML element.
//
Framerate = function(id){
    this.numFramerates = 10;
    this.framerateUpdateInterval = 500;
    this.id = id;
    
    this.renderTime = -1;
    this.framerates = [];
    self = this;
    var fr = function(){
        self.updateFramerate()
    }
    setInterval(fr, this.framerateUpdateInterval);
}

Framerate.prototype.updateFramerate = function(){
    var tot = 0;
    for (var i = 0; i < this.framerates.length; ++i) 
        tot += this.framerates[i];
    
    var framerate = tot / this.framerates.length;
    framerate = Math.round(framerate);
    document.getElementById(this.id).innerHTML = "Framerate:" + framerate + "fps";
}

Framerate.prototype.snapshot = function(){
    if (this.renderTime < 0) 
        this.renderTime = new Date().getTime();
    else {
        var newTime = new Date().getTime();
        var t = newTime - this.renderTime;
        var framerate = 1000 / t;
        this.framerates.push(framerate);
        while (this.framerates.length > this.numFramerates) 
            this.framerates.shift();
        this.renderTime = newTime;
    }
}

 function reshape(ctx)
        {
            var canvas = document.getElementById('example');
            if (canvas.width == width && canvas.height == height)
                return;

            width = canvas.width;
            height = canvas.height;
            
            ctx.viewport(0, 0, width, height);
    
          ctx.perspectiveMatrix = new J3DIMatrix4();
            ctx.perspectiveMatrix.perspective(30, width/height, 1, 100);
            ctx.perspectiveMatrix.lookat(0,0,70, 0, 0, 0, 0, 1, 0);
//	perspective(45, ctx.viewportWidth / ctx.viewportHeight, 0.1, 100.0);
//    loadIdentity();
//    mvTranslate([0.0, 0.0, -10.0]); 
 }

function pushJedi(m){
	if(m){
		mvMatrixStack.push(new J3dIMatrix4(m));
		mvMatrix = new J3dIMatrix4(m);
	}
	else {
		mvMatrixStack.push(new J3dIMatrix4(mvMatrix));
	}
} 

function popJedi(){
	if (mvMatrixStack.length == 0) {
      throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
    return mvMatrix;
}
 

 function mvPushMatrix(m) {
    if (m) {
      mvMatrixStack.push(m.dup());
      mvMatrix = m.dup();
    } else {
      mvMatrixStack.push(mvMatrix.dup());
    }
  }

  function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
      throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
    return mvMatrix;
  }

  function loadIdentity() {
    mvMatrix = Matrix.I(4);
  }


  function multMatrix(m) {
    mvMatrix = mvMatrix.x(m);
  }


  function mvTranslate(v) {
    var m = Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4();
    multMatrix(m);
  }


  function createRotationMatrix(angle, v) {
    var arad = angle * Math.PI / 180.0;
    return Matrix.Rotation(arad, $V([v[0], v[1], v[2]])).ensure4x4();
  }


 function mvRotate(angle, v) {
    multMatrix(createRotationMatrix(angle, v));
  }



function perspective(fovy, aspect, znear, zfar) {
    pMatrix = makePerspective(fovy, aspect, znear, zfar);
  }


  function setMatrixUniforms(ctx) {
    ctx.uniformMatrix4fv(ctx.program.pMatrixUniform, false, new Float32Array(pMatrix.flatten()));
    ctx.uniformMatrix4fv(ctx.program.mvMatrixUniform, false, new Float32Array(mvMatrix.flatten()));

    var normalMatrix = mvMatrix.inverse();
    normalMatrix = normalMatrix.transpose();
    ctx.uniformMatrix4fv(ctx.program.nMatrixUniform, false, new Float32Array(normalMatrix.flatten()));
	
	
  }
