#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { HelloWorldStack } from '../lib/hello_world-stack';

const app = new cdk.App();
new HelloWorldStack(app, 'HelloWorldStack');
