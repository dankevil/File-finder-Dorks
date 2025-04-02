# OpenDirFinder Chrome Extension

A Chrome extension that helps you find files in open directories using Google dorks.

## Features

- Search for various file types (movies, games, music, documents)
- Use advanced search options (recently added, parent directories, FTP servers)
- Get direct dork queries for finding open directories
- Customize file extensions for more specific searches
- Get direct download guidance for found files
- Simple and intuitive user interface

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the folder containing this extension
5. The extension icon should appear in your Chrome toolbar

## Usage

1. Click on the extension icon to open the popup
2. Enter your search term (movie name, game title, etc.)
3. Select the appropriate file type category
4. Optionally customize file extensions for specific searches
5. Optionally choose an advanced search option
6. Enable direct download links if you want guidance on downloading files
7. Click the Search button
8. A new tab will open with Google search results

## Advanced Search Options

- **Basic Search**: Standard search for open directories
- **Recently Added**: Find files that were recently added or modified
- **Parent Directory**: Search in parent directories for better organized collections
- **FTP Server**: Look specifically in FTP servers for your files

## Customizing File Extensions

If you're looking for specific file types, you can customize the extensions:

1. Click "Customize Extensions" to expand the options
2. When you select a file type category (Movies, Games, etc.), the extension will automatically fill in the relevant extensions
3. You can modify these pre-filled extensions as needed for your specific search
4. Enter your custom extensions in the format: `ext1|ext2|ext3` (no spaces)
5. For example, for high-quality movie files, you might modify the default to: `mkv|bluray|2160p`

## Direct Download Guidance

Enable the "Direct Download Links" option to get:

- Tips for identifying valid download links in search results
- Guidance on downloading files from open directories
- Instructions on finding files with your specified extensions

## Supported File Types

- **Movies**: mp4, mkv, avi, mov, webm, flv
- **Games**: iso, zip, rar, 7z, exe, msi, dmg, torrent
- **Music**: mp3, flac, wav, ogg, m4a, aac
- **Documents**: pdf, doc, docx, ppt, pptx, xls, xlsx, txt, epub, mobi

## Disclaimer

This extension is designed to find publicly accessible files that are legally available for download. Using this tool to download copyrighted material without permission may violate copyright laws in your country. Always ensure you have the right to download the files you find.

## Development

To modify or enhance this extension:

1. Edit the appropriate files:
   - `popup.html` and `styles.css` for UI changes
   - `popup.js`, `advanced.js`, and `directDownload.js` for functionality
   - `help.html` for documentation updates
2. Reload the extension in Chrome to test your changes

## License

This project is provided as-is, for educational purposes. 