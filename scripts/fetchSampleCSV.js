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
    optionTag.value = value.CSV
    pTag.innerText = value.title
    optionTag.appendChild(pTag)
    csvDropdown.insertAdjacentElement('beforeend', optionTag)
    console.log(optionTag)
}

// setTimeout(() => {
//     console.log(csvSampleDict)
// }, 1000);  