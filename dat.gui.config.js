	var gui, guiView, guiFiles, guiViews, guiScans, guiCamera, guiExtras, guiHelp;
	var guiConfig = {
		zoom: 1.0,
		rotate: 1.0,
		pan_Vertical: 1.0,
		pan_Horizontal: 1.0,
		files_info: 'Click any of the following\nthree links.',
		top_view_of_brain: function() { brainHack(1); },
		right_side_of_brain: function() { brainHack(2); },
		left_side_of_brain: function() { brainHack(3); },
		artichoke: function() { brainHack(4); },
		cactus: function() { brainHack(5); },
		home_view: function() {
			guiConfig.cameraMoving = false;
			camera.up.set(0, 1, 0);
			controls.target.set(0, 0, 0);
			camera.position.set(200, 100, 250);
		},	
		top_view: function() {
			guiConfig.cameraMoving = false;
			controls.target.set(0,0,0);
			camera.up.set(0,1,0);
			
			camera.position.set(0, 200, 0);
		},	
		side_view: function() {
			guiConfig.cameraMoving = false;
			camera.up.set(0,1,0);
			controls.target.set(0,0,0);
			camera.position.set(200, 5, 0);
		},		
		highlighting: true,
		opacityDefault: 0.02,
		opacityHighlight: 0.8,
		scansStart: 1,
		scansFinish: 10,
		cameraMoving: true,
		cameraCutoffNear: 1,
		cameraCutoffFar: 500,
		planeVisible: false,
		boundaryVisible: false,
		axisVisible: false,
		markerVisible: false,
		markerX: 0,
		markerY: 0,
		markerZ: 0,
		markerScaleX: 0,
		markerScaleY: 0,
		markerScaleZ: 0,
		Hide_This_Menu: 'Press the "h" key',
		showSplashScreen: function() { splash.style.display = 'block'; }
	};

