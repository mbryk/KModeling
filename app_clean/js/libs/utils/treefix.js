GraphicsCalculator = {};


GraphicsCalculator.setPositions = function(root) {
	root.pos={x: 650,y: 300};
	r=150;
	GraphicsCalculator.setPositionsHelper(root,0,Math.PI*2,root.pos,r,r);
}

GraphicsCalculator.setPositionsHelper = function(node,startDeg,endDeg,vec,r,rdelta) {
	var phi = (endDeg-startDeg)/node._childrenviews.length;
	_(node._childrenviews).each(function(child,i) {
		var theta = startDeg+(i+0.5)*phi;
		child.pos=GraphicsCalculator.getCartesian(r,theta,vec);
		GraphicsCalculator.setPositionsHelper(child,startDeg+i*phi,startDeg+(i+1)*phi,vec,r+rdelta,rdelta);
	});
}

GraphicsCalculator.getCartesian = function(r,theta,vec) {
	return {x: vec.x+r*Math.cos(theta) , y: vec.y+r*Math.sin(theta)};
}
