var limbs = {};
var starLimb = null;
var color = [0.5,0.4,0.3];
var starcolor = [0.1,0.48,0.28];

var fingers = [];

//Maths
var pi = Math.PI;

function Limb(name,url){
	this.name = name;
	this.url = url;
	loadObjModel(name,url);
}

Limb.prototype.setStaticProp = function(scale, trans, rot){
	this.static_scale = scale;
	this.static_trans = trans;
	this.static_rot = rot;
}

Limb.prototype.connectJoint = function(joint){
	this.joint = joint;
}

Limb.prototype.draw = function(){
	if(this.name==lastPicked) starLimb = this;
	usePointLight();
	this.joint.draw();
	pushMatrix();
	translate(this.static_trans[0],this.static_trans[1],this.static_trans[2]);
	rotateX(this.static_rot[0]);
	rotateY(this.static_rot[1]);
	rotateZ(this.static_rot[2]); 
	scale(this.static_scale[0],this.static_scale[1],this.static_scale[2]);
	if (starLimb==this) setColor(starcolor[0], starcolor[1], starcolor[2]);
	else 
		setColor(color[0], color[1], color[2]);
	mesh(this.name,TRIANGLES);
	noPointLight();
	popMatrix();
}

function Joint(radius, rot, posit){
this.radius = radius;
this.rotX = rot[0];
this.rotY = rot[1];
this.rotZ = rot[2];
this.posit = posit;
this.rotVals = [0,0,0,0];
this.setConstraints(null,null,null,null,null,null);
}

Joint.prototype.draw = function(){
	translate(this.posit[0],this.posit[1],this.posit[2]);
	setColor(color[0], color[1], color[2]);
	sphere(0,0,0,this.radius,this.radius,this.radius);
	rotateX(this.rotX);
	rotateY(this.rotY);
	rotateZ(this.rotZ); 
	//rotate(this.rotVals[0],this.rotVals[1],this.rotVals[2],this.rotVals[3]);
}

Joint.prototype.setConstraints = function(x1,x2,y1,y2,z1,z2){
	this.min ={};
	this.min["X"] = x1;
	this.min["Y"] = y1;
	this.min["X"] = z1;
	this.max = {};
	this.max["X"] = x2,
	this.max["Y"] = y2;
	this.max["Z"] = z2;
}

Joint.prototype.rot = function(ax, alpha){
	var beta = this["rot"+ax] + alpha;
	if(this.min[ax]==null && this.max[ax]==null) this["rot"+ax] = beta;
	else if (this.min[ax]<= beta && this.max[ax]>= beta) this["rot"+ax] = beta;
	else alert("Constraints for this joint reached. To turn off constraints uncheck the constraints option");
}

function nullConstraints(){
	for(var i in limbs){
		limbs[i].joint.setConstraints(null,null,null,null,null,null);
	}
}

function allConstraints(){
limbs.head.joint.setConstraints(-pi/3,pi/2,-pi/4,pi/4,-4*pi/9,4*pi/9);
limbs.hip.joint.setConstraints(-pi/18,pi/2,-pi/6,pi/6,-pi/4,pi/4);
limbs.rforearm.joint.setConstraints(-4*pi/9, pi/6, -5*pi/9, 5*pi/9, -pi/2, pi/2);
limbs.lforearm.joint.setConstraints(-4*pi/9, pi/6, -5*pi/9, 5*pi/9, -pi/2, pi/2);
limbs.rarm.joint.setConstraints(-pi/180, pi/180, -5*pi/6, pi/180, -pi/180, 2*pi/3);
limbs.larm.joint.setConstraints(-pi/180, pi/180, -pi/180, -5*pi/6, -pi/180, 2*pi/3);
limbs.rhand.joint.setConstraints(-pi, pi/6, -pi/4, pi/4, -5*pi/9, pi/2 );
limbs.lhand.joint.setConstraints(-pi, pi/6, -pi/4, pi/4, -5*pi/9, pi/2 );
limbs.rthigh.joint.setConstraints(-8*pi/9, pi/2, -pi/6, pi/6, -pi/9, pi/2);
limbs.lthigh.joint.setConstraints(-8*pi/9, pi/2, -pi/6, pi/6, -pi/2, pi/9);
limbs.rcalf.joint.setConstraints(-pi/180, 17*pi/18, -pi/32, pi/18, -pi/180, pi/180);
limbs.lcalf.joint.setConstraints(-pi/180, 17*pi/18, -pi/18, pi/32, -pi/180, pi/180);
limbs.rfoot.joint.setConstraints(-pi/9, pi/4, -pi/12, pi/9, -pi/180, pi/180);
limbs.rfoot.joint.setConstraints(-pi/9, pi/4, -pi/9, pi/12, -pi/180, pi/180);
}

