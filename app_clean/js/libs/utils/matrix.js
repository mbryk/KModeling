define(function(){
	
	var Matrix = function(ary){ this.mtx = ary;}
	Matrix.prototype.mult = function(vector) {
		result = Array();
		result[0]=this.mtx[0][0]*vector[0]+this.mtx[0][1]*vector[1];
		result[1]=this.mtx[1][0]*vector[0]+this.mtx[1][1]*vector[1];
		return result;
	};
	return Matrix;
	
});

