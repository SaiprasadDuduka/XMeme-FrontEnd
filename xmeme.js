var nameInput = document.querySelector("#name");
var captionInput = document.querySelector("#caption");
var urlInput = document.querySelector("#url");
var submitBtn = document.querySelector("#submit");
var stream = document.querySelector(".bottom");
var memeID = document.querySelector("#memeID");
var memeName = document.querySelector("#memeName");
var memeCaption = document.querySelector("#memeCaption");
var memeURL = document.querySelector("#memeURL");
const serverURL = "http://localhost:8081/memes"; //"http://ec2-3-17-231-21.us-east-2.compute.amazonaws.com:3000/memes";

//clear the input fields
function reset() {
    nameInput.value = "";
    captionInput.value = "";
    urlInput.value = "";
}

//make a get request to the server
function loadMemes() {
    $.get(serverURL, (data, status) => {
        var memes = JSON.parse(JSON.stringify(data));
        stream.innerHTML = "";
        memes.forEach(meme => {
            stream.innerHTML += '<div class="meme-div"> \
                                    <h4>'+ meme.name + ' <span id="' + meme.id + 'P" class="btn btn-primary patchB">Edit</span> <span id="' + meme.id + 'D" class="btn btn-danger delB">Delete</span></h4> \
                                    <p>'+ meme.caption + '</p> \
                                    <img src="'+ meme.url + '" alt="Meme Image"> \
                                </div>'
        });

        addButtonListener(); //add event listener to newly created memes
    });
}

//check if given text is url
function is_url(str) {
    regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(str)) {
        return true;
    }
    else {
        return false;
    }
}

//check if input fields are empty
function validate() {
    if (nameInput.value == "") {
        alert("Meme Owner field is empty");
        nameInput.focus();
        return false;
    }
    if (captionInput.value == "") {
        alert("Caption field is empty");
        caption.focus();
        return false;
    }
    if (urlInput.value == "") {
        alert("Meme URL field is empty");
        urlInput.focus();
        return false;
    }
    if(!is_url(urlInput.value)){
        alert("Meme URL is not an url");
        urlInput.focus();
        return false;
    }
    return true;
}

//make a post request to the server
$("#submit").click(function () {
    if (validate()) {
        $.ajax({
            headers: {
                "Content-Type":"application/json"
            },
            url: serverURL,
            type: 'POST',
            data: JSON.stringify({
                name: nameInput.value,
                url: urlInput.value,
                caption: captionInput.value
            }),
            statusCode: {
                409: function (responseObject, textStatus, jqXHR) {
                    reset();
                    alert("Meme already exists");
                }
            }
        }).done(function (data) {
            reset();
            loadMemes();
        })
    }
});

//add listeners to the newly created memes
function addButtonListener() {

    //listener for edit button
    $(".patchB").click(function () {
        openForm();
        var id = (this.id).slice(0, -1);
        $.get(serverURL + "/" + id, (data, status) => {
            var meme = JSON.parse(JSON.stringify(data));
            memeID.value = id;
            memeName.value = meme.name;
            memeCaption.value = meme.caption;
            memeURL.value = meme.url;
        });
    });

    //listener for delete button
    $(".delB").click(function () {
        var id = (this.id).slice(0, -1);
        $.ajax({
            url: serverURL + "/" + id,
            type: 'DELETE'
        }).done(function (data) {
            loadMemes();
        })
    });
}

//make a patch request to the server
function updateContent() {
    var id = memeID.value;
    $.ajax({
        headers: {
            "Content-Type":"application/json"
        },
        url: serverURL + "/" + id,
        type: 'PATCH',
        data: JSON.stringify({
            caption: memeCaption.value,
            url: memeURL.value
        }),
        statusCode: {
            409: function (responseObject, textStatus, jqXHR) {
                reset();
                alert("Meme already exists");
            }
        }
    }).done(function (data) {
        closeForm();
        loadMemes();
    });
}

//open the modal edit form
function openForm() {
    document.getElementById("myForm").style.display = "block";
}

//close the modal edit form
function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

loadMemes();