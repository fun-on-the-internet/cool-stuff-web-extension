# Cool Stuff Web Extension
This repo contains the code used for [Cool Stuff's](https://coolstuff.app) web extension for all supported browsers: Safari, Chrome, and Firefox.

The root directory contains the code required by XCode to build the extension for Safari. However, the extension's functionality is entirely provided by the standard Web Extension files in [Resources](https://github.com/fun-on-the-internet/cool-stuff-web-extension/tree/main/cool-stuff-web-extension%20Extension/Resources) and is shared among all platforms.

The functionality is as follows:
1. When the extenion is launched, it requests permission to access data on the domain `coolstuff.app`. This allows the extension to access the authentication token for the currently authenticated user on Cool Stuff.
2. When the extension's toolbar button is pressed, it adds the URL of the current tab to the user's stuff. The tab's URL is accessible due to the extension's [activeTab](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/permissions#activetab_permission) permission.
3. The extension's icon is updated to include the checkmark.
4. When the browser navigates to a new tab, the icon is reset. This does not provide the extension with the URL of the new tab. The URL is only accessible to the extension when the user presses the extension's toolbar icon.
