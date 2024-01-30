import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import AppController from '../controller/app.controller.js';

const port = 8080;

export const app = express().use(cors()).use(bodyParser.json()).use(AppController);
