
function convertToCSV(array) {
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

document.getElementById('form').addEventListener("submit", function(e) {
    e.preventDefault();
    var url = document.getElementById('url').value;

    if (!url) {
        console.log("invalid url");
        return;
    }
    $.ajax({
        url: '/get_reviews',
        method: 'post',
        data: {
           url: document.getElementById('url').value
        },
        success: function(response) {
            response = JSON.parse(response);
            if(response.status == "200") {
                console.log(response);
                const csvFile = convertToCSV(response.reviews);
                downloadCSV(csvFile);
                document.getElementById('url').value = "";
            } else if (response.status == "400") {
                alert('lo')
            }
        },
        error: function(jqXHR, exception) {
            // console.log(jqXHR)
        }

    })
})
