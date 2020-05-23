document.writeln('<script src="./node_modules/jquery/dist/jquery.min.js"></script>');

var contextMenuItem = {
    "id": "download",
    "title": "Télécharger sur le NAS",
    "contexts": ["selection"]
}
chrome.contextMenus.create(contextMenuItem);
chrome.contextMenus.onClicked.addListener(function(clickData){

    if (clickData.menuItemId === "download" && clickData.linkUrl) {
        chrome.storage.sync.get('alldebrid', function (data) {
            var apikey = ""

            if (data.alldebrid) {
                apikey = data.alldebrid
            }

            var settings = {
                "url": "https://api.alldebrid.com/v4/link/redirector?agent=SynoDownload&link=" + clickData.linkUrl + "&apikey=" + apikey,
                "method": "GET",
                "timeout": 0
            };

            $.ajax(settings).done(function (response) {
                if (response.status === "success") {
                    var settings = {
                        "url": "https://api.alldebrid.com/v4/link/unlock?agent=SynoDownload&link=" + response.data.links[0] + "&apikey=" + apikey,
                        "method": "GET",
                        "timeout": 0
                    };

                    $.ajax(settings).done(function (response2) {
                        if (response.status === "success") {
                            chrome.storage.sync.set({
                                link: response2.data.link
                            })
                        }
                    });
                }
            });
        })
    }
})

chrome.storage.onChanged.addListener(function (changes, storageName) {
    if (changes.nbDownloads !== undefined) {
        nbDownloads = changes.nbDownloads.newValue.toString()
        if (nbDownloads > 0) {
            chrome.browserAction.setBadgeText({"text": nbDownloads })
            chrome.browserAction.setBadgeBackgroundColor({"color": "#62ff00" })
        }
    }
})
