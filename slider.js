function Slider(sliderId) {
    let id = document.getElementById(sliderId);
    if(id) {
        this.sliderRoot = id
    }
    else {
        this.sliderRoot = document.querySelector('.slider')
    };

    this.sliderList = this.sliderRoot.querySelector('.items-list');
    this.sliderItems = this.sliderList.querySelector('.item');
    this.sliderFirst = this.sliderList.querySelector('.item');
 
    this.leftArrow = this.sliderRoot.querySelector('div.leftArrow');
	this.rightArrow = this.sliderRoot.querySelector('div.rightArrow');
    this.dotIndic = this.sliderRoot.querySelector('div.dot');

    this.options = Slider.defaults;
    Slider.initialize(this);
};

Slider.defaults = {
    itemsVisible: 3,
    loop: true,
    auto: true,
    interval: 3000,
    speed: 300,
    arrows: true,
    touch: true,
    dots: true
};  

Slider.prototype.prevElem = function(num) {
    num = num || 1;
    let prevElem = this.curElem;
    this.curElem -= num;

    if(this.curElem < 0) this.curElem = this.dotsVisible-1;
	if(this.options.dots) this.dotOff(this.curElem);

    if(!this.options.loop) {  // сдвиг вправо без цикла
		this.curOff += this.elemWidth*num;
		this.sliderList.style.marginLeft = this.curOff + 'px';
		if(this.curElem == 0) {
			this.leftArrow.style.display = 'none'; this.touchPrev = false
		}
		this.rightArrow.style.display = 'block'; this.touchNext = true
	}
	else {                    // сдвиг вправо с циклом
		let elm, buf, this$ = this;
		for(let i=0; i<num; i++) {
			elm = this.sliderList.lastElementChild;
			buf = elm.cloneNode(true);
			this.sliderList.insertBefore(buf, this.sliderList.firstElementChild);
			this.sliderList.removeChild(elm)
		};
		this.sliderList.style.marginLeft = '-' + this.elemWidth*num + 'px';
		let compStyle = window.getComputedStyle(this.sliderList).marginLeft;
		this.sliderList.style.cssText = 'transition:margin '+this.options.speed+'ms ease;';
		this.sliderList.style.marginLeft = '0px';
		setTimeout(function() {
			this$.sliderList.style.cssText = 'transition:none;'
		}, this.options.speed)
	}
};

Slider.prototype.nextElem = function(num) {
    num = num || 1;

	if(this.options.dots) this.dotOn(this.curElem);
	this.curElem += num;
	if(this.curElem >= this.dotsVisible) this.curElem = 0;
	if(this.options.dots) this.dotOff(this.curElem);

	if(!this.options.loop) {  // сдвиг влево без цикла
		this.curOff -= this.elemWidth*num;
		this.sliderList.style.marginLeft = this.curOff + 'px';
		if(this.curElem == this.dotsVisible-1) {
			this.rightArrow.style.display = 'none'; this.touchNext = false
		}
		this.leftArrow.style.display = 'block'; this.touchPrev = true
	}
	else {                    // сдвиг влево с циклом
		let elm, buf, this$ = this;
		this.sliderList.style.cssText = 'transition:margin '+this.options.speed+'ms ease;';
		this.sliderList.style.marginLeft = '-' + this.elemWidth*num + 'px';
		setTimeout(function() {
			this$.sliderList.style.cssText = 'transition:none;';
			for(let i=0; i<num; i++) {
				elm = this$.sliderList.firstElementChild;
				buf = elm.cloneNode(true); this$.sliderList.appendChild(buf);
				this$.sliderList.removeChild(elm)
			};
			this$.sliderList.style.marginLeft = '0px'
		}, this.options.speed)
	}
};

Slider.prototype.dotOn = function (num) {
    this.dotIndicAll[num].style.cssText = 'background-color:#BBB; cursor:pointer;'
};

Slider.prototype.dotOff = function(num) {
    this.dotIndicAll[num].style.cssText = 'background-color:#556; cursor:default;'
};

