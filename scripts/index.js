// API endpoints

// For local development
const csvEndpoint = "http://127.0.0.1:8080/uploadCSV";
const signalNameEndpoint = "http://127.0.0.1:8080/signalName";
// const plotsEndpoint = "http://127.0.0.1:8080/plotsList";
const plotsEndpoint = "http://127.0.0.1:8080/plots";
const sampleCSVEndpoint = "http://127.0.0.1:8080/csvSamples";

// const csvEndpoint = "https://aherrada.pythonanywhere.com/uploadCSV";
// const signalNameEndpoint = "https://aherrada.pythonanywhere.com/signalName";
// const plotsEndpoint = "https://aherrada.pythonanywhere.com/plots";


// Variables


// Constants
let reader = new FileReader();
const csvForm = document.getElementById("csvForm");
const csvInput = document.getElementById("csvInput");
const signalMenu = document.getElementById('signalMenu');
const plotsMenu = document.getElementById('plotsMenu');
const plotsSection = document.getElementById('plots');
const plotsCheckboxList = document.querySelectorAll('.plotCheckbox');
const defaultDropdownOption = document.getElementById('csvDropdown').firstElementChild;
const plotDict = {};
// eventListeners

// Cargue de datos

function selectCSV() {
    csvInput.click();
}

function clearCheckbox() {
    plotsCheckboxList.forEach(checkbox => { checkbox.checked = false });
    let divs = plotsSection.querySelectorAll('.plotDiv');
    divs.forEach(div => { div.remove() });
}

function clearAll() {
    clearCheckbox()
    csvForm.reset()
    document.getElementById('csvNameHolder').innerText = 'No File';
    defaultDropdownOption.selected = true;
    reader = new FileReader();
    signalMenu.innerHTML = '<p>Select a CSV</p>';
}
// Clear all information inside 
clearAll()

csvInput.addEventListener('input', function () {
    defaultDropdownOption.selected = true;

    document.getElementById('csvNameHolder').innerText = this.files[0].name;
    console.log('Se cargó el archivo' + this.files[0].name);

    let file = this.files[0];
    reader.onload = (e) => console.log(e.target.result);
    reader.onerror = (error) => console.log(error);
    reader.readAsText(file);
});

csvForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData;
    formData.append('csv_files', csvInput.files[0])
    fetch(csvEndpoint, {
        method: 'post',
        body: formData
    })
        .then(res => res.json())
        .then((data) => {
            signalList = data;
            console.log(signalList.signals_list);
            signalListAppend(signalList.signals_list)
        })
        .catch(err => console.log(err))
});


// Submit signal

signalMenu.addEventListener('submit', function (e) {
    e.preventDefault();
});

signalMenu.addEventListener('change', function (e) {
    e.preventDefault();
    let signalName = document.querySelector('input[name="signalName"]:checked').value;
    console.log(JSON.stringify({ "signal_name": signalName }));


    let divs = plotsSection.getElementsByClassName('plotDiv');
    for (let div of divs) {
        div.remove();
    }



    fetch(signalNameEndpoint, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "signal_name": signalName }),
    })
        .then(res => res.json())
        .then((data) => console.log(data))
        .then(() => {
            animationsExist = false;
            let plotDivs = document.querySelectorAll('.plotDiv');
            plotDivs.forEach(div => { div.remove() });
            for (let value of plotsMenu.getElementsByTagName('input')) {
                plotAddRemove(value)
            }
        },
        )
        .catch(err => console.log(err))
});


// submit plots

plotsMenu.addEventListener('submit', function (e) {
    e.preventDefault();
});

for (let value of plotsMenu.getElementsByTagName('input')) {
    plotDict[value.value] = value.checked;
    value.addEventListener('change', function () {
        plotAddRemove(value)
    })
};

function plotAddRemove(value) {
    if (value.checked === true) {
        plotSignal(value);
    } else {
        removeSignal(value);
    }
}







