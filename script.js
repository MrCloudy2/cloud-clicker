// Initialize the game state from local storage or set default values
let gameState = JSON.parse(localStorage.getItem('gameState')) || {
    cloudCount: 0,
    cursors: 0,
    evaporators: 0, // New evaporator state
    factories: 0,
    cloudGenerators: 0,
    weatherMachines: 0,
    stormStations: 0,
    atmosphereManipulators: 0,
    climateControllers: 0,
    currentAmountPerClick: 1
};

// Function to calculate building costs based on quantity owned
function calculateCost(quantity, baseCost) {
    return Math.floor(baseCost * Math.pow(1.15, quantity));
}


checkAndCorrectValues();

// Set initial costs based on default values
gameState.cursorCost = calculateCost(gameState.cursors, 10); // Updated cursor cost
gameState.evaporatorCost = calculateCost(gameState.evaporators, 100); // New evaporator cost
gameState.factoryCost = calculateCost(gameState.factories, 1000);
gameState.cloudGeneratorCost = calculateCost(gameState.cloudGenerators, 5000);
gameState.weatherMachineCost = calculateCost(gameState.weatherMachines, 20000);
gameState.stormStationCost = calculateCost(gameState.stormStations, 100000);
gameState.atmosphereManipulatorCost = calculateCost(gameState.atmosphereManipulators, 500000);
gameState.climateControllerCost = calculateCost(gameState.climateControllers, 2000000);
gameState.clickUpgradeCost = calculateCUCost(gameState.currentAmountPerClick, 10);


// Function to save game state to local storage
function saveGameState() {
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

//cheats for development
function setClouds(amount){
    gameState.cloudCount = amount;
}

// Function to check and correct NaN values
function checkAndCorrectValues() {
    if (isNaN(gameState.cloudCount)) gameState.cloudCount = 0;
    if (isNaN(gameState.cursors)) gameState.cursors = 0;
    if (isNaN(gameState.evaporators)) gameState.evaporators = 0;
    if (isNaN(gameState.factories)) gameState.factories = 0;
    if (isNaN(gameState.cloudGenerators)) gameState.cloudGenerators = 0;
    if (isNaN(gameState.weatherMachines)) gameState.weatherMachines = 0;
    if (isNaN(gameState.stormStations)) gameState.stormStations = 0;
    if (isNaN(gameState.atmosphereManipulators)) gameState.atmosphereManipulators = 0;
    if (isNaN(gameState.climateControllers)) gameState.climateControllers = 0;
    if (isNaN(gameState.currentAmountPerClick)) gameState.currentAmountPerClick = 1;

    // Recalculate CPS
    updateCPS();
}


// Update CPS function
function updateCPS() {
    cursorCPS = Math.round(gameState.cursors * 0.1 * 10)/10;
    evaporatorCPS = gameState.evaporators;
    factoryCPS = gameState.factories * 5;
    cloudGeneratorCPS = gameState.cloudGenerators * 20;
    weatherMachineCPS = gameState.weatherMachines * 50;
    stormStationCPS = gameState.stormStations * 100;
    atmosphereManipulatorCPS = gameState.atmosphereManipulators * 200;
    climateControllerCPS = gameState.climateControllers * 500;

    totalCPS = (Math.round( (cursorCPS + evaporatorCPS + factoryCPS + cloudGeneratorCPS + weatherMachineCPS + stormStationCPS + atmosphereManipulatorCPS + climateControllerCPS)*10)/10);
    

    document.getElementById('cloudsPerSecond').innerText = totalCPS.toLocaleString('en-US');
    document.getElementById('cursorCPS').innerText = cursorCPS.toLocaleString('en-US');
    document.getElementById('evaporatorCPS').innerText = evaporatorCPS.toLocaleString('en-US');
    document.getElementById('factoryCPS').innerText = factoryCPS.toLocaleString('en-US');
    document.getElementById('cloudGeneratorCPS').innerText = cloudGeneratorCPS.toLocaleString('en-US');
    document.getElementById('weatherMachineCPS').innerText = weatherMachineCPS.toLocaleString('en-US');
    document.getElementById('stormStationCPS').innerText = stormStationCPS.toLocaleString('en-US');
    document.getElementById('atmosphereManipulatorCPS').innerText = atmosphereManipulatorCPS.toLocaleString('en-US');
    document.getElementById('climateControllerCPS').innerText = climateControllerCPS.toLocaleString('en-US');
    document.getElementById('currentAmountPerClick').innerText = gameState.currentAmountPerClick.toLocaleString('en-US');
    document.getElementById('clickUpgradeCost').innerText = gameState.clickUpgradeCost;
}

// Update game state
function updateGameState() {
    gameState.cloudCount += (gameState.cursors * 0.1) /10;
    gameState.cloudCount += gameState.evaporators /10;
    gameState.cloudCount += (gameState.factories * 5)/10; // Factories produce 5 clouds per second
    gameState.cloudCount += (gameState.cloudGenerators * 20) /10; // Cloud Generators produce 20 clouds per second
    gameState.cloudCount += (gameState.weatherMachines * 50) /10; // Weather Machines produce 50 clouds per second
    gameState.cloudCount +=( gameState.stormStations * 100) /10; // Storm Stations produce 100 clouds per second
    gameState.cloudCount += (gameState.atmosphereManipulators * 200) /10; // Atmosphere Manipulators produce 200 clouds per second
    gameState.cloudCount += (gameState.climateControllers * 500) /10; // Climate Controllers produce 500 clouds per second

    saveGameState(); // Save the updated game state
    updateCPS(); // Update CPS display
}

// Update cloud count displayed on UI
function updateCloudCountDisplay() {
    roundedCloudCount = Math.round(gameState.cloudCount * 10) / 10; // Round the cloud count to one decimal place
    document.getElementById('cloudCount').innerText = roundedCloudCount.toLocaleString('en-US'); // Update cloud count with one decimal place
}

// Load initial game state
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('cloudCount').innerText = gameState.cloudCount;
    document.getElementById('cursorCount').innerText = gameState.cursors;
    document.getElementById('cursorCost').innerText = gameState.cursorCost;
    document.getElementById('evaporatorCount').innerText = gameState.evaporators;
    document.getElementById('evaporatorCost').innerText = gameState.evaporatorCost;
    document.getElementById('factoryCount').innerText = gameState.factories;
    document.getElementById('factoryCost').innerText = gameState.factoryCost;
    document.getElementById('cloudGeneratorCount').innerText = gameState.cloudGenerators;
    document.getElementById('cloudGeneratorCost').innerText = gameState.cloudGeneratorCost;
    document.getElementById('weatherMachineCount').innerText = gameState.weatherMachines;
    document.getElementById('weatherMachineCost').innerText = gameState.weatherMachineCost;
    document.getElementById('stormStationCount').innerText = gameState.stormStations;
    document.getElementById('stormStationCost').innerText = gameState.stormStationCost;
    document.getElementById('atmosphereManipulatorCount').innerText = gameState.atmosphereManipulators;
    document.getElementById('atmosphereManipulatorCost').innerText = gameState.atmosphereManipulatorCost;
    document.getElementById('climateControllerCount').innerText = gameState.climateControllers;
    document.getElementById('climateControllerCost').innerText = gameState.climateControllerCost;
    updateCPS(); // Update CPS display
});