Slider.initialize = function(that) {

	that.itemCount = that.sliderItems.length;
    that.dotsVisible = that.itemCount;
    let.itemStyle = window.getComputedStyle(that.sliderFirst);
    that.elemWidth = that.sliderFirst.offsetWidth + parseInt(itemStyle.marginLeft)+parseInt(itemStyle.marginRight);

    that.curElem = 0; 
    that.curOff = 0;
    that.touchPrev = true;
    that.touchNext = true;

    let xTouch, yTouch, xDiff, yDiff, stTime, mvTime;
	let bgTime = getTime();

	function getTime() {
		return new Date().getTime();
	};

	function setAutoScroll() {
		that.autoScroll = setInterval(function() {
			let fnTime = getTime();
			if(fnTime - bgTime + 10 > that.options.interval) {
				bgTime = fnTime; that.nextElem()
			}
		}, 
        that.options.interval)
	};

	if(that.itemCount <= that.options.itemsVisible) {   
		that.options.auto = false; 
        that.options.arrows = false; 
        that.options.dots = false;
		that.leftArrow.style.display = 'none'; 
        that.rightArrow.style.display = 'none'
	};

	if(!that.options.loop) {
        that.dotsVisible = that.itemCount - that.itemsVisible + 1;
		that.leftArrow.style.display = 'none';  
		that.options.auto = false; 
        that.touchPrev = false;
	}
	else if(that.options.auto) {   
		setAutoScroll();
		that.sliderList.addEventListener('mouseenter', function() {clearInterval(that.autoScroll)}, false);
		that.sliderList.addEventListener('mouseleave', setAutoScroll, false)
	};

    if(that.options.touch){
        that.sliderList.addEventListener('touchstart', 
        function(t){
            xTouch = parseInt(t.touches[0].clientX); 
            yTouch = parseInt(t.touches[0].clientY)
            mvTime = getTime();
            if(Math.abs(xDiff) > 15 && Math.abs(xDiff) > Math.abs(yDiff) && mvTime - stTime < 75) {
				stTime = 0;
				if(that.touchNext && xDiff > 0) {
					bgTime = mvTime; that.nextElem()
				}
				else if(that.touchPrev && xDiff < 0) {
					bgTime = mvTime; that.prevElem()
				}
			}
        }, false)
    }

	if(that.options.arrows) {  
		if(!that.options.loop) 
        that.crslList.style.cssText = 'transition:margin ' + that.options.speed+'ms ease;';
		that.leftArrow.addEventListener('click', function() {
			let fnTime = getTime();
			if(fnTime - bgTime > that.options.speed) {
				bgTime = fnTime; that.elemPrev()
			}
		}, false);
		that.rightArrow.addEventListener('click', function() {
			let fnTime = getTime();
			if(fnTime - bgTime > that.options.speed) {
				bgTime = fnTime; that.elemNext()
			}
		}, false)
	}
	else {
		that.leftArrow.style.display = 'none'; 
        that.rightArrow.style.display = 'none'
	};

	if(that.options.dots) {  
		let sum = '', diffNum;
		for(let i=0; i<that.dotsVisible; i++) {
			sum += '<span class="slide-dot"></span>'
		};
		that.dotIndic.innerHTML = sum;
		that.dotIndicAll = that.sliderRoot.querySelectorAll('span.slider-dot');
		for(let n=0; n<that.dotsVisible; n++) {
			that.dotIndicAll[n].addEventListener('click', function() {
				diffNum = Math.abs(n - that.curElem);
				if(n < that.curElem) {
					bgTime = getTime(); 
                    that.prevElem(diffNum)
				}
				else if(n > that.curElem) {
					bgTime = getTime(); 
                    that.nextElem(diffNum)
				}
			}, false)
		};
		that.dotOff(0);  
		for(let i=1; i<that.dotsVisible; i++) {
			that.dotOn(i)
		}
	}
};

new Slider();

    
