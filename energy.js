function setup() {
			setBackgroundColor(0.33);
 
		//	usePointLight();
			setPointPosition(0, 10, 100);
			setPointColor(1); 
		contourMode();
		
	/*	useDirectLight();
		setDirectColor(1);
		setDirectPosition(0,10,10);
		*/
		//Initialize Obj files
		limbs.head = new Limb('head','models/newhead.obj');
		limbs.torso = new Limb('torso','models/newtorso.obj');
		limbs.hip = new Limb('hip','models/newhip.obj');
		limbs.rforearm = new Limb('rforearm','models/newarm.obj');
		limbs.lforearm = new Limb('lforearm','models/newarm.obj');
		limbs.rarm = new Limb('rarm','models/newforearm.obj');
		limbs.larm = new Limb('larm','models/newforearm.obj'); 
		limbs.rhand = new Limb('rhand','models/newhand.obj');
		limbs.lhand = new Limb('lhand','models/newhand.obj');
		limbs.rthigh = new Limb('rthigh','models/newthigh.obj');
		limbs.lthigh = new Limb('lthigh','models/newthigh.obj');
		limbs.rcalf = new Limb('rcalf','models/newcalf.obj');
		limbs.lcalf = new Limb('lcalf','models/newcalf.obj');
		limbs.rfoot = new Limb('rfoot','models/newfoot.obj');
		limbs.lfoot = new Limb('lfoot','models/newfoot.obj');
		
		//Set Static Variables
		limbs.head.setStaticProp([0.7,0.7,0.7],[0,1.5,0],[0,0,0]);
		limbs.torso.setStaticProp([1,1,1],[0,0,0],[0,pi/2,0]);
		limbs.hip.setStaticProp([1,0.7,1],[0,-1.25,0],[0,0,0]);
		
		limbs.rforearm.setStaticProp([1,1,1],[2,0,0],[0,0,pi/5]);
		limbs.rarm.setStaticProp([1,1,1],[1.8,0,0],[-pi/6,pi/6-0.15,(2*pi/3)+0.4]);
		limbs.rhand.setStaticProp([1,1,1],[0.8,0,0],[0,0,5*pi/6]);
		limbs.rthigh.setStaticProp([1,1,1],[0,-2.8,0],[0,0,pi/16]);
		limbs.rcalf.setStaticProp([1,1,1],[0,-3.1,0],[-pi/9,0,pi/12]);
		limbs.rfoot.setStaticProp([1,1,1],[0,-0.5,1.2],[0,0,0]);
		
		limbs.lforearm.setStaticProp([1,1,1],[-2,0,0],[0,pi,pi/5]);
		limbs.larm.setStaticProp([1,1,1],[-1.8,0.1,0],[pi/6,pi/6-0.15+pi,(2*pi/3)+0.4]);
		limbs.lhand.setStaticProp([1,1,1],[-0.8,0.2,0],[0,pi,5*pi/6]);
		limbs.lthigh.setStaticProp([1,1,1],[0,-2.8,0],[0,0,pi/16]);
		limbs.lcalf.setStaticProp([1,1,1],[0,-3.1,0],[-pi/9,0,pi/12]);
		limbs.lfoot.setStaticProp([1,1,1],[0,-0.5,1.2],[0,0,0]);
		
		limbs.torso.connectJoint(new Joint(0.01,[0,0,0],[0,0,0]));	//center
		limbs.head.connectJoint(new Joint(0.5,[0,0,0],[0,2.5,0]));	//neck
		limbs.hip.connectJoint(new Joint(0.8,[0,0,0],[0,-2,0])); //hip joint
		
		limbs.rforearm.connectJoint(new Joint(0.6,[0,0,0],[1.5,1,0])); //rshoulder
		limbs.rarm.connectJoint(new Joint(0.4,[0,0,0],[4,-0.2,0]));	//relblow
		limbs.rhand.connectJoint(new Joint(0.3,[0,0,0],[3.7,0,0]));	//rwrist
		
		limbs.lforearm.connectJoint(new Joint(0.6,[0,0,0],[-1.5,1,0])); 
		limbs.larm.connectJoint(new Joint(0.4,[0,0,0],[-4,-0.2,0]));	
		limbs.lhand.connectJoint(new Joint(0.3,[0,0,0],[-3.7,0,0]));	
		
		limbs.rthigh.connectJoint(new Joint(0.6,[0,0,0],[0.8,-2.4,0]));
		limbs.rcalf.connectJoint(new Joint(0.4,[0,0,0],[0,-5.6,0]));
		limbs.rfoot.connectJoint(new Joint(0.4,[0,0,0],[0,-6,0]));
		
		limbs.lthigh.connectJoint(new Joint(0.6,[0,0,0],[-0.8,-2.4,0]));
		limbs.lcalf.connectJoint(new Joint(0.4,[0,0,0],[0,-5.6,0]));
		limbs.lfoot.connectJoint(new Joint(0.4,[0,0,0],[0,-6,0]));
		
		
		
			startLoading();
	document.onmouseup = mouseUp;
	usePicking();
		}
		
