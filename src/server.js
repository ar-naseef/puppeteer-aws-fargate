const express = require("express");
const puppeteer = require("puppeteer");
const { scrapeGoogleSearch } = require("./scripts");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  console.log("Query:", req.query);
  next();
});

// Health check endpoint for load balancer
app.get("/", (req, res) => {
  res.json({
    status: "healthy",
    message: "Puppeteer Scraper Service is running",
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    method: req.method,
    path: req.path,
    timestamp: new Date().toISOString(),
  });
});

// Route handler that can access all request details
app.all("/scrape/*", async (req, res) => {
  let browser;
  try {
    // Access all request details
    const method = req.method; // GET, POST, PUT, DELETE, etc.
    const path = req.path; // e.g., /scrape/google
    const fullUrl = req.originalUrl; // includes query params
    const body = req.body; // JSON body (for POST/PUT requests)
    const query = req.query; // Query parameters
    const params = req.params; // URL parameters

    if (method !== "POST") {
      return res.status(405).json({
        success: false,
        error: "Method not allowed",
        requestDetails: {
          method,
        },
      });
    }

    console.log("=== REQUEST DETAILS ===");
    console.log("Method:", method);
    console.log("Path:", path);
    console.log("Full URL:", fullUrl);
    console.log("Body:", body);
    console.log("Query params:", query);
    console.log("URL params:", params);
    console.log("=======================");

    // Route to different scripts based on path and method
    let result;

    browser = await puppeteer.launch({
      headless: "new", // Always headless for server deployment
      ...(process.env.NODE_ENV === "production"
        ? { executablePath: "/usr/bin/chromium" }
        : {}),
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    if (path.includes("/scrape/google")) {
      // Google scraping
      result = await scrapeGoogleSearch(body, page);
    } else {
      return res.status(404).json({
        success: false,
        error: "Route not found",
      });
    }

    // Return successful response with request details
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Scraping failed:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      requestDetails: {
        method: req.method,
        path: req.path,
        body: req.body,
        query: req.query,
      },
      timestamp: new Date().toISOString(),
    });
  } finally {
    if (browser) {
      console.log("Closing browser...");
      await browser.close();
    }
  }
});

// Catch-all endpoint for any other routes
app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    requestDetails: {
      method: req.method,
      path: req.path,
      body: req.body,
      query: req.query,
      headers: req.headers,
    },
    availableRoutes: [
      "GET /",
      "GET /health",
      "GET/POST /scrape/google",
      "GET/POST /scrape/custom",
      "GET/POST /scrape/batch",
    ],
    timestamp: new Date().toISOString(),
  });
});

// Start the server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Puppeteer Scraper Service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/`);
  console.log(`Google scrape: POST http://localhost:${PORT}/scrape/google`);
  console.log(`Custom scrape: POST http://localhost:${PORT}/scrape/custom`);
  console.log(`Batch scrape: POST http://localhost:${PORT}/scrape/batch`);
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("Received SIGINT, shutting down gracefully");
  process.exit(0);
});
