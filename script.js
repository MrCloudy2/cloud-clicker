// Initialize the game state from local storage or set default values
let gameState = JSON.parse(localStorage.getItem('gameState')) || {
    cloudCount: 0,
    cursors: 0,
    evaporators: 0,
    factories: 0,
    cloudGenerators: 0,
    weatherMachines: 0,
    stormStations: 0,
    atmosphereManipulators: 0,
    climateControllers: 0,
    currentAmountPerClick: 1,
    globalMulti: 1,
    cursorMulti: 1,
    evaporatorMulti: 1,
    factoryMulti: 1,
    cloudGeneratorMulti: 1,
    weatherMachineMulti: 1,
    stormStationMulti: 1,
    atmosphereManipulatorMulti: 1,
    climateControllerMulti: 1
};
// cps values
const defaultCursorCps = 0.1;
const defaultEvaporatorCps = 1;
const defaultFactoryCps = 5;
const defaultCloudGeneratorCps = 20;
const defaultWeatherMachineCps = 50;
const defaultStormStationCps = 100;
const defaultAtmosphereManipulatorCps = 200;
const defaultClimateControllerCps = 500;


let cursorCps;
let evaporatorCps;
let factoryCps;
let cloudGeneratorCps;
let weatherMachineCps;
let stormStationCps;
let atmosphereManipulatorCps;
let climateControllerCps;

// Set initial costs based on default values
let cursorCost = calculateCost(gameState.cursors, 10);
let evaporatorCost = calculateCost(gameState.evaporators, 100);
let factoryCost = calculateCost(gameState.factories, 1000);
let cloudGeneratorCost = calculateCost(gameState.cloudGenerators, 5000);
let weatherMachineCost = calculateCost(gameState.weatherMachines, 20000);
let stormStationCost = calculateCost(gameState.stormStations, 100000);
let atmosphereManipulatorCost = calculateCost(gameState.atmosphereManipulators, 500000);
let climateControllerCost = calculateCost(gameState.climateControllers, 2000000);
let clickUpgradeCost = calculateCUCost(gameState.currentAmountPerClick, 10);

let lastSaveTime = Date.now(); // Track the last time the game was saved

function autoSave() {
    saveGameState(); // Save the game state
}

// Start auto-save when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Call autoSave every 60 seconds (60000 ms)
    setInterval(autoSave, 60000);
});

// Function to save game state to local storage
function saveGameState() {
    gameState.lastSaveTime = Date.now(); // Store the last save time
    updateCloudCountDisplay();
    localStorage.setItem('gameState', JSON.stringify(gameState)); // Save to localStorage
    showSaveNotification();  // Show the "Saving..." notification
    console.log('Game saved!');
}

// Show the modal for exporting save data
function exportSave() {
    const saveData = JSON.stringify(gameState);  // Convert game state to JSON string
    const base64Save = btoa(saveData);  // Encode JSON string into Base64

    // Update the modal for export mode
    document.getElementById('modalTitle').innerText = "Copy Your Save";
    document.getElementById('saveString').value = base64Save;  // Set the encoded save string
    document.getElementById('saveString').readOnly = true;     // Make the text area read-only for export
    document.getElementById('exportButtons').style.display = 'block';  // Show the copy button
    document.getElementById('importButton').style.display = 'none';  // Hide import button

    // Show the modal
    document.getElementById('saveModal').style.display = 'flex';
}

// Show the modal for importing save data
function importSave() {
    // Update the modal for import mode
    document.getElementById('modalTitle').innerText = "Paste Your Save";
    document.getElementById('saveString').value = '';  // Clear the text area for pasting
    document.getElementById('saveString').readOnly = false;   // Allow user to paste
    document.getElementById('exportButtons').style.display = 'none';  // Hide the copy button
    document.getElementById('importButton').style.display = 'block';  // Show import button

    // Show the modal
    document.getElementById('saveModal').style.display = 'flex';
}

