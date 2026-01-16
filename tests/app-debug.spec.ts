import { test, expect } from '@playwright/test';

test.describe('Miyabi App Debug', () => {
  test('should load the app and show server settings dialog', async ({ page }) => {
    await page.goto('/');

    // Wait for the app to load
    await page.waitForLoadState('networkidle');

    // Take a screenshot of the initial state
    await page.screenshot({ path: 'screenshots/01-initial-load.png', fullPage: true });

    // Check if server settings dialog is visible
    const serverSettingsDialog = page.getByRole('dialog');
    await expect(serverSettingsDialog).toBeVisible();

    // Check for input fields
    const urlInput = page.getByLabel(/サーバーURL/i);
    const usernameInput = page.getByLabel(/ユーザー名/i);
    const passwordInput = page.getByLabel(/パスワード/i);

    await expect(urlInput).toBeVisible();
    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    console.log('✓ Server settings dialog is displayed correctly');
  });

  test('should test navigation and UI components', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check if Material-UI is loaded
    const muiElements = await page.locator('[class*="Mui"]').count();
    console.log(`Found ${muiElements} Material-UI elements`);
    expect(muiElements).toBeGreaterThan(0);

    // Check for console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Wait a bit to catch any errors
    await page.waitForTimeout(2000);

    if (consoleErrors.length > 0) {
      console.log('Console errors found:');
      consoleErrors.forEach(error => console.log('  - ' + error));
    } else {
      console.log('✓ No console errors detected');
    }

    await page.screenshot({ path: 'screenshots/02-ui-check.png', fullPage: true });
  });

  test('should check for JavaScript errors', async ({ page }) => {
    const errors: Error[] = [];

    page.on('pageerror', error => {
      errors.push(error);
      console.log('JavaScript error:', error.message);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    if (errors.length > 0) {
      console.log(`Found ${errors.length} JavaScript errors`);
      errors.forEach(error => {
        console.log('  Error:', error.message);
        console.log('  Stack:', error.stack);
      });
    } else {
      console.log('✓ No JavaScript errors detected');
    }

    await page.screenshot({ path: 'screenshots/03-error-check.png', fullPage: true });
  });

  test('should check responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'screenshots/04-mobile-375.png', fullPage: true });
    console.log('✓ Mobile viewport (375x667) rendered');

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'screenshots/05-tablet-768.png', fullPage: true });
    console.log('✓ Tablet viewport (768x1024) rendered');

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'screenshots/06-desktop-1920.png', fullPage: true });
    console.log('✓ Desktop viewport (1920x1080) rendered');
  });

  test('should test form validation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Try to submit without filling in fields
    const connectButton = page.getByRole('button', { name: /接続/i });
    await expect(connectButton).toBeVisible();

    // Check if button is disabled or if form validates
    const isDisabled = await connectButton.isDisabled();
    console.log(`Connect button disabled: ${isDisabled}`);

    // Try filling in invalid data
    await page.getByLabel(/サーバーURL/i).fill('invalid-url');
    await page.getByLabel(/ユーザー名/i).fill('test');
    await page.getByLabel(/パスワード/i).fill('test');

    await page.screenshot({ path: 'screenshots/07-form-filled.png', fullPage: true });
    console.log('✓ Form validation test completed');
  });

  test('should check network requests', async ({ page }) => {
    const requests: string[] = [];
    const failedRequests: string[] = [];

    page.on('request', request => {
      requests.push(request.url());
    });

    page.on('requestfailed', request => {
      failedRequests.push(request.url());
      console.log('Failed request:', request.url(), request.failure()?.errorText);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log(`Total requests: ${requests.length}`);
    console.log(`Failed requests: ${failedRequests.length}`);

    if (failedRequests.length > 0) {
      console.log('Failed requests:');
      failedRequests.forEach(url => console.log('  - ' + url));
    } else {
      console.log('✓ All network requests succeeded');
    }
  });

  test('should check PWA manifest', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for manifest link (with timeout since it may not exist in dev mode)
    const manifestLink = await page.locator('link[rel="manifest"]').getAttribute('href', { timeout: 5000 }).catch(() => null);
    console.log('Manifest link:', manifestLink);

    if (manifestLink) {
      const manifestResponse = await page.goto(new URL(manifestLink, page.url()).toString());
      const manifest = await manifestResponse?.json();
      console.log('Manifest content:', JSON.stringify(manifest, null, 2));
      console.log('✓ PWA manifest found and accessible');
    } else {
      console.log('⚠ PWA manifest not found (expected in dev mode)');
      console.log('Note: PWA manifest is generated only in production build');
    }
  });
});
