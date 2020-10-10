# Helper functions to delete, manipulate application icon and splash screens,
# as each platform stores those assets in a different way, and we need to make it easy for
# app developers to setup those resources.

import os
import shutil
import sys
import subprocess
from PIL import Image
import ela_util

def exitWithErrorMsg(exitCode, message):
    print("ERROR: "+message)
    sys.exit(exitCode)

def run_cmd(cmd):
    print("Running: " + cmd)
    ret = subprocess.call(cmd, shell=True)
    if ret != 0:
        exitWithErrorMsg(ret, "Command call failed")

def ensureIconSize(iconPath):
    if not os.path.exists(iconPath):
        exitWithErrorMsg(1, "No app icon found at: "+iconPath)

    icon = Image.open(iconPath)
    if icon is None:
        exitWithErrorMsg(1, "Unable to open app icon file as an image at: "+iconPath)

    # Icon must be at least 1024x1024
    if icon.size[0] < 1024 or icon.size[1] < 1024:
        exitWithErrorMsg(1, "App icon size must be at least 1024x1024")

def ensureSplashSize(splashPath):
    if not os.path.exists(splashPath):
        exitWithErrorMsg(1, "No splash screen found at: "+splashPath)

    splash = Image.open(splashPath)
    if splash is None:
        exitWithErrorMsg(1, "Unable to open app splash screen file as an image at: "+splashPath)

    # Splash screen must be at least 2732x2732
    if splash.size[0] < 2732 or splash.size[1] < 2732:
        exitWithErrorMsg(1, "Splash screen size must be at least 2732x2732 (and center the main uncropped content in a 1200x1200 square)")

# From given icon and splash screen paths, ask cordova to generate all resources needed for the main
# app icon and splsh screen, in different sizes, and save them in a temporary folder.
def generateCordovaResources(genFolder):
    print("Generating cordova resources")

    os.chdir(genFolder)
    run_cmd("cordova-res")

def replaceAndroidAppIcons(platformResPath, dirpath, iconPath):
    resDirPath = os.path.join(platformResPath, "app/src/main/res")

    ela_util.safeMkdir(resDirPath+"/"+dirpath)

    ela_util.safeRemove(os.path.join(resDirPath, dirpath+"/ic_launcher_foreground.png"))
    ela_util.safeRemove(os.path.join(resDirPath, dirpath+"/ic_launcher_round.png"))
    shutil.copy(iconPath, os.path.join(resDirPath, dirpath+"/ic_launcher.png"))

def replaceAndroidSplashScreen(platformResPath, dirpath, splashPath):
    resDirPath = os.path.join(platformResPath, "app/src/main/res")

    ela_util.safeMkdir(resDirPath+"/"+dirpath)

    shutil.copy(splashPath, os.path.join(resDirPath, dirpath+"/screen.png"))

