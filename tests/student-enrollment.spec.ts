import { test, expect } from "@playwright/test";

test("Student Enrollment Test", async ({ page }) => {
  await page.goto("http://localhost:3000/login");

  //waiting for display page
  await page.waitForSelector("#email");
  //waiting
  await page.waitForTimeout(500); 

  // Fill in email
  await page.fill("#email", "testuser@example.com");
  //waiting before typing password
  await page.waitForTimeout(500);

  // Fill in password
  await page.fill('input[type="password"]', "TestPassword1234");
  // wait before clicking
  await page.waitForTimeout(500); 

  // Click submit
  await page.click('button[type="submit"]');

  // give some time to redirect
  await page.waitForTimeout(3000); 

  const currentUrl = await page.url();
  console.log("Current URL after login:", currentUrl);

  // Expect redirect to homepage
  expect(currentUrl).toBe("http://localhost:3000/");

});
