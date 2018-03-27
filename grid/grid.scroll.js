function SCROLLBARS(cvs, btnSize, minSize, barColor, scrollBtnColor) {
	this.MAX_AREA_WIDTH = 0;
	this.MAX_AREA_HEIGHT= 0;
	this.MAX_SC_WIDTH = 0;
	this.MAX_SC_HEIGHT = 0;
	this.BTN_WH = btnSize;
	this.MS_X = 0;
	this.MS_Y = 0;
	this.AREA_X= 0;
	this.AREA_Y= 0;
	this.SC_MIN_SIZE= minSize;
	this.SC_V_SIZE= 0;
	this.SC_H_SIZE= 0;
	this.SC_V_VAL= 0;
	this.SC_H_VAL= 0;
	this.SCROLL_YBAR_COLOR= barColor;
	this.SCROLL_XBAR_COLOR= barColor;
	this.SCROLL_BTN_COLOR= scrollBtnColor;
	this.cvs = document.getElementById(cvs);
	this.ctx = this.cvs.getContext('2d');

	this.init();

	return this;
}

SCROLLBARS.prototype = {
	init: function() {
		this.MAX_AREA_WIDTH = (sc_vertical) ? rightwidth+this.BTN_WH : rightwidth;
		this.MAX_AREA_HEIGHT = (sc_horizontal) ? dataCount * tdHeight + this.BTN_WH : dataCount * tdHeight;
		this.MAX_SC_WIDTH = (sc_vertical) ? canvas.width - leftwidth - (this.BTN_WH) : canvas.width - leftwidth;
		this.MAX_SC_HEIGHT = (sc_horizontal) ? canvas.height - (this.BTN_WH) : canvas.height;
		this.MS_X = (resize) ? scrollbar.MS_X : leftwidth;
		this.MS_Y = (resize) ? scrollbar.MS_Y : this.MS_Y;

		this.scrollDraw();

		if( sc_vertical || sc_horizontal) {
			cvs.addEventListener('wheel', this.mousewheel);
			cvs.addEventListener('mousedown', this.scrollDown);
			document.addEventListener('mousemove', this.scrollMove);
		}
	},
	scrollDraw: function() {
		var xarea = 0,
			yarea = 0;

		if(sc_vertical) {
			xarea = this.BTN_WH;
			this.verticalDraw();
		}
		if(sc_horizontal) {
			yarea = this.BTN_WH;
			this.horizontalDraw();
		}

		if( sc_vertical && sc_horizontal ) {
			this.ctx.beginPath();
			this.ctx.fillStyle = '#fff';
			this.ctx.rect(canvas.width-this.BTN_WH, canvas.height-this.BTN_WH, this.BTN_WH, this.BTN_WH);
			this.ctx.fill();
		}
		imageData = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
	},
	verticalDraw: function() {
		drawScrollBar(canvas.width - this.BTN_WH, 0, this.BTN_WH, this.MAX_SC_HEIGHT);

		// scroll
		this.SC_V_SIZE = canvas.height/this.MAX_AREA_HEIGHT * this.MAX_SC_HEIGHT;
		if( this.SC_V_SIZE < this.SC_MIN_SIZE ) {
			this.SC_V_VAL = this.MAX_SC_HEIGHT - this.SC_MIN_SIZE - this.SC_V_SIZE;
			this.SC_V_SIZE = this.SC_MIN_SIZE;
		}else {
			this.SC_V_VAL = this.MAX_SC_HEIGHT;
		}

		this.ctx.beginPath();
		this.ctx.fillStyle = this.SCROLL_YBAR_COLOR;
		this.ctx.rect(canvas.width-this.BTN_WH+1.5, this.MS_Y, this.BTN_WH-3, this.SC_V_SIZE);
		this.ctx.strokeStyle = '#d9d3d3';
		this.ctx.strokeRect(canvas.width-this.BTN_WH+1.5, this.MS_Y, this.BTN_WH-3, this.SC_V_SIZE);
		this.ctx.fill();

		// button
		// var btnY = (sc_horizontal) ? canvas.height - (this.BTN_WH*3) : canvas.height - (this.BTN_WH*2);
		// this.buttonDraw(canvas.width-this.BTN_WH, 0, this.BTN_WH, this.BTN_WH, 't');
		// this.buttonDraw(canvas.width-this.BTN_WH, btnY+this.BTN_WH, this.BTN_WH, this.BTN_WH, 'b');

	},
	horizontalDraw: function(e) {
		drawScrollBar(leftwidth, canvas.height-this.BTN_WH, this.MAX_SC_WIDTH, this.BTN_WH);

		// scroll
		this.SC_H_SIZE = (canvas.width-leftwidth)/this.MAX_AREA_WIDTH * this.MAX_SC_WIDTH;
		if( this.SC_H_SIZE < this.SC_MIN_SIZE ) {
			SC_H_VAL = this.MAX_SC_WIDTH - this.SC_MIN_SIZE - this.SC_H_SIZE;
			this.SC_H_SIZE = this.SC_MIN_SIZE;
		}else {
			SC_H_VAL = this.SC_H_SIZE;
		}

		this.ctx.beginPath();
		this.ctx.fillStyle = this.SCROLL_XBAR_COLOR;
		this.ctx.rect(this.MS_X+.5, canvas.height-this.BTN_WH+2, this.SC_H_SIZE, this.BTN_WH-4);
		this.ctx.strokeStyle = '#d9d3d3';
		this.ctx.strokeRect(this.MS_X+.5, canvas.height-this.BTN_WH+2, this.SC_H_SIZE, this.BTN_WH-4);
		this.ctx.fill();

		// button
		// var btnY = (sc_vertical) ? canvas.width - leftwidth - (this.BTN_WH*3) : canvas.width - leftwidth - (this.BTN_WH*2);
		// this.buttonDraw(leftwidth, canvas.height-this.BTN_WH, this.BTN_WH, this.BTN_WH, 'l');
		// this.buttonDraw(leftwidth+btnY+this.BTN_WH, canvas.height-this.BTN_WH, this.BTN_WH, this.BTN_WH, 'r');

	},
	mousewheel: function(e) {
		e.preventDefault();
		ctx.setTransform(1, 0, 0, 1, 0, 0);

		if(!key.isModify) {
			if(e.deltaY && dataCount*tdHeight > canvas.height) {
				ctxTop -= e.deltaY;
				if( e.deltaY < 0 && ctxTop >= 0 ) {
					ctxTop = 0;
				}
				if( e.deltaY > 0 && ctxTop < -(scrollbar.MAX_AREA_HEIGHT - canvas.height)) {
					ctxTop = -(scrollbar.MAX_AREA_HEIGHT - canvas.height);
				}
				scrollbar.MS_Y = scrollbar.setMsY(ctxTop);
			}

			if(e.deltaX) {
				var header = document.getElementById('grid-moving');

				ctxLeft -= e.deltaX;
				header.style.left = leftwidth + ctxLeft + 'px';
				if( e.deltaX < 0 && ctxLeft >= 0) {
					ctxLeft = 0;
				}else if( e.deltaX > 0 && ctxLeft < -(scrollbar.MAX_AREA_WIDTH - (canvas.width - leftwidth))) {
					ctxLeft = -(scrollbar.MAX_AREA_WIDTH - (canvas.width - leftwidth));
				}
				scrollbar.MS_X = scrollbar.setMsX(ctxLeft);
			}
			scrollbar.reDraw();
		}
	},
	setMsY: function(ctxt) {
		this.MS_Y = -ctxt / this.MAX_AREA_HEIGHT * this.SC_V_VAL;

		return this.MS_Y;
	},
	setMsX: function(ctxl) {
		var header = document.getElementById('grid-moving');
		
		// this.MS_X = -ctxl / this.MAX_AREA_WIDTH * SC_H_VAL + leftwidth + this.BTN_WH;
		this.MS_X = -ctxl / this.MAX_AREA_WIDTH * this.MAX_SC_WIDTH + leftwidth;
		header.style.left =  leftwidth + ctxl + 'px';

		return this.MS_X;
	},
	reDraw: function() {
		this.ctx.clearRect(0, 0, canvas.width, canvas.height);
		rowStart = Math.abs(Math.ceil(ctxTop/tdHeight));
		rowEnd = rowStart + dataLen;

		grid.dataDraw();
		scrollbar.scrollDraw();
		// scrollbar.init();
	},
	scrollDown: function(e) {
		var x = e.offsetX,
			y = e.offsetY;

		// scroll
		if( sc_vertical && pointCheck(e, canvas.width - scrollbar.BTN_WH, 0, scrollbar.BTN_WH, scrollbar.MAX_SC_HEIGHT) ) {
			grid.eventConfig.isYScroll = true;
			if(pointCheck(e, canvas.width-scrollbar.BTN_WH+1.5, scrollbar.MS_Y, scrollbar.BTN_WH-3, scrollbar.SC_V_SIZE)) {
				grid.eventConfig.startY = y - scrollbar.MS_Y;
				// scrollbar.SCROLL_YBAR_COLOR = '#b9b9b9';
				scrollbar.verticalDraw();
			}else {
				if( y > scrollbar.MAX_SC_HEIGHT-scrollbar.SC_V_SIZE) {
					scrollbar.MS_Y = scrollbar.MAX_SC_HEIGHT - scrollbar.SC_V_SIZE;
					ctxTop = -(scrollbar.MAX_AREA_HEIGHT - canvas.height);
				}else {
					scrollbar.MS_Y = y;
					ctxTop = -(scrollbar.MS_Y) / scrollbar.SC_V_VAL * scrollbar.MAX_AREA_HEIGHT;
				}

				scrollbar.reDraw();
			}
		}

		if( sc_horizontal && pointCheck(e, leftwidth, canvas.height-scrollbar.BTN_WH-1, scrollbar.MAX_SC_WIDTH, scrollbar.BTN_WH) ) {
			if(pointCheck(e, scrollbar.MS_X, canvas.height-scrollbar.BTN_WH+1, scrollbar.SC_H_SIZE, scrollbar.BTN_WH-3)) {
				grid.eventConfig.isXScroll = true;
				grid.eventConfig.startX = x - scrollbar.MS_X;
				// scrollbar.SCROLL_XBAR_COLOR = '#b9b9b9';
				scrollbar.horizontalDraw();
			}else {
				var header = document.getElementById('grid-moving');
				if( x >  scrollbar.MAX_SC_WIDTH + leftwidth + scrollbar.BTN_WH  - scrollbar.SC_H_SIZE) {
					scrollbar.MS_X =  scrollbar.MAX_SC_WIDTH + leftwidth + scrollbar.BTN_WH  - scrollbar.SC_H_SIZE;
				}else {
					scrollbar.MS_X = x;
				}
				ctxLeft = -(scrollbar.MS_X-leftwidth-scrollbar.BTN_WH) / scrollbar.MAX_SC_WIDTH * scrollbar.MAX_AREA_WIDTH;
				header.style.left = leftwidth + ctxLeft + 'px';
				scrollbar.reDraw();
			}
		}
	},
	scrollMove: function(e) {
		if(!isPipeline) {
			var x = e.offsetX,
				y = e.offsetY;
			var topH = document.body.offsetHeight - canvas.height;
			var yy = (e.clientY-topH+30 < 0 ) ? 0 : e.clientY-topH+30;

			// scroll drag
			if(grid.eventConfig.isYScroll) {
				scrollbar.MS_Y = yy - grid.eventConfig.startY;

				ctxTop = -(scrollbar.MS_Y) / scrollbar.SC_V_VAL * scrollbar.MAX_AREA_HEIGHT;
				if( scrollbar.MS_Y < 0 ) {
					scrollbar.MS_Y = 0;
					ctxTop = 0;
				}else if( scrollbar.MS_Y > scrollbar.MAX_SC_HEIGHT - scrollbar.SC_V_SIZE) {
					scrollbar.MS_Y = scrollbar.MAX_SC_HEIGHT - scrollbar.SC_V_SIZE;
					ctxTop = -(scrollbar.MAX_AREA_HEIGHT - canvas.height);
				}
				scrollbar.reDraw();
			}

			if(grid.eventConfig.isXScroll) {
				var header = document.getElementById('grid-moving');
				scrollbar.MS_X = x - grid.eventConfig.startX;

				if( scrollbar.MS_X < leftwidth ) {
					scrollbar.MS_X = leftwidth;
					header.style.left = leftwidth + 'px';
				}else if( scrollbar.MS_X > scrollbar.MAX_SC_WIDTH + leftwidth - scrollbar.SC_H_SIZE) {
					scrollbar.MS_X = scrollbar.MAX_SC_WIDTH + leftwidth - scrollbar.SC_H_SIZE;
					header.style.left = leftwidth + ctxLeft + 'px';
				}

				ctxLeft = -(scrollbar.MS_X-leftwidth) / scrollbar.MAX_SC_WIDTH * scrollbar.MAX_AREA_WIDTH;
				header.style.left = leftwidth + ctxLeft + 'px';

				scrollbar.reDraw();
			}
		}
	}
	// buttonDraw: function(x, y, w, h, t) {
	// 	this.ctx.beginPath();
	// 	this.ctx.fillStyle = this.SCROLL_BTN_COLOR;
	// 	this.ctx.rect(x, y, w, h);
	// 	this.ctx.fill();

	// 	this.ctx.beginPath();
	// 	this.ctx.fillStyle = '#000';
	// 	switch(t) {
	// 		case 't':
	// 			this.ctx.moveTo(canvas.width - (this.BTN_WH/2), 6);
	// 			this.ctx.lineTo(canvas.width - (this.BTN_WH/2-3.5), 10);
	// 			this.ctx.lineTo(canvas.width - (this.BTN_WH/2+3.5), 10);
	// 			break;
	// 		case 'b':
	// 			this.ctx.moveTo(canvas.width - (this.BTN_WH/2), this.BTN_WH+this.MAX_SC_HEIGHT+10);
	// 			this.ctx.lineTo(canvas.width - (this.BTN_WH/2-3.5), this.BTN_WH+this.MAX_SC_HEIGHT+6);
	// 			this.ctx.lineTo(canvas.width - (this.BTN_WH/2+3.5), this.BTN_WH+this.MAX_SC_HEIGHT+6);
	// 			break;
	// 		case 'l':
	// 			this.ctx.moveTo(leftwidth+6, canvas.height - this.BTN_WH/2);
	// 			this.ctx.lineTo(leftwidth+10, canvas.height - this.BTN_WH/2-3.5);
	// 			this.ctx.lineTo(leftwidth+10, canvas.height - this.BTN_WH/2+3.5);
	// 			break;
	// 		case 'r':
	// 			var w = leftwidth+this.BTN_WH+this.MAX_SC_WIDTH;
	// 			this.ctx.moveTo(w+10, canvas.height - this.BTN_WH/2);
	// 			this.ctx.lineTo(w+6, canvas.height - this.BTN_WH/2-3.5);
	// 			this.ctx.lineTo(w+6, canvas.height - this.BTN_WH/2+3.5);
	// 			break;
	// 	}
	// 	this.ctx.closePath();
	// 	this.ctx.fill();
	// }
}

