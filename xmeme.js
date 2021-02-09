var nameInput = document.querySelector("#name");
var captionInput = document.querySelector("#caption");
var urlInput = document.querySelector("#url");
var submitBtn = document.querySelector("#submit");
var stream = document.querySelector(".bottom");
const serverURL = "http://ec2-3-17-231-21.us-east-2.compute.amazonaws.com:3000";

function reset() {
    nameInput.value = "";
    captionInput.value = "";
    urlInput.value = "";
}

function loadMemes() {
    $.get(serverURL + "/memes", (data, status) => {
        var memes = JSON.parse(JSON.stringify(data));
        stream.innerHTML = "";
        memes.forEach(meme => {
            stream.innerHTML += '<div class="meme-div"> \
                                    <h4>'+ meme.name + ' <span id="' + meme.id + 'P" class="btn btn-primary patchB">Edit</span> <span id="' + meme.id + 'D" class="btn btn-danger delB">Delete</span></h4> \
                                    <p>'+ meme.caption + '</p> \
                                    <img src="'+ meme.url + '" alt="Meme Image"> \
                                </div>'
        });
        addButtonListener();
    });
}

$("#submit").click(function () {
    let meme = {
        name: nameInput.value,
        url: urlInput.value,
        caption: captionInput.value
    };

    $.post(serverURL + "/memes", meme,
        function (data, status) {
            reset();
            loadMemes();
        }
    );
});

function addButtonListener() {
    $(".patchB").click(function () {
        var id = (this.id).slice(0, -1);
        $.ajax({
            url: serverURL + "/memes/" + id,
            type: 'PATCH',
            data: {
                caption: "temporary",
                url: "https://miro.medium.com/max/830/0*HWez4Yya6Cac_2LB.jpg"
            },
            success: function (result) {
                loadMemes();
            }
        });
    });

    $(".delB").click(function () {
        var id = (this.id).slice(0, -1);
        $.ajax({
            url: serverURL + "/memes/" + id,
            type: 'DELETE',
            success: function (result) {
                loadMemes();
            }
        });
    });
}

loadMemes();