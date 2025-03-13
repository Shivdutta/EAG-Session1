document.addEventListener('DOMContentLoaded', () => {
  // Initialize with Moneycontrol videos
  loadVideos('moneycontrol');
  
  // Add tab click handlers
  document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      loadVideos(e.target.dataset.channel);
    });
  });

  // Add refresh button handler
  document.getElementById('refresh-btn').addEventListener('click', async () => {
    const refreshBtn = document.getElementById('refresh-btn');
    refreshBtn.style.pointerEvents = 'none';
    refreshBtn.textContent = '⌛';
    
    try {
      await chrome.runtime.sendMessage({ action: 'refreshVideos' });
      // Wait a short moment for storage to be updated
      await new Promise(resolve => setTimeout(resolve, 500));
      // Reload videos for current active tab
      const activeTab = document.querySelector('.tab-btn.active');
      if (activeTab) {
        await loadVideos(activeTab.dataset.channel);
      }
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      refreshBtn.style.pointerEvents = 'auto';
      refreshBtn.textContent = '🔄';
    }
  });
});

async function loadVideos(channel) {
  const loadingElement = document.getElementById('loading');
  const errorElement = document.getElementById('error');
  const videosContainer = document.getElementById('videos-container');
  
  loadingElement.style.display = 'block';
  errorElement.style.display = 'none';
  videosContainer.innerHTML = '';
  
  // Remove any existing last-update element
  const existingLastUpdate = document.querySelector('.last-update');
  if (existingLastUpdate) {
    existingLastUpdate.remove();
  }
  
  try {
    const { videos, fetchError, lastUpdate } = await chrome.storage.local.get(['videos', 'fetchError', 'lastUpdate']);
    
    if (fetchError) {
      throw new Error(`API Error: ${fetchError}`);
    }
    
    if (!videos || !videos[channel] || !Array.isArray(videos[channel])) {
      throw new Error('No videos available. Please check your API key and try again.');
    }
    
    const channelVideos = videos[channel];
    
    if (channelVideos.length === 0) {
      throw new Error('No videos found for this channel');
    }
    
    // Add last update time once at the top of the container
    if (lastUpdate) {
      const lastUpdateElement = document.createElement('div');
      lastUpdateElement.className = 'last-update';
      lastUpdateElement.textContent = `Last updated: ${new Date(lastUpdate).toLocaleString()}`;
      const container = document.querySelector('.container');
      const header = document.querySelector('.header');
      container.insertBefore(lastUpdateElement, header.nextSibling);
    }
    
    // Display videos
    videosContainer.innerHTML = channelVideos
      .map(video => {
        if (!video.id?.videoId || !video.snippet?.title || !video.snippet?.thumbnails?.default?.url) {
          console.error('Invalid video object:', video);
          return '';
        }
        
        return `
          <a href="https://www.youtube.com/watch?v=${video.id.videoId}" 
             class="video-item" 
             target="_blank">
            <img class="video-thumbnail" 
                 src="${video.snippet.thumbnails.default.url}" 
                 alt="${video.snippet.title}">
            <div class="video-info">
              <h3 class="video-title">${video.snippet.title}</h3>
              <div class="video-date">
                ${new Date(video.snippet.publishedAt).toLocaleDateString()}
              </div>
            </div>
          </a>
        `;
      })
      .filter(html => html)
      .join('');
    
  } catch (error) {
    console.error('Error in loadVideos:', error);
    errorElement.textContent = error.message;
    errorElement.style.display = 'block';
  } finally {
    loadingElement.style.display = 'none';
  }
} 