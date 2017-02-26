'use strict';

var $ = require('jquery');
var THREE = require('three');
var TweenMax = require('gsap');

// Constructor
var Hero = function() {
	
	var container;
	var camera, scene, renderer, particles, geometry, materials = [], parameters, i, h, color, sprite, size;
	var mouseX = 0, mouseY = 0;
	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;


	var particlesNumber = 150;

	var exploding = false;

	function start() {

		var sprite1,
			sprite2,
			sprite3,
			sprite4,
			sprite5;

		container = document.querySelector( '.Hero-canvas' );
		document.body.appendChild( container );
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 2000 );
		camera.position.z = 1200;
		scene = new THREE.Scene();
		
		scene.fog = new THREE.FogExp2( 0x000000, 0.0008 );
		geometry = new THREE.Geometry();

		var textureLoader = new THREE.TextureLoader();
		sprite1 = textureLoader.load( "/images/sprite1.png" );
		sprite2 = textureLoader.load( "/images/sprite1.png" );
		sprite3 = textureLoader.load( "/images/sprite1.png" );
		sprite4 = textureLoader.load( "/images/sprite1.png" );
		sprite5 = textureLoader.load( "/images/sprite1.png" );

		for ( i = 0; i < particlesNumber; i ++ ) {

			var vertex = new THREE.Vector3();

			vertex.x = 0;
			vertex.y = 0;
			vertex.z = 0;

			geometry.vertices.push( vertex );

		}


		parameters = [
			[ [.8, 0.79, 1], sprite2, 10 ],
			[ [.8, 0.79, 1], sprite3, 10 ],
			[ [.8, 0.79, 1], sprite1, 10 ],
			[ [.8, 0.79, 1], sprite5, 10 ],
			[ [.8, 0.79, 1], sprite4, 10 ]
		];

		for ( i = 0; i < parameters.length; i ++ ) {

			color  = parameters[i][0];
			sprite = parameters[i][1];
			size   = parameters[i][2];

			materials[i] = new THREE.PointsMaterial({
				size: size,
				map: sprite,
				depthTest: false,
				transparent : true
			});

			materials[i].color.setHSL( color[0], color[1], color[2] );
			particles = new THREE.Points( geometry, materials[i] );

			particles.rotation.x = Math.random() * 0.01;
			particles.rotation.y = Math.random() * 0.01;
			particles.rotation.z = Math.random() * 0.01;

			scene.add( particles );

		}

		for( i = 0; i < particlesNumber; i ++ ){

			TweenMax.fromTo( geometry.vertices[ i ], 2, {
				x: 0,
				y: 0,
				z: 0
			}, {
				y: Math.random() * 2000 - 1000,
				x: Math.random() * 2000 - 1000,
				z: Math.random() * 2000 - 1000,
				ease: Power4.easeOut
			} );

		}


		animateExplosion();

		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		container.appendChild( renderer.domElement );
		

		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		
		window.addEventListener( 'resize', onWindowResize, false );

	}
	function onWindowResize() {
		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}
	function onDocumentMouseMove( event ) {
		mouseX = event.clientX - windowHalfX;
		mouseY = event.clientY - windowHalfY;
	}

	//
	function animate() {
		requestAnimationFrame( animate );
		render();
	}

	function animateExplosion(){

		if( exploding = true ){

			geometry.verticesNeedUpdate = true;
			requestAnimationFrame( animateExplosion );

		}


	}

	function render() {

		var time = Date.now() * 0.00005;

		// camera.position.x += ( mouseX - camera.position.x ) * 0.005;
		camera.position.y += ( - mouseY - camera.position.y ) * 0.005;

		camera.lookAt( scene.position );

		for ( i = 0; i < scene.children.length; i ++ ) {
			var object = scene.children[ i ];

			if ( object instanceof THREE.Points ) {
				object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) ) * 0.2;
			}
		}

		renderer.render( scene, camera );

	}

	this.init = function(){

		// loading bar
		var tl = new TimelineMax();

		tl
			.fromTo( '.loading-bar', 1, {
				scaleX: 0
			}, {
				scaleX: 1
			})
			.fromTo( '.loading-bar', .4, {
				opacity: 1
			}, {
				opacity: 0
			})
			.fromTo('.loading', 1, {
				opacity: 1,
				display: 'block'
			}, {
				opacity: 0,
				display: 'none'
			}, '-=.4');

		setTimeout( function(){

			start();
			animate();

			var tl = new TimelineMax();

			tl
				.fromTo( '.Hero-wrapper', 1.4, {
					scale: 0,
					opacity: 0
				}, {
					scale: 1,
					opacity: 1,
					ease: Power4.easeOut
				} )
				.fromTo( '.Hero-claim', .5, {
					opacity: 0,
				}, {
					opacity: 1,
				}, .8 )

		}, 800 );

	}

};

module.exports = Hero;
