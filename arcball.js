function normVector(v){
var len = Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);
var result = [v[0]/len, v[1]/len, v[2]/len];
return result;
}

function normScalor(v){
return Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]); }

function cross(a,b){
var result = [a[1]*b[2]-b[1]*a[2] , a[2]*b[0]-b[2]*a[0] , a[0]*b[1]-b[0]*a[1] ];
return result;
}

function divideScale(v,s){
var result = [v[0]/s,v[1]/s,v[2]/s];
return result; }

function xy2Sphere(x,y){
var nx = x / width* 2.0 - 1.0;
var ny = 1.0 - y / height * 2.0;
var l2 = nx*nx+ny*ny;
var z; 
if(l2>1) return normVector([nx,ny,0]);
else return[nx,ny,Math.sqrt(1-l2)];
}

function getRot(v1,v2){
var n = cross(v1,v2);
var nn = normScalor(n);
var result = divideScale(n,nn);
result.push(Math.asin(nn));
for(var i=0; i<3; i++){
if(result[i]<0) { result[i] = -1*result[i]; result[3] = -1*result[3]; }
}
return result;
}

function arcball(){
var v1 = xy2Sphere(lastMouseX,lastMouseY);
var v2 = xy2Sphere(mouseX,mouseY);
return getRot(v1,v2);
}
