Generic archive information:

```json
{
  "uid": 1234,
  "name": "Archive Name",
  "domain": "example.com",
  "http": true,
  "https": true,
  "software": "foolfuuka",
  "boards": ["a"],
  "files": ["a"],
  "search": ["a"],
  "reports": true
}
```

Most entries should be self-explanatory.

`uid` stands for "unique id", used on the client-side to save archive-specific settings.
The `uid` for a new archive should be an increment of the highest one,
make sure it does not overlap with an archive that previously died for example.

`software` can be `"foolfuuka"` or `"fuuka"` for example.

`files` is the list of boards whose files (images, videos, pdfs) are also archived, even temporarily, and not just thumbnails.

`search` is the list of boards where search is enabled. If this field is missing then it implies that search is enabled on all boards.

`reports` indicates that you have enabled the offsite reporting API from https://github.com/pleebe/foolfuuka-plugin-popup-report. It is assumed false if missing.

Archives with HTTPS support are listed before archives without HTTPS support.

Also, be sure to add your board to [archives.md](https://github.com/MayhemYDG/archives.json/blob/gh-pages/archives.md) at some point.