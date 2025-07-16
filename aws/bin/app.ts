#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { PuppeteerFargateStack } from "../lib/puppeteer-fargate-stack";

const app = new cdk.App();

const account = "";
const region = "us-east-1";

// Create the Puppeteer Fargate stack
new PuppeteerFargateStack(app, "PuppeteerFargateStack", {
  // Stack configuration
  env: {
    // Use default AWS account and region from environment
    account,
    region,
  },

  // Stack description
  description:
    "Scalable Puppeteer-based web scraping system deployed on AWS Fargate",

  // Stack tags
  tags: {
    Project: "PuppeteerScraper",
    Environment: "Production",
    CreatedBy: "CDK",
  },

  // Stack name for CloudFormation
  stackName: "PuppeteerFargateStack",
});
