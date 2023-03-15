export default function generateManifestJson(p, version, channel) {
  const manifest = {
    "name": p.meta.name,
    "version": version.version,
    "manifest_version": 2,
    "description": p.description,
    "icons": {
      "16": "icon16.png",
      "48": "icon48.png",
      "128": "icon128.png"
    },
    "content_scripts": [{
      "js": ["script.js"],
      "matches": p.meta.matches_only.concat(p.meta.matches, p.meta.matches_extra),
      "exclude_matches": p.meta.exclude_matches,
      "all_frames": true,
      "run_at": "document_start"
    }],
    "background": {
      "scripts": ["eventPage.js"],
      "persistent": false
    },
    "homepage_url": p.meta.page,
    "minimum_chrome_version": p.meta.min.chrome,
    "permissions": p.meta.matches_only.concat(p.meta.matches, ["storage"]),
    "optional_permissions": [
      "*://*/"
    ],
    "applications": {
      "gecko": {
        "id": p.meta.appidGecko,
      }
    }
  };

  if (channel !== '-noupdate') {
    manifest.update_url = `${p.meta.downloads}updates${channel}.xml`;
    manifest.applications.gecko.update_url = `${p.meta.downloads}updates${channel}.json`;
  }

  return JSON.stringify(manifest, undefined, 2);
}
