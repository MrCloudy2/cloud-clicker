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
const defaultCursorCps = 0.1;
const defaultEvaporatorCps = 1;
const defaultFactoryCps = 5;
const defaultCloudGeneratorCps = 20;
const defaultWeatherMachineCps = 50;
const defaultStormStationCps = 100;
const defaultAtmosphereManipulatorCps = 200;
const defaultClimateControllerCps = 500;




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

let lastSaveTime = Date.now(); // Track the last time the game was saved

function autoSave() {
    const now = Date.now();
    const timeElapsed = now - lastSaveTime;

    // Save every 60 seconds (60000 ms)
    if (timeElapsed >= 6000) {
        saveGameState();
        lastSaveTime = now;
    }

    // Keep the loop running with requestAnimationFrame
    requestAnimationFrame(autoSave);
}

// Start auto-save when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
    requestAnimationFrame(autoSave);
});

// Function to save game state to local storage
function saveGameState() {
    gameState.lastSaveTime = Date.now(); // Store the last save time
    localStorage.setItem('gameState', JSON.stringify(gameState)); // Save to localStorage
    console.log('Game saved!');
}

function exportSave() {
    const saveData = JSON.stringify(gameState, null, 2); // Convert game state to formatted JSON string
    const blob = new Blob([saveData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cloud_clicker_save.json'; // Filename for the save file
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a); // Clean up
}

function importSave(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const importedData = JSON.parse(e.target.result);
        gameState = { ...gameState, ...importedData }; // Merge with existing gameState
        saveGameState(); // Save the imported data to localStorage
        location.reload(); // Reload to apply the new state
    };
    reader.readAsText(file);
}

function wipeSave() {
    if (confirm("Are you sure you want to wipe your save? This cannot be undone!")) {
        localStorage.removeItem('gameState'); // Remove the saved game state
        location.reload(); // Reload the page to reset the game
    }
}


// Function to calculate building costs based on quantity owned
function calculateCost(quantity, baseCost) {
    return Math.floor(baseCost * Math.pow(1.15, quantity));
}

//cheats for development
function rccalc(amount){
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
    cursorCPS = Math.round(gameState.cursors * defaultCursorCps * 10)/10;
    evaporatorCPS = gameState.evaporators * defaultEvaporatorCps;
    factoryCPS = gameState.factories * defaultFactoryCps;
    cloudGeneratorCPS = gameState.cloudGenerators * defaultCloudGeneratorCps;
    weatherMachineCPS = gameState.weatherMachines * defaultWeatherMachineCps;
    stormStationCPS = gameState.stormStations * defaultStormStationCps;
    atmosphereManipulatorCPS = gameState.atmosphereManipulators * defaultAtmosphereManipulatorCps;
    climateControllerCPS = gameState.climateControllers * defaultClimateControllerCps;

    totalCPS = (Math.round( (cursorCPS + evaporatorCPS + factoryCPS + cloudGeneratorCPS + weatherMachineCPS + stormStationCPS + atmosphereManipulatorCPS + climateControllerCPS)*10)/10);
    

    document.getElementById('cloudsPerSecond').innerText = formatLargeNumber(totalCPS);
}

function playSound(id) {
    if (isMuted) return; // Do not play sound if muted
    const sound = document.getElementById(id);
    sound.currentTime = 0; 
    sound.play();
}

let isMuted = false;

function toggleMute() {
    isMuted = !isMuted;
    const button = document.getElementById('muteButton');
    button.innerText = isMuted ? '🔇' : '🔊';

    const allSounds = document.querySelectorAll('audio');
    allSounds.forEach(sound => {
        sound.muted = isMuted;
    });
}

function formatLargeNumber(num) {
    if (num >= 1e42) return removeTrailingZeros((num / 1e42).toFixed(2)) + ' Tredecillion';
    if (num >= 1e39) return removeTrailingZeros((num / 1e39).toFixed(2)) + ' Duodecillion';
    if (num >= 1e36) return removeTrailingZeros((num / 1e36).toFixed(2)) + ' Undecillion';
    if (num >= 1e33) return removeTrailingZeros((num / 1e33).toFixed(2)) + ' Decillion';
    if (num >= 1e30) return removeTrailingZeros((num / 1e30).toFixed(2)) + ' Nonillion';
    if (num >= 1e27) return removeTrailingZeros((num / 1e27).toFixed(2)) + ' Octillion';
    if (num >= 1e24) return removeTrailingZeros((num / 1e24).toFixed(2)) + ' Septillion';
    if (num >= 1e21) return removeTrailingZeros((num / 1e21).toFixed(2)) + ' Sextillion';
    if (num >= 1e18) return removeTrailingZeros((num / 1e18).toFixed(2)) + ' Quintillion';
    if (num >= 1e15) return removeTrailingZeros((num / 1e15).toFixed(2)) + ' Quadrillion';
    if (num >= 1e12) return removeTrailingZeros((num / 1e12).toFixed(2)) + ' Trillion';
    if (num >= 1e9) return removeTrailingZeros((num / 1e9).toFixed(2)) + ' Billion';
    if (num >= 1e6) return removeTrailingZeros((num / 1e6).toFixed(2)) + ' Million';
    if (num >= 1e3) return removeTrailingZeros((num / 1e3).toFixed(2)) + 'K';
    return num.toLocaleString('en-US');
}


