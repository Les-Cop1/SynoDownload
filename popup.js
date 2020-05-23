$(function(){

    chrome.storage.sync.get('nbDownloads', function (data) {
        var nbDownloads = 0

        if (data.nbDownloads) {
            nbDownloads = data.nbDownloads
        }

        $("#nbDownloads").text(nbDownloads + " téléchargements en cours")
    })


    chrome.storage.sync.get('link', function (data) {
        var link = ""
        console.log(data)

        if (data.link) {
            link = data.link
        }

        $("#link").text(link)
    })
})
