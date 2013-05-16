var model = {};

model.head = "models/head.obj";
model.torso = "models/torso.obj";
model.hip = "models/hip.obj";
model.rarm = "models/arm2.obj";
//model.larm = "models/arm.obj";
//model.rforearm = "models/forearm.obj";
//model.lforearm = "models/forearm.obj";
//model.rhand = "models/hand.obj";
//model.lhand = "models/hand.obj";
//model.rthigh = "models/thigh.obj";
//model.lthigh = "models/thigh.obj";
//model.rcalf = "models/calf.obj";
//model.lcalf = "models/calf.obj";
//model.rfoot = "models/foot.obj";
//model.lfoot = "models/foot.obj";

/*Inherent Translations*/
function fixPositions(){
model.head.setTrans(0,10,0);
model.torso.setTrans(0,0,0);
model.hip.setTrans(0,-20,0);
model.rarm.setTrans(0,25,15);
}
