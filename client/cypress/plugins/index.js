/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
import execa from "execa";
const findBrowser = () => {
  // the path is hard-coded for simplicity
  const browserPath =
    "C:\\Program Files (x86)\\BraveSoftware\\Brave-Browser\\Application\\brave.exe";

  return execa(browserPath, ["--version"]).then((result) => {
    // STDOUT will be like "Brave Browser 77.0.69.135"
    const [, version] = /Brave Browser (\d+\.\d+\.\d+\.\d+)/.exec(
      result.stdout
    );
    const majorVersion = parseInt(version.split(".")[0]);

    return {
      name: "Brave",
      channel: "stable",
      family: "chromium",
      displayName: "Brave",
      version,
      path: browserPath,
      majorVersion,
    };
  });
};

module.exports = (on, config) => {
  return findBrowser().then((browser) => {
    return {
      browsers: config.browsers.concat(browser),
    };
  });
};
