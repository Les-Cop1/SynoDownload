$(function(){

    chrome.storage.sync.get('synology', function (data) {
        var host = ""
        var username = ""
        var password = ""
        var protocol = "http"
        let nasURL = "";

        if (data.synology.host) {
            host = data.synology.host
            nasURL = host.split(':')[0]
        }
        if (data.synology.username) {
            username = data.synology.username
        }
        if (data.synology.password) {
            password = data.synology.password
        }
        if (data.synology.protocol) {
            protocol = data.synology.protocol
        }

        var settings = {
            "url": "http://" + nasURL + ":500/?method=list&username=" + encodeURI(username) + "&password=" + encodeURI(password) + "&protocol=" + protocol + "&ip=" + host,
            "method": "GET",
            "timeout": 0
        };


        $.ajax(settings).done(function (response) {
            response = JSON.parse(response)
            if (response.success) {
                let nbDownloads = response.tasks.length
                chrome.storage.sync.set({
                    nbDownloads: nbDownloads
                })

                if (nbDownloads > 1) {
                    $("#nbDownloads").text(nbDownloads + " téléchargements en cours")
                } else {
                    $("#nbDownloads").text(nbDownloads + " téléchargement en cours")
                }


                let list = $("#listItems")
                list.empty()

                response.tasks.forEach(function (task) {
                    console.log(task)
                    let playPause
                    if (task.status === "paused") {
                        playPause = '<button type="button" class="btn btn-sm btn-outline-success" onclick="resumeDownload(this, task.id)">\n' +
                            '                                <i class="fas fa-play"></i>\n'
                    } else {
                        playPause = '<button type="button" class="btn btn-sm btn-outline-warning" onclick="pauseDownload(this, task.id)">\n' +
                            '                                <i class="fas fa-pause"></i>\n'
                    }

                    list.append('<li class="list-group-item">\n' +
                        '                    <div class="row">\n' +
                        '                        <div class="col">\n' +
                        '                            ' + task.title + '\n' +
                        '                        </div>\n' +
                        '                        <div class="col-2" style="text-align: right">\n' +
                        playPause +
                        '                            </button>\n' +
                        '                            <button type="button" class="btn btn-sm btn-outline-danger" onclick="cancelDownload(this, task.id)">\n' +
                        '                                <i class="fas fa-stop"></i>\n' +
                        '                            </button>\n' +
                        '                        </div>\n' +
                        '                    </div>\n' +
                        '                </li>')
                })
            }
        });
    })
})

function pauseDownload(element, id) {

}

function cancelDownload(element, id) {

}

function resumeDownload(element, id) {

}
