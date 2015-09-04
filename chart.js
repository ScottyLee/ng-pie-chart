function Chart (element_name, width, height) {
	this.name = "";
	this.radius = 150;
	this.active_pice = undefined;
	this.inner_radius = this.radius/3;
	this.canvas = document.getElementById(element_name);
	this.context = this.canvas.getContext("2d");
	this.width = width;
	this.height = height;
	this.centerX = this.width/2
	this.centerY = this.height/2

	this.canvas.width = this.width;
	this.canvas.height = this.height;

	this.context.clearRect(0, 0, this.width, this.width);
	this.context.fillStyle = "#f0f0f0"
	this.context.rect(0,0,this.width, this.height);
	this.context.fill();

	this.pices = [];
	this.add_listeners();
}

Chart.prototype.set_data = function(data) {
	if (data == undefined || data == null){
		return false;
	}
	
	this.chart_data = data;
	this.name = data.name;
	this.total = 0;
	
	for (var i = data.pices.length - 1; i >= 0; i--) {
		var elem = data.pices[i];
		this.total += (typeof( elem.value ) == 'number') ? elem.value : 0;
		this.pices.push(new Pice( this, elem ) );
	};
};

Chart.prototype.draw = function(initial_pivot) {
	var lastend = 0;
	if (initial_pivot != undefined && initial_pivot != null && typeof( initial_pivot ) == 'number' ){
		lastend = initial_pivot;
	}

	for (var i = this.pices.length - 1; i >= 0; i--) {
			var pice = this.pices[i];
			lastend = pice.draw(lastend);
	};
	this.draw_center();
};


Chart.prototype.draw_center = function() {
	var context = this.context;
	context.beginPath();
	context.shadowColor = "#c7c7c7";
	context.shadowBlur = 10;
    context.fillStyle = "white";
    context.arc(this.centerX, this.centerY, this.inner_radius, 0, 2 * Math.PI, false);
    context.fill();
    context.shadowBlur = 0;
	context.closePath();

	context.textAlign = "center";
    context.textBaseline = "bottom";
    context.fillStyle = "#333333"
    context.font = '20px Times new roman';
    context.fillText(this.name, this.centerX , this.centerY);

	if (this.active_pice != undefined && this.active_pice != null){
		context.textAlign = "center";
	    context.textBaseline = "bottom";
	    context.fillStyle = "#333333"
	    context.font = '14px Times new roman';
	    context.fillText(this.active_pice.data.name, this.centerX , this.centerY + 20);    


	    if (this.active_pice.data.nominal != undefined || this.active_pice.data.nominal != null){
	    	context.textAlign = "center";
	    	context.textBaseline = "bottom";
	    	context.fillStyle = "#333333"
	    	context.font = '10px Times new roman';
	    	context.fillText(this.active_pice.data.nominal, this.centerX , this.centerY + 35);
	    }
    	
	}
	
	

};

Chart.prototype.add_listeners = function() {
	var chart = this;
	this.canvas.addEventListener('click', function(event) { chart.on_click(event); }, false);
	this.canvas.addEventListener('mousemove', function(event) { chart.on_mousemove(event); }, false);
};

Chart.prototype.on_mousemove = function(event) {
	var pice = this.get_pice_by_coords(event.pageX, event.pageY);
	// if (pice != undefined){
		this.set_active( pice );
		// console.log(pice.data.name);
	// }
};

Chart.prototype.set_active = function(pice) {
	this.active_pice = pice;
	if (pice != undefined){
		pice.set_active( true );
		for (var i = this.pices.length - 1; i >= 0; i--) {
			var cur_pice = this.pices[i];
			if (cur_pice != pice){
				cur_pice.set_active( false );
			}
		};
	}else{
		for (var i = this.pices.length - 1; i >= 0; i--) {
			var cur_pice = this.pices[i];
			cur_pice.set_active( false );
		};
	}
	
	this.draw();
};

Chart.prototype.on_click = function(event) {
	var pice = this.get_pice_by_coords(event.pageX, event.pageY);
	if (pice != undefined)
		console.log(pice.data.name);
};


Chart.prototype.get_pice_by_coords = function(x,y) {
	var mouseX = x - this.canvas.offsetLeft;
    var mouseY = y - this.canvas.offsetTop;

	var xFromCentre = mouseX - this.centerX;
    var yFromCentre = mouseY - this.centerY;
	var distanceFromCentre = Math.sqrt( Math.pow( Math.abs( xFromCentre ), 2) + Math.pow( Math.abs( yFromCentre ), 2));
	if (distanceFromCentre > this.radius || distanceFromCentre < this.inner_radius ) return undefined;
    var clickAngle = Math.atan2(yFromCentre, xFromCentre);
    if ( clickAngle < 0 ) 
    	clickAngle = 2 * Math.PI + clickAngle;
    clickAngle = clickAngle;

	for (var i = this.pices.length - 1; i >= 0; i--) {
		var pice = this.pices[i];
		if (pice.hit_anc(clickAngle)){
			return pice;
		}
	};
};









function Pice (parent, data) {
	this.data = data;
	this.parent = parent;
	this.active = false;
}

Pice.prototype.draw = function(current_end) {
	var context = this.parent.context;
	var parent = this.parent;
	var cur_val = Math.PI * 2 * ( this.data.value / parent.total );
	
	context.fillStyle = this.active ? this.data.active: this.data.color;
	
	context.strokeStyle="#FFFFFF";
	context.lineWidth = 1;

	context.beginPath();
	context.moveTo(parent.centerX , parent.centerY);
	context.arc(parent.centerX, parent.centerY, parent.radius, current_end, current_end + cur_val, false);
	context.lineTo(this.centerX , this.centerY);
	context.fill();
	context.stroke();
	context.closePath();

	this.pice_begin = current_end;
	this.pice_end = current_end + cur_val
	return current_end + cur_val
};

Pice.prototype.hit_anc = function(anc) {
	return (this.pice_begin < anc) && (this.pice_end > anc)
};


Pice.prototype.set_active = function(state) {
	if (typeof( state ) == 'boolean')
		this.active = state;
};





