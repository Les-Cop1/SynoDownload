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
                "url": "https://api.alldebrid.com/v4/link/redirector?agent=SynoDownload&link=" + clickData.linkUrl + "&apikey=" + encodeURI(apikey),
                "method": "GET",
                "timeout": 0
            };

            $.ajax(settings).done(function (response) {
                if (response.status === "success") {
                    for (let i = 0; i < response.data.links.length; i++) {
                        var settings = {
                            "url": "https://api.alldebrid.com/v4/link/unlock?agent=SynoDownload&link=" + response.data.links[i] + "&apikey=" + encodeURI(apikey),
                            "method": "GET",
                            "timeout": 0
                        };

                        $.ajax(settings).done(function (response2) {
                            if (response2.status === "success") {
                                chrome.storage.sync.get('synology', function (data2) {
                                    let host = ""
                                    let nasURL = ""
                                    let username = ""
                                    let password = ""
                                    let protocol = "http"

                                    if (data2.synology.host) {
                                        host = data2.synology.host
                                        nasURL = host.split(':')[0];
                                    }
                                    if (data2.synology.username) {
                                        username = data2.synology.username
                                    }
                                    if (data2.synology.password) {
                                        password = data2.synology.password
                                    }
                                    if (data2.synology.protocol) {
                                        protocol = data2.synology.protocol
                                    }

                                    var form = new FormData();
                                    form.append("method", "download");
                                    form.append("username", encodeURI(username));
                                    form.append("password", encodeURI(password));
                                    form.append("protocol", protocol);
                                    form.append("ip", host);
                                    form.append("link", response2.data.link);

                                    var settings = {
                                        "url": "http://" + nasURL + ":500",
                                        "method": "POST",
                                        "timeout": 0,
                                        "processData": false,
                                        "mimeType": "multipart/form-data",
                                        "contentType": false,
                                        "data": form
                                    };

                                    $.ajax(settings).done(function (response3) {
                                        console.log("Téléchargment")
                                        chrome.storage.sync.get('nbDownloads', function (data3) {
                                            chrome.storage.sync.set({
                                                nbDownloads: data3.nbDownloads + 1
                                            })
                                        })
                                    });
                                })

                            }
                        });
                    }
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
            chrome.browserAction.setBadgeBackgroundColor({"color": "#4f79ff" })
        } else {
            chrome.browserAction.setBadgeText({"text": "" })
        }
    }
})


