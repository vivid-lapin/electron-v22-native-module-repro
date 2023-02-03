#!/usr/bin/env bash

# https://github.com/ci7lus/MirakTest/tree/46ef1fcee9e40efa7c5c1530f02dd8079700543c

set -eu

set -eu
rm -rf vlc_libs
if [ -d ./VLC.app ]; then
    BASE_PATH=./VLC.app
else
    BASE_PATH=/Applications/VLC.app
fi
echo "Using $BASE_PATH"
cp -Ra $BASE_PATH/Contents/MacOS/lib vlc_libs
mkdir vlc_libs/vlc
cp -Ra $BASE_PATH/Contents/MacOS/{plugins,share} vlc_libs/vlc
rm vlc_libs/vlc/plugins/libsecuretransport_plugin.dylib
rm -rf vlc_libs/vlc/share/locale
rm -rf vlc_libs/vlc/share/lua/playlist/*.luac
rm -rf node_modules/electron/dist/Electron.app/Contents/Frameworks/libvlc*.dylib
rm -rf node_modules/electron/dist/Electron.app/Contents/Frameworks/vlc
for d in vlc_libs/*; do cp -Ra $d node_modules/electron/dist/Electron.app/Contents/Frameworks; done
curl -sL https://raw.githubusercontent.com/videolan/vlc/master/COPYING > vlc_libs/COPYING
curl -sL https://raw.githubusercontent.com/videolan/vlc/master/COPYING.LIB > vlc_libs/COPYING.LIB
curl -sL https://raw.githubusercontent.com/videolan/vlc/master/COPYING > node_modules/electron/dist/Electron.app/Contents/VLC-COPYING
curl -sL https://raw.githubusercontent.com/videolan/vlc/master/COPYING.LIB > node_modules/electron/dist/Electron.app/Contents/VLC-COPYING.LIB

export ELECTRON_VER="$(yarn run --silent electron --version | sed -e "s/v//")"
export BUILD_DIR="./build/Release"
export npm_config_wcjs_runtime=electron
export npm_config_wcjs_runtime_version=$ELECTRON_VER
npm_config_wcjs_arch=${npm_config_wcjs_arch:-}
if [[ -z "${npm_config_wcjs_arch}" ]]; then
  export npm_config_wcjs_arch="$(arch | sed -e "s/i386/x64/")"
fi
export ELECTRON_MIRROR="https://artifacts.electronjs.org/headers/dist"
export OS_NAME="$(uname)"
cd node_modules/webchimera.js

function finally {
  echo "Cleanup"
  rm -rf node_modules build deps/VLC.app yarn.lock .yarn
}
trap finally EXIT
finally

if [ "$OS_NAME" = "Darwin" ]; then
  if [ -d "../../VLC.app" ]; then
    echo "Using ./VLC.app"
    cp -Ra ../../VLC.app ./deps;
  else
    echo "Using /Application/VLC.app"
    cp -Ra /Applications/VLC.app ./deps;
  fi
fi
export WCJS_ARCHIVE=WebChimera.js_${npm_config_wcjs_runtime}_${npm_config_wcjs_runtime_version}_${npm_config_wcjs_arch}_${OS_NAME}.zip
export WCJS_ARCHIVE_PATH=$BUILD_DIR/$WCJS_ARCHIVE
export WCJS_FULL_ARCHIVE=WebChimera.js_${npm_config_wcjs_runtime}_v${npm_config_wcjs_runtime_version}_VLC_${npm_config_wcjs_arch}_${OS_NAME}.tar.gz
if [ "$OS_NAME" = "Darwin" ]; then export WCJS_FULL_ARCHIVE_PATH=$BUILD_DIR/$WCJS_FULL_ARCHIVE; else export WCJS_FULL_ARCHIVE_PATH=$WCJS_ARCHIVE_PATH; fi
echo 'nodeLinker: node-modules' > .yarnrc.yml
echo '' > yarn.lock
rm -rf deps/libvlc_wrapper
git clone --depth 1 --recursive https://github.com/RSATom/ya-libvlc-wrapper.git deps/libvlc_wrapper
YARN_ENABLE_IMMUTABLE_INSTALLS=false yarn install
node rebuild.js
file ./build/Release/WebChimera.js.node
mv ./build/Release/WebChimera.js.node .
echo "module.exports = require('./WebChimera.js.node')" > index.js