function removeTrailingZeros(numberString) {
    return parseFloat(numberString).toString();
}

// Function to update game state and handle tab inactivity
function updateGameState() {
    // Update current cloud count based on active time (same as before)
    gameState.cloudCount += (gameState.cursors * defaultCursorCps) / 10;
    gameState.cloudCount += (gameState.evaporators * defaultEvaporatorCps) / 10;
    gameState.cloudCount += (gameState.factories * defaultFactoryCps) / 10;
    gameState.cloudCount += (gameState.cloudGenerators * defaultCloudGeneratorCps) / 10;
    gameState.cloudCount += (gameState.weatherMachines * defaultWeatherMachineCps) / 10;
    gameState.cloudCount += (gameState.stormStations * defaultStormStationCps) / 10;
    gameState.cloudCount += (gameState.atmosphereManipulators * defaultAtmosphereManipulatorCps) / 10;
    gameState.cloudCount += (gameState.climateControllers * defaultClimateControllerCps) / 10;
    updateCPS(); // Update CPS display
}
// Update cloud count displayed on UI
function updateCloudCountDisplay() {
    roundedCloudCount = Math.round(gameState.cloudCount * 10) / 10; // Round the cloud count to one decimal place
    document.getElementById('cloudCount').innerText = formatLargeNumber(roundedCloudCount); // Update cloud count with one decimal place
}


function buyClickUpgrade(){
    if(gameState.cloudCount >= gameState.clickUpgradeCost){
    gameState.currentAmountPerClick++;
    gameState.cloudCount = gameState.cloudCount - gameState.clickUpgradeCost;
    gameState.clickUpgradeCost = gameState.clickUpgradeCost * 10;
    document.getElementById('clickUpgradeCost').innerText = formatLargeNumber(gameState.clickUpgradeCost)
    playSound('purchaseSound');
    }

}

//salculate Clicker upgrade cost
function calculateCUCost(quantity, baseCost){
    return Math.floor(baseCost  * Math.pow(10, (quantity - 1 )));
}

let clickCooldown = false;

function clickCloud() {
    if (clickCooldown) return;
    gameState.cloudCount += gameState.currentAmountPerClick;
    updateCloudCountDisplay();
    playSound('clickSound');
    clickCooldown = true;
    setTimeout(() => clickCooldown = false, 5); // 5ms throttle
}

// Buy cursor function
function buyCursor() {
    if (gameState.cloudCount >= gameState.cursorCost) {
        gameState.cloudCount -= gameState.cursorCost;
        gameState.cursors++;
        gameState.cursorCost = Math.round(gameState.cursorCost * 1.15);
        document.getElementById('cursorCost').innerText = formatLargeNumber(gameState.cursorCost); // Update cursor cost
        updateCPS(); // Update CPS display
        playSound('purchaseSound');
    }
}

//buy evaporator
function buyEvaporator() {
    if (gameState.cloudCount >= gameState.evaporatorCost) {
        gameState.cloudCount -= gameState.evaporatorCost;
        gameState.evaporators++;
        gameState.evaporatorCost = Math.round(gameState.evaporatorCost * 1.15);
        document.getElementById('evaporatorCost').innerText = formatLargeNumber(gameState.evaporatorCost); // Update cursor cost
        updateCPS(); // Update CPS display
        playSound('purchaseSound');
    }
}

// Buy factory function
function buyFactory() {
    if (gameState.cloudCount >= gameState.factoryCost) {
        gameState.cloudCount -= gameState.factoryCost;
        gameState.factories++;
        gameState.factoryCost = Math.round(gameState.factoryCost * 1.15);
        document.getElementById('factoryCost').innerText = formatLargeNumber(gameState.factoryCost); // Update factory cost
        updateCPS(); // Update CPS display
        playSound('purchaseSound');
    }
}

// Buy cloud generator function
function buyCloudGenerator() {
    if (gameState.cloudCount >= gameState.cloudGeneratorCost) {
        gameState.cloudCount -= gameState.cloudGeneratorCost;
        gameState.cloudGenerators++;
        gameState.cloudGeneratorCost = Math.round(gameState.cloudGeneratorCost * 1.15);
        document.getElementById('cloudGeneratorCost').innerText = formatLargeNumber(gameState.cloudGeneratorCost); // Update cloud generator cost
        updateCPS(); // Update CPS display
        playSound('purchaseSound');
    }
}

