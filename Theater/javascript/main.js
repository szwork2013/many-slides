function init() {
    var introForm = document.createElement("form");
    introForm.id = "introForm";
    introForm.method = "GET";
    introForm.setAttribute("onsubmit", "return initConnection();");

    var introHeadline = document.createElement("h1");
    introHeadline.setAttribute("class", "demo-section-title");
    introHeadline.innerHTML = "Welcome to Many Slides";

    var introSubline = document.createElement("h3");
    introSubline.setAttribute("class", "demo-section-title");
    introSubline.innerHTML = "Please enter your name and the ID of the Host below";

    var introNameField = document.createElement("input");
    introNameField.setAttribute("class", "form-control introFormTextBox");
    introNameField.placeholder = "Name";
    introNameField.id = "introName";

    var introIDField = document.createElement("input");
    introIDField.setAttribute("class", "form-control introFormTextBox");
    introIDField.placeholder = "ID";
    introIDField.id = "introID";


    var introLoginButton = document.createElement("input");
    introLoginButton.setAttribute("type", "submit");
    introLoginButton.setAttribute("class", "btn btn-block btn-lg btn-primary introFormButton");
    introLoginButton.innerHTML = "Login";
    introLoginButton.value = "Login";

    introForm.appendChild(introHeadline);
    introForm.appendChild(introSubline);
    introForm.appendChild(introNameField);
    introForm.appendChild(document.createElement("br"));
    introForm.appendChild(introIDField);
    introForm.appendChild(document.createElement("br"));
    introForm.appendChild(introLoginButton);

    document.getElementById("mainWrapper").appendChild(introForm);

    var hostPeerID = getUrlVars()["peerID"];

    if(hostPeerID != "undefined" && hostPeerID != "")
    {
        document.getElementById("introID").value = hostPeerID;
    }

    console.log("init done!");
}

function initConnection() {
    var name = document.getElementById("introName").value;
    var peerID = document.getElementById("introID").value;

    window.location = "watching.html?name=" + name + "&peerID=" + peerID;
}
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}