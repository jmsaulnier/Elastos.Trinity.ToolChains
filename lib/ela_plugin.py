import os
import sys
import subprocess
from xml.dom import minidom
import shutil

SCRIPT_PATH=os.path.realpath(__file__)
TOOLCHAINS_DIR_PATH=os.path.dirname(os.path.dirname(SCRIPT_PATH))
TOOLCHAINS_DIR_NAME=os.path.basename(TOOLCHAINS_DIR_PATH)
PROJECT_DIR_PATH=os.path.join(TOOLCHAINS_DIR_PATH, "..")
RUNTIME_DIR_PATH=os.path.join(PROJECT_DIR_PATH, "Runtime")
PLUGIN_DIR_PATH=os.path.join(PROJECT_DIR_PATH, "Plugins")
RT_PLUGIN_DIR_PATH=os.path.join(PROJECT_DIR_PATH, "Runtime/plugin_src")
RUNTIME_PLUGIN_PATH=os.path.join(RUNTIME_DIR_PATH, "plugins")

ELECTRON_DIR_PATH=os.path.join(RUNTIME_DIR_PATH, "platform_src/electron")
ELECTRON_TITLERBAR_DIR_PATH=os.path.join(ELECTRON_DIR_PATH, "titlebar")
ELECTRON_MAIN_DIR_PATH=os.path.join(ELECTRON_DIR_PATH, "main")
ELECTRON_RENDERER_DIR_PATH=os.path.join(ELECTRON_DIR_PATH, "renderer")
ELECTRON_SCRIPT_DIR_PATH=os.path.join(RUNTIME_DIR_PATH, "scripts/electron")

def run_cmd(cmd, ignore_error=False):
    print("Running: " + cmd)
    ret = subprocess.call(cmd, shell=True)
    if not ignore_error and ret != 0:
        sys.exit(ret)

def plugin_prepare(check_update=False):
    if os.path.isdir(RUNTIME_PLUGIN_PATH):
        if check_update:
            plugin_update()
    else:
        plugin_convertTS2JS()

def plugin_update_dir(plugin_dir):
    dirs = os.listdir(plugin_dir)
    for dir in dirs:
        filepath = os.path.join(plugin_dir, dir)
        if os.path.isdir(filepath):
            try:
                is_changed = is_plugin_changed(dir);
                if is_changed:
                    print('reinstall plugin ' + dir);
                    re_install_plugin(filepath, False);
            except Exception as err:
                print("Error: " + str(err))
    restore_files()

def plugin_update():
    plugin_update_dir(RT_PLUGIN_DIR_PATH)
    plugin_update_dir(PLUGIN_DIR_PATH)

# first build
def plugin_convertTS2JS():
    run_cmd("npm install typescript -g")
    plugin_convertTS2JS_dir(RT_PLUGIN_DIR_PATH)
    plugin_convertTS2JS_dir(PLUGIN_DIR_PATH)


def plugin_convertTS2JS_dir(plugin_dir):
    dirs = os.listdir(plugin_dir)
    for dir in dirs:
        filepath = os.path.join(plugin_dir, dir)
        if os.path.isdir(filepath):
            tsconfig = os.path.join(filepath, "www/tsconfig.json")
            if os.path.isfile(tsconfig):
                run_cmd("tsc --build " + tsconfig)

def get_pluginId(directory):
    xmldoc = minidom.parse(directory + '/plugin.xml')
    itemlist = xmldoc.getElementsByTagName('plugin')
    return itemlist[0].attributes['id'].value

def is_plugin_changed(directory):
    filepath = os.path.join(PLUGIN_DIR_PATH, directory + '/www/' + directory + '.ts');
    if os.path.isfile(filepath):
        modify_time_1 = os.stat(filepath).st_mtime;

        plugin_path = os.path.join(PLUGIN_DIR_PATH, directory)
        pluginId = get_pluginId(plugin_path);
        plugin_runtime = os.path.join(RUNTIME_DIR_PATH, 'plugins/' + pluginId + '/www/' + directory + '.ts');
        modify_time_2 = os.stat(plugin_runtime).st_mtime;
        return (modify_time_1 > modify_time_2);

