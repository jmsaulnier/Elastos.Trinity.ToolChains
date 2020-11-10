const path = require("path")
require("colors")

const RunHelper = require("../helpers/run.helper")
const ManifestHelper = require("../helpers/manifest.helper")
const IonicHelper = require("../helpers/ionic.helper")
const DAppHelper = require("../helpers/dapp.helper")
const SystemHelper = require("../helpers/system.helper")

exports.command = 'run'
exports.describe = 'Deploys current DApp to your connected device'
exports.builder = {
  platform: {
    alias: "p",
    describe: "Platform to deploy to (android|ios|desktop)",
    require: true
  },
  nodebug: {
      // Let the app be deployed without ionic serve. This way, manifest is not modified and will call
      // a local index.html (on device) instead of a remote IP served by ionic. This way, apps can be
      // running on the device without computer dependency (but loose debugging capability).
      describe: "Deploy the DApp without remote url access, auto-reload or debugging capability",
      require: false,
      nargs: 0
  },
  prod: {
    // Build the app with ionic's --prod flag (production mode). Useful to totally test apps before
    // publishing as there maybe be some slight difference with dev mode.
    describe: "Build the app for production in order to fully test its behaviour before publishing it.",
    require: false,
    nargs: 0
  },
  localmdns: {
    describe: "Forces the iOS bonjour service (dAPP installation) to run only on localhost to solve iOS mDNS resolving issues in some cases"
  },
  device: {
    describe: "Identifier of the device to which the app should be deployed. Use this option in case several devices are connected on the computer (android)"
  }
}
exports.handler = function (argv) {
    var platform = argv.platform
    var noDebug = argv.nodebug
    var forProd = argv.prod || false
    var localMDNS = argv.localmdns || false
    var device = argv.device

    if (forProd)
        console.log("Building for production")

    switch (platform) {
        case "android":
            deployAndroidDApp(noDebug, forProd, device)
            break;
        case "ios":
        case "desktop":
            // Desktop currently uses the same process as iOS, with a generic bonjour service
            deployiOSDApp(noDebug, forProd, localMDNS)
            break;
        default:
            console.log("ERROR - Not a valid platform")
    }
}

/**
 * Shared steps between android and ios deployments.
 */
async function runSharedDeploymentPhase(noDebug, forProd) {
    var dappHelper = new DAppHelper()
    var manifestHelper = new ManifestHelper()
    var ionicHelper = new IonicHelper   ()

    if (!dappHelper.checkFolderIsDApp()) {
        console.error("ERROR".red + " - " + dappHelper.noManifestErrorMessage())
        return
    }

    // Retrieve user's computer IP (to be able to ionic serve / hot reload)
    // Update the start_url in the trinity manifest
    //
    // Clone the original manifest into a temporary manifest so that we don't touch user's original manifest.
    var ipAddress = await manifestHelper.promptIpAddressToUse();
    var originalManifestPath = manifestHelper.getManifestPath(ionicHelper.getConfig().assets_path)
    var temporaryManifestPath = manifestHelper.cloneToTemporaryManifest(originalManifestPath)
    if (noDebug)
        manifestHelper.updateManifestForLocalIndex(temporaryManifestPath)
    else
        await manifestHelper.updateManifestForRemoteIndex(temporaryManifestPath, ipAddress)

    return new Promise((resolve, reject)=>{
        ionicHelper.updateNpmDependencies().then(() => {
            ionicHelper.runIonicBuild(forProd).then(() => {
                dappHelper.packEPK(temporaryManifestPath).then((outputEPKPath)=>{
                    resolve({
                        outputEPKPath: outputEPKPath,
                        ipAddress: ipAddress
                    })
                })
                .catch((err)=>{
                    console.error("Failed to pack your DApp into a EPK file".red)
                    reject(err)
                })
            })
            .catch((err)=>{
                console.error("Failed run ionic build".red)
                reject(err)
            })
        })
        .catch((err)=>{
            console.error("Failed to install ionic dependencies".red)
            reject(err)
        })
    })
}

