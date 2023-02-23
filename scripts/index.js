// API endpoints

// Backend domain
const domainName = "https://aherrada.pythonanywhere.com"

// For local development
// const domainName = "http://127.0.0.1:8080"

// Endpoints

const csvEndpoint = `${domainName}/uploadCSV`;
const signalNameEndpoint = `${domainName}/signalName`;
const plotsEndpoint = `${domainName}/plots`;
const sampleCSVEndpoint = `${domainName}/csvSamples`;
const sampleCSVSelectEndpoint = `${domainName}/csvSampleSelect`;



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

function clearDivs() {
    let divs = document.querySelectorAll('.plotDiv')
    divs.forEach(div => {
        div.remove()
    })
}
function clearPlotly() {
    let divs = document.querySelectorAll('.plotly')
    divs.forEach(div => {
        div.remove()
    })
}

csvInput.addEventListener('input', function (e) {
    e.preventDefault();

    // Reset Dropdown menu
    defaultDropdownOption.selected = true;
    document.getElementById('csvNameHolder').innerText = this.files[0].name;

    const formData = new FormData;
    formData.append('csv_files', csvInput.files[0])
    fetch(csvEndpoint, {
        method: 'post',
        body: formData
    })
        .then(res => res.json())
        .then((data) => {
            clearPlotly();
            // clearCheckbox();
            let signalList = data;
            signalListAppend(signalList.signals_list);
        })
        .catch(err => console.log(err))

    // // Visualize Loaded CSV
    // console.log('Se cargó el archivo' + this.files[0].name);
    // let file = this.files[0];
    // reader.onload = (e) => console.log(e.target.result);
    // reader.onerror = (error) => console.log(error);
    // reader.readAsText(file);
});



// Submit signal

signalMenu.addEventListener('submit', function (e) {
    e.preventDefault();
});

signalMenu.addEventListener('change', function (e) {
    e.preventDefault();
    let signalName = document.querySelector('input[name="signalName"]:checked').value;

    clearDivs()

    fetch(signalNameEndpoint, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "signal_name": signalName }),
    })
        .then(res => res.json())
        .then((data) => { console.log(data) })
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

document.getElementById("imgSignal-checkbox").checked = true;
document.getElementById("imgTrip-checkbox").checked = true;
document.getElementById("animSignal-checkbox").checked = true;
document.getElementById("animFFT-checkbox").checked = true;





