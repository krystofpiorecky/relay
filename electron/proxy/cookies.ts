export type CookieSchema = {
  name: string
  value: string,
  domain: string,
  path: string,
  httpOnly: boolean,
  secure: boolean,
  sameSite?: "None",
  expires: number,
  active: boolean
};

const expires = Date.now() + 30 * 24 * 60 * 60 * 1000;

export const COOKIES: CookieSchema[] = [{
  "name": "cf_clearance",
  "value": "NeHtWi8OumdFncpPWjEfs3IrhTfSNEl1s6M_dLMZCps-1760533096-1.2.1.1-2.8i97vJ3yIi0BabnfudDj6aJdoECsnTigMjnMs73_ayHCHmmqvvo6uPxMe.guotlhIn1ASkb.d02GblJc4ORHN1YaEADuPjHbfK_0O50H.WfVmBCPBcT_3v7Qem4N29XAAS5LegrqvLyebagT5U7Bu.6nIDpnbKrTu0tqwU61zvKgA_XWlsc9NKUEwWPmRlpXZ3xYHo_CXDbmdbcQ8AhcJiRhHpozDO6v0uiAYbbc8",
  "domain": ".skinsearch.dev",
  "path": "/",
  "httpOnly": true,
  "secure": true,
  "sameSite": "None",
  "expires": expires,
  active: true
}, {
  "name": "identity",
  "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiNzY1NjExOTgwOTk0NTI2OTUifSwiaXNzIjoic2tpbnNlYXJjaCIsInN1YiI6ImlkZW50aXR5In0.1GUmVVlxxS4u9--R1pzf-om9cb9q9Mgi7mnjWIwmr74",
  "domain": "skinsearch.dev",
  "path": "/",
  "httpOnly": true,
  "secure": true,
  "expires": expires,
  active: true
}, {
  "name": "content",
  "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImF2YXRhciI6Ijg0NTQ0YzNlMWY4MjBiZjdlY2VhMTI4ZmYwNjI4MjIzNzIzYWZhM2MiLCJpZCI6Ijc2NTYxMTk4MDk5NDUyNjk1IiwibmFtZSI6InZ5aGxlZGF2YW0gZG9taW5hbnRuaSB6ZW55In0sImlzcyI6InNraW5zZWFyY2giLCJzdWIiOiJjb250ZW50In0.qsNMU8Eszs8bNpe_uFyrQhnG2lgMvH-zNQoW_kHfG6E",
  "domain": "skinsearch.dev",
  "path": "/",
  "httpOnly": false,
  "secure": true,
  "expires": expires,
  active: true
}, {
  "name": "discord",
  "value": "eyJpZCI6IjM5MzgwNTU3MjcxOTUwOTUyNSIsInVzZXJuYW1lIjoic2h0b29vZmkiLCJhdmF0YXIiOiJiYWI4N2Q2Nzc3N2U2N2QxZDAxNmM4N2I3YWQ5NzRkOCIsImFwcF9hZGRlZCI6dHJ1ZX0",
  "domain": "skinsearch.dev",
  "path": "/",
  "httpOnly": false,
  "secure": true,
  "expires": expires,
  active: true
}];
