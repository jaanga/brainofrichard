	
	demo = document.createElement( 'div' );
	document.body.appendChild( demo );
	demo.style.backgroundColor = '#ddd';
	demo.style.borderRadius = '10px';
	demo.style.boxShadow = '10px 10px 5px #888888';
	demo.style.color = '#000';
	// demo.style.display = 'none';
	demo.style.right = '300px';
	demo.style.opacity = '0.85';
	demo.style.padding = '0 15px 15px 15px';
	demo.style.position = 'absolute';
	demo.style.font = 'bold 16pt monospace';
	demo.style.textAlign = 'left';
	demo.style.top = '48px';
	demo.style.width = '300px';
	var demoText = '<h3 style="text-align:right;"><a href="#" title="Click to close" onClick="demo.style.display = \'none\'" style="color:#888;text-decoration:none;">[X]<\/a><\/h3>';

	
	audioElement.addEventListener("click", function() {
		if ( playingDemo ) {playingDemo = false;}
		if (demo) { demo.style.display = 'none'; }
	}, false);

	audioElement.addEventListener("playing", function() {
		loadScript('brainDemo.js');
		playingDemo = true;
		// demo.style.display = 'block';
	}, false);
	
	function loadScript(fname) {
		var js = document.createElement('script');
		js.setAttribute('type', 'text/javascript');
		js.setAttribute('src', fname);
		document.body.appendChild(js);
	}


	audioElement.addEventListener("timeupdate", function() {
		var duration = document.getElementById('duration'),
			s = parseInt(audioElement.currentTime % 60, 10),
			m = parseInt((audioElement.currentTime / 60) % 60, 10),
			tim = + audioElement.currentTime.toFixed(),
			text;
		if ( tim === 0) {
			text = 'Welcome to the Brain of Richard demo!' +
			'<br><br>With your mouse on screen...' +
			'<br><br>or by clicking on right-side menu...';	
		} else if (tim === 8 ) {
			text = 'You can zoom in and out.';
			whichDemoApp = brainDemo.zoomBrain;	
		} else if (tim === 11 ) {
			text = 'You can rotate the scans.';
			whichDemoApp = brainDemo.rotateBrain;
		} else if (tim === 14 ) {
			text = 'You can pan the camera left and right or up and down.';
			whichDemoApp = brainDemo.panBrain;
		} else if (tim === 19 ) {
			whichDemoApp = function(){ return; };
			text = 'The \'Open Files\' menu lets you open different set of scan files'
			brainDemo.openMenu(guiFiles, guiView);
		} else if (tim === 24 ) {
			whichDemoApp = function(){ return; };
			text = 'The file named \'Right_side_of_brain\' is of particular interest.'
		} else if (tim === 28) {
			text = 'The \'Views\' menu enables you to jump to different views...';
			brainDemo.openMenu(guiViews,guiFiles);
		} else if (tim === 30 ) {
			text = 'including top view...';
			guiConfig.top_view();
		} else if (tim === 34 ) {
			text = 'and side view...';
			guiConfig.side_view();
		} else if (tim === 38 ) {
			text = 'And return to home view' +
			'<br><br>Use this menu if you ever get lost in space...';
			guiConfig.home_view();
		} else if (tim === 42 ) {
			text = 'The \'Scans\' menu allows you to toggle the highlighting on and off';
			brainDemo.openMenu(guiScans,guiViews);
			whichDemoApp = brainDemo.highlightScans;
		} else if (tim === 47 ) {
			text = 'With highlighting on, individual scans highlight as you move over them.';
		} else if (tim === 52 ) {
			whichDemoApp = function(){ return; };
			guiConfig.highlighting = false;
			playingDemo = false;
			guiConfig.cameraMoving = true;
			text = 'The \'Camera\' menu allows you to toggle the automatic camera motion.'
			brainDemo.openMenu(guiCamera,guiScans);
		} else if (tim === 56) {
			text = 'You can also set camera cutoffs. This allows for views that cut through the scans at oblique angles.'
		} else if (tim === 63) {
			playingDemo = true;
			guiConfig.cameraMoving = false;		
			text = 'The \'Extras\' menu toggles the display of four different viewing aids.'
			brainDemo.openMenu(guiExtras,guiCamera);
		} else if (tim === 65 ) {
			text = 'The display aids are:<ul>' +
			'<li>Ground plane</li>' +
			'<li>Bounding box</li>' +
			'<li>3D axis indicator</li>' +
			'<li>Marker box for highlighting items of interest</li></ul>';
		} else if (tim === 75 ) {
			text = 'The \'Help\' menu reminds you that you can press \'h\' to hide this menu';
			brainDemo.openMenu(guiHelp,guiExtras);
		} else if (tim === 80 ) {
			// whichDemoApp = function(){ return; };
			text = 'You can also display the splash screen from here.';
		} else if (tim === 84 ) {
			text = 'Thanks for watching.' +
		'<br><br>Happy brain examining!';
			brainDemo.openMenu(guiView,guiHelp);
			whichDemoApp = brainDemo.finish;
		} else {

		}
		if (text) { demo.innerHTML = demoText + text; }
	}, false);
	
	var brainDemo = brainDemo || {};
	brainDemo.currentApp = '';
	brainDemo.i = 0;
	brainDemo.delta = 0;
	brainDemo.object = '';
	brainDemo.status = document.getElementById('status');

	brainDemo.hideSplash = function() {
		splash.style.display = 'none';
		replay_is_on = false;
		audioElement.pause();
	};
	// brainDemo.hideSplash();
	