// Buy weather machine function
function buyWeatherMachine() {
    if (gameState.cloudCount >= gameState.weatherMachineCost) {
        gameState.cloudCount -= gameState.weatherMachineCost;
        gameState.weatherMachines++;
        gameState.weatherMachineCost = Math.round(gameState.weatherMachineCost * 1.15);
        document.getElementById('weatherMachineCost').innerText = formatLargeNumber(gameState.weatherMachineCost); // Update weather machine cost
        updateCPS(); // Update CPS display
        playSound('purchaseSound');
    }
}

// Buy storm station function
function buyStormStation() {
    if (gameState.cloudCount >= gameState.stormStationCost) {
        gameState.cloudCount -= gameState.stormStationCost;
        gameState.stormStations++;
        gameState.stormStationCost = Math.round(gameState.stormStationCost * 1.15);
        document.getElementById('stormStationCost').innerText = formatLargeNumber(gameState.stormStationCost); // Update storm station cost
        updateCPS(); // Update CPS display
        playSound('purchaseSound');
    }
}

// Buy atmosphere manipulator function
function buyAtmosphereManipulator() {
    if (gameState.cloudCount >= gameState.atmosphereManipulatorCost) {
        gameState.cloudCount -= gameState.atmosphereManipulatorCost;
        gameState.atmosphereManipulators++;
        gameState.atmosphereManipulatorCost = Math.round(gameState.atmosphereManipulatorCost * 1.15);
        document.getElementById('atmosphereManipulatorCost').innerText = formatLargeNumber(gameState.atmosphereManipulatorCost); // Update atmosphere manipulator cost
        updateCPS(); // Update CPS display
        playSound('purchaseSound');
    }
}

// Buy climate controller function
function buyClimateController() {
    if (gameState.cloudCount >= gameState.climateControllerCost) {
        gameState.cloudCount -= gameState.climateControllerCost;
        gameState.climateControllers++;
        gameState.climateControllerCost = Math.round(gameState.climateControllerCost * 1.15);
        document.getElementById('climateControllerCost').innerText = formatLargeNumber(gameState.climateControllerCost); // Update climate controller cost
        updateCPS(); // Update CPS display
        playSound('purchaseSound');
    }
}

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

gameState.cursorCost = calculateCost(gameState.cursors, 10); // Updated cursor cost
gameState.evaporatorCost = calculateCost(gameState.evaporators, 100); // New evaporator cost
gameState.factoryCost = calculateCost(gameState.factories, 1000);
gameState.cloudGeneratorCost = calculateCost(gameState.cloudGenerators, 5000);
gameState.weatherMachineCost = calculateCost(gameState.weatherMachines, 20000);
gameState.stormStationCost = calculateCost(gameState.stormStations, 100000);
gameState.atmosphereManipulatorCost = calculateCost(gameState.atmosphereManipulators, 500000);
gameState.climateControllerCost = calculateCost(gameState.climateControllers, 2000000);
gameState.clickUpgradeCost = calculateCUCost(gameState.currentAmountPerClick, 10);

    updateCPS();
    updateCloudCountDisplay();
}



//                                                                                       //
//                  MAIN DOING THINGS SHIT                     //
//                                                                                       //

// Load initial game state
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('cloudCount').innerText = formatLargeNumber(gameState.cloudCount);
    document.getElementById('cursorCost').innerText = formatLargeNumber(gameState.cursorCost);
    document.getElementById('evaporatorCost').innerText = formatLargeNumber(gameState.evaporatorCost);
    document.getElementById('factoryCost').innerText = formatLargeNumber(gameState.factoryCost);
    document.getElementById('cloudGeneratorCost').innerText = formatLargeNumber(gameState.cloudGeneratorCost);
    document.getElementById('weatherMachineCost').innerText = formatLargeNumber(gameState.weatherMachineCost);
    document.getElementById('stormStationCost').innerText = formatLargeNumber(gameState.stormStationCost);
    document.getElementById('atmosphereManipulatorCost').innerText = formatLargeNumber(gameState.atmosphereManipulatorCost);
    document.getElementById('climateControllerCost').innerText = formatLargeNumber(gameState.climateControllerCost);
    document.getElementById('clickUpgradeCost').innerText = formatLargeNumber(gameState.clickUpgradeCost);
    updateCPS(); // Update CPS display
});

