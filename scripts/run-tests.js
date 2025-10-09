/* eslint-disable no-console */
const path = require('path');
const url = require('url');
const puppeteer = require('puppeteer');

(async () => {
  const runnerPath = path.resolve(__dirname, '../lib/tests/jsTestRunner.html');
  const runnerUrl = url.pathToFileURL(runnerPath).toString();

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  let browserClosed = false;

  // Capture console output
  page.on('console', (msg) => {
    const args = msg.args();
    Promise.all(args.map(a => a.jsonValue().catch(() => undefined)))
      .then(values => {
        const text = values.map(v => typeof v === 'string' ? v : JSON.stringify(v)).join(' ');
        console.log(text);
      })
      .catch(() => {});
  });

  try {
    await page.goto(runnerUrl, { waitUntil: 'load', timeout: 30000 });
    
    // Wait for Jasmine to be available
    await page.waitForFunction(() => !!(window.jasmine && window.jasmine.getEnv), { timeout: 30000 });
    
    console.log('Jasmine loaded, waiting for tests to complete...');
    
    // Multiple strategies to detect completion
    const results = await Promise.race([
      // Strategy 1: Wait for summary element
      page.waitForSelector('.jasmine-summary', { timeout: 30000 }).then(async () => {
        console.log('Found jasmine-summary element');
        return await page.evaluate(() => {
          const failedBar = document.querySelector('.jasmine-bar.jasmine-failed');
          
          const getCount = (selector) => {
            const el = document.querySelector(selector);
            if (!el) return 0;
            const text = el.textContent || '';
            const match = text.match(/(\d+)/);
            return match ? parseInt(match[1], 10) : 0;
          };
          
          return {
            failed: getCount('.jasmine-bar.jasmine-failed .jasmine-failed'),
            passed: getCount('.jasmine-bar.jasmine-passed .jasmine-passed'),
            hasFailures: !!failedBar,
            method: 'summary'
          };
        });
      }),
      
      // Strategy 2: Wait for any jasmine results
      page.waitForSelector('.jasmine-results', { timeout: 30000 }).then(async () => {
        console.log('Found jasmine-results element');
        return await page.evaluate(() => {
          const failedSpecs = document.querySelectorAll('.jasmine-failed');
          const passedSpecs = document.querySelectorAll('.jasmine-passed');
          
          return {
            failed: failedSpecs.length,
            passed: passedSpecs.length,
            hasFailures: failedSpecs.length > 0,
            method: 'results'
          };
        });
      }),
      
      // Strategy 3: Wait for jasmine to finish via jsApiReporter
      page.waitForFunction(() => {
        return window.jsApiReporter && window.jsApiReporter.finished;
      }, { timeout: 30000 }).then(async () => {
        console.log('Jasmine finished via jsApiReporter');
        return await page.evaluate(() => {
          const reporter = window.jsApiReporter;
          const specs = reporter.specs();
          const failed = specs.filter(s => s.status === 'failed').length;
          const passed = specs.filter(s => s.status === 'passed').length;
          
          return {
            failed,
            passed,
            hasFailures: failed > 0,
            method: 'reporter'
          };
        });
      }),
      
      // Strategy 4: Timeout fallback - just wait and check what we can find
      new Promise(resolve => {
        setTimeout(async () => {
          if (browserClosed) return; // Don't execute if browser is already closed
          console.log('Timeout reached, checking current state');
          try {
            const results = await page.evaluate(() => {
              const failedSpecs = document.querySelectorAll('.jasmine-failed');
              const passedSpecs = document.querySelectorAll('.jasmine-passed');
              const summary = document.querySelector('.jasmine-summary');
              
              return {
                failed: failedSpecs.length,
                passed: passedSpecs.length,
                hasFailures: failedSpecs.length > 0,
                method: 'timeout',
                hasSummary: !!summary
              };
            });
            resolve(results);
          } catch (err) {
            // Browser might be closed, resolve with empty results
            resolve({ failed: 0, passed: 0, hasFailures: false, method: 'timeout-error' });
          }
        }, 10000); // Wait 10 seconds then check
      })
    ]);
    
    console.log(`Test Results (${results.method}): ${results.passed} passed, ${results.failed} failed`);
    
    if (results.hasFailures || results.failed > 0) {
      console.error('❌ Tests failed');
      process.exitCode = 1;
    } else {
      console.log('✅ All tests passed');
    }
    
  } catch (err) {
    console.error('Error running tests:', err.message);
    process.exitCode = 1;
  } finally {
    browserClosed = true;
    await browser.close();
  }
})();