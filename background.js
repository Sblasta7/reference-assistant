chrome.tabs.onUpdated.addListener((
    tabId, tab
    ) => {
        if(tab.url && tab.url.includes('youtube.com/watch')){
            const queryParameters = tab.url.split('?')[1];
            const urlParameters = new URLSearchParams(queryParameters);
            
            console.log(urlParameters.get('v'));
            
            chrome.tabs.sendMessage(tabId, {
                type: 'NEW',
                urlId: urlParameters.get('v')
            });
        }
    }
);