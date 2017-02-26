'use strict';

var $ = require('jquery');

var ScrollMagic = require('scrollmagic');
require('gsap');

// Constructor
var Header = function() {

	var controller = new ScrollMagic.Controller();

	function init(){

		$('.Slide').each(function(){

			function checkColors(){

				if( $this.hasClass('bg--dark') ){

					$('.Header').addClass('onDark');

				} else {

					$('.Header').removeClass('onDark');

				}

			}

			var $this = $(this);

			new ScrollMagic.Scene({
				triggerElement: this,
				triggerHook: 'onLeave',
				duration: this.clientHeight
			})
			.on('progress', function( e ){

				checkColors();

			} )
			.addTo(controller);
			

		});

	}

	init();

};

module.exports = Header;
