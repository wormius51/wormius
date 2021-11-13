
const postObject = pageToObject();

const saveButton = document.getElementById('saveButton');
const publishButton = document.getElementById('publishButton');
const deleteButton = document.getElementById('deleteButton');
saveButton.addEventListener('click', savePost);
publishButton.addEventListener('click', publishPost);
deleteButton.addEventListener('click', deletePost);

function savePost () {
    deselectElement();
    updatePostObject();
    postFunction('update', 'PUT');
}

function publishPost () {
    if (confirm("Are you sure you want to publish this post?")) {
        savePost();
        postFunction('publish', 'PUT');
    }
}

function deletePost () {
    if (confirm("Are you sure you want to delete this post?")) {
        postFunction('delete', 'DELETE');
    }
}

function postFunction (path, method) {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = () => {
        console.log(this.responseText);
    };
    xhttp.onerror = () => {
        console.error(this.responseText);
    };
    xhttp.open(method, `./${path}`, true);
    xhttp.setRequestHeader('content-type', 'application/json');
    xhttp.send(JSON.stringify(postObject));
}

function pageToObject () {
    return {
        id: getPostId(),
        title: getTitle(),
        description: getDescription(),
        content: postDiv.innerHTML
    }
}

function updatePostObject () {
    postObject.title = getTitle();
    postObject.content = postDiv.innerHTML;
}

function getTitle () {
    const texts = postDiv.getElementsByClassName('primaryText');
    if (texts.length > 0)
        return texts[0].innerHTML;
    else
        return "New Post";
}

function getPostId () {
    return document.getElementById('postId').innerHTML;
}

function getDescription () {
    const texts = postDiv.getElementsByClassName('lead');
    if (texts.length > 0) {
        if (texts[0].innerHTML.length <= 300)
            return texts[0].innerHTML;
        else
            return text[0].innerHTML.substr(0, 298) + "..";
    } else
        return "";
}

function objectToPage (object) {
    postDiv.innerHTML = object.content;
}