function drawScrollBar(x, y, w, h) {
	this.ctx.beginPath();
	this.ctx.fillStyle = '#878787';
	this.ctx.rect(x, y, w, h);
	this.ctx.fill();

}




// 
var scx = 234,
	scy = 1;
function SC(id, maxWidth, maxHeight, stX) {
	this.cvs = document.getElementById(id);
	this.ctx = this.cvs.getContext('2d');
	this.maxWidth = maxWidth;
	this.maxHeight = maxHeight;
	this.scSize = 16;
	this.stX = stX;
	this.h = 0;
	this.w = 0;
	this.scySize = 0;
	this.scxSize = 0;
	this.scVertical = false;
	this.scHorizontal = false;
	this.isClkXsc = false;
	this.isClkYsc = false;
	// this.scx = 234;
	// this.scy = 1;

	this.init();
}

var s_this;
SC.prototype = {
	init: function() {
		s_this = this;
		_ctx = this.ctx;
		this.h = ( this.cvs.width-this.stX < this.maxWidth ) ? this.scSize : 0;
		this.w = ( this.cvs.height < this.maxHeight ) ? this.scSize : 0;

		this.scrollDraw();

		if( this.cvs.height < this.maxHeight || this.cvs.width-this.stX < this.maxWidth) {
			this.cvs.addEventListener('mousewheel', this.mousewheel);
			this.cvs.addEventListener('mousedown', this.mousedown);
			document.addEventListener('mousemove', this.mousemove);
			document.addEventListener('mouseup', this.mouseup);
		}

	},
	scrollDraw: function() {
		if(this.cvs.height < this.maxHeight) {
			drawScBar(this.cvs.width-this.scSize, 0, this.scSize, this.cvs.height-this.h);
			scDraw(this.cvs.width-this.scSize+1, scy, this.scSize-2, 'vertical');
			this.scVertical = true;
		}
		if(this.cvs.width-this.stX < this.maxWidth) {
			drawScBar(this.stX, this.cvs.height-this.scSize, this.cvs.width-this.stX-this.w, this.scSize);
			scDraw(scx, this.cvs.height-this.scSize+1, this.scSize-2, 'horizontal');
			this.scHorizontal = true;
		}

		function drawScBar(x, y, w, h) {
			_ctx.beginPath();
			_ctx.fillStyle = '#878787';
			_ctx.rect(x, y, w, h);
			_ctx.fill();
		}

		function scDraw(x, y, xy, type) {
			_ctx.beginPath();
			_ctx.fillStyle = '#b9b9b9';
			_ctx.strokeStyle = '#c9c6c6';
			_ctx.lineWidth = '1'
			if( type == 'vertical') {
				s_this.scySize = s_this.cvs.height/s_this.maxHeight * (s_this.cvs.height-s_this.h);
				if( s_this.scySize < 17 ) s_this.scySize = 17;
				_ctx.rect(x, y, xy, s_this.scySize);
		
			}else {
				s_this.scxSize = (s_this.cvs.width-s_this.stX)/s_this.maxWidth * (s_this.cvs.width-s_this.stX-s_this.w);
				if( s_this.scxSize < 17 ) s_this.scxSize = 17;
				_ctx.rect(x, y, s_this.scxSize, xy);
				// _ctx.strokeRect(x, y, size, xy);
			}
			_ctx.fill();
		}
	},
	mousewheel: function(e) {
		e.preventDefault();
		_cvs = e.target;

		if(!canvasdraw.modify) {
			_ctx.clearRect(0,0,_cvs.width, _cvs.height);
			if(e.deltaY && s_this.maxHeight > _cvs.height) {
				multictxTop -= e.deltaY;
				if( e.deltaY < 0 && multictxTop >= 0 ) {
					multictxTop = 0;
				}
				if( e.deltaY > 0 && multictxTop < -(s_this.maxHeight - _cvs.height)) {
					multictxTop = -(s_this.maxHeight - _cvs.height);
				}
				scy = -multictxTop / s_this.maxHeight * (s_this.cvs.height-s_this.h);
			}
			if(e.deltaX) {
				var header = $('table.move');

				multictxLeft -= e.deltaX;
				header.css('left', s_this.stX + multictxLeft + 'px');
				if( e.deltaX < 0 && multictxLeft >= 0) {
					multictxLeft = 0;
				}else if( e.deltaX > 0 && multictxLeft < -(s_this.maxWidth - (_cvs.width - s_this.stX))) {
					multictxLeft = -(s_this.maxWidth - (_cvs.width - s_this.stX));
				}
				scx = -multictxLeft / s_this.maxWidth * (s_this.cvs.width-s_this.stX-s_this.w ) + s_this.stX;

			}

			mst = Math.abs(Math.ceil(multictxTop/30));

			canvasdraw.draw();
			s_this.scrollDraw();
		}
	},
	mousedown: function(e) {
		e.preventDefault();
		var x = e.offsetX,
			y = e.offsetY;

		if(s_this.scVertical && pointCheck(e, s_this.cvs.width-s_this.scSize, 0, s_this.scSize, s_this.cvs.height-s_this.h)) {
			if(pointCheck(e, s_this.cvs.width-s_this.scSize, scy, s_this.scSize, s_this.scySize)) {
				s_this.isClkYsc = true;
				_scy = y - scy;
			}else {
				if(y > s_this.cvs.height- s_this.scySize - s_this.h) {
					scy = s_this.cvs.height- s_this.scySize - s_this.h;
					multictxTop = -(s_this.maxHeight-s_this.cvs.height);
				}else {
					scy = y;
					multictxTop = -(scy) / (s_this.cvs.height-s_this.h) * s_this.maxHeight;
				}

				s_this.ctx.clearRect(0,0,s_this.cvs.width, s_this.cvs.height);
				mst = Math.abs(Math.ceil(multictxTop/30));
				canvasdraw.draw();
				s_this.scrollDraw();
			}
		}

		if(s_this.scHorizontal && pointCheck(e, s_this.stX, s_this.cvs.height-s_this.scSize, s_this.cvs.width-s_this.stX-s_this.w, s_this.scSize)) {
			if(pointCheck(e, scx, s_this.cvs.height-s_this.scSize, s_this.scxSize, s_this.scSize)) {
				s_this.isClkXsc = true;
				_scx = x - scx;
			}else {
				if(x > s_this.cvs.width - s_this.scxSize - s_this.w) {
					scx = s_this.cvs.width - s_this.scxSize - s_this.w;
					multictxLeft = -s_this.maxWidth+(s_this.cvs.width-s_this.stX);
				}else {
					scx = x;
					multictxLeft = -(scx-s_this.stX) / (s_this.cvs.width) * s_this.maxWidth;
				}
				$('table.move').css('left', multictxLeft+s_this.stX + 'px');
			}
			s_this.ctx.clearRect(0,0,s_this.cvs.width, s_this.cvs.height);
			canvasdraw.draw();
			s_this.scrollDraw();
		}
	},
	mousemove: function(e) {
		var x = e.offsetX,
			y = e.offsetY;

		if(s_this.isClkYsc) {
			var lt = parseInt($('.layerPop').css('top'))+parseInt($('.layerPop').css('margin-top'));
			var yy = e.clientY - (parseInt($('.layerPop .top').height()) + parseInt($('.layerPop .step2').height())+lt);

			scy = yy - _scy;
			if( scy < 0 ) {
				scy = 0;
			}else if( scy > s_this.cvs.height - s_this.scySize - s_this.h) {
				scy = s_this.cvs.height - s_this.scySize - s_this.h;
			}
			multictxTop = -(scy) / (s_this.cvs.height-s_this.h) * s_this.maxHeight;
			mst = Math.abs(Math.ceil(multictxTop/30));
		}

		if(s_this.isClkXsc) {
			var ll = parseInt($('.layerPop').css('left'))+parseInt($('.layerPop').css('margin-left'));
			var xx = e.clientX - ll;

			scx = xx - _scx;
			if( scx < s_this.stX) {
				scx = s_this.stX;
			}else if( scx > s_this.cvs.width - s_this.scxSize - s_this.w) {
				scx = s_this.cvs.width - s_this.scxSize - s_this.w;
			}
			multictxLeft = -(scx-s_this.stX) / (s_this.cvs.width-s_this.stX-s_this.w) * s_this.maxWidth;

			$('table.move').css('left', multictxLeft+s_this.stX + 'px');
		}

		if(s_this.isClkYsc || s_this.isClkXsc) {
			e.preventDefault();
			s_this.ctx.clearRect(0,0,s_this.cvs.width, s_this.cvs.height);
			canvasdraw.draw();
			s_this.scrollDraw();
		}
	},
	mouseup: function(e) {
		s_this.isClkYsc = false;
		s_this.isClkXsc = false;
	}
};