// Copy the save data to the clipboard
function copyToClipboard() {
    const saveString = document.getElementById('saveString');
    saveString.select();
    saveString.setSelectionRange(0, 99999);  // Select the text

    try {
        document.execCommand('copy');
        alert('Save copied to clipboard!');
    } catch (err) {
        alert('Failed to copy the save.');
    }
}

// Load the pasted save data
function loadPastedSave() {
    const base64Input = document.getElementById('saveString').value;  // Get the pasted input

    if (!base64Input) {
        alert("Please paste a valid save string.");
        return;
    }

    try {
        const decodedSave = atob(base64Input);  // Decode the Base64 string back to JSON
        const importedData = JSON.parse(decodedSave);  // Parse the JSON string
        gameState = { ...gameState, ...importedData };  // Merge with existing game state
        saveGameState();  // Save the imported data to localStorage
        location.reload();  // Reload the page to apply the new state
    } catch (e) {
        alert("Invalid save data. Please check the format.");
    }
}

// Close the modal
function closeModal() {
    document.getElementById('saveModal').style.display = 'none';
}



function wipeSave() {
    if (confirm("Are you sure you want to wipe your save? This cannot be undone!")) {
        localStorage.removeItem('gameState'); // Remove the saved game state
        location.reload(); // Reload the page to reset the game
    }
}

function showSaveNotification() {
    const notification = document.getElementById('saveNotification');
    notification.style.display = 'block';  // Show the notification
    setTimeout(() => {
        notification.style.display = 'none';  // Hide the notification after 2 seconds
    }, 2000);  // Duration of the message display (2 seconds)
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
    cursorCps = gameState.cursors * defaultCursorCps;
    evaporatorCps = gameState.evaporators * defaultEvaporatorCps;
    factoryCps = gameState.factories * defaultFactoryCps;
    cloudGeneratorCps = gameState.cloudGenerators * defaultCloudGeneratorCps;
    weatherMachineCps = gameState.weatherMachines * defaultWeatherMachineCps;
    stormStationCps = gameState.stormStations * defaultStormStationCps;
    atmosphereManipulatorCps = gameState.atmosphereManipulators * defaultAtmosphereManipulatorCps;
    climateControllerCps = gameState.climateControllers * defaultClimateControllerCps;

    totalCPS = (Math.round( (cursorCps + evaporatorCps + factoryCps + cloudGeneratorCps + weatherMachineCps + stormStationCps + atmosphereManipulatorCps + climateControllerCps)*10)/10);
    

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
    button.innerText = isMuted ? '🔇Unmute' : '🔊 mute';

    const allSounds = document.querySelectorAll('audio');
    allSounds.forEach(sound => {
        sound.muted = isMuted;
    });
}

