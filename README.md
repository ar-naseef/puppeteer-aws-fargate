# Puppeteer Web Scraping API on AWS Fargate

A scalable Express-based web scraping API using Puppeteer, deployed on AWS Fargate with multiple scraping endpoints.

## Project Overview

This project creates a containerized web scraping API that:

- **Express Web Server** with multiple scraping endpoints
- **Puppeteer v24.13.0** with Node.js 20 in headless mode
- **Request routing** based on HTTP method, path, and body
- **Google Search scraping** with customizable search terms
- **Custom scraping endpoints** for different use cases
- **AWS Fargate deployment** with auto-scaling
- **Production-ready** with health checks and monitoring

## Project Structure

```
project-root/
├── src/                               # Application source code
│   ├── server.js                      # Express web server (main entry)
│   ├── package.json                   # Node.js dependencies
│   ├── Dockerfile                     # Docker configuration
│   └── scripts/                       # Scraping scripts
│       ├── index.js                   # Script exports
│       └── google-script.js           # Google scraping logic
└── aws/                              # AWS CDK infrastructure
    ├── bin/app.ts                    # CDK app entry point
    ├── lib/puppeteer-fargate-stack.ts # Fargate stack definition
    ├── cdk.json                      # CDK configuration
    ├── package.json                  # CDK dependencies
    └── tsconfig.json                 # TypeScript configuration
```

## API Endpoints

The Express server provides multiple endpoints for different scraping needs:

### **Health Check**

```bash
GET /               # Service status
GET /health         # Health check endpoint
```

### **Google Search Scraping**

```bash
# POST with JSON body
POST /scrape/google
Content-Type: application/json
{
  "searchTerm": "Node.js tutorials",
  "options": {"timeout": 30000}
}
```

## Request Details Access

The server logs and provides access to all request details:

```javascript
// Available in all route handlers
const method = req.method; // GET, POST, PUT, DELETE
const path = req.path; // /scrape/google
const body = req.body; // JSON request body
const query = req.query; // URL query parameters
const headers = req.headers; // Request headers
```

## Running Locally

### **With Docker (Recommended)**

```bash
# Build the Docker image
docker build -t puppeteer-scraper ./src

# Run the container
docker run --rm -p 3000:3000 puppeteer-scraper

# Test the API
curl http://localhost:3000/
curl -X POST http://localhost:3000/scrape/google \
  -H "Content-Type: application/json" \
  -d '{"searchTerm": "Docker tutorials"}'
```

### **With Node.js**

```bash
cd src
npm install
npm start

# Server runs on http://localhost:3000
```

## Expected API Response

```json
{
  "success": true,
  "requestDetails": {
    "method": "POST",
    "path": "/scrape/google",
    "body": { "searchTerm": "Docker" },
    "query": {},
    "params": {}
  },
  "data": {
    "type": "google_search",
    "searchTerm": "Docker",
    "htmlLength": 157230,
    "scrapedAt": "2024-01-15T10:30:00.000Z",
    "htmlPreview": "<!DOCTYPE html><html>..."
  },
  "timestamp": "2024-01-15T10:30:05.000Z"
}
```

## AWS Fargate Deployment

Deploy the Express API as a containerized service on AWS Fargate:

```bash
cd aws
npm install
cdk bootstrap
cdk deploy
```

**Features:**

- ✅ **Always available** (no cold starts)
- ✅ **Auto-scaling** (1-3 tasks based on CPU usage)
- ✅ **Application Load Balancer** with health checks
- ✅ **CloudWatch monitoring** and logging
- ✅ **Uses default VPC** (avoids resource limits)
- ✅ **0.5 vCPU and 1GB RAM** per task
- ✅ **Cost:** ~$50/month for continuous operation

**CDK Commands:**

- **Deploy:** `cdk deploy`
- **View differences:** `cdk diff`
- **Synthesize template:** `cdk synth`
- **Destroy stack:** `cdk destroy`

## Development & Testing

### **Test Different Endpoints**

```bash
# Health check
curl http://localhost:3000/

# Google search with POST
curl -X POST http://localhost:3000/scrape/google \
  -H "Content-Type: application/json" \
  -d '{"searchTerm": "Puppeteer tutorials"}'

### **View Request Logs**

The server logs all request details for debugging:

```

## Cost Information

**Monthly Operating Cost:** ~$50 for continuous operation

- **Fargate Compute:** ~$18/month (0.5 vCPU + 1GB RAM)
- **Application Load Balancer:** ~$22/month (fixed + usage)
- **CloudWatch Logs:** ~$2-5/month (depending on log volume)
- **Data Transfer:** ~$1-10/month (depending on traffic)

## Troubleshooting

### **Docker Issues**

- **Port conflict:** Stop existing containers with `docker ps` and `docker stop <container-id>`
- **Build failures:** Check that `package-lock.json` is updated with `npm install`
- **Memory issues:** Increase Docker memory allocation in Docker Desktop

### **AWS Deployment Issues**

- **VPC limits:** Stack now uses default VPC (no new VPC creation)
- **Resource limits:** Check AWS service quotas in your region
- **Permissions:** Ensure IAM user has ECS, EC2, and LoadBalancer permissions

### **API Issues**

- **404 errors:** Check endpoint spelling and HTTP method
- **Request parsing:** Ensure `Content-Type: application/json` header
- **Timeout errors:** Puppeteer operations can take 10-30 seconds

## Extending the API

### **Add New Scraping Endpoints**

```javascript
// In server.js
app.all("/scrape/linkedin/*", async (req, res) => {
  const result = await linkedinScraper(req.body, {
    method: req.method,
    path: req.path,
    query: req.query,
  });
  res.json({ success: true, data: result });
});
```

### **Route Based on Request Details**

```javascript
// Route different scripts based on method/path/body
if (req.method === "POST" && req.path.includes("/scrape/advanced")) {
  result = await advancedScraper(req.body);
} else if (req.query.format === "pdf") {
  result = await pdfScraper(req.body);
}
```

## Security Considerations

- ✅ **Non-root container** user
- ✅ **No sensitive data** in logs
- ✅ **Headless-only** operation
- ✅ **VPC isolation** (Fargate)
- ✅ **IAM roles** for AWS resources

## License

MIT License - see package.json for details.

---

## Quick Start Commands

```bash
# Local development
docker build -t puppeteer-scraper ./src && docker run --rm -p 3000:3000 puppeteer-scraper

# Test API
curl -X POST http://localhost:3000/scrape/google -H "Content-Type: application/json" -d '{"searchTerm": "test"}'

# Deploy to AWS
cd aws && cdk deploy

# Clean up
cd aws && cdk destroy
```
