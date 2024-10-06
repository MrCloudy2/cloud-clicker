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
    if (timeElapsed >= 60000) {
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

function formatLargeNumber (num) {
    if (num >= 1e303) return removeTrailingZeros((num / 1e303).toFixed(2)) + ' Centillion';
    if (num >= 1e300) return removeTrailingZeros((num / 1e300).toFixed(2)) + ' Novemnonagintillion';
    if (num >= 1e297) return removeTrailingZeros((num / 1e297).toFixed(2)) + ' Octononagintillion';
    if (num >= 1e294) return removeTrailingZeros((num / 1e294).toFixed(2)) + ' Septennonagintillion';
    if (num >= 1e291) return removeTrailingZeros((num / 1e291).toFixed(2)) + ' Senonagintillion';
    if (num >= 1e288) return removeTrailingZeros((num / 1e288).toFixed(2)) + ' Quinnonagintillion';
    if (num >= 1e285) return removeTrailingZeros((num / 1e285).toFixed(2)) + ' Quattuornonagintillion';
    if (num >= 1e282) return removeTrailingZeros((num / 1e282).toFixed(2)) + ' Trenonagintillion';
    if (num >= 1e279) return removeTrailingZeros((num / 1e279).toFixed(2)) + ' Duononagintillion';
    if (num >= 1e276) return removeTrailingZeros((num / 1e276).toFixed(2)) + ' Unnonagintillion';
    if (num >= 1e273) return removeTrailingZeros((num / 1e273).toFixed(2)) + ' Nonagintillion';
    if (num >= 1e270) return removeTrailingZeros((num / 1e270).toFixed(2)) + ' Novemoctogintillion';
    if (num >= 1e267) return removeTrailingZeros((num / 1e267).toFixed(2)) + ' Octooctogintillion';
    if (num >= 1e264) return removeTrailingZeros((num / 1e264).toFixed(2)) + ' Septenoctogintillion';
    if (num >= 1e261) return removeTrailingZeros((num / 1e261).toFixed(2)) + ' Sexoctogintillion';
    if (num >= 1e258) return removeTrailingZeros((num / 1e258).toFixed(2)) + ' Quinoctogintillion';
    if (num >= 1e255) return removeTrailingZeros((num / 1e255).toFixed(2)) + ' Quattuoroctogintillion';
    if (num >= 1e252) return removeTrailingZeros((num / 1e252).toFixed(2)) + ' Tresoctogintillion';
    if (num >= 1e249) return removeTrailingZeros((num / 1e249).toFixed(2)) + ' Duooctogintillion';
    if (num >= 1e246) return removeTrailingZeros((num / 1e246).toFixed(2)) + ' Unoctogintillion';
    if (num >= 1e243) return removeTrailingZeros((num / 1e243).toFixed(2)) + ' Octogintillion';
    if (num >= 1e240) return removeTrailingZeros((num / 1e240).toFixed(2)) + ' Novemseptuagintillion';
    if (num >= 1e237) return removeTrailingZeros((num / 1e237).toFixed(2)) + ' Octoseptuagintillion';
    if (num >= 1e234) return removeTrailingZeros((num / 1e234).toFixed(2)) + ' Septenseptuagintillion';
    if (num >= 1e231) return removeTrailingZeros((num / 1e231).toFixed(2)) + ' Sexseptuagintillion';
    if (num >= 1e228) return removeTrailingZeros((num / 1e228).toFixed(2)) + ' Quinseptuagintillion';
    if (num >= 1e225) return removeTrailingZeros((num / 1e225).toFixed(2)) + ' Quattuorseptuagintillion';
    if (num >= 1e222) return removeTrailingZeros((num / 1e222).toFixed(2)) + ' Treseptuagintillion';
    if (num >= 1e219) return removeTrailingZeros((num / 1e219).toFixed(2)) + ' Duoseptuagintillion';
    if (num >= 1e216) return removeTrailingZeros((num / 1e216).toFixed(2)) + ' Unseptuagintillion';
    if (num >= 1e213) return removeTrailingZeros((num / 1e213).toFixed(2)) + ' Septuagintillion';
    if (num >= 1e210) return removeTrailingZeros((num / 1e210).toFixed(2)) + ' Novemsexagintillion';
    if (num >= 1e207) return removeTrailingZeros((num / 1e207).toFixed(2)) + ' Octosexagintillion';
    if (num >= 1e204) return removeTrailingZeros((num / 1e204).toFixed(2)) + ' Septensexagintillion';
    if (num >= 1e201) return removeTrailingZeros((num / 1e201).toFixed(2)) + ' Sextosexagintillion';
    if (num >= 1e198) return removeTrailingZeros((num / 1e198).toFixed(2)) + ' Quinsexagintillion';
    if (num >= 1e195) return removeTrailingZeros((num / 1e195).toFixed(2)) + ' Quattuorsexagintillion';
    if (num >= 1e192) return removeTrailingZeros((num / 1e192).toFixed(2)) + ' Tresexagintillion';
    if (num >= 1e189) return removeTrailingZeros((num / 1e189).toFixed(2)) + ' Duosexagintillion';
    if (num >= 1e186) return removeTrailingZeros((num / 1e186).toFixed(2)) + ' Unsexagintillion';
    if (num >= 1e183) return removeTrailingZeros((num / 1e183).toFixed(2)) + ' Sexagintillion';
    if (num >= 1e180) return removeTrailingZeros((num / 1e180).toFixed(2)) + ' Novemquinquagintillion';
    if (num >= 1e177) return removeTrailingZeros((num / 1e177).toFixed(2)) + ' Octoquinquagintillion';
    if (num >= 1e174) return removeTrailingZeros((num / 1e174).toFixed(2)) + ' Septenquinquagintillion';
    if (num >= 1e171) return removeTrailingZeros((num / 1e171).toFixed(2)) + ' Sextoquinquagintillion';
    if (num >= 1e168) return removeTrailingZeros((num / 1e168).toFixed(2)) + ' Quinquinquagintillion';
    if (num >= 1e165) return removeTrailingZeros((num / 1e165).toFixed(2)) + ' Quattuorquinquagintillion';
    if (num >= 1e162) return removeTrailingZeros((num / 1e162).toFixed(2)) + ' Trequinquagintillion';
    if (num >= 1e159) return removeTrailingZeros((num / 1e159).toFixed(2)) + ' Duoquinquagintillion';
    if (num >= 1e156) return removeTrailingZeros((num / 1e156).toFixed(2)) + ' Unquinquagintillion';
    if (num >= 1e153) return removeTrailingZeros((num / 1e153).toFixed(2)) + ' Quinquagintillion';
    if (num >= 1e150) return removeTrailingZeros((num / 1e150).toFixed(2)) + ' Novemquadragintillion';
    if (num >= 1e147) return removeTrailingZeros((num / 1e147).toFixed(2)) + ' Octoquadragintillion';
    if (num >= 1e144) return removeTrailingZeros((num / 1e144).toFixed(2)) + ' Septenquadragintillion';
    if (num >= 1e141) return removeTrailingZeros((num / 1e141).toFixed(2)) + ' Sexquadragintillion';
    if (num >= 1e138) return removeTrailingZeros((num / 1e138).toFixed(2)) + ' Quinquadragintillion';
    if (num >= 1e135) return removeTrailingZeros((num / 1e135).toFixed(2)) + ' Quattuorquadragintillion';
    if (num >= 1e132) return removeTrailingZeros((num / 1e132).toFixed(2)) + ' Tresquadragintillion';
    if (num >= 1e129) return removeTrailingZeros((num / 1e129).toFixed(2)) + ' Duoquadragintillion';
    if (num >= 1e126) return removeTrailingZeros((num / 1e126).toFixed(2)) + ' Unquadragintillion';
    if (num >= 1e123) return removeTrailingZeros((num / 1e123).toFixed(2)) + ' Quadragintillion';
    if (num >= 1e120) return removeTrailingZeros((num / 1e120).toFixed(2)) + ' Novemtrigintillion';
    if (num >= 1e117) return removeTrailingZeros((num / 1e117).toFixed(2)) + ' Octotrigintillion';
    if (num >= 1e114) return removeTrailingZeros((num / 1e114).toFixed(2)) + ' Septentrigintillion';
    if (num >= 1e111) return removeTrailingZeros((num / 1e111).toFixed(2)) + ' Sextrigintillion';
    if (num >= 1e108) return removeTrailingZeros((num / 1e108).toFixed(2)) + ' Quintrigintillion';
    if (num >= 1e105) return removeTrailingZeros((num / 1e105).toFixed(2)) + ' Quattuortrigintillion';
    if (num >= 1e102) return removeTrailingZeros((num / 1e102).toFixed(2)) + ' Trestrigintillion';
    if (num >= 1e99) return removeTrailingZeros((num / 1e99).toFixed(2)) + ' Duotrigintillion';
    if (num >= 1e96) return removeTrailingZeros((num / 1e96).toFixed(2)) + ' Untrigintillion';
    if (num >= 1e93) return removeTrailingZeros((num / 1e93).toFixed(2)) + ' Trigintillion';
    if (num >= 1e90) return removeTrailingZeros((num / 1e90).toFixed(2)) + ' Novemvigintillion';
    if (num >= 1e87) return removeTrailingZeros((num / 1e87).toFixed(2)) + ' Octovigintillion';
    if (num >= 1e84) return removeTrailingZeros((num / 1e84).toFixed(2)) + ' Septenvigintillion';
    if (num >= 1e81) return removeTrailingZeros((num / 1e81).toFixed(2)) + ' Sexvigintillion';
    if (num >= 1e78) return removeTrailingZeros((num / 1e78).toFixed(2)) + ' Quinvigintillion';
    if (num >= 1e75) return removeTrailingZeros((num / 1e75).toFixed(2)) + ' Quattuorvigintillion';
    if (num >= 1e72) return removeTrailingZeros((num / 1e72).toFixed(2)) + ' Tresvigintillion';
    if (num >= 1e69) return removeTrailingZeros((num / 1e69).toFixed(2)) + ' Duovigintillion';
    if (num >= 1e66) return removeTrailingZeros((num / 1e66).toFixed(2)) + ' Unvigintillion';
    if (num >= 1e63) return removeTrailingZeros((num / 1e63).toFixed(2)) + ' Vigintillion';
    if (num >= 1e60) return removeTrailingZeros((num / 1e60).toFixed(2)) + ' Novemdecillion';
    if (num >= 1e57) return removeTrailingZeros((num / 1e57).toFixed(2)) + ' Octodecillion';
    if (num >= 1e54) return removeTrailingZeros((num / 1e54).toFixed(2)) + ' Septendecillion';
    if (num >= 1e51) return removeTrailingZeros((num / 1e51).toFixed(2)) + ' Sedecillion';
    if (num >= 1e48) return removeTrailingZeros((num / 1e48).toFixed(2)) + ' Quindecillion';
    if (num >= 1e45) return removeTrailingZeros((num / 1e45).toFixed(2)) + ' Quattuordecillion';
    if (num >= 1e42) return removeTrailingZeros((num / 1e42).toFixed(2)) + ' Tredecilion';
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