function formatLargeNumber(num) {
    const thresholds = [
        { value: 1e303, suffix: ' Centillion' },
        { value: 1e300, suffix: ' Novemnonagintillion' },
        { value: 1e297, suffix: ' Octononagintillion' },
        { value: 1e294, suffix: ' Septennonagintillion' },
        { value: 1e291, suffix: ' Senonagintillion' },
        { value: 1e288, suffix: ' Quinnonagintillion' },
        { value: 1e285, suffix: ' Quattuornonagintillion' },
        { value: 1e282, suffix: ' Trenonagintillion' },
        { value: 1e279, suffix: ' Duononagintillion' },
        { value: 1e276, suffix: ' Unnonagintillion' },
        { value: 1e273, suffix: ' Nonagintillion' },
        { value: 1e270, suffix: ' Novemoctogintillion' },
        { value: 1e267, suffix: ' Octooctogintillion' },
        { value: 1e264, suffix: ' Septenoctogintillion' },
        { value: 1e261, suffix: ' Sexoctogintillion' },
        { value: 1e258, suffix: ' Quinoctogintillion' },
        { value: 1e255, suffix: ' Quattuoroctogintillion' },
        { value: 1e252, suffix: ' Tresoctogintillion' },
        { value: 1e249, suffix: ' Duooctogintillion' },
        { value: 1e246, suffix: ' Unoctogintillion' },
        { value: 1e243, suffix: ' Octogintillion' },
        { value: 1e240, suffix: ' Novemseptuagintillion' },
        { value: 1e237, suffix: ' Octoseptuagintillion' },
        { value: 1e234, suffix: ' Septenseptuagintillion' },
        { value: 1e231, suffix: ' Sexseptuagintillion' },
        { value: 1e228, suffix: ' Quinseptuagintillion' },
        { value: 1e225, suffix: ' Quattuorseptuagintillion' },
        { value: 1e222, suffix: ' Treseptuagintillion' },
        { value: 1e219, suffix: ' Duoseptuagintillion' },
        { value: 1e216, suffix: ' Unseptuagintillion' },
        { value: 1e213, suffix: ' Septuagintillion' },
        { value: 1e210, suffix: ' Novemsexagintillion' },
        { value: 1e207, suffix: ' Octosexagintillion' },
        { value: 1e204, suffix: ' Septensexagintillion' },
        { value: 1e201, suffix: ' Sextosexagintillion' },
        { value: 1e198, suffix: ' Quinsexagintillion' },
        { value: 1e195, suffix: ' Quattuorsexagintillion' },
        { value: 1e192, suffix: ' Tresexagintillion' },
        { value: 1e189, suffix: ' Duosexagintillion' },
        { value: 1e186, suffix: ' Unsexagintillion' },
        { value: 1e183, suffix: ' Sexagintillion' },
        { value: 1e180, suffix: ' Novemquinquagintillion' },
        { value: 1e177, suffix: ' Octoquinquagintillion' },
        { value: 1e174, suffix: ' Septenquinquagintillion' },
        { value: 1e171, suffix: ' Sextoquinquagintillion' },
        { value: 1e168, suffix: ' Quinquinquagintillion' },
        { value: 1e165, suffix: ' Quattuorquinquagintillion' },
        { value: 1e162, suffix: ' Trequinquagintillion' },
        { value: 1e159, suffix: ' Duoquinquagintillion' },
        { value: 1e156, suffix: ' Unquinquagintillion' },
        { value: 1e153, suffix: ' Quinquagintillion' },
        { value: 1e150, suffix: ' Novemquadragintillion' },
        { value: 1e147, suffix: ' Octoquadragintillion' },
        { value: 1e144, suffix: ' Septenquadragintillion' },
        { value: 1e141, suffix: ' Sexquadragintillion' },
        { value: 1e138, suffix: ' Quinquadragintillion' },
        { value: 1e135, suffix: ' Quattuorquadragintillion' },
        { value: 1e132, suffix: ' Tresquadragintillion' },
        { value: 1e129, suffix: ' Duoquadragintillion' },
        { value: 1e126, suffix: ' Unquadragintillion' },
        { value: 1e123, suffix: ' Quadragintillion' },
        { value: 1e120, suffix: ' Novemtrigintillion' },
        { value: 1e117, suffix: ' Octotrigintillion' },
        { value: 1e114, suffix: ' Septentrigintillion' },
        { value: 1e111, suffix: ' Sextrigintillion' },
        { value: 1e108, suffix: ' Quintrigintillion' },
        { value: 1e105, suffix: ' Quattuortrigintillion' },
        { value: 1e102, suffix: ' Trestrigintillion' },
        { value: 1e99, suffix: ' Duotrigintillion' },
        { value: 1e96, suffix: ' Untrigintillion' },
        { value: 1e93, suffix: ' Trigintillion' },
        { value: 1e90, suffix: ' Novemvigintillion' },
        { value: 1e87, suffix: ' Octovigintillion' },
        { value: 1e84, suffix: ' Septenvigintillion' },
        { value: 1e81, suffix: ' Sexvigintillion' },
        { value: 1e78, suffix: ' Quinvigintillion' },
        { value: 1e75, suffix: ' Quattuorvigintillion' },
        { value: 1e72, suffix: ' Tresvigintillion' },
        { value: 1e69, suffix: ' Duovigintillion' },
        { value: 1e66, suffix: ' Unvigintillion' },
        { value: 1e63, suffix: ' Vigintillion' },
        { value: 1e60, suffix: ' Novemdecillion' },
        { value: 1e57, suffix: ' Octodecillion' },
        { value: 1e54, suffix: ' Septendecillion' },
        { value: 1e51, suffix: ' Sedecillion' },
        { value: 1e48, suffix: ' Quindecillion' },
        { value: 1e45, suffix: ' Quattuordecillion' },
        { value: 1e42, suffix: ' Tredecilion' },
        { value: 1e39, suffix: ' Duodecillion' },
        { value: 1e36, suffix: ' Undecillion' },
        { value: 1e33, suffix: ' Decillion' },
        { value: 1e30, suffix: ' Nonillion' },
        { value: 1e27, suffix: ' Octillion' },
        { value: 1e24, suffix: ' Septillion' },
        { value: 1e21, suffix: ' Sextillion' },
        { value: 1e18, suffix: ' Quintillion' },
        { value: 1e15, suffix: ' Quadrillion' },
        { value: 1e12, suffix: ' Trillion' },
        { value: 1e9, suffix: ' Billion' },
        { value: 1e6, suffix: ' Million' },
        { value: 1e3, suffix: 'K' },
    ];

    for (const { value, suffix } of thresholds) {
        if (num >= value) {
            return removeTrailingZeros((num / value).toFixed(2)) + suffix;
        }
    }
    return num.toLocaleString('en-US');
}


