# Puppeteer Web Scraping System on AWS Fargate

A scalable Puppeteer-based web scraping system that searches Google and scrapes HTML content, deployed using AWS CDK on Fargate.

## Project Overview

This project creates a containerized web scraping system that:

- Uses Puppeteer v24.13.0 with Node.js 20
- Searches Google for "ChatGPT"
- Scrapes the HTML content of search results
- Logs the HTML content length
- Runs reliably in headless mode
- Deploys to AWS Fargate using CDK

## Project Structure

```
project-root/
├── index.js                          # Main Puppeteer scraping script
├── package.json                      # Node.js dependencies
├── Dockerfile                        # Docker configuration
├── README.md                         # This file
└── aws/                             # AWS CDK infrastructure
    ├── bin/app.ts                   # CDK app entry point
    ├── lib/puppeteer-fargate-stack.ts # Fargate stack definition
    ├── cdk.json                     # CDK configuration
    ├── package.json                 # CDK dependencies
    └── tsconfig.json                # TypeScript configuration
```

## Running with Docker

### 1. Build the Docker Image

```bash
docker build -t puppeteer-scraper .
```

### 2. Run the Container

```bash
docker run --rm puppeteer-scraper
```

### 3. Run with Interactive Mode (to see logs in real-time)

```bash
docker run --rm -it puppeteer-scraper
```

### 4. Run with Port Mapping (if you want to expose port 3000)

```bash
docker run --rm -p 3000:3000 puppeteer-scraper
```

## Expected Output

When you run the container, you should see output like this:

```
Starting Puppeteer browser...
Browser launched successfully
Navigating to Google...
Google loaded, searching for "ChatGPT"...
Search submitted, waiting for results...
Search results loaded, scraping HTML content...
HTML content scraped successfully!
HTML content length: [NUMBER] characters
Waiting 5 seconds...
Scraping completed successfully!
Web scraping completed successfully
Closing browser...
```

## Optional Docker Commands

### Run in Background

```bash
docker run -d --name puppeteer-container puppeteer-scraper
```

### View Logs from Background Container

```bash
docker logs puppeteer-container
```

### Stop and Remove Background Container

```bash
docker stop puppeteer-container
docker rm puppeteer-container
```

## AWS Deployment with CDK

### Prerequisites

- AWS CLI configured with appropriate credentials
- Node.js 18+ installed
- AWS CDK CLI installed: `npm install -g aws-cdk`

### Deploy to AWS Fargate

1. **Navigate to the AWS directory:**

   ```bash
   cd aws
   ```

2. **Install CDK dependencies:**

   ```bash
   npm install
   ```

3. **Bootstrap CDK (first time only):**

   ```bash
   cdk bootstrap
   ```

4. **Deploy the stack:**

   ```bash
   cdk deploy
   ```

5. **View the deployment:**
   The deployment will output the Application Load Balancer URL where your service is accessible.

### CDK Commands

- **Synthesize CloudFormation template:** `cdk synth`
- **View differences:** `cdk diff`
- **Destroy the stack:** `cdk destroy`

## Features

### Puppeteer Configuration

- Headless mode with `headless: 'new'`
- Optimized Chrome arguments for containerized environments
- No sandbox mode for Docker compatibility
- Graceful error handling and browser cleanup

### Docker Features

- Based on Node.js 20 official image
- Includes all Chromium dependencies
- Non-root user for security
- Health checks included
- Optimized for production environments

### AWS Fargate Features

- **Resources:** 512 CPU units (0.5 vCPU) and 1GB RAM
- **Auto Scaling:** CPU-based scaling from 1 to 3 tasks
- **Load Balancer:** Application Load Balancer with health checks
- **Logging:** CloudWatch logs with 1-week retention
- **Networking:** VPC with 2 AZs and 1 NAT Gateway
- **Monitoring:** Container Insights enabled

## Environment Configuration

### Local Development

The Docker container runs the scraping task once and exits. It's designed for batch processing rather than serving HTTP requests.

### Production (AWS Fargate)

- The container is managed by ECS Fargate
- Accessible via Application Load Balancer
- Auto-scales based on CPU utilization
- Logs are sent to CloudWatch

## Troubleshooting

### Docker Issues

- If Chrome fails to start, ensure you're running with `--no-sandbox` flag
- For memory issues, increase Docker's memory allocation
- Check that all Chromium dependencies are installed in the container

### CDK Deployment Issues

- Ensure AWS credentials are configured: `aws configure`
- Check that your account has sufficient permissions for ECS, EC2, and Load Balancer resources
- Verify the region supports Fargate: most major regions do

### Puppeteer Issues

- If Google blocks requests, the script includes user agent spoofing
- Cookie acceptance is handled automatically
- Timeouts are configured for reliable operation

## Security Considerations

- Container runs as non-root user
- VPC isolates the Fargate tasks
- No sensitive data is logged
- Chrome runs in sandboxed mode where possible

## Cost Optimization

- Single NAT Gateway to reduce costs
- Log retention set to 1 week
- Auto-scaling prevents over-provisioning
- Container stops after task completion

## License

MIT License - see package.json for details.
