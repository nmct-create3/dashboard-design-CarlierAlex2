let api = "https://iotcloud-mct.azurewebsites.net/api/visitors/"
let daySelect;
let graph;

const getVisitorsByDay = function(day){
    console.log("getVisitorsByDay");
    const endpoint = `${api}${day}`;
    getApiResponse(endpoint);
};

const getApiResponse = function(url){
    console.log("getApiResponse");
    fetch(url).then(function(response) {
        if (!response.ok) {
            console.warn(`>> Probleem bij de fetch(). Statuscode: ${response.status}`);
          } 
          else {
            console.info('>> Er is een response teruggekomen van de server');
            return response.json();
          }
        })
        .then(function(jsonObject) {
          if (jsonObject) {
            console.info('>> JSONobject is aangemaakt');
            getData(jsonObject);
          }
        })
        .catch((error) => {
            console.error('Error:', error);
          });
};

const getData = function(jsonObject){
    console.log("getData");
    console.log(jsonObject);
    let dayArray = [];
    let labelArray = [];

    for (const index in jsonObject)
    {
        console.log(index);
        let obj = jsonObject[index];
        let aantalBezoekers = obj["aantalBezoekers"];
        dayArray.push(aantalBezoekers);
        labelArray.push(`Week ${index}`);
    }

    drawChart(dayArray, labelArray);
};

const drawChart = function(dayArray, labelArray){
    console.log("drawChart");
    console.log(dayArray);
    var ctx = graph.getContext("2d");

    var options = {
        responsive: true,
        legend: {
            position: 'bottom'
            },
        scales: {
                xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true
                        }
                    }],
                yAxes: [{
                        display: true,
                        ticks: {
                            beginAtZero: true,
                            steps: 10,
                            stepValue: 5,
                            max: 50
                        }
                    }]
        },
        /*
        title: {
            display: true,
            text: 'Daily visitors',
            position: 'left'
        }   
        */
    };

    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labelArray,
            datasets: [{
                label: "Visitors",
                data: dayArray,
                fill: false,
                backgroundColor: "#eebcde ",
                borderColor: "#eebcde",
                borderCapStyle: 'butt',
            }]
        },
        lineTension: 0.3,
        options: options
    });
};

const init = function(){
    console.log("Init");
    daySelect = document.querySelector('.js-card__select');
    graph = document.querySelector('.js-graph');

    daySelect.addEventListener("change", function(){
        const selectedIndex = this.selectedIndex; 
        const stringDay = this.options[selectedIndex].dataset.day;
        getVisitorsByDay(stringDay);
    });
};

document.addEventListener('DOMContentLoaded', function() {
    console.log("Script geladen");
    init();

});