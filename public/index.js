
function convertReviewsToCSV(array) {
    let csv = "UserName, Date, Star Rating, Review or Comment, Link \n";
    for (var i = 0; i < array.length; i++) {
        let text = array[i]['text'].split(',').join(';');
        text = text.replace(/(\r\n\t|\n|\r\t)/gm,"");
        var line = `${array[i]['author_name']}, ${array[i]['relative_time_description']}, ${array[i]['rating']}, ${text}, " ${array[i]['author_url']} "`;

        csv += line + '\n';
    }
    return csv;
}


function downloadCSV(csv) {
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'reviews.csv';
    hiddenElement.click();
}

document.getElementById('form').addEventListener("submit", (e) => {
    e.preventDefault();
    const url = document.getElementById('url-input');
    const errorElement = document.getElementById('error-message');
    const submitButton = document.getElementById("submit-button");
    
    errorElement.innerHTML = "";
    submitButton.innerHTML = "";
    submitButton.classList.add("spinner");

    if (url.value == "" || url.value == null) {
        errorElement.innerHTML = "Please enter a valid Url";
        return;
    }

    let data = {url : url.value};

    fetch('/get_reviews', {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        response.json()
        .then(data => {
            if(data.status == "200") {
                const csvFile = convertReviewsToCSV(data.reviews);
                downloadCSV(csvFile);
                url.value = "";
            } else if (data.status == "400") {
                errorElement.innerHTML = data.message;
            }
            submitButton.innerHTML = "Submit";
            submitButton.classList.remove("spinner");
        })
    })
    .catch(error => {
        console.log(error)
        errorElement.innerHTML = "Sorry, we can't get reviews for this place at the moment";
    })

})
