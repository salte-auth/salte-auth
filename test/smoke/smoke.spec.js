require('dotenv/config');
const http = require('http');
const handler = require('serve-handler');
const { rollup } = require('rollup');
const chrome = require('chrome-finder');
const puppeteer = require('puppeteer-core');
const chai = require('chai');
const chaiString = require('chai-string');

const { expect } = chai;
chai.use(chaiString);

const common = require('../../rollup.common.config.js');

describe(`💨`, async function () {
  this.timeout(30000);
  const email = process.env.SMOKE_EMAIL;
  const password = process.env.SMOKE_PASSWORD;

  /** @type {http.Server} */
  let server;
  /** @type {puppeteer.Browser} */
  let browser;
  /** @type {puppeteer.Page} */
  let page;
  before(async () => {
    const config = common({
      minified: false,
      es6: false,
      demo: true
    });
    const bundle = await rollup(config);

    await bundle.write(config.output);

    server = http.createServer((request, response) => handler(request, response, { public: 'dist' }));

    server.listen(8081, 'localhost');

    browser = await puppeteer.launch({
      executablePath: chrome(),
      headless: process.env.SMOKE_DEBUG !== 'true',
      pipe: true
    });
  });

  after(async () => {
    if (server) {
      await new Promise((resolve, reject) => {
        return server.close((error) => error ? reject(error) : resolve())
      });
    }

    if (browser) {
      await browser.close();
    }
  })

  beforeEach(async () => {
    page = await browser.newPage();
  });

  afterEach(async () => {
    await page.close();
  });

  it('should obtain an id token', async () => {
    await page.goto('http://localhost:8081');

    await page.waitForNavigation();

    await page.waitFor(3000);

    expect(await page.evaluate(`location.href`)).to.startWith('https://salte-os.auth0.com/login');

    const elements = {
      email: await page.waitForSelector('input[name="email"]'),
      password: await page.waitForSelector('input[name="password"]'),
      submit: await page.waitForSelector('button[name="submit"]'),
    };

    await elements.email.type(email);
    await elements.password.type(password);
    await elements.submit.click();

    await page.waitFor(3000);
    expect(await page.evaluate(`location.href`)).to.equal('http://localhost:8081/');
    const idToken = await page.evaluate(`sessionStorage.getItem('salte.auth.provider.generic.openid.id-token.raw')`);

    expect(idToken).to.be.ok;
    expect(idToken.split('.').length).to.equal(3);
  });
});
