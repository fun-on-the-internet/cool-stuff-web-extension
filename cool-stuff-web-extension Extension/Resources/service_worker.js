const API = "https://api.coolstuff.app";
const browserApi = typeof browser === "undefined" ? chrome : browser;

const inactiveIcons = {
  16: "images/cool-stuff-toolbar-icon-inactive-16.png",
  19: "images/cool-stuff-toolbar-icon-inactive-19.png",
  32: "images/cool-stuff-toolbar-icon-inactive-32.png",
  38: "images/cool-stuff-toolbar-icon-inactive-38.png",
  48: "images/cool-stuff-toolbar-icon-inactive-48.png",
  72: "images/cool-stuff-toolbar-icon-inactive-72.png",
};

const activeIcons = {
  16: "images/cool-stuff-toolbar-icon-active-16.png",
  19: "images/cool-stuff-toolbar-icon-active-19.png",
  32: "images/cool-stuff-toolbar-icon-active-32.png",
  38: "images/cool-stuff-toolbar-icon-active-38.png",
  48: "images/cool-stuff-toolbar-icon-active-48.png",
  72: "images/cool-stuff-toolbar-icon-active-72.png",
};

browserApi.action.onClicked.addListener(addLink);
browserApi.tabs.onActivated.addListener(onActiveTabChanged);
browserApi.runtime.onStartup.addListener(onStartup);

const isSafari = browserApi.runtime.getURL("").startsWith("safari");

async function _getHeaders() {
  const token = await browserApi.cookies.get({
    name: "token",
    url: "https://coolstuff.app/",
  });

  if (!token) {
    return null;
  }

  return {
    "content-type": "application/vnd.api+json",
    Authorization: `Bearer ${token.value}`,
  };
}

function _updateIcon(isActive) {
  browserApi.action.setIcon({
    path: isActive ? activeIcons : inactiveIcons,
  });
}

function onStartup() {
  // Request the host permissions as on Safari, they're not granted by default. We
  // need this to access the user's token via the cookie set on https://coolstuff.app.
  browserApi.permissions.request({ permissions: ["*://coolstuff.app/*"] });
}

async function onActiveTabChanged() {
  // Reset the icon
  _updateIcon(false);
}

async function addLink() {
  const [tab] = await browserApi.tabs.query({
    currentWindow: true,
    active: true,
  });

  const headers = await _getHeaders();

  if (!headers) {
    const landing = isSafari ? "safari-extension" : "chrome-extension";
    browserApi.tabs.create({ url: `https://coolstuff.app?landing=${landing}` });
    return;
  }

  // Create the link data
  const linkDataResponse = await fetch(`${API}/link_datas`, {
    headers,
    method: "POST",
    body: JSON.stringify({
      data: {
        type: "link_data",
        attributes: {
          url: tab.url,
        },
      },
    }),
  });

  if (!linkDataResponse.ok) {
    return;
  }

  const linkData = await linkDataResponse.json();
  const linkDataId = linkData.data.id;

  // Create the link
  const linkResponse = await fetch(`${API}/links`, {
    headers,
    method: "POST",
    body: JSON.stringify({
      data: {
        type: "link",
        relationships: {
          link_data: {
            data: {
              id: linkDataId,
              type: "link_data",
            },
          },
        },
      },
    }),
  });

  // Update the icon
  _updateIcon(linkResponse.ok);
}
