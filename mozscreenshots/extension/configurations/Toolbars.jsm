/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

this.EXPORTED_SYMBOLS = [ "Toolbars" ];

const {classes: Cc, interfaces: Ci, utils: Cu} = Components;

Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/devtools/Console.jsm");


this.Toolbars = {
  init: function(libDir) {},

  configurations: {
    onlyNavBar: {
      applyConfig: (deferred) => {
        let browserWindow = Services.wm.getMostRecentWindow("navigator:browser");
        var personalToolbar = browserWindow.document.getElementById("PersonalToolbar");
        browserWindow.setToolbarVisibility(personalToolbar, false);
        toggleMenubarIfNecessary(false);
        deferred.resolve();
      },
    },

    allToolbars: {
      applyConfig: (deferred) => { // Boookmarks and menubar
        let browserWindow = Services.wm.getMostRecentWindow("navigator:browser");
        var personalToolbar = browserWindow.document.getElementById("PersonalToolbar");
        browserWindow.setToolbarVisibility(personalToolbar, true);
        toggleMenubarIfNecessary(true);
        deferred.resolve();
      },

      verifyConfig: deferred => {
        let browserWindow = Services.wm.getMostRecentWindow("navigator:browser");
        if (browserWindow.fullScreen) {
          deferred.reject("The bookmark toolbar and menubar are not shown in fullscreen.");
          return;
        }
        deferred.resolve("allToolbars.verifyConfig");
      },
    },

  },
};


///// helpers /////

function toggleMenubarIfNecessary(visible) {
  let browserWindow = Services.wm.getMostRecentWindow("navigator:browser");
  // The menubar is not shown on OS X or while in fullScreen
  if (Services.appinfo.OS != "Darwin" /*&& !browserWindow.fullScreen*/) {
    var menubar = browserWindow.document.getElementById("toolbar-menubar");
    browserWindow.setToolbarVisibility(menubar, visible);
  }
}
