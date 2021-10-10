import { writable, readable } from 'svelte/store';

//basics-form stores
export const organizationName = writable("");
export const organizationType = writable("");
export const shortDesc = writable("");
export const website = writable("");
export const telegram = writable("");
export const discord = writable("");
export const twitter = writable("");
export const medium = writable("");
export const whitepaper = writable("");
export let deepdive = writable([{insert:""}]);
export let cover = writable();
export let logo = writable();

//Token metric stores
export const tokenAddress = writable("");
export const tokenName = writable("");
export const tokenTotalSupply = writable(0);
export const tokenIcon = writable("");
export const tokenTicker = writable("");
export const tokenFixedSupply = writable(false);
export const tokenTotalRaised = writable(0);

export const deepdiveTemplatePrivate = readable([
	{ insert: '1. PROJECT OVERVIEW' },
	{ insert: '\n', attributes: {header: 2}  },
	{ insert: '\n'},
	{ insert: '2. GO-TO-MARKET STRATEGY' },
	{ insert: '\n', attributes: {header: 2}  },
	{ insert: '\n'},
	{ insert: '3. PRODUCT VIABILITY' },
	{ insert: '\n', attributes: {header: 2}  },
	{ insert: '\n'},
	{ insert: '4. PRODUCT ROADMAP' },
	{ insert: '\n', attributes: {header: 2}  },
	{ insert: '\n'},
	{ insert: '5. REVENUE STREAMS' },
	{ insert: '\n', attributes: {header: 2}  },
	{ insert: '\n'},
	{ insert: '6. PRODUCT DIVE' },
	{ insert: '\n', attributes: {header: 2}  },
	{ insert: '\n'},
	{ insert: '7. TECHNOLOGIES USED AND CREATED BY THE PROJECT' },
	{ insert: '\n', attributes: {header: 2}  },
	{ insert: '\n'},
	{ insert: '8. TEAM & ADVISORS' },
	{ insert: '\n', attributes: {header: 2}  },
	{ insert: '\n'},
	{ insert: '9. INVESTORS & PARTNERS' },
	{ insert: '\n', attributes: {header: 2}  },
	{ insert: '\n'},
	{ insert: '10. TOKEN ECONOMY' },
	{ insert: '\n', attributes: {header: 2}  },
	{ insert: '\n'},
	{ insert: '11. PREVIOUS RAISES' },
	{ insert: '\n', attributes: {header: 2}  },
	{ insert: '\n'},
	{ insert: '12. TOKEN DISTRIBUTION' },
	{ insert: '\n', attributes: {header: 2}  },
	{ insert: '\n'},
	{ insert: '13. TOKEN RELEASE SCHEDULE' },
	{ insert: '\n', attributes: {header: 2}  },
	{ insert: '\n'},
]);
export const deepdiveTemplateDao = readable([
	{ insert: '1. PROJECT OVERVIEW' },
	{ insert: '\n', attributes: {header: 2}  },
	{ insert: '\n'},
	{ insert: '2. GO-TO-MARKET STRATEGY' },
	{ insert: '\n', attributes: {header: 2}  },
	{ insert: '\n'},
	{ insert: '3. DAO VIABILITY' },
	{ insert: '\n', attributes: {header: 2}  },
	{ insert: '\n'},
	{ insert: '4. DAO ROADMAP' },
	{ insert: '\n', attributes: {header: 2}  },
	{ insert: '\n'},
	{ insert: '5. REVENUE STREAMS' },
	{ insert: '\n', attributes: {header: 2}  },
	{ insert: '\n'},
	{ insert: '6. PRODUCT(S) DIVE' },
	{ insert: '\n', attributes: {header: 2}  },
	{ insert: '\n'},
	{ insert: '7. TECHNOLOGIES USED AND CREATED BY THE DAO' },
	{ insert: '\n', attributes: {header: 2}  },
	{ insert: '\n'},
	{ insert: '8. FOUNDING MEMBERS' },
	{ insert: '\n', attributes: {header: 2}  },
	{ insert: '\n'},
	{ insert: '9. INVESTORS & PARTNERS' },
	{ insert: '\n', attributes: {header: 2}  },
	{ insert: '\n'},
	{ insert: '10. TOKEN ECONOMY' },
	{ insert: '\n', attributes: {header: 2}  },
	{ insert: '\n'},
	{ insert: '11. PREVIOUS RAISES' },
	{ insert: '\n', attributes: {header: 2}  },
	{ insert: '\n'},
	{ insert: '12. TOKEN AND OR REPUTATION DISTRIBUTION' },
	{ insert: '\n', attributes: {header: 2}  },
	{ insert: '\n'},
	{ insert: '13. TOKEN RELEASE SCHEDULE' },
	{ insert: '\n', attributes: {header: 2}  },
	{ insert: '\n'},
]);

//Limited curve stores
export const mode = writable("exp");
export const totalSupply = writable(1000000);
export const range = writable(10);
export const offset = writable(0.5);
export const factorExp = writable(0);
export const factorLin = writable(0);
