import { writable, readable } from 'svelte/store';

export const organizationName = writable("");
export const organizationType = writable("");
export const shortDesc = writable("");
export const tokenAddress = writable("");
export const website = writable("");
export const telegram = writable("");
export const discord = writable("");
export const twitter = writable("");
export const issueingType = writable("ltd");
export const price = writable(0);
export const deepdive = writable("");

export const deepdiveTemplatePrivate = readable(
`### 1. PROJECT OVERVIEW

### 2. GO-TO-MARKET STRATEGY

### 3. PRODUCT VIABILITY 

### 4. PRODUCT ROADMAP

### 5. REVENUE STREAMS

### 6. PRODUCT DIVE

### 7. TECHNOLOGIES USED AND CREATED BY THE PROJECT

### 8. TEAM & ADVISORS

### 9. INVESTORS & PARTNERS

### 10. TOKEN ECONOMY

### 11. PREVIOUS RAISES

### 12. TOKEN DISTRIBUTION

### 13. TOKEN RELEASE SCHEDULE`);

export const deepdiveTemplateDao = readable(
`### 1. PROJECT OVERVIEW

### 2. GO-TO-MARKET STRATEGY

### 3. DAO VIABILITY 

### 4. DAO ROADMAP

### 5. REVENUE STREAMS

### 6. PRODUCT(S) DIVE

### 7. TECHNOLOGIES USED AND CREATED BY THE PROJECT

### 8. FOUNDING MEMBERS

### 9. INVESTORS & PARTNERS

### 10. TOKEN ECONOMY

### 11. PREVIOUS RAISES

### 12. TOKEN AND OR REPUTATION DISTRIBUTION

### 13. TOKEN RELEASE SCHEDULE`);

