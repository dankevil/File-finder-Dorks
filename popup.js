document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const resultsList = document.getElementById('resultsList');
  const helpBtn = document.getElementById('helpBtn');
  const customExtensionsInput = document.getElementById('customExtensions');
  const enableDirectDownload = document.getElementById('enableDirectDownload');
  const themeToggle = document.getElementById('themeToggle');
  
  // Type buttons
  const movieBtn = document.getElementById('movieBtn');
  const gameBtn = document.getElementById('gameBtn');
  const musicBtn = document.getElementById('musicBtn');
  const documentBtn = document.getElementById('documentBtn');
  
  // Advanced search radio buttons
  const basicSearch = document.getElementById('basicSearch');
  const recentlyAdded = document.getElementById('recentlyAdded');
  const parentDirectory = document.getElementById('parentDirectory');
  const ftpServer = document.getElementById('ftpServer');
  
  // Initialize the direct downloader
  const directDownloader = new DirectDownloader();
  
  // Current selected type
  let selectedType = null;
  
  // Add event listeners for type buttons
  const typeButtons = [movieBtn, gameBtn, musicBtn, documentBtn];
  
  // Initialize theme from saved preferences
  initializeTheme();
  
  // Theme toggle event listener
  themeToggle.addEventListener('change', function() {
    if (this.checked) {
      document.body.classList.add('dark-mode');
      saveThemePreference('dark');
    } else {
      document.body.classList.remove('dark-mode');
      saveThemePreference('light');
    }
    // Add a small animation to the entire interface to make the theme change more noticeable
    document.body.style.transition = 'background-color 0.3s ease';
    document.querySelector('.container').style.transition = 'background-color 0.3s ease, box-shadow 0.3s ease';
  });
  
  // Function to initialize theme based on saved preference
  function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      themeToggle.checked = true;
    } else {
      document.body.classList.remove('dark-mode');
      themeToggle.checked = false;
    }
  }
  
  // Function to save theme preference
  function saveThemePreference(theme) {
    localStorage.setItem('theme', theme);
  }
  
  typeButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Add animation to the clicked button
      this.classList.add('btn-clicked');
      setTimeout(() => {
        this.classList.remove('btn-clicked');
      }, 300);
      
      // Remove selected class from all buttons
      typeButtons.forEach(btn => btn.classList.remove('selected'));
      
      // Add selected class to clicked button
      this.classList.add('selected');
      
      // Update selected type
      selectedType = this.textContent.toLowerCase().trim();
      
      // Extract type name without the icon
      if (selectedType.includes('movies')) selectedType = 'movies';
      else if (selectedType.includes('games')) selectedType = 'games';
      else if (selectedType.includes('music')) selectedType = 'music';
      else if (selectedType.includes('documents')) selectedType = 'documents';
      
      // Get default extensions for this type
      const defaultExtensions = getDefaultExtensionsArray(selectedType).join('|');
      
      // Update custom extensions placeholder
      customExtensionsInput.placeholder = `Custom extensions (e.g., ${defaultExtensions})`;
      
      // Automatically fill in the extensions field with default values
      customExtensionsInput.value = defaultExtensions;
    });
  });
  
  // Search button click event
  searchBtn.addEventListener('click', function() {
    // Add button click animation
    this.classList.add('btn-active');
    setTimeout(() => {
      this.classList.remove('btn-active');
    }, 300);
    
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) {
      showError('Please enter a search term');
      return;
    }
    
    if (!selectedType) {
      showError('Please select a file type');
      return;
    }
    
    // Get custom extensions if provided
    const customExtensions = customExtensionsInput.value.trim();
    
    // Clear previous results
    resultsList.innerHTML = '<div class="result-item">Searching...</div>';
    
    // Hide download section by default
    directDownloader.hideDownloadSection();
    
    // Generate dork based on selected search type
    let dorkQuery = '';
    
    if (recentlyAdded.checked) {
      dorkQuery = generateRecentlyAddedDork(searchTerm, selectedType, customExtensions);
    } else if (parentDirectory.checked) {
      dorkQuery = generateParentDirectoryDork(searchTerm, selectedType, customExtensions);
    } else if (ftpServer.checked) {
      dorkQuery = generateFTPDork(searchTerm, selectedType, customExtensions);
    } else {
      // Default to basic search
      dorkQuery = generateBasicDork(searchTerm, selectedType, customExtensions);
    }
    
    // Use the actual extensions that will be used in the search
    const fileExtensions = getExtensionsForType(selectedType, customExtensions);
    
    // Perform the search
    performSearch(dorkQuery, fileExtensions);
  });
  
  // Help button click event
  helpBtn.addEventListener('click', function() {
    chrome.tabs.create({ url: 'help.html' });
  });
  
  // Add CSS for animations
  const style = document.createElement('style');
  style.textContent = `
    .btn-clicked {
      transform: scale(0.95);
    }
    .btn-active {
      transform: scale(0.98);
    }
    .type-btn, .search-button {
      transition: all 0.2s ease;
    }
    .search-button, #helpBtn, .type-btn {
      position: relative;
      overflow: hidden;
    }
    .search-button:after, #helpBtn:after, .type-btn:after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 5px;
      height: 5px;
      background: rgba(255, 255, 255, 0.5);
      opacity: 0;
      border-radius: 100%;
      transform: scale(1, 1) translate(-50%);
      transform-origin: 50% 50%;
    }
    .search-button:focus:not(:active)::after, #helpBtn:focus:not(:active)::after, .type-btn:focus:not(:active)::after {
      animation: ripple 1s ease-out;
    }
    @keyframes ripple {
      0% {
        transform: scale(0, 0);
        opacity: 0.5;
      }
      20% {
        transform: scale(25, 25);
        opacity: 0.3;
      }
      100% {
        opacity: 0;
        transform: scale(40, 40);
      }
    }
  `;
  document.head.appendChild(style);
  
  // Function to show error message
  function showError(message) {
    resultsList.innerHTML = `<div class="result-item" style="color: var(--light-accent); border-left: 3px solid var(--light-accent);"><i class="fas fa-exclamation-circle"></i> ${message}</div>`;
    
    // If in dark mode, use dark mode accent color
    if (document.body.classList.contains('dark-mode')) {
      const errorElement = resultsList.querySelector('.result-item');
      errorElement.style.color = 'var(--dark-accent)';
      errorElement.style.borderLeft = '3px solid var(--dark-accent)';
    }
  }
  
  // Function to generate basic Google dork
  function generateBasicDork(searchTerm, type, customExtensions) {
    let fileExtensions = getExtensionsForType(type, customExtensions);
    return `intitle:"index of" "${searchTerm}" ${fileExtensions}`;
  }
  
  // Function to perform the search using the generated dork
  function performSearch(dorkQuery, fileExtensions) {
    // Encode the dork query for URL
    const encodedQuery = encodeURIComponent(dorkQuery);
    
    // Create Google search URL
    const searchUrl = `https://www.google.com/search?q=${encodedQuery}`;
    
    // Open a new tab with the search results
    chrome.tabs.create({ url: searchUrl }, function(tab) {
      // Add a message that the search was opened in a new tab
      resultsList.innerHTML = `<div class="result-item"><i class="fas fa-check-circle"></i> Search opened in a new tab</div>`;
      
      // Create and store the dork for reference
      const dorkItem = document.createElement('div');
      dorkItem.className = 'result-item';
      dorkItem.innerHTML = `<strong>Dork used:</strong> <code>${dorkQuery}</code>`;
      resultsList.appendChild(dorkItem);
      
      // If direct download is enabled, try to process results
      if (enableDirectDownload.checked) {
        directDownloader.processSearchResults(searchUrl, fileExtensions);
      }
    });
  }
}); 