export async function getActiveTabURL() {
    try {
        const tabs = await chrome.tabs.query({
            currentWindow: true,
            active: true
        });
      
        if (tabs && tabs.length > 0) {
            return tabs[0];
        } else {
            console.error('No active tabs found.');
            return null; // Or handle the lack of active tabs in your specific way
        }
    } catch (error) {
        console.log(error)
    }
}