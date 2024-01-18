const apiKey = 'AIzaSyA7deRSchkD9mFP6IPrn_IfmBT5dalHC3E';

(() => { 

  console.log('hey u left ur water!!! content');
  chrome.runtime.onMessage.addListener(async (message, sender, response) => {
    console.log(`testing the message${message}`);
    const { type, urlId } = message;
    if (type === 'ADD') {
      response(type);
      scrapeYouTube(`${urlId}`);

    } else if (type === 'scrape') {
      scrapeWebsite();
    }
  });

  const scrapeWebsite = () => {
    console.log('scraping website...');
  }

  const scrapeYouTube = (video) => {
    
    if (video) {
      let videoId = video;

      if(video.includes('www.youtube.com/watch')){
        videoId = `${video}`.split('=')[1]
      }

      const YouTube_API_Url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`;
      
      fetch(YouTube_API_Url)
      .then(response => response.json())
      .then(data => {
        // Extract information
        const channelTitle = data.items[0].snippet.channelTitle;
        const videoTitle = data.items[0].snippet.title;
        const publishedAt = data.items[0].snippet.publishedAt;

        // Log or use the extracted information
        console.log('Channel Title:', channelTitle);
        console.log('Video Title:', videoTitle);
        console.log('Published At:', publishedAt);

        // let url = `https://www.youtube.com/watch?v=${video}`;
        let reference = referenceYoutubeVideo(video, channelTitle, publishedAt, videoTitle);
        

        addReference(reference);
        
        // alert(reference);

        var newReference = 'This is a new reference for today.';
        addReference(newReference);

        getSentencesForCurrentDate((references) => {
          alert('Sentences for the current date:', references);
        });
      })
      .catch(error => {
        console.error(`Error fetching YouTube data:`, error);
       });
    } else {
      console.error(`Invalid YouTube video URL:  ${video} `);
    }
  }

  const referenceYoutubeVideo = (url, nameOfAccount, yearOfPost, videoTitle) => {
    let dateAccessed = currentDate();
    let value = `${nameOfAccount} (${yearOfPost}) ${videoTitle}. Available at: ${url} (${dateAccessed})`;
    return value;
  }

  const referenceWebsite = (url, datePublished, title) => {
    let dateAccessed = currentDate();
    let websiteName = "";
    if (datePublished === null || datePublished === ''){
      datePublished = 'n.d';
    }
    let value = `${websiteName}. ${datePublished}. ${title}. [online] Available at: ${url} [${dateAccessed}].`;
    return value;
  }

  

  const addReference = (reference) => {
    var currDate = currentDate();
  
    chrome.storage.local.get({ references: {} }, (result) => {
      var referencesByDate = result.references || {};

    // If the date key doesn't exist, create an empty array for it
      if (!referencesByDate[currDate]) {
        referencesByDate[currDate] = [];
      }

    // Add the sentence to the array for the current date
      referencesByDate[currDate].push(reference);

    // Store the updated data back to chrome.storage
      chrome.storage.local.set({ references: referencesByDate }, () => {
        console.log('Sentence added successfully for ' + currDate);
      });
    });
  }


  const getSentencesForCurrentDate = (callback) =>  {
    var currDate = currentDate();

    chrome.storage.local.get({ references: {} }, (result) => {
      var referencesByDate = result.references || {};

    // Retrieve references for the current date
      var references = referencesByDate[currDate] || [];

    // Execute the callback with the retrieved references
      callback(references);
    });
  }

  const currentDate = () => {
    const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
    const currDate = new Date();
    const day = currDate.getDate();
    const month = currDate.getMonth();
    const year = currDate.getFullYear();

    return `${day} ${months[month]} ${year}`;
  }
})();

// console.log('Content script initialized');

// chrome.runtime.onMessage.addListener((message, sender, response) => {
//   console.log('Received message:', message);
//   // Handle the message
// });