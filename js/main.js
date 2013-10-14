$(function() {
	Sketch.create({
		container: document.getElementById('paintcontainer'),
		autoclear: false,
		setup: function() {
			var self = this;
			this._radius = 5;
			this._colour = '#00FF00';
			this._speed = 4;
			this._ticker = {
				queue: [],
				start: 0
			};
			this._lifetime = 5000;
			this._randColour = function() {
				var r = Math.round(random(0, 255)),
					g = Math.round(random(0, 255)),
					b = Math.round(random(0, 255));
				return 'rgb(' + r + ', ' + g + ', ' + b + ')';
			};
			this.fillStyle = this.strokeStyle = this._colour;
			$('.tools-stop').click(function() {
				self._ticker.queue = [];
			});
		},
		update: function() {
			$('.tools-total').text(this._ticker.queue.length);
			var timeDifference = this.now - this._ticker.start;
			for(var i = 0; i < this._ticker.queue.length; i++) {
				var branch = this._ticker.queue[i],
					rand = Math.random(),
					directionX = (this._speed * cos(TWO_PI * rand)),
					directionY = (this._speed * sin(TWO_PI * rand)),
					x = branch.x,
					y = branch.y;
				if(timeDifference < 30) {
					directionX = branch.directionX;
					directionY = branch.directionY;
				} else {
					this._ticker.start = this.now;
				}
				var splitDiff = (this.now - branch.time),
					splitRand = Math.random();
				if(!branch.isSplit && splitDiff > random(900, 1000)) {
					this._ticker.queue.push({
						x: branch.x,
						y: branch.y,
						directionX: this._speed * cos(TWO_PI * splitRand),
						directionY: this._speed * sin(TWO_PI * splitRand),
						colour: this._randColour(),
						time: this.now,
						isSplit: false,
					});
					branch.isSplit = true;
				}
				x += directionX;
				y += directionY;
				if((this.now - branch.time) > this._lifetime || x > this.width || y > this.height || x < 0 || y < 0) {
					this._ticker.queue.splice(i, 1);
					continue;
				}
				this.beginPath();
				this.moveTo(branch.x, branch.y);
				this.lineTo(x, y);
				this.strokeStyle = branch.colour;
				this.stroke();
				this.closePath();
				branch.x = x;
				branch.y = y;
				branch.directionX = directionX;
				branch.directionY = directionY;
			}
		},
		touchstart: function(e) {
			for(var i = 0; i < this.touches.length; i++) {
				var touch = this.touches[i];
				this.beginPath();
				this.arc(touch.x, touch.y, this._radius, 0, TWO_PI, false);
				this.fillStyle = '#FFF';
				this.fill();
				this.closePath();
				var branches = random(3, 8),
					positionLast = [-1, -1];
				for(var i = 0; i < branches; i++) {
					var rand = Math.random(),
						position;
					do {
						position = [
							this._radius * cos(TWO_PI * rand),
							this._radius * sin(TWO_PI * rand)
						];
					} while(position == positionLast);
					positionLast = position;
					this._ticker.queue.push({
						x: touch.x + position[0],
						y: touch.y + position[1],
						directionX: this._speed * cos(TWO_PI * rand),
						directionY: this._speed * sin(TWO_PI * rand),
						colour: this._colour,
						time: this.now,
						isSplit: false
					});
				}
			}
		}
	});
});