def re_install_plugin(plugindir, restore = True):
    tsconfig = plugindir + "/www/tsconfig.json"
    if os.path.isfile(tsconfig):
        run_cmd("tsc --build " + tsconfig)
    os.chdir(RUNTIME_DIR_PATH)
    backup_files()
    run_cmd("cordova plugin rm " + get_pluginId(plugindir), True)
    run_cmd("cordova plugin add " + os.path.relpath(plugindir))
    if restore:
        restore_files()

def backup_files():
    os.chdir(RUNTIME_DIR_PATH)
    if not os.path.isfile(os.path.join(RUNTIME_DIR_PATH + '/config.xml.buildbak')):
        if isWindows():
            run_cmd('copy config.xml config.xml.buildbak')
        else:
            run_cmd('cp config.xml config.xml.buildbak')
    if not os.path.isfile(os.path.join(RUNTIME_DIR_PATH + '/package.json.buildbak')):
        if isWindows():
            run_cmd('copy package.json package.json.buildbak')
        else:
            run_cmd('cp package.json package.json.buildbak')

def restore_files():
    os.chdir(RUNTIME_DIR_PATH)
    if os.path.isfile(os.path.join(RUNTIME_DIR_PATH + '/config.xml.buildbak')):
        if isWindows():
            run_cmd('move config.xml.buildbak config.xml')
        else:
            run_cmd('mv config.xml.buildbak config.xml')
    if os.path.isfile(os.path.join(RUNTIME_DIR_PATH + '/package.json.buildbak')):
        if isWindows():
            run_cmd('move package.json.buildbak package.json')
        else:
            run_cmd('mv package.json.buildbak package.json')

def isWindows():
    return sys.platform == "win32"

def install_titlebar():
    os.chdir(ELECTRON_TITLERBAR_DIR_PATH)
    run_cmd('npm install')
    run_cmd("ionic build --prod")

# moved from before_prepare script
def copy_electron_files():
    os.chdir(RUNTIME_DIR_PATH)

    build_electron_files()
    shutil.copy2(ELECTRON_RENDERER_DIR_PATH + "/dapp_preload.js", "platforms/electron/platform_www")

    copy_electron_plugin("AppManager")
    copy_electron_plugin("DIDSessionManager")
    copy_electron_plugin("NotificationManager")
    copy_electron_plugin("PasswordManager")
    copy_electron_plugin("TitleBarManager")

def copy_electron_plugin(pluginName):
    pluginPathName = ""
    pluginIsolatedName = ""

    if pluginName == "AppManager":
        pluginPathName = "elastos-trinity-plugins-appmanager"
        pluginIsolatedName = "AppManagerPluginIsolated.js"
    elif pluginName == "DIDSessionManager":
        pluginPathName = "elastos-trinity-plugins-didsessionmanager"
        pluginIsolatedName = "DIDSessionManagerPluginIsolated.js"
    elif pluginName == "NotificationManager":
        pluginPathName = "elastos-trinity-plugins-notificationmanager"
        pluginIsolatedName = "NotificationManagerPluginIsolated.js"
    elif pluginName == "PasswordManager":
        pluginPathName = "elastos-trinity-plugins-passwordmanager"
        pluginIsolatedName = "PasswordManagerPluginIsolated.js"
    elif pluginName == "TitleBarManager":
        pluginPathName = "elastos-trinity-plugins-titlebarmanager"
        pluginIsolatedName = "TitleBarManagerPluginIsolated.js"
    
    platformPluginPath = "platforms/electron/platform_www/plugins/" + pluginPathName + "/src/electron"
    if not os.path.isdir(platformPluginPath):
        os.makedirs(platformPluginPath)
    shutil.copy2(RT_PLUGIN_DIR_PATH + "/" + pluginName + "/src/electron/" + pluginIsolatedName, platformPluginPath)

def build_electron_files():
    os.chdir(ELECTRON_SCRIPT_DIR_PATH)
    run_cmd("node build.main.js")
    run_cmd("node build.renderer.js")
    os.chdir(ELECTRON_MAIN_DIR_PATH)
    run_cmd("tsc --build tsconfig.json --force")
    os.chdir(RUNTIME_DIR_PATH)

def install_electron():
    os.chdir(RUNTIME_DIR_PATH)
    if not os.path.isdir("platforms/electron"):
        run_cmd("cordova platform rm electron")
        run_cmd("cordova platform add electron@2.0.0-nightly.2020.9.12.734bbe7c", True)





    