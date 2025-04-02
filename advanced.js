// Advanced dork generation functions

// Function to generate a dork that searches for recently modified files
function generateRecentlyAddedDork(searchTerm, type, customExtensions = null) {
  let fileExtensions = getExtensionsForType(type, customExtensions);
  return `intitle:"index of" "last modified" "${searchTerm}" ${fileExtensions}`;
}

// Function to generate a dork that searches in parent directories
function generateParentDirectoryDork(searchTerm, type, customExtensions = null) {
  let dirType = getDirTypeForCategory(type);
  return `"parent directory" "${dirType}" "${searchTerm}" -html -htm -php -asp -jsp`;
}

// Function to generate a FTP server search dork
function generateFTPDork(searchTerm, type, customExtensions = null) {
  let fileExtensions = getExtensionsForType(type, customExtensions);
  return `intitle:"index of" inurl:ftp "${searchTerm}" ${fileExtensions}`;
}

// Function to generate a dork with specific file size
function generateFileSizeDork(searchTerm, type, sizeOperator, sizeValue, customExtensions = null) {
  let fileExtensions = getExtensionsForType(type, customExtensions);
  return `intitle:"index of" "${searchTerm}" ${fileExtensions} size:${sizeOperator}${sizeValue}`;
}

// Function to generate a basic dork with custom extensions
function generateBasicDork(searchTerm, type, customExtensions = null) {
  let fileExtensions = getExtensionsForType(type, customExtensions);
  return `intitle:"index of" "${searchTerm}" ${fileExtensions}`;
}

// Helper function to get file extensions based on type
function getExtensionsForType(type, customExtensions = null) {
  // If custom extensions are provided, use them instead of defaults
  if (customExtensions && customExtensions.trim() !== '') {
    return `(${customExtensions})`;
  }
  
  // Otherwise use default extensions for the selected type
  switch(type) {
    case 'movies':
      return '(mp4|mkv|avi|mov|webm|flv)';
    case 'games':
      return '(iso|zip|rar|7z|exe|msi|dmg|torrent)';
    case 'music':
      return '(mp3|flac|wav|ogg|m4a|aac)';
    case 'documents':
      return '(pdf|doc|docx|ppt|pptx|xls|xlsx|txt|epub|mobi)';
    default:
      return '';
  }
}

// Helper function to get directory type for category
function getDirTypeForCategory(type) {
  switch(type) {
    case 'movies':
      return '(movies|films|videos)';
    case 'games':
      return '(games|software)';
    case 'music':
      return '(music|audio|mp3)';
    case 'documents':
      return '(documents|docs|ebooks)';
    default:
      return '';
  }
}

// Helper function to get default extensions as array
function getDefaultExtensionsArray(type) {
  switch(type) {
    case 'movies':
      return ['mp4', 'mkv', 'avi', 'mov', 'webm', 'flv'];
    case 'games':
      return ['iso', 'zip', 'rar', '7z', 'exe', 'msi', 'dmg', 'torrent'];
    case 'music':
      return ['mp3', 'flac', 'wav', 'ogg', 'm4a', 'aac'];
    case 'documents':
      return ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'epub', 'mobi'];
    default:
      return [];
  }
}

// Export the functions for use in popup.js
if (typeof module !== 'undefined') {
  module.exports = {
    generateRecentlyAddedDork,
    generateParentDirectoryDork,
    generateFTPDork,
    generateFileSizeDork,
    generateBasicDork,
    getExtensionsForType,
    getDefaultExtensionsArray
  };
} 