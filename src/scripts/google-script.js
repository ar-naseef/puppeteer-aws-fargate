const scrapeGoogleSearch = async (body, page) => {
  const searchTerm = body.searchTerm || "ChatGPT";

  try {
    console.log("Navigating to Google...");

    // Navigate to Google
    await page.goto("https://www.google.com", {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    console.log('Google loaded, searching for "ChatGPT"...');

    // Accept cookies if present (common on Google)
    try {
      const acceptButton = await page.$('button[id="L2AGLb"]');
      if (acceptButton) {
        await acceptButton.click();
        await page.waitForTimeout(1000);
      }
    } catch (error) {
      console.log("No cookie banner found or already accepted");
    }

    // Find search input and type "ChatGPT"
    await page.waitForSelector("textarea", { timeout: 10000 });
    await page.type("textarea", searchTerm);

    // Submit search
    await page.keyboard.press("Enter");

    console.log("Search submitted, waiting for results...");

    // Wait for search results to load
    // await page.waitForSelector("#search", { timeout: 15000 });
    await new Promise((r) => setTimeout(r, 3000));

    console.log("Search results loaded, scraping HTML content...");

    // Get the HTML content of the entire page
    const htmlContent = await page.content();

    console.log(`HTML content scraped successfully!`);
    console.log(`HTML content length: ${htmlContent.length} characters`);

    // Wait for 5 seconds as requested
    console.log("Waiting 5 seconds...");
    await new Promise((r) => setTimeout(r, 5000));

    console.log("Scraping completed successfully!");

    return { htmlLength: htmlContent.length };
  } catch (error) {
    console.error("Error during scraping:", error.message);
    throw error;
  }
};

// // Run the scraper
// scrapeGoogleSearch()
//   .then(() => {
//     console.log("Web scraping completed successfully");
//     process.exit(0);
//   })
//   .catch((error) => {
//     console.error("Web scraping failed:", error);
//     process.exit(1);
//   });

module.exports = scrapeGoogleSearch;
