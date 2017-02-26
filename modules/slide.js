'use strict';

var $ = require('jquery');

require('gsap');
require('hammerjs');

function isPercentOf( a, b ){
  
  return (a / b) * 100; 
  
}

// Constructor
var Slide = function() {
	this.name = 'slide';

	var progress = 0,
		index = 0,
		slides = document.querySelectorAll('.Skills-slide').length,
		isMobile = window.innerWidth < 600 ? true : false,
		iconsTlContainer = [];

	var tl = new TimelineMax();

	function forward(){

		index = index + 1 > slides - 1 ? 0 : index + 1;
		moveSlider( 'forward' );
	}

	function back(){

		index = index - 1 < 0 ? slides : index - 1;
		moveSlider( 'back' );

	}

	function moveSlider( dir ){
		console.log( 'moving with index %s', index );

		TweenMax.to( '.Skills-slider', .4, {
			x: - index * 100 + '%'
 		} );

		closeAllOpenIcons();

	}

	function closeAllOpenIcons(){

		$('.Skills-slide').each( function(){
			closeIcon( $(this) );
		});

	}

	function closeIcon( $element ){

		if( !$element.hasClass( 'is-open' ) ) return true;

		$element.removeClass('is-open');
		iconsTlContainer[ $element.index() ].reverse();

	}

	function toggleIcon( $element ){

		var elementIndex = $element.index();
		if( $element.hasClass('is-open') ){

			console.log( 'is-open' );
			iconsTlContainer[ elementIndex ].reverse();

		} else {

			iconsTlContainer[ elementIndex ].play();

		}

		$element.toggleClass('is-open');

	}

	function iconsTimelines(){

		$('.Skills-slide').each(function( index ){

			var openIconTl = new TimelineMax(),
				$element = $(this),
				$copy = $element.find('.Icon-copy'),
				$letter = $element.find('.Icon-letter'),
				$logo = $element.find('.Icon-logo'),
				$canvas = $('.Hero-canvas');

			if( isMobile ){ $('.Skills-control').addClass('hidden') }

			openIconTl
				.set( $copy, {
					display: 'block'
				})
				.fromTo( $letter, .4, {
					scale: 1
				},{
					scale: 0,
					ease: Power2.easeInOut
				});

			if( isMobile ){

				openIconTl
					.fromTo( $logo, .6, {
						width: 216,
						height: 216,
						zIndex: 2,
						position: 'absolute',
						backgroundColor: 'rgba(0,0,0,0)'
					},{
						width: window.innerWidth,
						height: window.innerHeight,
						backgroundColor: 'rgba(0,0,0,1)',
						zIndex: 100,
						position: 'fixed',
						ease: Power4.easeInOut
					})
					.to( $logo, .6, {
						borderWidth: 0
					}, '-=.6')


			} else {

				openIconTl
					.fromTo( $logo, .6, {
						width: 216,
						height: 216,
						zIndex: 2,
						backgroundColor: 'rgba(0,0,0,0)',
					}, {
						width: !isMobile ? 500 : window.innerWidth - 32,
						height: !isMobile ? 500 : 420,
						backgroundColor: !isMobile ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,1)',
						zIndex: 100,
						ease: Power4.easeInOut
					}, 0 );

			}

			
			openIconTl
				.fromTo( $canvas, .6, {
					scale: 1
				}, {
					scale: 1.4,
					ease: Power4.easeInOut
				}, 0 )
				.staggerFromTo( $copy.find('li'), .5, {
					opacity: 0,
					scale: 0
				}, {
					opacity: 1,
					scale: 1,
					ease: Power4.easeOut
				}, .05, '-=.2' );

			openIconTl.pause(0);

			iconsTlContainer.push( openIconTl );

		})

	}

	function sliderTimeline(){

		var sliderWidth = $('body').width() * slides,
			containerWidth = $('.Skills-slide').outerWidth();

		tl
			.set(['.Skills-slider'], {
				x: '0%'
			});

		tl.timeScale(2);

		$('.Skills-slide').each(function( index ){

			var localTl = new TimelineMax(),
				$this = $(this);

			tl
				.to( '.Skills-slider', 2, {
					x: ( - containerWidth * index ) ,
					ease: Power0.easeInOut
				})

			tl.add( localTl );	

		});

		// tl.seek( 1 );
		tl.pause( 2 );

		TweenMax.set('.Icon-copy', {
			display: 'none'
		});

	}

	function bindUI(){

		$('.Skills-control').on('click', function(){

			$(this).attr('data-nav') == 'forward' ? forward() : back();

		});

		$('.Skills-slide').on('mouseup', function(){

			toggleIcon( $(this) );

		});


		var slider = document.querySelector('.Skills-slider');
		var sliderWidth = slider.clientWidth * 5;
		var hammertime = new Hammer(slider); 

		var viewportWidth = window.innerWidth;

		console.warn('slider width: %spx', sliderWidth );
		console.warn( 'slider timeline duration %ss', tl.duration() )

		hammertime.on('pan', function(ev) {
		      
			var direction = ev.deltaX > 0 ? 1 : -1,
				distance = Math.abs( ev.deltaX ),
				perc = isPercentOf( distance, sliderWidth ),
				percentOfContainer = isPercentOf( distance, viewportWidth );

			console.log( ( - index * (sliderWidth / 5 )) - ( ev.deltaX ) + 'px' );

			TweenMax.set( '.Skills-slider', {

				x: ( ev.deltaX ) + 'px'

			});
		  
		});

		hammertime.on('panend', function(ev){
		  
			var direction = ev.deltaX > 0 ? 1 : -1,
				distance = Math.abs( ev.deltaX ),
				perc = isPercentOf( distance, sliderWidth ),
				percentOfContainer = isPercentOf( distance, viewportWidth );

			console.warn(
				'panned for %ipx, %i% of viewport, %i% of slider', 
				distance * direction,
				percentOfContainer, isPercentOf( distance, sliderWidth )
			);

			if( distance > 100 ){


				if( direction < 0 ){

					forward();

				} else{

					index == 0 ? moveSlider() : back();

				}

			} else {

				moveSlider();

			}
		  
		});
		  

	}

	function init(){

		bindUI();
		// sliderTimeline();

		iconsTimelines();

	}

	init();

};

module.exports = Slide;
