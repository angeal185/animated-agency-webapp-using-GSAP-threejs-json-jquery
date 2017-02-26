'use strict';

var $ = require('jquery');
var ScrollMagic = require('scrollmagic');
require('gsap');

require('node_modules/scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js');
require('node_modules/scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js');
require('node_modules/gsap/src/uncompressed/plugins/AttrPlugin.js')

var IconParticles = (function( $element ){

	var that = this,
		emitter = $element.find( $('#emitter') ).get(0),
		middleX = 250,
		middleY = 250;

	this.isActive = false;
	this.color = "#E3D72F";
	this.interval = 10;
	this.minRadius = 2;
	this.maxRadius = 5;
	this.rangeX = 4000;
	this.rangeY = 4000;
	this.minDuration = 20000;
	this.maxDuration = 24000;

	this.start = function(){
		this.isActive = true;
		loop();
	};

	this.stop = function(){
		this.isActive = false;
	};

	function emitParticle(){

		var id = 'particle-' + rand( 0, 1000000 ),
			circle = $('#particle').clone().attr('data-id', id).appendTo( $element.find('#particles') ) ,
			$circle;

		$circle = $('[data-id="'+ id +'"]');

		$circle.attr({
			'cx': middleX,
			'cy': middleY,
			'r': rand( that.minRadius, that.maxRadius ),
			'fill': that.color
		});

		TweenMax.to( '[data-id="'+ id +'"]', rand( that.minDuration, that.maxDuration )/1000, {

			x: rand( - that.rangeX / 2, that.rangeX / 2 ),
			y: rand( - that.rangeY / 2, that.rangeY / 2 ),
			
			opacity: 0,
			onComplete: function(){
				$circle.remove();
			}
		});

	}

	function loop(){

		setTimeout( function(){

			if( !that.isActive ) return false;

			emitParticle();

			requestAnimationFrame( loop );

		}, that.interval );

	}

	if( !that.isActive ) return false;

	loop();

});

function rand(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function sample(a) {
	return a[rand(0, a.length)];
}

// Constructor
var sec = function() {
	if( $(window).width() < 1025 ){
		return false;
	}
  
	var controller = new ScrollMagic.Controller();
	var i;
	var emitters = [];
	var Tween = new TimelineMax({
		onStart: function(){

			i = 0;

		}
	})
		.staggerFromTo( '.sec-icon', .3, {
			scale: 0
		}, {
			scale: 1,
			onComplete: function(){

				var index = i++;

				console.log( '--- emitters', emitters, index );

				emitters[ index ].start();

				setTimeout( function(){

					emitters[ index ].stop();

				}, 300 );

			}
		}, .3 )
		.staggerFromTo( '.sec-content', .4, {
			y: 100,
			opacity: 0,
			ease: Power3.easeOut
		}, {
			y: 0,
			opacity: 1
		}, .05)

	var scene = new ScrollMagic.Scene({
		triggerElement: '.sec',
		triggerHook: 'onEnter',
		reverse: false
	})
	.setTween(Tween)

	scene.addTo(controller);

};

module.exports = sec;
