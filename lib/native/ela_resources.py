# Helper functions to delete, manipulate application icon and splash screens,
# as each platform stores those assets in a different way, and we need to make it easy for
# app developers to setup those resources.

import os
import shutil

def safeRemove(path):
    if not os.path.exists(path):
        return
    os.remove(path)

def removeAndroidLauncherAppIconsInFolder(platformResPath, dirpath):
    resDirPath = os.path.join(platformResPath, "app/src/main/res")

    safeRemove(os.path.join(resDirPath, dirpath+"/ic_launcher_foreground.png"))
    safeRemove(os.path.join(resDirPath, dirpath+"/ic_launcher_round.png"))
    safeRemove(os.path.join(resDirPath, dirpath+"/ic_launcher.png"))

# Removes all default elastOS app icons and replaces them with ionic dapp icon.
def deployAndroidAppIcon(iconPath, platformResPath):
    print("Deploying dapp icon to android resources")

    resDirPath = os.path.join(platformResPath, "app/src/main/res")

    # TODO: make sure app icon is a PNG file

    # Keep a copy of ic_launcher_foreground as it's neede by one of the layout...
    os.mkdir(os.path.join(resDirPath, "mipmap"))
    shutil.copy(os.path.join(resDirPath, "mipmap-xxxhdpi/ic_launcher_foreground.png"), os.path.join(resDirPath, "mipmap/ic_launcher_foreground.png"))

    # Delete all mipmap app icons
    safeRemove(os.path.join(resDirPath, "mipmap-anydpi-v26/ic_launcher_round.xml"))
    safeRemove(os.path.join(resDirPath, "mipmap-anydpi-v26/ic_launcher.xml"))

    removeAndroidLauncherAppIconsInFolder(platformResPath, "mipmap-hdpi")
    removeAndroidLauncherAppIconsInFolder(platformResPath, "mipmap-ldpi")
    removeAndroidLauncherAppIconsInFolder(platformResPath, "mipmap-mdpi")
    removeAndroidLauncherAppIconsInFolder(platformResPath, "mipmap-xhdpi")
    removeAndroidLauncherAppIconsInFolder(platformResPath, "mipmap-xxhdpi")
    removeAndroidLauncherAppIconsInFolder(platformResPath, "mipmap-xxxhdpi")

    # Copy ionic dapp icon to android resources as ic_launcher
    shutil.copy(iconPath, os.path.join(resDirPath, "drawable-nodpi/ic_launcher.png"))

