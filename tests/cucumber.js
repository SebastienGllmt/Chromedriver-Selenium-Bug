/** Setup a Cucumber test that simply opens the extension */

import { Given } from 'cucumber';
import { driver, getExtensionUrl } from './webdriver';
import { By, until } from 'selenium-webdriver';

Given(/^I have completed the basic setup$/, async function () {
  // wait for extension to load
  await waitForElement('.LanguageSelectionForm_component');
});

Given(/^I have opened the extension$/, async function () {
  await driver.get(getExtensionUrl());
});

// =========================
//   Selenium helper utils
// =========================

const getElementBy = (locator, method = By.css) => driver.findElement(method(locator));
const waitForElementLocated = (locator, method = By.css) => {
  const isLocated = until.elementLocated(method(locator));
  return driver.wait(isLocated);
};
const waitForElement = async (locator, method = By.css) => {
  await waitForElementLocated(locator, method);
  const element = await getElementBy(locator, method);
  const condition = until.elementIsVisible(element);
  return driver.wait(condition);
};