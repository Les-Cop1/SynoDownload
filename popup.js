$(function(){

    chrome.storage.sync.get('tasks', function (data) {
        if (data.tasks !== undefined) setItems(data.tasks)
    })

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
        let time = 30000
        chrome.storage.sync.get('reloadTime', function (data) {

            if (data.reloadTime !== undefined) {
                time = data.reloadTime * 1000
            }
            loadData(settings)
            setInterval(loadData, time, settings)
        })
    })
})

function pauseDownload(element, id) {
    console.log("Mise en pause")

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
            console.log("En pause");
        });
    })
}

function cancelDownload(element, id) {
    console.log("Supression")

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
    console.log("Mise en route")

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
            console.log("En téléchargement");
        });
    })
}

function setItems(tasks) {
    let list = $("#listItems")
    list.empty()

    tasks.forEach(function (task) {
        let playPause
        if (task.status === "paused") {
            playPause = '<button type="button" class="btn btn-sm btn-outline-success" id="play' + task.id + '" >\n' +
                '                                <i class="fas fa-play"></i>\n'
        } else if (task.status === "downloading") {
            playPause = '<button type="button" class="btn btn-sm btn-outline-warning" id="pause' + task.id + '" >\n' +
                '                                <i class="fas fa-pause"></i>\n'
        } else if (task.status === "finished") {
            playPause = ""
        } else if (task.status === "waiting") {
            playPause = ""
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

        /*
        let cancelButton = $("#cancel" + task.id)
        let pauseButton = $("#pause" + task.id)
        let resumeButton = $("#resume" + task.id)

        cancelButton.bind('click', cancelDownload(cancelButton, task.id))
        pauseButton.bind('click', pauseDownload(pauseButton, task.id))
        resumeButton.bind('click', resumeDownload(resumeButton, task.id))
        */
    })
}

function loadData(settings) {
    console.log("Chargement")
    let divNbDownload = $("#nbDownloads")

    divNbDownload.empty()
    divNbDownload.append('<div class="spinner-grow spinner-grow-sm" role="status">\n' +
        '                    <span class="sr-only">Loading...</span>\n' +
        '                </div>')

    $.ajax(settings).done(function (response) {
        response = JSON.parse(response)
        if (response.success) {
            let nbDownloads = response.tasks.length

            chrome.storage.sync.set({
                nbDownloads: nbDownloads,
                tasks: response.tasks
            })


            divNbDownload.empty()

            if (nbDownloads > 1) {
                divNbDownload.append('<span class="navbar-text" id="nbDownloads">\n' +
                    '                ' + nbDownloads + ' téléchargements en cours\n' +
                    '            </span>')
            } else {
                divNbDownload.append('<span class="navbar-text" id="nbDownloads">\n' +
                    '                ' + nbDownloads + ' téléchargement en cours\n' +
                    '            </span>')
            }

            setItems(response.tasks)

        }
    })
}
