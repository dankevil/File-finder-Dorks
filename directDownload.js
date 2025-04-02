// Direct Download Functionality

class DirectDownloader {
  constructor() {
    this.downloadSection = document.getElementById('downloadSection');
    this.downloadList = document.getElementById('downloadList');
    this.downloadLoader = document.getElementById('downloadLoader');
    this.maxResults = 15; // Maximum number of results to display
  }

  // Show the download section
  showDownloadSection() {
    this.downloadSection.style.display = 'block';
    // Add a fade-in animation
    this.downloadSection.style.opacity = '0';
    this.downloadSection.style.transform = 'translateY(10px)';
    this.downloadList.innerHTML = '';
    this.downloadLoader.style.display = 'block';
    
    // Trigger animation
    setTimeout(() => {
      this.downloadSection.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      this.downloadSection.style.opacity = '1';
      this.downloadSection.style.transform = 'translateY(0)';
    }, 10);
  }

  // Hide the download section
  hideDownloadSection() {
    // Add fade-out effect
    this.downloadSection.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    this.downloadSection.style.opacity = '0';
    this.downloadSection.style.transform = 'translateY(10px)';
    
    // Actually hide it after the animation completes
    setTimeout(() => {
      this.downloadSection.style.display = 'none';
    }, 300);
  }

  // Process Google search results to find direct download links
  async processSearchResults(searchUrl, fileExtensions) {
    try {
      this.showDownloadSection();
      
      // Message about opening in a new tab
      this.downloadList.innerHTML = `
        <div class="result-item">
          <i class="fas fa-info-circle"></i> Google search opened in a new tab. Due to browser security restrictions, 
          we cannot directly extract links from search results.
        </div>
        <div class="result-item">
          <p><i class="fas fa-lightbulb"></i> Tips for finding direct download links:</p>
          <ol>
            <li>In the Google results, look for URLs that contain "Index of" or "Directory Listing"</li>
            <li>Click those links to open the directory</li>
            <li>Look for files with these extensions: ${fileExtensions.replace(/[\(\)]/g, '')}</li>
            <li>Right-click on the file link and select "Save link as..." to download</li>
          </ol>
        </div>
      `;
      
      this.downloadLoader.style.display = 'none';
    } catch (error) {
      this.showError(`Error finding direct download links: ${error.message}`);
    }
  }

  // Show error in download section
  showError(message) {
    this.downloadLoader.style.display = 'none';
    
    // Use CSS variables for colors to support dark mode
    const isDarkMode = document.body.classList.contains('dark-mode');
    const accentVar = isDarkMode ? 'var(--dark-accent)' : 'var(--light-accent)';
    
    this.downloadList.innerHTML = `
      <div class="result-item" style="color: ${accentVar}; border-left: 3px solid ${accentVar};">
        <i class="fas fa-exclamation-circle"></i> ${message}
      </div>
    `;
  }

  // Helper function to extract file extension from URL
  getFileExtension(url) {
    const parts = url.split('.');
    if (parts.length < 2) return '';
    return parts[parts.length - 1].toLowerCase();
  }

  // Helper function to get file name from URL
  getFileName(url) {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
  }

  // Check if the URL points to a file with one of the allowed extensions
  isFileWithAllowedExtension(url, extensions) {
    if (!url) return false;
    
    // Convert extensions string to array
    let extensionsArray = [];
    if (typeof extensions === 'string') {
      // Remove parentheses and split by pipe
      extensionsArray = extensions.replace(/[\(\)]/g, '').split('|');
    } else if (Array.isArray(extensions)) {
      extensionsArray = extensions;
    }
    
    const fileExt = this.getFileExtension(url);
    return extensionsArray.includes(fileExt);
  }

  // Create a download item element
  createDownloadItem(fileName, url) {
    const item = document.createElement('div');
    item.className = 'download-item';
    
    // Add entrance animation delay based on index
    const delay = Math.random() * 0.3;
    item.style.animation = `fadeIn 0.3s ease ${delay}s both`;
    
    const nameSpan = document.createElement('div');
    nameSpan.className = 'download-item-name';
    nameSpan.textContent = fileName;
    
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'download-btn';
    downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download';
    
    // Add ripple effect to download button
    downloadBtn.addEventListener('mousedown', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const circle = document.createElement('span');
      circle.style.position = 'absolute';
      circle.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
      circle.style.borderRadius = '50%';
      circle.style.width = '100px';
      circle.style.height = '100px';
      circle.style.left = x - 50 + 'px';
      circle.style.top = y - 50 + 'px';
      circle.style.transform = 'scale(0)';
      circle.style.transition = 'transform 0.5s, opacity 0.5s';
      
      this.appendChild(circle);
      
      setTimeout(() => {
        circle.style.transform = 'scale(1)';
        circle.style.opacity = '0';
        setTimeout(() => {
          circle.remove();
        }, 500);
      }, 10);
    });
    
    downloadBtn.addEventListener('click', () => {
      chrome.tabs.create({ url });
    });
    
    item.appendChild(nameSpan);
    item.appendChild(downloadBtn);
    
    return item;
  }

  // Parse an open directory page to find downloadable files
  parseDirectoryPage(html, allowedExtensions) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const links = doc.querySelectorAll('a');
    const files = [];
    
    for (const link of links) {
      const href = link.getAttribute('href');
      if (this.isFileWithAllowedExtension(href, allowedExtensions)) {
        files.push({
          name: this.getFileName(href),
          url: href
        });
      }
      
      if (files.length >= this.maxResults) break;
    }
    
    return files;
  }
} 