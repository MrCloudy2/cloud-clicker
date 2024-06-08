let cloudCount = 0;
let cursors = 0;
let cursorCost = 10;
let factories = 0;
let factoryCost = 100;
let cloudGenerators = 0;
let cloudGeneratorCost = 500;
let weatherMachines = 0;
let weatherMachineCost = 2000;
let stormStations = 0;
let stormStationCost = 10000;
let atmosphereManipulators = 0;
let atmosphereManipulatorCost = 50000;
let climateControllers = 0;
let climateControllerCost = 200000;

function updateCPS() {
    const cursorCPS = cursors;
    const factoryCPS = factories * 5;
    const cloudGeneratorCPS = cloudGenerators * 20;
    const weatherMachineCPS = weatherMachines * 50;
    const stormStationCPS = stormStations * 100;
    const atmosphereManipulatorCPS = atmosphereManipulators * 200;
    const climateControllerCPS = climateControllers * 500;

    const totalCPS = cursorCPS + factoryCPS + cloudGeneratorCPS + weatherMachineCPS + stormStationCPS + atmosphereManipulatorCPS + climateControllerCPS;

    document.getElementById('cloudsPerSecond').innerText = totalCPS;
    document.getElementById('cursorCPS').innerText = cursorCPS;
    document.getElementById('factoryCPS').innerText = factoryCPS;
    document.getElementById('cloudGeneratorCPS').innerText = cloudGeneratorCPS;
    document.getElementById('weatherMachineCPS').innerText = weatherMachineCPS;
    document.getElementById('stormStationCPS').innerText = stormStationCPS;
    document.getElementById('atmosphereManipulatorCPS').innerText = atmosphereManipulatorCPS;
    document.getElementById('climateControllerCPS').innerText = climateControllerCPS;
}

function clickCloud() {
    cloudCount++;
    document.getElementById('cloudCount').innerText = cloudCount;
}

function buyCursor() {
    if (cloudCount >= cursorCost) {
        cloudCount -= cursorCost;
        cursors++;
        cursorCost = Math.round(cursorCost * 1.15);
        document.getElementById('cloudCount').innerText = cloudCount;
        document.getElementById('cursorCount').innerText = cursors;
        document.getElementById('cursorCost').innerText = cursorCost;
        updateCPS();
    }
}

function buyFactory() {
    if (cloudCount >= factoryCost) {
        cloudCount -= factoryCost;
        factories++;
        factoryCost = Math.round(factoryCost * 1.15);
        document.getElementById('cloudCount').innerText = cloudCount;
        document.getElementById('factoryCount').innerText = factories;
        document.getElementById('factoryCost').innerText = factoryCost;
        updateCPS();
    }
}

function buyCloudGenerator() {
    if (cloudCount >= cloudGeneratorCost) {
        cloudCount -= cloudGeneratorCost;
        cloudGenerators++;
        cloudGeneratorCost = Math.round(cloudGeneratorCost * 1.15);
        document.getElementById('cloudCount').innerText = cloudCount;
        document.getElementById('cloudGeneratorCount').innerText = cloudGenerators;
        document.getElementById('cloudGeneratorCost').innerText = cloudGeneratorCost;
        updateCPS();
    }
}

function buyWeatherMachine() {
    if (cloudCount >= weatherMachineCost) {
        cloudCount -= weatherMachineCost;
        weatherMachines++;
        weatherMachineCost = Math.round(weatherMachineCost * 1.15);
        document.getElementById('cloudCount').innerText = cloudCount;
        document.getElementById('weatherMachineCount').innerText = weatherMachines;
        document.getElementById('weatherMachineCost').innerText = weatherMachineCost;
        updateCPS();
    }
}

function buyStormStation() {
    if (cloudCount >= stormStationCost) {
        cloudCount -= stormStationCost;
        stormStations++;
        stormStationCost = Math.round(stormStationCost * 1.15);
        document.getElementById('cloudCount').innerText = cloudCount;
        document.getElementById('stormStationCount').innerText = stormStations;
        document.getElementById('stormStationCost').innerText = stormStationCost;
        updateCPS();
    }
}

function buyAtmosphereManipulator() {
    if (cloudCount >= atmosphereManipulatorCost) {
        cloudCount -= atmosphereManipulatorCost;
        atmosphereManipulators++;
        atmosphereManipulatorCost = Math.round(atmosphereManipulatorCost * 1.15);
        document.getElementById('cloudCount').innerText = cloudCount;
        document.getElementById('atmosphereManipulatorCount').innerText = atmosphereManipulators;
        document.getElementById('atmosphereManipulatorCost').innerText = atmosphereManipulatorCost;
        updateCPS();
    }
}

function buyClimateController() {
    if (cloudCount >= climateControllerCost) {
        cloudCount -= climateControllerCost;
        climateControllers++;
        climateControllerCost = Math.round(climateControllerCost * 1.15);
        document.getElementById('cloudCount').innerText = cloudCount;
        document.getElementById('climateControllerCount').innerText = climateControllers;
        document.getElementById('climateControllerCost').innerText = climateControllerCost;
        updateCPS();
    }
}

setInterval(function() {
    cloudCount += cursors;
    cloudCount += factories * 5; // Factories produce 5 clouds per second
    cloudCount += cloudGenerators * 20; // Cloud Generators produce 20 clouds per second
    cloudCount += weatherMachines * 50; // Weather Machines produce 50 clouds per second
    cloudCount += stormStations * 100; // Storm Stations produce 100 clouds per second
    cloudCount += atmosphereManipulators * 200; // Atmosphere Manipulators produce 200 clouds per second
    cloudCount += climateControllers * 500; // Climate Controllers produce 500 clouds per second
    document.getElementById('cloudCount').innerText = cloudCount;
}, 1000);
