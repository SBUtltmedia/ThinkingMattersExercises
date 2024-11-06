SugarCube.Macro.add("addCharacter", {
  handler: function () {
    // Extract arguments (name, description, stats) from macro call
    const name = this.args[0];
    const description = this.args[1];
    const stats = this.args[2] || {};

    // Initialize the characters array if not already done
    if (!SugarCube.State.variables.characters) {
      SugarCube.State.variables.characters = [];
    }

    // Create a new character object
    const newCharacter = {
      name: name,
      description: description,
      stats: stats
    };

    // Add the character to the characters array
    SugarCube.State.variables.characters.push(newCharacter);

    // Provide feedback in the passage
    this.output.append(`Character "${name}" added!`);
  }
});

let prev = {};
prev.prevPassage = '';
prev.objects = [];
window.occupiedPositions = {};

window.addObjects = function (objects) {
  if(SugarCube.State.passage != prev.prevPassage) {
    window.occupiedPositions = {};
  } 
  if(objects === prev.objects) {
    return;
  }
  $(document).one(':passagedisplay.createObjectInventory', function (ev) {
    const stage = document.getElementById('walkway');
    const stageStyle = window.getComputedStyle(stage);


    const stageWidth = parseFloat(stageStyle.width);
    const stageHeight = parseFloat(stageStyle.height);
    const objectWidth = 5; // Adjust based on your object size
    const objectHeight = 5; // Adjust based on your object size


    objects.forEach(function (object, index) {
      // console.log({ object })

      let position = findAvailablePosition(stageWidth, stageHeight, objectWidth, objectHeight);
      console.log({stageHeight, stageWidth});
      console.log(position);

      if(position) {
        console.log(position);
        let newObject = $('<div></div>', {
          class: 'environment',
          css: {
            position: 'absolute',
            left: position.x + '%',
            top: position.y + '%',
            backgroundImage: `url(${object.source})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',

          }
        }).appendTo(stage);

        if(!(SugarCube.State.passage in occupiedPositions)) {
          occupiedPositions[SugarCube.State.passage] = [];
        }
          occupiedPositions[SugarCube.State.passage].push(position);
        console.log({newObject});

      }
    });
  });
  prevPassage = SugarCube.State.passage;
  prev = {prevPassage, objects};
};


function findAvailablePosition(stageWidth, stageHeight, objectWidth, objectHeight) {
  console.log('find position')
  const gridSize = 10; // Adjust this value to change the spacing between objects

  for (let y = 0; y < stageHeight; y += gridSize) {
    for (let x = 0; x < stageWidth; x += gridSize) {
        if(!isPositionOccupied(x,y, objectWidth, objectHeight)) {
          return {x,y};
        }
      }
    }

  return null; // No available position found
}

function isPositionOccupied(x, y, width, height) {
  console.log(occupiedPositions);
  if (!occupiedPositions[SugarCube.State.passage] || occupiedPositions[SugarCube.State.passage].length === 0) {
    return false;
  } else {
    return occupiedPositions[SugarCube.State.passage].some(pos =>
      x < pos.x + width &&
      x + width > pos.x &&
      y < pos.y + height &&
      y + height > pos.y
    );
  }
}



SugarCube.Macro.add("object", {
  handler: function () {
    requestAnimationFrame(() => {
      const name = this.args[0];
      const source = this.args[2];
      let [left,top]= this.args[1].split(":")[1].split(',')
      console.log(name, left, top, source);
  
      // Ensure the walkway exists or create it
      let walkway = $("#walkway");
      // if (!$walkway.length) {
      //   $walkway = $('<div id="walkway"></div>').appendTo(document.body);
      // }
      console.log(walkway);
      // Create the object element
     $('<div/>', {
        class: 'object',
        id: name.toLowerCase(),
        css: {
          position: 'absolute',
          left,
          top,
          backgroundImage: `url(${source})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          width: '50px',  // Adjust as needed
          height: '50px'  // Adjust as needed
      }
    }).appendTo(walkway);
    // Initialize the objects array if not already done
    if (!SugarCube.State.variables.objects) {
      SugarCube.State.variables.objects = [];
    }

    // // Create a new object data
    // const newObject = {
    //   name: name,
    //   position: [left,top],
    //   source: source
    // };

    // // Add the object to the objects array
    // SugarCube.State.variables.objects.push(newObject);

    // Provide feedback in the passage
    // this.output.append(`Object "${name}" added at position ${position}!`);
    })
  }
});

