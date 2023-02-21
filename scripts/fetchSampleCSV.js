let csvSampleDict = {};

const csvDropdown = document.getElementById('csvDropdown');
fetch(sampleCSVEndpoint, {
    method: 'get',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
})
    .then(res => res.json())
    .then((data) => {
        data.forEach(csv => {
            csvSampleDict[csv.title] = csv.CSV
            csvListCreator(csv)
        });
        // csvSampleDict['CSV'] = data.CSV
    })
    .catch(err => console.log(err))

function csvListCreator(value) {
    let optionTag = document.createElement('option');
    let pTag = document.createElement('p');
    optionTag.value = value.id
    pTag.innerText = value.title
    optionTag.appendChild(pTag)
    csvDropdown.insertAdjacentElement('beforeend', optionTag)
}

csvDropdown.addEventListener('input', function () {

    csvInput.value = ''

    fetch(`${sampleCSVSelectEndpoint}/${csvDropdown.value}`, {
        method: 'get',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
        .then(res => res.json())
        .then((data) => {
            document.getElementById('csvNameHolder').innerText = data.file_name;
            let signalList = data;
            signalListAppend(signalList.signals_list);
            clearPlotly();
            // clearCheckbox();
        })
        .catch(err => console.log(err))
})