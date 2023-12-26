declare module '*.css' { const css: string; export default css; }
declare module '*.woff' { const woff: string; export default woff; }
declare module '*.woff2' { const woff2: string; export default woff2; }
declare module '*.html' { const html: string; export default html; }
declare module '*.gif' { const gif: string; export default gif; }
declare module '*.png' { const png: string; export default png; }
declare module '*.wav' { const wav: string; export default wav; }
declare module '*/package.json' {
  const meta: {
    "name": string,
    "path": string,
    "fork": string,
    "page": string,
    "downloads": string,
    "oldVersions": string,
    "faq": string,
    "captchaFAQ": string,
    "cssGuide": string,
    "license": string,
    "changelog": string,
    "issues": string,
    "newIssue": string,
    "newIssueMaxLength": number,
    "alternatives": string,
    "appid": string,
    "appidGecko": string,
    "chromeStoreID": string,
    "recaptchaKey": string,
    "distBranch": string,
    "includes_only": string[],
    "matches_only": string[],
    "matches": string[],
    "matches_extra": string[],
    "exclude_matches": string[],
    "grants": string[],
    "min": {
      "chrome": string,
      "firefox": string,
      "greasemonkey": string
    }
  }
  export default meta;
}
declare module '*/version.json' {
  const versionInfo: {
    version: string,
    /** ISO */
    date: string,
  }
  export default versionInfo;
}
declare module '*/archives.json' {
  const archives: {
    uid: number,
    name: string,
    domain: string,
    http: boolean,
    https: boolean,
    software: string,
    boards: string[],
    files: string[],
    search?: string[],
    reports?: boolean,
  }[];
  export default archives;
}
declare module '*/banners.json' {
  const banners: string[];
  export default banners;
}