function buyClickUpgrade(){
    if(gameState.cloudCount >= gameState.clickUpgradeCost){
    gameState.currentAmountPerClick++;
    gameState.cloudCount = gameState.cloudCount - gameState.clickUpgradeCost;
    gameState.clickUpgradeCost = gameState.clickUpgradeCost * 10;
    }

}

function calculateCUCost(quantity, baseCost){
    return Math.floor(baseCost  * Math.pow(10, (quantity - 1 )));
}

// Cloud clicking function
function clickCloud() {
    gameState.cloudCount = gameState.cloudCount + gameState.currentAmountPerClick;
}

// Buy cursor function
function buyCursor() {
    if (gameState.cloudCount >= gameState.cursorCost) {
        gameState.cloudCount -= gameState.cursorCost;
        gameState.cursors++;
        gameState.cursorCost = Math.round(gameState.cursorCost * 1.15);
        saveGameState(); // Save the updated game state
        document.getElementById('cursorCount').innerText = gameState.cursors; // Update cursor count
        document.getElementById('cursorCost').innerText = gameState.cursorCost; // Update cursor cost
        updateCPS(); // Update CPS display
    }
}

function buyEvaporator() {
    if (gameState.cloudCount >= gameState.evaporatorCost) {
        gameState.cloudCount -= gameState.evaporatorCost;
        gameState.evaporators++;
        gameState.evaporatorCost = Math.round(gameState.evaporatorCost * 1.15);
        saveGameState(); // Save the updated game state
        document.getElementById('evaporatorCount').innerText = gameState.evaporators; // Update cursor count
        document.getElementById('evaporatorCost').innerText = gameState.evaporatorCost; // Update cursor cost
        updateCPS(); // Update CPS display
    }
}