function removeTrailingZeros(numberString) {
    return parseFloat(numberString).toString();
}


// Function to update game state and handle tab inactivity
function updateGameState() {
    // Update current cloud count based on active time
    updateCPS();
    gameState.cloudCount += gameState.globalMulti * gameState.cursorMulti * (cursorCps / 10);
    gameState.cloudCount += gameState.globalMulti * gameState.evaporatorMulti * (evaporatorCps / 10);
    gameState.cloudCount += gameState.globalMulti * gameState.factoryMulti * (factoryCps / 10);
    gameState.cloudCount += gameState.globalMulti * gameState.cloudGeneratorMulti * (cloudGeneratorCps / 10);
    gameState.cloudCount += gameState.globalMulti * gameState.weatherMachineMulti * (weatherMachineCps / 10);
    gameState.cloudCount += gameState.globalMulti * gameState.stormStationMulti * (stormStationCps / 10);
    gameState.cloudCount += gameState.globalMulti * gameState.atmosphereManipulatorMulti * (atmosphereManipulatorCps / 10);
    gameState.cloudCount += gameState.globalMulti * gameState.climateControllerMulti * (climateControllerCps / 10); 
     // Update CPS display
}
// Update cloud count displayed on UI
function updateCloudCountDisplay() {
    roundedCloudCount = Math.round(gameState.cloudCount * 10) / 10; // Round the cloud count to one decimal place
    document.getElementById('cloudCount').innerText = formatLargeNumber(roundedCloudCount); // Update cloud count with one decimal place
}


