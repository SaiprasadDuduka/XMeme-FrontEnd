var nameInput = document.querySelector("#name");
var captionInput = document.querySelector("#caption");
var urlInput = document.querySelector("#url");
var submitBtn = document.querySelector("#submit");
var stream = document.querySelector(".bottom");
var memeID = document.querySelector("#memeID");
var memeName = document.querySelector("#memeName");
var memeCaption = document.querySelector("#memeCaption");
var memeURL = document.querySelector("#memeURL");
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
        openForm();
        var id = (this.id).slice(0, -1);
        $.get(serverURL + "/memes/" + id, (data, status) => {
            var meme = JSON.parse(JSON.stringify(data));
            memeID.value = id;
            memeName.value = meme.name;
            memeCaption.value = meme.caption;
            memeURL.value = meme.url;
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

function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

function updateContent(){
    var id = memeID.value;
    $.ajax({
        url: serverURL + "/memes/" + id,
        type: 'PATCH',
        data: {
            caption: memeCaption.value,
            url: memeURL.value
        },
        success: function (result) {
            closeForm();
            loadMemes();
        }
    });
}

loadMemes();