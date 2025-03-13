Cursor Chrome Extension Setup    https://www.youtube.com/watch?v=fpK_gFP_Nq4

    Step 1: Cursor Installation

        Cursor Official Website  https://www.cursor.com/

        sudo chmod +x Cursor-0.46.8-be4f0962469499f009005e66867c8402202ff0b7.   deb.glibc2.25-x86_64.AppImage
        
        ./Cursor-0.46.8-be4f0962469499f009005e66867c8402202ff0b7.deb.glibc2.25-x86_64.AppImage --no-sandbox

Step 2: Steps to Create a YouTube API Key

    1. Create a Google Cloud Project

        Go to the Google Cloud Console.

        Sign in with your Google account.

        Click the Select a project dropdown (top left) and then click New Project.

        Give your project a name (e.g., "YouTube Video Fetcher") and click Create.

    2. Enable the YouTube Data API

        Inside your project, go to the Google API Library.

        Search for YouTube Data API v3.

        Click on it and then click Enable.

    3. Create an API Key

        Go to the Google Cloud Credentials page.

        Click Create Credentials > API key.

        Your API key will be generated. Copy it.

    4. Restrict the API Key (Optional but Recommended)

        Click on the created API key in the Credentials page.

        Under Application restrictions, select HTTP referrers (Websites).

        Add your extension's ID (chrome-extension://YOUR_EXTENSION_ID/).

        Under API restrictions, select YouTube Data API v3.

        Click Save.

    5. Test Your API Key

        Run this in your browser (replace YOUR_API_KEY with your actual API key)

        curl -X GET "https://www.googleapis.com/youtube/v3/search?part=snippet& channelId=UChftTVI0QJmyXkajQYt2tiQ&maxResults=5&key=YOUR_API_KEY"

Step 3: Prompt Generation

    Chrome Extension Prompt

    Prompt:"Create a Chrome extension that fetches and displays the latest videos from Moneycontrol and Zee Business. The extension should have a popup UI that lists the latest videos with thumbnails, titles, and links to watch them. It should use JavaScript, HTML, and CSS, and fetch video data using APIs or web scraping if necessary. The design should be clean, responsive, and user-friendly. Include background scripts if needed to periodically update the video feed."

Step 4: Channel IDs

    Moneycontrol: UChftTVI0QJmyXkajQYt2tiQ

    Zee Business: UCkXopQ3ubd-rnXnStZqCl2w