function buyClickUpgrade(){
    if(gameState.cloudCount >= clickUpgradeCost ){
    gameState.currentAmountPerClick++;
    gameState.cloudCount = gameState.cloudCount - clickUpgradeCost ;
    clickUpgradeCost = clickUpgradeCost * 10;
    document.getElementById('clickUpgradeCost').innerText = formatLargeNumber(clickUpgradeCost )
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
    if (gameState.cloudCount >= cursorCost) {
        gameState.cloudCount -= cursorCost;
        gameState.cursors++;
        cursorCost = Math.round(cursorCost * 1.15);
        document.getElementById('cursorCost').innerText = formatLargeNumber(cursorCost); // Update cursor cost
        updateCPS(); // Update CPS display
        playSound('purchaseSound');
    }
}

//buy evaporator
function buyEvaporator() {
    if (gameState.cloudCount >= evaporatorCost) {
        gameState.cloudCount -= evaporatorCost;
        gameState.evaporators++;
        evaporatorCost = Math.round(evaporatorCost * 1.15);
        document.getElementById('evaporatorCost').innerText = formatLargeNumber(evaporatorCost); // Update cursor cost
        updateCPS(); // Update CPS display
        playSound('purchaseSound');
    }
}

// Buy factory function
function buyFactory() {
    if (gameState.cloudCount >= factoryCost) {
        gameState.cloudCount -= factoryCost;
        gameState.factories++;
        factoryCost = Math.round(factoryCost * 1.15);
        document.getElementById('factoryCost').innerText = formatLargeNumber(factoryCost); // Update factory cost
        updateCPS(); // Update CPS display
        playSound('purchaseSound');
    }
}

// Buy cloud generator function
function buyCloudGenerator() {
    if (gameState.cloudCount >= cloudGeneratorCost) {
        gameState.cloudCount -= cloudGeneratorCost;
        gameState.cloudGenerators++;
        cloudGeneratorCost = Math.round(cloudGeneratorCost * 1.15);
        document.getElementById('cloudGeneratorCost').innerText = formatLargeNumber(cloudGeneratorCost); // Update cloud generator cost
        updateCPS(); // Update CPS display
        playSound('purchaseSound');
    }
}

// Buy weather machine function
function buyWeatherMachine() {
    if (gameState.cloudCount >= weatherMachineCost) {
        gameState.cloudCount -= weatherMachineCost;
        gameState.weatherMachines++;
        weatherMachineCost = Math.round(weatherMachineCost * 1.15);
        document.getElementById('weatherMachineCost').innerText = formatLargeNumber(weatherMachineCost); // Update weather machine cost
        updateCPS(); // Update CPS display
        playSound('purchaseSound');
    }
}

// Buy storm station function
function buyStormStation() {
    if (gameState.cloudCount >= stormStationCost) {
        gameState.cloudCount -= stormStationCost;
        gameState.stormStations++;
        stormStationCost = Math.round(stormStationCost * 1.15);
        document.getElementById('stormStationCost').innerText = formatLargeNumber(stormStationCost); // Update storm station cost
        updateCPS(); // Update CPS display
        playSound('purchaseSound');
    }
}

// Buy atmosphere manipulator function
function buyAtmosphereManipulator() {
    if (gameState.cloudCount >= atmosphereManipulatorCost) {
        gameState.cloudCount -= atmosphereManipulatorCost;
        gameState.atmosphereManipulators++;
        atmosphereManipulatorCost = Math.round(atmosphereManipulatorCost * 1.15);
        document.getElementById('atmosphereManipulatorCost').innerText = formatLargeNumber(atmosphereManipulatorCost); // Update atmosphere manipulator cost
        updateCPS(); // Update CPS display
        playSound('purchaseSound');
    }
}

// Buy climate controller function
function buyClimateController() {
    if (gameState.cloudCount >= climateControllerCost) {
        gameState.cloudCount -= climateControllerCost;
        gameState.climateControllers++;
        climateControllerCost = Math.round(climateControllerCost * 1.15);
        document.getElementById('climateControllerCost').innerText = formatLargeNumber(climateControllerCost); // Update climate controller cost
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

cursorCost = calculateCost(gameState.cursors, 10); // Updated cursor cost
evaporatorCost = calculateCost(gameState.evaporators, 100); // New evaporator cost
factoryCost = calculateCost(gameState.factories, 1000);
cloudGeneratorCost = calculateCost(gameState.cloudGenerators, 5000);
weatherMachineCost = calculateCost(gameState.weatherMachines, 20000);
stormStationCost = calculateCost(gameState.stormStations, 100000);
atmosphereManipulatorCost = calculateCost(gameState.atmosphereManipulators, 500000);
climateControllerCost = calculateCost(gameState.climateControllers, 2000000);
clickUpgradeCost = calculateCUCost(gameState.currentAmountPerClick, 10);

    updateCPS();
    updateCloudCountDisplay();
}

function openTab(event, tabId) {
    // Hide all tab content
    var tabContents = document.getElementsByClassName('tab-content');
    for (var i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = 'none';
    }

    // Remove the active class from all tab buttons
    var tabButtons = document.getElementsByClassName('tab-button');
    for (var i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }

    // Show the selected tab content and set the active tab button
    document.getElementById(tabId).style.display = 'block';
    event.currentTarget.classList.add('active');
}

// Set the default active tab
document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.tab-button').click();
});



