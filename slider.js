function Slider(sliderId) {
    let id = document.getElementById(sliderId);
    if(id) {
        this.sliderRoot = id
    }
    else {
        this.sliderRoot = document.querySelector('.slider')
    };

    this.sliderList = this.sliderRoot.querySelector('.items-list');
    this.sliderItems = this.sliderList.querySelector(',item');
    this.sliderFirst = this.sliderList.querySelector('.item');
 
    /*this.leftArrow = this.sldrRoot.querySelector('');
	this.rightArrow = this.sldrRoot.querySelector('div.sim-slider-arrow-right');
	this.indicatorDots = this.sldrRoot.querySelector('div.sim-slider-dots');**/

    this.options = Slider.defaults;
    Slider.initialize(this);

    Slider.defaults{
        loop: true,
        auto: true,
        interval: 3000,
    }

    Slider.prototype.prevElem = function(num) {
        num = num || 1;
        let prevElem = this.curElem;
        this.curElem -= num;

        if (this.curElem < 0) this.curElem = this.elemCount-1;

        if(!this.options.loop) {
            if(this.curElem==0)
        }
    }
}