/*
	brainDemo.theo = function() {
		if ( brainDemo.currentApp !== 'theo' ) {
			brainDemo.i = 50;
			brainDemo.currentApp = 'theo';
			brainDemo.object = document.createElement( 'div' );
			document.body.appendChild( brainDemo.object );
			brainDemo.object.style.top = '20%';
			brainDemo.object.style.position = 'absolute';
			brainDemo.object.innerHTML = '<img src="theo-logo.png" width=200>';
			brainDemo.status.innerHTML = 'See theoarmour.com';
		}
		var stats = document.getElementById('status');
		brainDemo.object.style.left = 250 + 5 * brainDemo.i + 'px';
		brainDemo.object.style.top = 5 * brainDemo.i + 'px';
		if (brainDemo.i > window.innerHeight - 100 ) {brainDemo.i = 50;}
		brainDemo.i++;
	};

	brainDemo.richard = function() {
		if ( brainDemo.currentApp !== 'richard' ) {
			brainDemo.currentApp = 'richard';
			if (brainDemo.object) {
				brainDemo.object.style.display = 'none';
			}
			var i,
				l = hack.count;
			for ( i = 0; i < l; i++ ) {
				scans.children[i].visible = false;
			}
			geometry = new THREE.PlaneGeometry( 200, 100 );
			brainDemo.object = new THREE.Object3D();
			material = createText('Richard', 60, '', '','','','#ff0000'  );
			mesh = new THREE.Mesh( geometry, material );
			mesh.position.set(50, 0, 0);
			brainDemo.object.add( mesh );
			scene.add( brainDemo.object );
			brainDemo.status.innerHTML = 'Eventually we will have a 3D view of Richard to wrap around this brain';
		}
	};
*/

	brainDemo.showScans = function() {
		if ( brainDemo.currentApp !== 'showScans' ) {
			brainDemo.currentApp = 'showScans';
			// brainDemo.i = 20;
			if (brainDemo.object) {
				scene.remove(brainDemo.object);
			}
			geometry = new THREE.CubeGeometry( 100, 100, 100 );
			brainDemo.object = new THREE.Object3D();
			var i, l = hack.count;
			for ( i = 1; i <= l; i++) {
				map = THREE.ImageUtils.loadTexture( hack.dir + i + '.png' );
				material = new THREE.MeshBasicMaterial( { color: 0xffffff, ambient: 0xffffffff, map: map, opacity: 1, side: THREE.DoubleSide, transparent: true, wireframe: false} );
				mesh = new THREE.Mesh( geometry, material );
				mesh.rotation.set(1.57 * Math.random(), 1.57 * Math.random(), 1.57 * Math.random());
				mesh.position.set(200 * Math.random() - 100, 200 * Math.random() + hack.startY - 50, 200 * Math.random() - 100 );
				brainDemo.object.add( mesh );
			}
			scene.add( brainDemo.object );
			brainDemo.status.innerHTML = 'The name of the beast is an oligodendroglioma.' +
			'<br>It\'s home is in my posterior cingulate gyrus, ' +
			'more precisely Brodmanns Area 23.' ;
		}
		var rot = brainDemo.object.rotation;
		rot.set( rot.x += 0.01, rot.y += 0.01, rot.z += 0.01);
	};

	brainDemo.zoomBrain = function() {
		if ( brainDemo.currentApp !== 'zoomBrain' ) {
			brainDemo.currentApp = 'zoomBrain';
			if (brainDemo.object) {
				scene.remove(brainDemo.object);
			}
			brainDemo.i = 0;
			brainDemo.delta = 1;
			guiConfig.highlighting = false;
		}
		zoomView(brainDemo.i);
		if (Math.abs(brainDemo.i) > 20) { brainDemo.delta = - brainDemo.delta;  }
		brainDemo.i += brainDemo.delta; 
	};
	
	brainDemo.rotateBrain = function() {
		if ( brainDemo.currentApp !== 'rotateBrain' ) {
			brainDemo.currentApp = 'rotateBrain';
			if (brainDemo.object) {
				scene.remove(brainDemo.object);
			}			
			brainDemo.i = 0;
			brainDemo.delta = -1;
			guiConfig.highlighting = false;
		}
		rotateView(brainDemo.i);
		if (Math.abs(brainDemo.i) > 20) { brainDemo.delta = - brainDemo.delta;  }
		brainDemo.i += brainDemo.delta; 
	};
	
	brainDemo.panBrain = function() {
		if ( brainDemo.currentApp !== 'panBrain' ) {
			brainDemo.currentApp = 'panBrain';
			brainDemo.i = 0;
			brainDemo.delta = 1;
			guiConfig.highlighting = false;

		}
		panView(brainDemo.i, 0);
		if (Math.abs(brainDemo.i) > 20) { brainDemo.delta = - brainDemo.delta;  }
		brainDemo.i += brainDemo.delta; 
	};

	brainDemo.highlightScans = function(id, color) {
		if ( brainDemo.currentApp !== 'highlightId' ) {
			brainDemo.currentApp = 'highlightId';
			brainDemo.i = 0;
			brainDemo.delta = 1;
		}
		brainApp.scanHighlight(brainDemo.i);
		if (Math.abs(brainDemo.i) > 25) { brainDemo.delta = - brainDemo.delta;  }
		brainDemo.i += brainDemo.delta; 
	};
	
	brainDemo.openMenu  = function(menuOpen, menuClose) {
		if (menuClose) { menuClose.close(); }
		menuOpen.open();
	}
	
	brainDemo.finish = function() {
		scans.rotation.y = 0;
		scans.scale.x = scans.scale.y = scans.scale.z = 1;
		scans.position.z = 0;
		guiConfig.home_view();
		guiConfig.highlighting = true;
		whichDemoApp = function(){ return; };
		return;
	};

	function createText(text, fontSize, width, height, color, backgroundColor, shadowColor, shadowBlur) {
		var canvas = document.createElement("canvas");
		if (width) { canvas.width = width; }
		if (height) { canvas.height = height; }
		var context = canvas.getContext("2d");
		if (backgroundColor) { context.fillStyle = backgroundColor; } else { context.fillStyle = '#ffffff'; }
		context.fillRect( 0, 0, width, height );
		if (color) { context.fillStyle = color; } else { context.fillStyle = '#000000'; }
		context.globalAlpha = 0.8;
		if (shadowColor) {context.shadowColor = shadowColor; }
		if (shadowBlur) { context.shadowBlur = shadowBlur; } else { context.shadowBlur = 10; }
		if (fontSize) { context.font = fontSize + "pt Arial bold"; } else {context.font = "24pt Arial bold"; }
		context.textBaseline = 'top';
		context.fillText(text, 0, 0);
		var map = new THREE.Texture( canvas );
		map.needsUpdate = true;
		return new THREE.MeshBasicMaterial( { map: map, transparent: true } );
	}

	function mouseEvent(element, type, button, cx, cy ) {
		var evt,
		e = {
			bubbles: true, cancelable: (type !== "mousemove"), view: window, detail: 0,
			screenX: 0, screenY: 0, clientX: cx, clientY: cy,
			ctrlKey: false, altKey: false, shiftKey: false, metaKey: false,
			button: button, relatedTarget: undefined
		};
		button = button || 0;
		cx = cx || 0;
		cy = cy || 0;
		evt = document.createEvent("MouseEvents");
		evt.initMouseEvent(type, e.bubbles, e.cancelable, e.view, e.detail,
		e.screenX, e.screenY, e.clientX, e.clientY,
		e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
		e.button, document.body.parentNode);
		element.dispatchEvent(evt);
		return evt;
	}

	function zoomView( y ) {
		var elm = controls.domElement;
		mouseEvent( elm, "mousedown", 1 );
		mouseEvent( elm, "mousemove", 1, 0, -y );
		mouseEvent( elm, "mouseup", 1 );
	}

	function rotateView( y ) {
		var elm = controls.domElement, wiw = 0.5 * window.innerWidth, wih = 0.5 * window.innerHeight;
		mouseEvent(elm, "mousedown", 0, wiw, wih);
		mouseEvent(elm, "mousemove", 0, wiw - y, wih);
		mouseEvent(elm, "mouseup");
	}

	function panView( x, y ) {
		var elm = controls.domElement,  wiw = 0.5 * window.innerWidth, wih = 0.5 * window.innerHeight;
		mouseEvent( elm, "mousedown", 2, wiw, wih );
		mouseEvent( elm, "mousemove", 2, wiw + x, wih - y );
		mouseEvent( elm, "mouseup", 2);
	}