const path = require("path")
const os = require("os")
const fs = require("fs")
require("colors")

const DAppHelper = require("./dapp.helper")

module.exports = class RunHelper {
    /**
     * Gets a readable format from "adb devices". Used to prompt user to choose a device in case more
     * than one are connected.
     */
    androidGetADBDevicesList() {
        return new Promise((resolve, reject)=>{
            const spawn = require("child_process").spawn;
            const adbProcess = spawn('adb',["devices"]);

            let output = "";
            let devices = [];

            adbProcess.stdout.on('data', function (data) { output += data; });
            adbProcess.stderr.on('data', function (data) { output += data; });
            adbProcess.on('error', function(err) { reject(err)})

            adbProcess.on('exit', function (code) {
                if (code == 0) {
                    // Operation completed successfully - parse output to generate the devices list
                    let lines = output.split("\n");
                    for (let line of lines) {
                        if (line.endsWith("device")) {
                            let words = line.split("\t");
                            if (words.length > 0)
                                devices.push(words[0]);
                        }
                    }

                    resolve(devices);
                }
                else {
                    console.log('ERROR - failed to get ADB devices list - error code: ' + code);
                    reject()
                }
            });
        });
    }

    /**
     * Uploads a given EPK file to a connected android device, to a temporary location.
     */
    androidUploadEPK(EPKPath, device) {
        return new Promise((resolve, reject) => {
            console.log("Trying to upload the EPK file to a connected android device...")

            var destinationPath = "/sdcard/temp.epk";

            const spawn = require("child_process").spawn;

            let adbOptions = [];
            if (device) {
                // Device must be specified to adb
                adbOptions.push("-s");
                adbOptions.push(device);
            }
            adbOptions.push("push");
            adbOptions.push(EPKPath);
            adbOptions.push(destinationPath);

            const adbProcess = spawn('adb', adbOptions);

            adbProcess.stdout.on('data', function (data) { console.log(''+data)});
            adbProcess.stderr.on('data', function (data) { console.log(''+data)});
            adbProcess.on('error', function(err) { reject(err)})

            adbProcess.on('exit', function (code) {
                if (code == 0) {
                    // Operation completed successfully
                    console.log("EPK file successfully pushed on your android device at "+destinationPath)
                    resolve()
                }
                else {
                    console.log('ERROR - child process exited with code ' + code);
                    reject()
                }
            });
        })
    }

    /**
     * Request the trinity application to open a EPK file that was previously pushed to the device.
     * That may install that EPK inside trinity.
     */
    androidInstallTempEPK(device, wipeStorage) {
        return new Promise((resolve, reject) => {
            console.log("Requesting your trinity application to install your DApp...")

            // Sample command: adb shell am start -a android.intent.action.VIEW -d file:///storage/emulated/0/temp.epk -t *.epk
            const spawn = require("child_process").spawn;

            let adbOptions = [];
            if (device) {
                // Device must be specified to adb
                adbOptions.push("-s");
                adbOptions.push(device);
            }
            adbOptions.push("shell");
            adbOptions.push("am");
            adbOptions.push("start");
            adbOptions.push("-a");
            adbOptions.push("android.intent.action.VIEW");
            adbOptions.push("-d");
            adbOptions.push("file:///storage/emulated/0/temp.epk");
            adbOptions.push("-t");
            adbOptions.push("*.epk");
            adbOptions.push("-c");
            adbOptions.push("android.intent.category.TEST");

            if (wipeStorage) {
                adbOptions.push("-e");
                adbOptions.push("wipestorage");
                adbOptions.push("wipe");
            }

            const adbProcess = spawn('adb', adbOptions);

            adbProcess.stdout.on('data', function (data) { console.log(''+data)});
            adbProcess.stderr.on('data', function (data) { console.log(''+data)});
            adbProcess.on('error', function(err) { reject(err)})

            adbProcess.on('exit', function (code) {
                if (code == 0) {
                    // Operation completed successfully
                    console.log("Trinity has received your DApp. Please check your device for further instruction")
                    resolve()
                }
                else {
                    console.log('ERROR - child process exited with code ' + code);
                    reject()
                }
            });
        })
    }

    /**
     * Tries to find a running ios simulator and returns its info (mostly, its udid).
     */
    getRunningSimulatorInfo() {
        return new Promise((resolve, reject)=>{
            console.log("Retrieving information about the currently running ios simulator.")

            const spawn = require("child_process").spawn;
            const process = spawn('xcrun',["simctl","list","devices","booted","--json"]);

            let output = ""

            process.stdout.on('data', function (data) { output += data });
            process.stderr.on('data', function (data) { console.log(''+data)});
            process.on('error', function(err) { reject(err)})

            process.on('exit', function (code) {
                if (code == 0) {
                    try {
                        // Parse returned json and try to find a started iOS simulator
                        let infoJson = JSON.parse(output)
                        if (!infoJson || !infoJson.devices) {
                            reject("No device information foudn in simctl")
                        }
                        else {
                            // Try to find a "ios" device in the list of returned devices
                            // Looking for something like "com.apple.CoreSimulator.SimRuntime.iOS-13-3"
                            let iosDevice = null
                            for (let deviceKey of Object.keys(infoJson.devices)) {
                                if (deviceKey.indexOf("iOS") > 0) {
                                    // Found the ios device - now check if an instance is running
                                    if (infoJson.devices[deviceKey].length > 0) {
                                        iosDevice = infoJson.devices[deviceKey][0]
                                        console.log("Found a running ios simulator: "+deviceKey)
                                        console.log(iosDevice)
                                        break
                                    }
                                    else {
                                        // Found the device ID, but no instance is running - keep searching
                                    }
                                }
                            }

                            if (iosDevice)
                                resolve(iosDevice)
                            else
                                reject("No running iOS simulator found")
                        }
                    }
                    catch (e) {
                        console.log('ERROR - Failed to get a readable response from simctl')
                        reject(e)
                    }
                }
                else {
                    console.log('ERROR - child process exited with code ' + code);
                    reject()
                }
            });
        })
    }

    /**
     * Uploads a EPK file from the computer to the internal trinity app folder on simulator, at a location
     * that trinity will be able to read to install the EPK.
     */
    iosUploadEPK(epkPath) {
        return new Promise((resolve, reject)=>{
            console.log("Uploading computer EPK to simulator.")

            // First, find the trinity folder location
            const spawn = require("child_process").spawn;
            const process = spawn('xcrun',["simctl","get_app_container","booted","org.elastos.trinity.browser","data"]);

            let output = ""

            process.stdout.on('data', function (data) { output += data });
            process.stderr.on('data', function (data) { console.log(''+data)});
            process.on('error', function(err) { reject(err)})

            process.on('exit', function (code) {
                if (code == 0) {
                    // Make sure the output is a full path that exists
                    let appDataPath = output.replace("\n","").replace("\r","").trim()
                    if (fs.existsSync(appDataPath)) {
                        // Copy the epk inside the simulator folder
                        let epkDestPath = appDataPath+"/temp.epk"
                        fs.copyFileSync(epkPath, epkDestPath)
                        resolve()
                    }
                    else {
                        reject("Simulator path to the trinity app looks invalid. Is Trinity installed in the simulator?")
                    }
                }
                else {
                    console.log('ERROR - child process exited with code ' + code);
                    reject()
                }
            });
        })
    }

    /**
     * Sends a command to the ios simulator's installed trinity app, in order to let it install our epk
     */
    iosInstallTempEPK() {
        return new Promise((resolve, reject)=>{
            console.log("Requesting EPK installation to the simulator.")

            let urlToOpen = "elastos://installepk"

            const spawn = require("child_process").spawn;
            const process = spawn('xcrun',["simctl","openurl","booted",urlToOpen]);

            process.stdout.on('data', function (data) { console.log(''+data) });
            process.stderr.on('data', function (data) { console.log(''+data) });
            process.on('error', function(err) { reject(err)})

            process.on('exit', function (code) {
                if (code == 0) {
                    resolve()
                }
                else {
                    console.log('ERROR - child process exited with code ' + code);
                    reject()
                }
            });
        })
    }

    runDownloadService(epkPath, ipAddress, localMDNS, wipeStorage) {
        return new Promise((resolve, reject)=>{
            var server;
            let port = 3000

            // Start a bonjour service to be found by the ios device.
            const bonjour = require('bonjour')()

            // Run a temporary http server
            var express = require('express')
            var app = express()

            // Returns information/options for this download progress.
            app.get('/downloadinfo', (req, res) => {
                res.json({
                    wipeAppData: wipeStorage
                });
            })

            // Returns the EPK file as binary content
            app.get('/downloadepk', (req, res) => {
                res.sendFile(epkPath, {}, (err)=>{
                    if (err) {
                        console.log("There was an error while delivering the EPK to elastOS.".red)
                        reject(err)
                        return
                    }
                    else
                        console.log("The EPK file was downloaded by elastOS.".green)

                    // Stop the servers right after the download is completed, and resolve.
                    server.close()
                    bonjour.unpublishAll()

                    resolve()
                })
            })
            server = app.listen(port)

            // Advertise a trinitycli HTTP server
            let serviceOptions = {
                name: 'trinitycli',
                type: 'trinitycli',
                port: port
            };

            // "Local service" not set, so we let the service run on a network IP address, not on
            // localhost (default if setting no "host")
            if (!localMDNS) {
                serviceOptions.host = ipAddress;
                console.log("Publishing Bonjour service 'trinitycli', host: "+ipAddress+", port: "+serviceOptions.port);
            }
            else {
                console.log("Publishing Bonjour service 'trinitycli', host: localhost, port: "+serviceOptions.port);
            }

            bonjour.publish(serviceOptions)

            console.log("Waiting for elastOS to download the dApp.".blue);
            console.log("");
            console.log("NOTE:".gray);
            console.log("If for any reason after enabling developer mode in elastOS, having");
            console.log("your device on the same wifi and turning VPN off, the dApp still can't be found");
            console.log("by elastOS after more than 5 seconds, please use a simulator instead of a real iOS device,");
            console.log("and run this command again with the --localmdns option.");
            console.log("");
        })
    }
}