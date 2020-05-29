$(function () {

    $(document).ready( function() {
        $("#modalFolder_div").load("ModalFolder.html");
    });

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
        let status

        switch (task.status) {
            case "waiting":
            case "finishing":
            case "extracting":
            case 1:
            case 4:
            case 9:
                playPause = '<button type="button" class="btn btn-sm btn-outline-info" id="waiting' + task.id + '" >\n' +
                    '           <i class="fas fa-hourglass-half"></i>\n' +
                    '         </button>\n'
                break
            case "downloading":
            case 2:
                playPause = '<button type="button" class="btn btn-sm btn-outline-warning" id="pause' + task.id + '" >\n' +
                    '           <i class="fas fa-pause"></i>\n' +
                    '        </button>\n'
                break
            case "paused":
            case 3:
                playPause = '<button type="button" class="btn btn-sm btn-outline-success" id="play' + task.id + '" >\n' +
                    '           <i class="fas fa-play"></i>\n' +
                    '        </button>\n'
                break
            default:
                playPause = ''
        }

        switch (task.status) {
            case "waiting":
            case 1:
                status = "En attente"
                break
            case "downloading":
            case 2:
                status = "En cours de téléchargement"
                break
            case "paused":
            case 3:
                status = "En pause"
                break
            case "finishing":
            case 4:
                status = "En cours de finalisation"
                break
            case "finished":
            case 5:
                status = "Terminé"
                break
            case "filehosting_waiting":
            case 8:
                status = "En attente de l'hébergeur"
                break
            case "extracting":
            case 9:
                status = "En cours d'extraction"
                break
            case "error":
            case 10:
                status = "Erreur"
                break
            default:
                status = "Inconnu"
        }


        let size_downloaded = task.additional.transfer.size_downloaded;
        let size_total = task.size;
        let pourcent = Math.round((size_downloaded * 100) / size_total);
        if (isNaN(pourcent))
            pourcent = 0;


        let title = formatTitre(task.title)

        let downloaded = getSize(size_downloaded)
        let download = getSize(size_total)

        list.append('<li class="list-group-item">\n' +
            '                    <div class="row">\n' +
            '                        <div class="col">\n' +
            '                           <p style="font-size: 11pt; margin-bottom: 2px">\n' +
            '                            ' + title + '\n' +
            '                           </p>\n' +
            '                           <small>' + status + ' - ' + downloaded + ' sur ' + download + '</small>' +
            '                           <div class="progress"  style="margin-top:15px">\n' +
            '                               <div class="progress-bar" role="progressbar" style="width: ' + pourcent + '%;" aria-valuenow="' + pourcent + '" aria-valuemin="0" aria-valuemax="100">' + pourcent + '%</div>\n' +
            '                           </div>\n' +
            '                        </div>\n' +
            '                        <div class="col-2" style="text-align: right">\n' +
            playPause +
            '                            <button type="button" class="btn btn-sm btn-outline-danger" id="cancel' + task.id + '" >\n' +
            '                                <i class="fas fa-trash"></i>\n' +
            '                            </button>\n' +
            '                            <button type="button" class="btn btn-sm btn-outline-secondary" id="folder' + task.id + '" data-toggle="modal" data-target="#modalFolder">\n' +
            '                                <i class="fas fa-folder"></i>\n' +
            '                                <i class="fas fa-folder-open"></i>\n' +
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

function getSize(size) {
    let unit, roundValue
    if (size >= 1000000000) {
        unit = "GB"
        roundValue = Math.round(size / 10000000) / 100
    } else {
        unit = "MB"
        roundValue = Math.round(size / 10000) / 100
    }

    return roundValue + unit
}

function formatTitre(title) {
    title = title.replace(/\./g, ' ')
    title = title.split('')
    title.splice(title.lastIndexOf(' '), 1, '.')
    title = title.join('')

    return title
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
