import { setWorldConstructor, setDefaultTimeout } from 'cucumber';
import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import path from 'path';
const argv = require('minimist')(process.argv.slice(2));

const fs = require('fs');

function encode(file) {
  var stream = fs.readFileSync(file);
  return new Buffer.from(stream).toString('base64');
}

function getChromeBuilder() {
  return new Builder()
    .withCapabilities({
      chromeOptions: {
        args: [
          'start-maximized'
        ]
      },
    })
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options()
      .addExtensions(encode(path.resolve(__dirname, `../${argv.file}.crx`))));
}

setDefaultTimeout(60 * 1000);
export default {
  driver: getChromeBuilder().build(),
  getExtensionUrl: () => {
    /**
     * Extension id is determinisitically calculated based on pubKey used to generate the crx file
     * so we can just hardcode this value
     * https://stackoverflow.com/a/10089780/3329806
     */
    return 'chrome-extension://ffnbelfdoeiohenkjibnmadjiehjhajb/main_window.html';
  },
}
