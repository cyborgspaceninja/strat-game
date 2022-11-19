
	/*


		there is no reason to corrigate what part of herosprite moves to this or that tile when this or that tile is clicked
		because we will handle all that later

		now just make sure you can display all directions nicely and evenly.


		TODO:
			- fix and get uniform texture size to prevent sprite-overlap (40px or whatever fits all at first)
			- center hero
			- create a eastward-looking hero sprites
			- start making a function deciding whether a move is legit


			we can chop spritesheet with 32 width at least (40 for now so one size fits all)
			dimensions will be different for sideways hero and forward/back hero
			this is unavoidable, sideways is always wider(twice wide?88)

	*/

	function sideDir(x){
		if(x > 0){
			return "WEST";//"EAST";
		}else if(x < 0){
			return "WEST";
		}
		return "";
	}

	function actorDir(x,y){
		const tile = tileOfPos(x,y);
		const xDir = sideDir(tile[0] - actorPos[0]);
		const yDir = tile[1] - actorPos[1];
		let tex = "";
		
		if(yDir > 0){
			tex = "SOUTH";
		}else if(yDir < 0){
			tex = "NORTH";
		}
		return tex += xDir;
	}

	//we could have function posObj(x,y,obj)
	//it could both set pos and get the offset-vals for the sprite
	function tileOfPos(x,y){
		while(x % 32 !== 0){
			x--;
		}
		while(y % 32 !== 0){
			y--;
		}
		return [x,y];
	}

	function draw(x,y){

		const xOffset = 43;
		const yOffset = 32;
		
		actorCtx.clearRect(
			actorPos[0]-xOffset,
			actorPos[1]-yOffset,
			...actorDim
			);

		actorPos = tileOfPos(x,y);
		
		actorCtx.drawImage(
			actorSet,
			...charSpritePos["FRONTEAST"],
			...actorDim,
			actorPos[0]-xOffset,
			actorPos[1]-yOffset,
			...actorDim
			);
	}
	

	//can we make a dictionary instead to lessen lookups?
	

	const MAP_WIDTH = 3000;
	const MAP_HEIGHT = 1200;
	const Dirs = { 
		"NORTH": 0, //-60
		"NORTHWEST": 60, //-90
		"WEST": 120, //30, east -30
		"SOUTHWEST":180, //90
		"SOUTH":240 //60
	};

	const charSpritePos = {
		"FRONT": [31,0],
		"FRONTEAST": [85,0]	
	}


	const worldCanvas = document.getElementById('world-canvas');
  	const actorCanvas = document.getElementById('actor-canvas');
  	const debugCanvas = document.getElementById('debug-canvas');
  	
	debugCanvas.width=worldCanvas.width=actorCanvas.width=MAP_WIDTH;
	debugCanvas.height=worldCanvas.height=actorCanvas.height=MAP_HEIGHT;
	
  	const worldCtx = worldCanvas.getContext('2d');
  	const actorCtx = actorCanvas.getContext('2d');
  	const debugCtx = debugCanvas.getContext('2d');
	const worldSet = new Image(); // static map stuff
	const actorSet = new Image(); // interactable stuff
	const debugSet = new Image(); // interactable stuff
	
	let actorPos = [0,0];
	const actorDim = [86,64];
	let currentDir = Dirs["NORTH"];
	let tex = 0;
	let debugGrid = "";//"M 0 0";
	worldSet.addEventListener('load', () => {
		let gridXFilled = 0;
		//make a var which will be filled if debug, with svg grid d-coords
		for(let y = 0; y < MAP_HEIGHT; y+=32){
			for(let x = 0; x < MAP_WIDTH; x+=32){
				worldCtx.drawImage(worldSet,0,0,32,32,x,y,32,32);
				if(gridXFilled !== 1)
					debugGrid += " M "+ x + " 0" + " L " + x +" "+ MAP_HEIGHT;
			}
			gridXFilled = 1;
			debugGrid += " M 0 " + y + " L" + MAP_WIDTH + " " + y;
		}
		let grid = document.getElementById("grid").children[0];
		grid.setAttribute("d",debugGrid);
	});

	actorSet.addEventListener('load', () => {
		draw(MAP_WIDTH/2,MAP_HEIGHT/2);
		actorCanvas.addEventListener("click",e => {
			const containerDim = actorCanvas.getBoundingClientRect();
			draw(e.clientX- containerDim.left,e.clientY - containerDim.top);
		});	
	});


	debugSet.addEventListener('load', () => {
		debugCtx.drawImage(debugSet,0,0);	
	});


	worldSet.src = './sprites/steppe.png'; // Set source path
	actorSet.src = './sprites/h3sprites.png';
	debugSet.src = './sprites/h3sprites.png';