function drawGuides(){
	pushMatrix();
	setColor(1,0,0);
	scale(10,0.1,0.1);
	cube();
	popMatrix();
	
	pushMatrix();
	setColor(0,1,0);
	scale(0.1,10,0.1);
	cube();
	popMatrix();
	
	pushMatrix();
	setColor(0,0,1);
	scale(0.1,0.1,10);
	cube();
	popMatrix();
}

function euDistance(x1,x2,y1,y2){
return Math.sqrt(Math.pow(y2-y1,2)+Math.pow(x2-x1,2));
}

function chordAngle(chord){
var radius = width/2;
return 2*Math.asin((chord/2)/radius); }

function rotMouse(){ 
var nr = arcball();
for(var i=0; i<3; i++){
starLimb.joint.rotVals[i]=nr[i]; }
starLimb.joint.rotVals[3]+=nr[3];
console.log(starLimb.joint.rotVals);
/*
var diffX = mouseX - lastMouseX;
var diffY = mouseY - lastMouseY;
var m = diffY/diffX;
if(m<1 && m>-1) {
  var angle = pi*diffX/width;
  starLimb.joint.rot("Y",angle) }
else if  (m<5 && m>-5) {
	var angle = chordAngle(euDistance(lastMouseX,mouseX,lastMouseY,mouseY));
	starLimb.joint.rot("Z",angle);
	}
else {
	var angle = pi*diffY/height;
	starLimb.joint.rot("X",angle);
	}
 console.log("["+starLimb.joint.rotX+","+starLimb.joint.rotY+","+starLimb.joint.rotZ+"]"); */
}

var armMove = null;
var armids = [];

function touchDown(event){
	fingers[event.streamId] = { x: event.clientX ,y: event.clientY	  };
	console.log(event.streamId+",x:"+event.clientX+", y:"+event.clientY);
	
	var temp = [];
	for(var e in fingers){
		if(e==null) continue;
		temp.push(fingers[e].x)
		armids = e;
	}
	if(temp.length==2) setMoveArm(temp[0],temp[1]);
}

function touchMove(event){
	console.log(event.streamId+",x:"+event.clientX+", y:"+event.clientY);
	fingers[event.streamId].x = event.clientX;
	fingers[event.streamId].y = event.clientY;
	
	if(armMove!=null) moveArm(armids[0],armids[1]);
}

function setMoveArm(in1x,in2x){
	armMove = {};
	if(in1x<in2x){
		armMove.Lori = in1x;
		armMove.Rori = in2x;
	}
	else {
		armMove.Lori = in2x;
		armMove.Rori = in1x;
	}
	armMove.center = (armMove.Rori - armMove.Lori)/2;
	armMove.Lpos = armMove.Lori;
	armMove.Rpos = armMove.Rori;
}

function moveArm(in1x,in2x){
	if(armMove==null) return;
		if(in1x<in2x){
		armMove.Lpos = in1x;
		armMove.Rpos = in2x;
	}
	else {
		armMove.Lpos = in2x;
		armMove.Rpos = in1x;
	}
	var Langle = (armMove.center-armMove.Lpos)*(0.5*pi)/Math.abs(armMove.Lori-armMove.center);
	var Rangle = (armMove.Rpos-armMove.center)*(0.5*pi)/Math.abs(armMove.Rori-armMove.center);
	limbs.rforearm.joint.rotY = Rangle;
	limbs.lforearm.joint.rotY = -1*Langle;
}
