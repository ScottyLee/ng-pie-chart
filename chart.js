function Chart (element_name, width, height) {
	this.main_anc = 0;
	this.reseted = true;
	this.name = "";
	this.radius = 150;
	this.active_pice = undefined;
	this.selected_pice = undefined;
	this.inner_radius = this.radius/3;
	this.canvas = document.getElementById(element_name);
	this.context = this.canvas.getContext("2d");
	this.width = width;
	this.height = height;
	this.centerX = this.width/2
	this.centerY = this.height/2

	this.canvas.width = this.width;
	this.canvas.height = this.height;

	this.draw_background();

	this.pices = [];
	this.add_listeners();
 	this.reset_active();
 	this.draw();
}

Chart.prototype.draw_background = function() {
	this.context.clearRect(0, 0, this.width, this.width);
	this.context.fillStyle = "#f0f0f0"
	this.context.rect(0, 0 ,this.width, this.height);
	this.context.fill();
};

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

Chart.prototype.draw = function(anc) {
	this.draw_background();	
	var lastend = this.main_anc;
	if (anc != undefined && anc != null && typeof( anc ) == 'number' ){
		lastend = anc;
		this.main_anc = anc;
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

	if (this.selected_pice != undefined) {
		context.textAlign = "center";
	    context.textBaseline = "bottom";
	    context.fillStyle = "#333333"
	    context.font = '14px Times new roman';
	    context.fillText(this.selected_pice.data.name, this.centerX , this.centerY + 20);
		if (this.selected_pice.data.nominal != undefined || this.active_pice.data.nominal != null){
			context.textAlign = "center";
			context.textBaseline = "bottom";
			context.fillStyle = "#333333"
			context.font = '10px Times new roman';
			context.fillText(this.selected_pice.data.nominal, this.centerX , this.centerY + 35);
		}
	    //еще надо подкуски
	    return;
	};

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
	if (pice == this.active_pice) return;
	if (pice == undefined){
		// if (this.active_pice = undefined)
			this.reset_active();
		// else
			// this.hide_unselected();
	}
	this.set_active( pice );
	this.draw();
};

Chart.prototype.on_click = function(event) {
	var pice = this.get_pice_by_coords(event.pageX, event.pageY);	
	if ( pice == undefined ){
		this.reset_selected();
		this.reset_active();
 		this.draw();
 		return;
	}
	this.set_selected( pice );
	// this.set_rotation(false, (2.5 * Math.PI) % (2 * Math.PI));
	this.draw();

	


	// var way = (2 * Math.PI) - pice.pice_center;

	// if ( ( way ) < pice.pice_center ){
	// 	console.log("По часовой стрелке");
	// 	var anc_pivot = this.main_anc + way;
	// 	this.set_rotation( anc_pivot );
	// 	// this.set_rotation(false, (2.5 * Math.PI) % (2 * Math.PI));
	// }else{
	// 	console.log("Против часовой стрелки");
	// 	var anc_pivot = this.main_anc - pice.pice_center;
	// 	if (anc_pivot < 0)
	// 		anc_pivot = (2 * Math.PI) + anc_pivot;
		
	// 	this.set_rotation(anc_pivot);
	// }
	
};

Chart.prototype.reset_active = function() {
	this.reseted = true;
	this.active_pice = undefined;
	for (var i = this.pices.length - 1; i >= 0; i--) {
		this.pices[i].active = true;
	};
};

Chart.prototype.hide_unselected = function() {
	for (var i = this.pices.length - 1; i >= 0; i--) {
		if (!this.pices[i].selected){
			this.pices[i].active = false;
		}
	};
};

Chart.prototype.reset_selected = function() {
	this.reseted = true;
	this.selected_pice = undefined;
	for (var i = this.pices.length - 1; i >= 0; i--) {
		this.pices[i].selected = false;
	};
};


Chart.prototype.set_selected = function(pice) {
	if ( pice == undefined ) return;
	
	if( this.selected_pice == undefined ){
		pice.selected_pice = true;
		pice.selected = true;
		this.selected_pice = pice;
		return;
	}
	
	if ( pice == this.selected_pice.selected ) return;

	this.selected_pice.selected = false;
	pice.selected = true;
	this.selected_pice = pice;
};

Chart.prototype.set_active = function(pice) {
	if (pice == undefined) return;
	if (this.active_pice != undefined)
		this.active_pice.active = false;
	pice.active = true;
	this.active_pice = pice;
	if (this.reseted){
		for (var i = this.pices.length - 1; i >= 0; i--) {
			if (pice != this.pices[i])
				this.pices[i].active = false
		};
	}
};

Chart.prototype.set_rotation = function(anc) {

	if (this.main_anc == ( anc % (2 * Math.PI) ) ){
		this.main_anc = 0;
	}else{
		this.main_anc = anc % (2 * Math.PI);
	}
	
	this.draw();
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
	this.sub_pices = [];
	this.active = true;
	this.selected = false;
	this.init();
};

Pice.prototype.init = function(first_argument) {
	var actual_val = 0;
	if ( this.data.hasOwnProperty("pices") ){
		
		for (var i = this.data.pices.length - 1; i >= 0; i--) {
			var pice = this.data.pices[i];
			this.sub_pices.push( new Pice(this.parent, pice) );
			actual_val += pice.value;
		};

		if (this.data.value != actual_val) 
			this.data.value = actual_val;
	}
};

Pice.prototype.draw = function(current_end) {
	if (this.selected) {
		if (this.data.hasOwnProperty("pices")){
			var res = this.draw_subpices( current_end );
			this.draw_legend();
			return res;
		}else{
			var res = this.draw_self( current_end );
			this.draw_legend();
			return res;			
		}

	}else{
		var res = this.draw_self( current_end );
		this.draw_legend();
		return res;
	}
};

Pice.prototype.draw_subpices = function(current_end) {
	var acc = undefined;
	for (var i = this.sub_pices.length - 1; i >= 0; i--) {
		if(acc == undefined){
			acc = this.sub_pices[i].draw(current_end);
		}else{
			acc = this.sub_pices[i].draw( acc );
		}
	};
	
	this.calc_sector(current_end, parent.total);
	return acc;
};

Pice.prototype.draw_self = function(current_end) {
	var context = this.parent.context;
	var parent = this.parent;

	this.calc_sector(current_end, parent.total);

	context.fillStyle = this.active ? this.data.active: this.data.color;
	context.strokeStyle = "#FFFFFF";
	context.lineWidth = 1;

	context.beginPath();
	context.moveTo(parent.centerX , parent.centerY);
	// console.log(this.pice_begin);
	context.arc(parent.centerX, parent.centerY, parent.radius, this.pice_begin, this.pice_end, false);
	context.lineTo(this.centerX , this.centerY);
	context.fill();
	context.stroke();
	context.closePath();
	// console.log(this.pice_end);
	return this.pice_end;
};

Pice.prototype.draw_legend = function() {
	var context = this.parent.context;
	var parent = this.parent;
	context.textBaseline = "bottom";
	context.fillStyle = "#333333"
	context.font = '10px Times new roman';
	// context.textAlign = "center";
	context.textAlign = "right";	
	// if (  Math.PI / 2 < this.pice_begin && this.pice_begin < (3 * Math.PI) / 4 ){
	// 	// context.textAlign = "center";
	// 	context.textAlign = "left";	
	// }else{
	// 	context.textAlign = "right";
	// }
	
	var textX = parent.centerX + Math.cos( this.pice_end) * (parent.radius+80);
	var textY = parent.centerY + Math.sin( this.pice_end) * (parent.radius+20);
	
	// if ()
	// 	this.pice_begin


	context.fillText(this.data.name, textX , textY);
};


Pice.prototype.normalize = function(current_end) {
	this.pice_begin = this.pice_begin % (2 * Math.PI);
	this.pice_end = this.pice_end % (2 * Math.PI);
	this.pice_center = this.pice_center % (2 * Math.PI);
}

Pice.prototype.calc_sector = function(current_end, total) {
	var new_end = 2 * Math.PI * ( this.data.value / total );
	this.pice_begin = current_end;
	this.pice_end = current_end + new_end;
	this.pice_center = ( current_end + ( (new_end - current_end) / 2 ) );
	this.normalize();
}


Pice.prototype.hit_anc = function(anc) {
	if (this.pice_begin > this.pice_end){
		var tmp_end = 0;
		if (this.pice_end == 0){
			tmp_end = 2 * Math.PI;
			return (this.pice_begin < anc ) && (anc < tmp_end);
		}
		tmp_end = 2 * Math.PI + this.pice_end;
		return (this.pice_begin < anc ) && (anc < tmp_end);
	}
	return (this.pice_begin < anc ) && (anc < this.pice_end);
};