/**
 * The process to run one of our ionic-based DApps on android is as following:
 *
 * - Retrieve user's computer IP (to be able to ionic serve / hot reload)
 * - Update the start_url in the trinity manifest
 * - npm install
 * - ionic build
 * - sign_epk
 * - push and run the EPK on the device (adb push/shell am start, on android)
 * - ionic serve (for hot reload inside trinity, when user saves his files)
 */
async function deployAndroidDApp(noDebug, forProd, device) {
    var runHelper = new RunHelper()
    var ionicHelper = new IonicHelper()

    // Make sure mandatory dependencies are available
    if (!SystemHelper.checkIonicPresence()) {
        console.error("Error:".red, "Please first install IONIC on your computer.")
        return
    }
    if (!SystemHelper.checkADBPresence()) {
        console.error("Error:".red, "Please first install Android tools (especially ADB) on your computer.")
        return
    }
    if (!SystemHelper.checkPythonPresence()) {
        console.error("Error:".red, "Please first install Python on your computer.")
        return
    }

    let devices = await runHelper.androidGetADBDevicesList();
    if (device) {
        // The developer told us which device he wants to use. Let's check that this device actually exists.
        if (devices.indexOf(device) < 0) {
            console.error("Error:".red, "The specified device ID was not found. Available devices:", devices);
            return;
        }
    }
    else {
        if (devices.length > 1) {
            // More than one device: prompt user to tell us the device name
            console.error("Error:".red, "Please specify which device you want to deploy your app to using the --device 'yourdevice' option. Available devices:", devices);
            return;
        }
    }

    //let outputEPKPath = "/var/folders/d2/nw213ddn1c7g6_zcp5940ckw0000gn/T/temp.epk"
    runSharedDeploymentPhase(noDebug, forProd).then((sharedInfo)=>{
        runHelper.androidUploadEPK(sharedInfo.outputEPKPath, device).then(()=>{
            runHelper.androidInstallTempEPK(device).then(()=>{
                console.log("RUN OPERATION COMPLETED".green)

                if (!noDebug) {
                    console.log("NOW RUNNING THE APP FOR DEVELOPMENT".green)
                    console.log("Please wait until the ionic server is started before launching your DApp on your device.".magenta)
                    ionicHelper.runIonicServe()
                }
            })
            .catch((err)=>{
                console.error("Failed to install your DApp on your device".red)
                console.error("Error:",err)
            })
        })
        .catch((err)=>{
            console.error("Failed to upload your DApp to your device".red)
            console.error("Error:",err)
        })
    })
}

/**
 * The process to run one of our ionic-based DApps on iOS devices is as following:
 *
 * - Retrieve user's computer IP (to be able to ionic serve / hot reload)
 * - Update the start_url in the trinity manifest
 * - npm install
 * - ionic build
 * - pack_epk
 * - sign_epk
 * - run a bonjour + http service and wait for native app to download the EPK
 * - ionic serve (for hot reload inside trinity, when user saves his files)
 */
async function deployiOSDApp(noDebug, forProd, localMDNS) {
    var runHelper = new RunHelper()
    var ionicHelper = new IonicHelper()

    // Make sure mandatory dependencies are available
    if (!SystemHelper.checkIonicPresence()) {
        console.error("Error:".red, "Please first install IONIC on your computer.")
        return
    }
    if (!SystemHelper.checkPythonPresence()) {
        console.error("Error:".red, "Please first install Python on your computer.")
        return
    }

    //let outputEPKPath = "/var/folders/d2/nw213ddn1c7g6_zcp5940ckw0000gn/T/temp.epk"
    runSharedDeploymentPhase(noDebug, forProd).then((sharedInfo)=>{
        runHelper.runDownloadService(sharedInfo.outputEPKPath, sharedInfo.ipAddress, localMDNS).then(()=>{
            console.log("RUN OPERATION COMPLETED".green)

            if (!noDebug) {
                console.log("NOW RUNNING THE APP FOR DEVELOPMENT".green)
                console.log("Please wait until the ionic server is started before launching your DApp on your device.".magenta)
                ionicHelper.runIonicServe()
            }
            else {
                // Manually exit to force close bonjour and express...
                process.exit(0)
            }
        })
        .catch((err)=>{
            console.error("Failed to upload your DApp to your device".red)
            console.error("Error:",err)
        })
    })
}