def copyGeneratedResourcesToProject(genFolder, runtimeFolder):
    androidPlatformResFolder = os.path.join(runtimeFolder, "platform_res", "android")
    iosPlatformResFolder = os.path.join(runtimeFolder, "platform_res", "ios")
    generatedResFolder = os.path.join(genFolder, "resources")
    androidIconFolder = os.path.join(generatedResFolder, "android", "icon")
    androidSplashFolder = os.path.join(generatedResFolder, "android", "splash")
    iosIconFolder = os.path.join(generatedResFolder, "ios", "icon")
    iosSplashFolder = os.path.join(generatedResFolder, "ios", "splash")
    androidResDirPath = os.path.join(androidPlatformResFolder, "app/src/main/res")

    # Android - Remove v26 folders, we keep only static pngs, not composed drawables for now
    ela_util.safeRemove(os.path.join(androidResDirPath, "mipmap-anydpi-v26"))

    # Android - Keep a copy of ic_launcher_foreground as it's needed by one of the layouts for now...
    ela_util.safeMkdir(os.path.join(androidResDirPath, "mipmap"))
    shutil.copy(androidIconFolder+"/drawable-xxxhdpi-icon.png", os.path.join(androidResDirPath, "mipmap/ic_launcher_foreground.png"))

    # Android app icon
    replaceAndroidAppIcons(androidPlatformResFolder, "mipmap-ldpi", androidIconFolder+"/drawable-ldpi-icon.png")
    replaceAndroidAppIcons(androidPlatformResFolder, "mipmap-mdpi", androidIconFolder+"/drawable-mdpi-icon.png")
    replaceAndroidAppIcons(androidPlatformResFolder, "mipmap-hdpi", androidIconFolder+"/drawable-hdpi-icon.png")
    replaceAndroidAppIcons(androidPlatformResFolder, "mipmap-xhdpi", androidIconFolder+"/drawable-xhdpi-icon.png")
    replaceAndroidAppIcons(androidPlatformResFolder, "mipmap-xxhdpi", androidIconFolder+"/drawable-xxhdpi-icon.png")
    replaceAndroidAppIcons(androidPlatformResFolder, "mipmap-xxxhdpi", androidIconFolder+"/drawable-xxxhdpi-icon.png")

    # Android splash screen
    replaceAndroidSplashScreen(androidPlatformResFolder, "drawable-land-ldpi", androidSplashFolder+"/drawable-land-ldpi-screen.png")
    replaceAndroidSplashScreen(androidPlatformResFolder, "drawable-land-mdpi", androidSplashFolder+"/drawable-land-mdpi-screen.png")
    replaceAndroidSplashScreen(androidPlatformResFolder, "drawable-land-hdpi", androidSplashFolder+"/drawable-land-hdpi-screen.png")
    replaceAndroidSplashScreen(androidPlatformResFolder, "drawable-land-xhdpi", androidSplashFolder+"/drawable-land-xhdpi-screen.png")
    replaceAndroidSplashScreen(androidPlatformResFolder, "drawable-land-xxhdpi", androidSplashFolder+"/drawable-land-xxhdpi-screen.png")
    replaceAndroidSplashScreen(androidPlatformResFolder, "drawable-land-xxxhdpi", androidSplashFolder+"/drawable-land-xxxhdpi-screen.png")
    replaceAndroidSplashScreen(androidPlatformResFolder, "drawable-port-ldpi", androidSplashFolder+"/drawable-port-ldpi-screen.png")
    replaceAndroidSplashScreen(androidPlatformResFolder, "drawable-port-mdpi", androidSplashFolder+"/drawable-port-mdpi-screen.png")
    replaceAndroidSplashScreen(androidPlatformResFolder, "drawable-port-hdpi", androidSplashFolder+"/drawable-port-hdpi-screen.png")
    replaceAndroidSplashScreen(androidPlatformResFolder, "drawable-port-xhdpi", androidSplashFolder+"/drawable-port-xhdpi-screen.png")
    replaceAndroidSplashScreen(androidPlatformResFolder, "drawable-port-xxhdpi", androidSplashFolder+"/drawable-port-xxhdpi-screen.png")
    replaceAndroidSplashScreen(androidPlatformResFolder, "drawable-port-xxxhdpi", androidSplashFolder+"/drawable-port-xxhdpi-screen.png")

    # iOS app icon
    generatedIosAppIcons = os.listdir(iosIconFolder)
    dstAssetsFolder = os.path.join(iosPlatformResFolder, "elastOS", "Images.xcassets", "AppIcon.appiconset")
    for icon in generatedIosAppIcons:
        iconPath = os.path.join(iosIconFolder, icon)
        print("Overwriting ios app icon with user's app icon: "+icon)
        shutil.copy(iconPath, dstAssetsFolder)

    # iOS splash screen
    generatedIosSplashs = os.listdir(iosSplashFolder)
    dstAssetsFolder = os.path.join(iosPlatformResFolder, "elastOS", "Images.xcassets", "LaunchImage.launchimage")
    for splash in generatedIosSplashs:
        splashPath = os.path.join(iosSplashFolder, splash)
        print("Overwriting ios splash screen with user's splash image: "+splash)
        shutil.copy(splashPath, dstAssetsFolder)

    # TODO - desktop

# - Check user's app icon and splash images size and format requirements
# - Ask cordova to generate the resources
# - Copy the generated resources to the right projects locations
def buildAppIconAndSplashScreen(iconPath, splashPath, genFolder, runtimeFolder):
    print("Generating app icon and splash screen")

    # Ensure the given assets are usable
    ensureIconSize(iconPath)
    ensureSplashSize(splashPath)

    # Get our target work folder ready
    ela_util.safeMkdir(genFolder)
    ela_util.safeMkdir(genFolder+"/resources")

    # Copy source resources to resources/icon.png and resources/splash.png
    shutil.copy(iconPath, os.path.join(genFolder, "resources/icon.png"))
    shutil.copy(splashPath, os.path.join(genFolder, "resources/splash.png"))

    generateCordovaResources(genFolder)

    copyGeneratedResourcesToProject(genFolder, runtimeFolder)