// Buy factory function
function buyFactory() {
    if (gameState.cloudCount >= gameState.factoryCost) {
        gameState.cloudCount -= gameState.factoryCost;
        gameState.factories++;
        gameState.factoryCost = Math.round(gameState.factoryCost * 1.15);
        saveGameState(); // Save the updated game state
        document.getElementById('factoryCount').innerText = gameState.factories; // Update factory count
        document.getElementById('factoryCost').innerText = gameState.factoryCost; // Update factory cost
        updateCPS(); // Update CPS display
    }
}

// Buy cloud generator function
function buyCloudGenerator() {
    if (gameState.cloudCount >= gameState.cloudGeneratorCost) {
        gameState.cloudCount -= gameState.cloudGeneratorCost;
        gameState.cloudGenerators++;
        gameState.cloudGeneratorCost = Math.round(gameState.cloudGeneratorCost * 1.15);
        saveGameState(); // Save the updated game state
        document.getElementById('cloudGeneratorCount').innerText = gameState.cloudGenerators; // Update cloud generator count
        document.getElementById('cloudGeneratorCost').innerText = gameState.cloudGeneratorCost; // Update cloud generator cost
        updateCPS(); // Update CPS display
    }
}

// Buy weather machine function
function buyWeatherMachine() {
    if (gameState.cloudCount >= gameState.weatherMachineCost) {
        gameState.cloudCount -= gameState.weatherMachineCost;
        gameState.weatherMachines++;
        gameState.weatherMachineCost = Math.round(gameState.weatherMachineCost * 1.15);
        saveGameState(); // Save the updated game state
        document.getElementById('weatherMachineCount').innerText = gameState.weatherMachines; // Update weather machine count
        document.getElementById('weatherMachineCost').innerText = gameState.weatherMachineCost; // Update weather machine cost
        updateCPS(); // Update CPS display
    }
}

// Buy storm station function
function buyStormStation() {
    if (gameState.cloudCount >= gameState.stormStationCost) {
        gameState.cloudCount -= gameState.stormStationCost;
        gameState.stormStations++;
        gameState.stormStationCost = Math.round(gameState.stormStationCost * 1.15);
        saveGameState(); // Save the updated game state
        document.getElementById('stormStationCount').innerText = gameState.stormStations; // Update storm station count
        document.getElementById('stormStationCost').innerText = gameState.stormStationCost; // Update storm station cost
        updateCPS(); // Update CPS display
    }
}

// Buy atmosphere manipulator function
function buyAtmosphereManipulator() {
    if (gameState.cloudCount >= gameState.atmosphereManipulatorCost) {
        gameState.cloudCount -= gameState.atmosphereManipulatorCost;
        gameState.atmosphereManipulators++;
        gameState.atmosphereManipulatorCost = Math.round(gameState.atmosphereManipulatorCost * 1.15);
        saveGameState(); // Save the updated game state
        document.getElementById('atmosphereManipulatorCount').innerText = gameState.atmosphereManipulators; // Update atmosphere manipulator count
        document.getElementById('atmosphereManipulatorCost').innerText = gameState.atmosphereManipulatorCost; // Update atmosphere manipulator cost
        updateCPS(); // Update CPS display
    }
}

// Buy climate controller function
function buyClimateController() {
    if (gameState.cloudCount >= gameState.climateControllerCost) {
        gameState.cloudCount -= gameState.climateControllerCost;
        gameState.climateControllers++;
        gameState.climateControllerCost = Math.round(gameState.climateControllerCost * 1.15);
        saveGameState(); // Save the updated game state
        document.getElementById('climateControllerCount').innerText = gameState.climateControllers; // Update climate controller count
        document.getElementById('climateControllerCost').innerText = gameState.climateControllerCost; // Update climate controller cost
        updateCPS(); // Update CPS display
    }
}

// Update game state and UI every second
setInterval(function() {
    updateGameState(); // Update game state
    updateCloudCountDisplay(); // Update cloud count displayed on UI
}, 100);

// Function to reset the saved game state
function resetGame() {
    localStorage.removeItem('gameState'); // Remove the saved game state from local storage
    location.reload(); // Reload the page to reset the game
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function resetUpgrades() {
    // Set all upgrade counts to 0
    gameState.cursors = 0;
    gameState.evaporators = 0;
    gameState.factories = 0;
    gameState.cloudGenerators = 0;
    gameState.weatherMachines = 0;
    gameState.stormStations = 0;
    gameState.atmosphereManipulators = 0;
    gameState.climateControllers = 0;
    gameState.currentAmountPerClick = 1;

    updateCPS();
    updateCloudCountDisplay();
}