var zoom = -37;
var panX = 0; var panY=6;
var counter = 0;
 
function draw() {

  pushMatrix();
    translate(panX, panY, zoom);
		if(document.getElementsByName("shAxis")[0].checked) drawGuides();
	startPickables();
	limbs.torso.draw();
	//above chest
	pushMatrix();
	
	//neck
	pushMatrix();
	limbs.head.draw();
	popMatrix();
	
	//r-shoulder
	pushMatrix();
	limbs.rforearm.draw();
		pushMatrix();
		limbs.rarm.draw();
			pushMatrix();
			limbs.rhand.draw();
			popMatrix();
		popMatrix();
	popMatrix();
	
	//l-shoulder
	pushMatrix();
	limbs.lforearm.draw();
		pushMatrix();
		limbs.larm.draw();
			pushMatrix();
			limbs.lhand.draw();
			popMatrix();
		popMatrix();
	popMatrix();


	//below chest
	pushMatrix();
	limbs.hip.draw();
	
	//left leg
	pushMatrix();
	limbs.lthigh.draw();
		pushMatrix();
		limbs.lcalf.draw();
			pushMatrix();
			limbs.lfoot.draw();
			popMatrix();
		popMatrix();
	popMatrix();
	
	//right leg
	pushMatrix();
	limbs.rthigh.draw();
		pushMatrix();
		limbs.rcalf.draw();
			pushMatrix();
			limbs.rfoot.draw();
			popMatrix();
		popMatrix();
	popMatrix();
	
	popMatrix();
	
	popMatrix();
	
	 endPickables(); 
    popMatrix();

}

function picked(){
	console.log(lastPicked);
}

function selectJoint(limb){
	starLimb = limb;
	console.log(limb.name);
}

function mouseDown(){
noPicking();
console.log("mouse down");
}

function mouseUp(){
usePicking();
console.log("mouse up");
}

function mouseDrag() {
	if (!starLimb)  {
//		panX += mouseX - lastMouseX;
	//	panY += mouseY - lastMouseY;
	} 
	else {
		rotMouse();
	} 
}
 
function mouseWheel() {
    zoom += wheelSpeed;
}

function keyDown()
{
    var key = keyCode;
	if(key==13) togglePick(); 
	var incre = 0.5;
	if(!starLimb) starLimb = limbs.torso;
    switch(key){
		case 37: //left
		//starLimb.joint.rotVals = [0,0,1,starLimb.joint.rotVals[3]-incre];
		starLimb.joint.rotY-=incre;
		break;
		case 38: //up
		//starLimb.joint.rotVals = [1,0,0,starLimb.joint.rotVals[3]-incre];
		starLimb.joint.rotX-=incre;
		break;
		case 39: //right
		//starLimb.joint.rotVals = [0,0,1,starLimb.joint.rotVals[3]+incre];
		starLimb.joint.rotY+=incre;
		break;
		case 40: //down
		//starLimb.joint.rotVals = [1,0,1,starLimb.joint.rotVals[3]+incre];
		starLimb.joint.rotX+=incre;
		break;
		case 65: //a
		//starLimb.joint.rotVals =[0,1,0,starLimb.joint.rotVals[3]-incre];
		starLimb.joint.rotZ-=incre;
		break;
		case 83: //s
		//starLimb.joint.rotVals =[0,1,0,starLimb.joint.rotVals[3]+incre];
		starLimb.joint.rotZ+=incre;
		break;
		case 88: //x
		zoom += incre;
		break;
		case 90: //z
		zoom -= incre;
		break;
		
		case 32: //space-body
	 	starLimb = null;
		break;
		case 72: // H - head
		selectJoint(limbs.hip);
		break;
		case 78: // N - hip
		selectJoint(limbs.head);
		break;
		case 71: // G- left thigh
		selectJoint(limbs.lthigh);
		break;
		case 70: // F - left knee
		selectJoint(limbs.lcalf);
		break;
		case 68: // D- left ankle
		selectJoint(limbs.lfoot);
		break;
		case 82: // R- left shoulder
		selectJoint(limbs.lforearm);
		break;
		case 69: // E - left elbow
		selectJoint(limbs.larm);
		break;
		case 87: // W- left hand
		selectJoint(limbs.lhand);
		break;
		case 74: // J- right thigh
		selectJoint(limbs.rthigh);
		break;
		case 75: // K - right knee
		selectJoint(limbs.rcalf);
		break;
		case 76: // L- right ankle
		selectJoint(limbs.rfoot);
		break;
		case 85: // U- right shoulder
		selectJoint(limbs.rforearm);
		break;
		case 73: // I - right elbow
		selectJoint(limbs.rarm);
		break;
		case 79: // O- right hand
		selectJoint(limbs.rhand);
		break;

	}

}

function contourMode(){
		setShininess(0);
}
