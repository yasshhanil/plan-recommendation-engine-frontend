export const DEBUG = true;

const DEV_BASE  = 'http://192.168.1.11:8000/api';
const PROD_BASE = 'https://plan-recommendation-engine-production.up.railway.app/api';

export const API_BASE = DEBUG ? DEV_BASE : PROD_BASE;
