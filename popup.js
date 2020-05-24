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

        var form = new FormData();
        form.append("method", "list");
        form.append("username", encodeURI(username));
        form.append("password", encodeURI(password));
        form.append("protocol", protocol);
        form.append("ip", host);

        var settings = {
            "url": "http://" + nasURL + ":500",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
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
                        playPause = '<button type="button" class="btn btn-sm btn-outline-success" id="play' + task.id + '" >\n' +
                            '                                <i class="fas fa-play"></i>\n'
                    } else {
                        playPause = '<button type="button" class="btn btn-sm btn-outline-warning" id="pause' + task.id + '" >\n' +
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
                        '                            <button type="button" class="btn btn-sm btn-outline-danger" id="cancel' + task.id + '" >\n' +
                        '                                <i class="fas fa-stop"></i>\n' +
                        '                            </button>\n' +
                        '                        </div>\n' +
                        '                    </div>\n' +
                        '                </li>')

                    let cancelButton = $("#cancel" + task.id)
                    let pauseButton = $("#pause" + task.id)
                    let resumeButton = $("#resume" + task.id)
                    cancelButton.click(cancelDownload(cancelButton, task.id))
                    pauseButton.click(cancelDownload(pauseButton, task.id))
                    resumeButton.click(cancelDownload(resumeButton, task.id))
                })
            }
        });
    })
})

function pauseDownload(element, id) {

}

function cancelDownload(element, id) {
    console.log(element)

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

        console.log("import des données")

        var form = new FormData();
        form.append("method", "delete");
        form.append("username", username);
        form.append("password", password);
        form.append("protocol", protocol);
        form.append("ip", host);
        form.append("id", id);

        var settings = {
            "url": "http://" + nasURL + ":500",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };

        $.ajax(settings).done(function (response) {
            console.log("Supprimé");
        });
    })

}

function resumeDownload(element, id) {

}
