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

//make a post request to the server
$("#submit").click(function () {
    $.ajax({
        url: serverURL,
        type: 'POST',
        data: {
            name: nameInput.value,
            url: urlInput.value,
            caption: captionInput.value
        },
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
        url: serverURL + "/" + id,
        type: 'PATCH',
        data: {
            name: memeName.value,
            caption: memeCaption.value,
            url: memeURL.value
        },
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