//                                                                                       //
//                  MAIN DOING THINGS SHIT                     //
//                                                                                       //

// Load initial game state
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('cloudCount').innerText = formatLargeNumber(gameState.cloudCount);
    document.getElementById('cursorCost').innerText = formatLargeNumber(cursorCost);
    document.getElementById('evaporatorCost').innerText = formatLargeNumber(evaporatorCost);
    document.getElementById('factoryCost').innerText = formatLargeNumber(factoryCost);
    document.getElementById('cloudGeneratorCost').innerText = formatLargeNumber(cloudGeneratorCost);
    document.getElementById('weatherMachineCost').innerText = formatLargeNumber(weatherMachineCost);
    document.getElementById('stormStationCost').innerText = formatLargeNumber(stormStationCost);
    document.getElementById('atmosphereManipulatorCost').innerText = formatLargeNumber(atmosphereManipulatorCost);
    document.getElementById('climateControllerCost').innerText = formatLargeNumber(climateControllerCost);
    document.getElementById('clickUpgradeCost').innerText = formatLargeNumber(clickUpgradeCost );
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
        let buildingCost;

        switch (buildingType) {
            case 'cursors':
                buildingCPS = defaultCursorCps;
                buildingCount = gameState.cursors;
                buildingCost = cursorCost;
                break;
            case 'evaporators':
                buildingCPS = defaultEvaporatorCps;
                buildingCount = gameState.evaporators;
                buildingCost = evaporatorCost;
                break;
            case 'factories':
                buildingCPS = defaultFactoryCps; 
                buildingCount = gameState.factories;
                buildingCost = factoryCost;
                break;
            case 'cloudGenerators':
                buildingCPS = defaultCloudGeneratorCps; 
                buildingCount = gameState.cloudGenerators;
                buildingCost = cloudGeneratorCost;
                break;
            case 'weatherMachines':
                buildingCPS = defaultWeatherMachineCps; 
                buildingCount = gameState.weatherMachines;
                buildingCost = weatherMachineCost;
                break;
            case 'stormStations':
                buildingCPS = defaultStormStationCps; 
                buildingCount = gameState.stormStations;
                buildingCost = stormStationCost;
                break;
            case 'atmosphereManipulators':
                buildingCPS = defaultAtmosphereManipulatorCps; 
                buildingCount = gameState.atmosphereManipulators;
                buildingCost = atmosphereManipulatorCost;
                break;
            case 'climateControllers':
                buildingCPS = defaultClimateControllerCps; 
                buildingCount = gameState.climateControllers;
                buildingCost = climateControllerCost;
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
                <p>ROI cost:   <span id="BuildingCPS">${(buildingCost / buildingCPS)}</span></p>
                
            </span>
        `;
    }


    upgradeButtons.forEach(button => {
        const buildingType = button.getAttribute('data-building-type');

        button.addEventListener('mouseover', function(event) {
            tooltip.innerHTML = generateTooltipContent(buildingType);
            tooltip.style.display = 'block';

            const middlePanelRect = middlePanel.getBoundingClientRect();
            const buttonRect = event.target.getBoundingClientRect();

            tooltip.style.left = `${middlePanelRect.right - tooltip.offsetWidth}px`;
            tooltip.style.top = `${event.clientY + window.scrollY -30}px`;
        });

        button.addEventListener('mousemove', function(event) {
            tooltip.style.top = `${event.clientY + window.scrollY - 30}px`;
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