function generateTooltipContent(buildingType) {
    let buildingCPS = 0;
    let buildingCount = 0;

    switch (buildingType) {
        case 'cursors':
            buildingCPS = defaultCursorCps;
            buildingCount = gameState.cursors;
            break;
        case 'evaporators':
            buildingCPS = defaultEvaporatorCps;
            buildingCount = gameState.evaporators;
            break;
        case 'factories':
            buildingCPS = defaultFactoryCps; 
            buildingCount = gameState.factories;
            break;
        case 'cloudGenerators':
            buildingCPS = defaultCloudGeneratorCps; 
            buildingCount = gameState.cloudGenerators;
            break;
        case 'weatherMachines':
            buildingCPS = defaultWeatherMachineCps; 
            buildingCount = gameState.weatherMachines;
            break;
        case 'stormStations':
            buildingCPS = defaultStormStationCps; 
            buildingCount = gameState.stormStations;
            break;
        case 'atmosphereManipulators':
            buildingCPS = defaultAtmosphereManipulatorCps; 
            buildingCount = gameState.atmosphereManipulators;
            break;
        case 'climateControllers':
            buildingCPS = defaultClimateControllerCps; 
            buildingCount = gameState.climateControllers;
            break;
            case 'click':
                return `
                <span class="info">
                    <p>Amount: <span id="buildingCount">${gameState.currentAmountPerClick}</span></p>
                </span>
            `;
        default:
            break;
    }

    return `
        <span class="info">
            <p>Amount: <span id="buildingCount">${buildingCount}</span></p>
            <p>CPS: ${buildingCPS}</p>
            <p>Total CPS: <span id="BuildingCPS">${buildingCount * buildingCPS}</span></p>
        </span>
    `;
}




document.addEventListener('DOMContentLoaded', function() {
    const tooltip = document.getElementById('tooltip');
    const upgradeButtons = document.querySelectorAll('.upgrade-button');
    const middlePanel = document.querySelector('.middle-panel');

    // Default CPS value



    setInterval(function() {
        updateGameState(); // Update game state
        updateCloudCountDisplay(); // Update cloud count displayed on UI
    }, 100);
    
    


    // Function to generate tooltip content
    function generateTooltipContent(buildingType) {
        let buildingCPS = 0;
        let buildingCount = 0;

        switch (buildingType) {
            case 'cursors':
                buildingCPS = defaultCursorCps;
                buildingCount = gameState.cursors;
                break;
            case 'evaporators':
                buildingCPS = defaultEvaporatorCps;
                buildingCount = gameState.evaporators;
                break;
            case 'factories':
                buildingCPS = defaultFactoryCps; 
                buildingCount = gameState.factories;
                break;
            case 'cloudGenerators':
                buildingCPS = defaultCloudGeneratorCps; 
                buildingCount = gameState.cloudGenerators;
                break;
            case 'weatherMachines':
                buildingCPS = defaultWeatherMachineCps; 
                buildingCount = gameState.weatherMachines;
                break;
            case 'stormStations':
                buildingCPS = defaultStormStationCps; 
                buildingCount = gameState.stormStations;
                break;
            case 'atmosphereManipulators':
                buildingCPS = defaultAtmosphereManipulatorCps; 
                buildingCount = gameState.atmosphereManipulators;
                break;
            case 'climateControllers':
                buildingCPS = defaultClimateControllerCps; 
                buildingCount = gameState.climateControllers;
                break;
        case 'click':
            return `
            <span class="info">
                <p>Amount: <span id="buildingCount">${gameState.currentAmountPerClick}</span></p>
            </span>
        `;
            default:
                break;
        }

        return `
            <span class="info">
                <p>Amount: <span id="buildingCount">${buildingCount}</span></p>
                <p>CPS: ${buildingCPS}</p>
                <p>Total CPS: <span id="BuildingCPS">${(buildingCount * buildingCPS).toFixed(1)}</span></p>
            </span>
        `;
    }

    // Tooltip content for each building type
    const tooltipData = {
        cursors: { count: gameState.cursors, cps: cursorCPS },
        evaporators: { count: gameState.evaporators, cps: evaporatorCPS },
        // Define other building types similarly
    };

    upgradeButtons.forEach(button => {
        const buildingType = button.getAttribute('data-building-type');

        button.addEventListener('mouseover', function(event) {
            tooltip.innerHTML = generateTooltipContent(buildingType);
            tooltip.style.display = 'block';

            const middlePanelRect = middlePanel.getBoundingClientRect();
            const buttonRect = event.target.getBoundingClientRect();

            tooltip.style.left = `${middlePanelRect.right - tooltip.offsetWidth}px`;
            tooltip.style.top = `${buttonRect.top + window.scrollY}px`;
        });

        button.addEventListener('mousemove', function(event) {
            tooltip.style.top = `${event.clientY + window.scrollY - 60}px`;
        });

        button.addEventListener('mouseout', function() {
            tooltip.style.display = 'none';

        });
        button.addEventListener('click', function(event) {
            tooltip.innerHTML = generateTooltipContent(buildingType);
            tooltip.style.display = 'block';

        });
    });
});



checkAndCorrectValues();