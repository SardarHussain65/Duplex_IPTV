/**
 * API Configuration
 * Central place for all API-related constants.
 */

export const API_BASE_URL = 'https://duplex-iptv-backend.replatechnologies.com';

export const REST_BASE_URL = `${API_BASE_URL}`;

export const GRAPHQL_URL = `${API_BASE_URL}/graphql`;

/** Default timeout for REST requests (ms) */
export const REQUEST_TIMEOUT_MS = 15_000;

/** How many times to retry a failed request before giving up */
export const MAX_RETRIES = 2;