// has to be a function because need to rebuild the gui each time new scans are loaded
// var buildGui = buildGui || {}; // cannot get to work yet...
	
	function buildGui() {
		if (gui) {
		  gui.destroy();
		  gui = null;
		}

		gui = new dat.GUI( );
		// gui.domElement.style.zIndex = 100;
		
		guiView = gui.addFolder('Zoom / Rotate / Pan');
		guiView.open();
		guiView.add( guiConfig, 'zoom', -50, 50 ).onFinishChange( function() {
			guiConfig.cameraMoving = false;
			zoomView ( guiConfig.zoom );
		} );
		guiView.add( guiConfig, 'rotate', -50, 50 ).step(1).onFinishChange( function(){
			guiConfig.cameraMoving = false;
			rotateView( guiConfig.rotate );
		} );
		guiView.add( guiConfig, 'pan_Vertical', -50, 50 ).onFinishChange( function() {
			guiConfig.cameraMoving = false;
			panView ( 0, guiConfig.pan_Vertical);
		} );		
		guiView.add( guiConfig, 'pan_Horizontal', -50, 50 ).onFinishChange( function() {
			guiConfig.cameraMoving = false;
			panView ( guiConfig.pan_Horizontal, 0);
		} );
		
		guiFiles = gui.addFolder('Open Files');
		guiFiles.add( guiConfig, 'top_view_of_brain' );
		guiFiles.add( guiConfig, 'right_side_of_brain' );
		guiFiles.add( guiConfig, 'left_side_of_brain' );
		guiFiles.add( guiConfig, 'artichoke' );
		guiFiles.add( guiConfig, 'cactus' );
		
		guiViews = gui.addFolder('Views');
		guiViews.add( guiConfig, 'home_view' );
		guiViews.add( guiConfig, 'top_view' );
		guiViews.add( guiConfig, 'side_view' );
		
		guiScans = gui.addFolder('Scans');

		guiScans.add( guiConfig, 'highlighting', true ).onChange( function() {
			if ( !guiConfig.highlighting) {
				guiConfig.highlighting = false;
			} else {
				guiConfig.highlighting = true;
			}
		} );

		guiScans.add( guiConfig, 'opacityDefault', 0.01, 1 ).step(0.01).onChange( function() {
			var i;
			for (i = 0, l = scans.length; i < l; i++) {
				scans[i].material.opacity = ( guiConfig.opacityDefault );
			}
		} );

		guiScans.add( guiConfig, 'opacityHighlight').min(0.01).max(1).step(0.01).onChange( function() {
		} );

		guiScans.add( guiConfig, 'scansStart').min(1).max(hack.count).step(1).onChange( function() {
			var i;
			for (i = 0, l = hack.count; i < l; i++) {
				if (i < guiConfig.scansStart || i > guiConfig.scansFinish) {scans.children[i].visible = false;
				} else {
					scans.children[i].visible = true;
				}
			}
		} );

		guiScans.add( guiConfig, 'scansFinish').min(1).max(hack.count).step(1).onChange( function() {
			var i;
			for (i = 0, l = hack.count; i < l; i++) {
				if (scans.children && i < guiConfig.scansStart || i > guiConfig.scansFinish) {scans.children[i].visible = false;
				} else {
					scans.children[i].visible = true;
				}
			}
		} );

		guiCamera = gui.addFolder('Camera');
		guiCamera.add( guiConfig, 'cameraMoving', true ).onChange( function() {
			if ( !guiConfig.cameraMoving) {
				guiConfig.cameraMoving = false;
			} else {
				guiConfig.cameraMoving = true;
			}
		} );

		guiCamera.add( guiConfig, 'cameraCutoffNear', 1, 500 ).onChange( function() {
			camera.near = guiConfig.cameraCutoffNear;
			camera.updateProjectionMatrix();
		} );

		guiCamera.add( guiConfig, 'cameraCutoffFar', 1, 500 ).onChange( function() {
			camera.far = guiConfig.cameraCutoffFar;
			camera.updateProjectionMatrix();
		} );

		guiExtras = gui.addFolder('Extras');
	

		guiExtras.add( guiConfig, 'planeVisible', true ).onChange( function() {
			if ( !guiConfig.planeVisible) {
				guiConfig.planeVisible = false;
				scene.remove( plane );
			} else {
				guiConfig.planeVisible = true;
				if (plane) { scene.remove(plane); }
				geometry = new THREE.CubeGeometry( 500, 0.1, 500, 10, 10, 10);
				material = new THREE.MeshNormalMaterial( { wireframe: true } );
				plane = new THREE.Mesh( geometry, material );
				plane.position.set(0, hack.meshY, 0);
				scene.add( plane );
			}
		} );

		guiExtras.add( guiConfig, 'boundaryVisible', true ).onChange( function() {
			if ( !guiConfig.boundaryVisible) {
				guiConfig.boundaryVisible = false;
				scene.remove( boundary );
			} else {
				guiConfig.boundaryVisible = true;
				if (boundary) { scene.remove(boundary); }
				geometry = new THREE.CubeGeometry( 200, 200, 200, 1, 1, 1);
				material = new THREE.MeshNormalMaterial( { wireframe: true } );
				boundary = new THREE.Mesh( geometry, material );
				boundary.rotation.x = hack.angle;
				boundary.position.set(0, hack.startY + 0.5 * hack.count * hack.deltaY, hack.startZ + 0.5 * hack.count * hack.deltaZ);
				scene.add( boundary );
			}
		} );

		guiExtras.add( guiConfig, 'axisVisible', true ).onChange( function() {
			if ( !guiConfig.axisVisible) {
				guiConfig.axisVisible = false;
				scene.remove( axis );
			} else {
				guiConfig.axisVisible = true;
				axis = new THREE.AxisHelper();
				axis.position.set( 0, 0, 0 );
				axis.scale.x = axis.scale.y = axis.scale.z = 0.5;
				scene.add( axis );
			}
		} );

		guiExtras.add( guiConfig, 'markerVisible', true ).onChange( function() {
			if ( !guiConfig.boxVisible) {
				guiConfig.boxVisible = false;
				scene.remove( box );
			} else {
				guiConfig.boxVisible = true;
				geometry = new THREE.CubeGeometry( 20, 20, 20);
				material = new THREE.MeshNormalMaterial( { wireframe: true } );
				box = new THREE.Mesh( geometry, material );
				box.position.set(0, 0, 0);
				scene.add( box );
			}
		} );
		guiExtras.add( guiConfig, 'markerX', -100, 100 ).onChange( function() {
			if (box) { box.position.x = guiConfig.boxX; }
		} );
		guiExtras.add( guiConfig, 'markerY', -100, 100 ).onChange( function() {
			if (box) { box.position.y = guiConfig.boxY; }
		} );
		guiExtras.add( guiConfig, 'markerZ', -100, 100 ).onChange( function() {
			if (box) { box.position.z = guiConfig.boxZ; }
		} );

		guiExtras.add( guiConfig, 'markerScaleX', 0, 5 ).onChange( function() {
			if (box) { box.scale.x = guiConfig.boxScaleX; }
		} );
		guiExtras.add( guiConfig, 'markerScaleY', 0, 5 ).onChange( function() {
			if (box) { box.scale.y = guiConfig.boxScaleY; }
		} );
		guiExtras.add( guiConfig, 'markerScaleZ', 0, 5 ).onChange( function() {
			if (box) { box.scale.z = guiConfig.boxScaleZ; }
		} );

		guiHelp = gui.addFolder('About');
		guiHelp.add( guiConfig, 'Hide_This_Menu' );
		guiHelp.add( guiConfig, 'showSplashScreen' );
	};	