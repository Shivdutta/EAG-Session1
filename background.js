const YOUTUBE_API_KEY = 'enter your api key here';
const CHANNELS = {
  moneycontrol: 'UChftTVI0QJmyXkajQYt2tiQ',
  zeebusiness: 'UCkXopQ3ubd-rnXnStZqCl2w'
};
const UPDATE_INTERVAL = 360;

// Initialize when extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed/updated. Setting up alarm...');
  
  // Remove any existing alarms first
  chrome.alarms.clearAll(() => {
    // Create new alarm
    chrome.alarms.create('updateVideos', {
      periodInMinutes: UPDATE_INTERVAL,
      delayInMinutes: 1 // Start first update after 1 minute
    });
    
    // Fetch videos immediately
    fetchAndStoreVideos();
  });
});

// Ensure alarm is running when service worker starts
chrome.runtime.onStartup.addListener(() => {
  console.log('Extension starting up. Checking alarm...');
  
  chrome.alarms.get('updateVideos', (alarm) => {
    if (!alarm) {
      console.log('Alarm not found. Creating new alarm...');
      chrome.alarms.create('updateVideos', {
        periodInMinutes: UPDATE_INTERVAL,
        delayInMinutes: 1
      });
      fetchAndStoreVideos();
    } else {
      console.log('Alarm already exists:', alarm);
    }
  });
});

// Listen for alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  console.log('Alarm triggered:', alarm.name);
  if (alarm.name === 'updateVideos') {
    console.log('Fetching new videos...');
    fetchAndStoreVideos();
  }
});

async function fetchAndStoreVideos() {
  try {
    console.log('Starting video fetch at:', new Date().toLocaleString());
    const videos = {};
    
    for (const [channel, channelId] of Object.entries(CHANNELS)) {
      console.log(`Fetching videos for ${channel}...`);
      
      const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=10`;
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error(`API Error for ${channel}:`, errorData);
        throw new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
      
      if (!data.items || !Array.isArray(data.items)) {
        console.error(`Invalid data format for ${channel}:`, data);
        throw new Error('Invalid data format received from API');
      }
      
      videos[channel] = data.items;
      console.log(`Successfully fetched ${data.items.length} videos for ${channel}`);
    }
    
    await chrome.storage.local.set({ videos });
    await chrome.storage.local.set({ lastUpdate: Date.now() });
    console.log('Videos successfully stored in local storage');
    
    // Clear any previous error
    await chrome.storage.local.remove('fetchError');
    
  } catch (error) {
    console.error('Error in fetchAndStoreVideos:', error);
    await chrome.storage.local.set({ fetchError: error.message });
  }
}

// Add manual refresh capability
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'refreshVideos') {
    console.log('Manual refresh requested');
    fetchAndStoreVideos()
      .then(() => sendResponse({ success: true }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true; // Required for async response
  }
}); 