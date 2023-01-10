// Grabbing Form Data From a html button Submit Event   
const form = document.querySelector('#racerDataForm')
// console.log(form)

// Add Event Listener for submit event(s)   
form.addEventListener('submit', ( event ) => {

    event.preventDefault();
    var query_season = document.querySelector('#season').value
    var query_round = document.querySelector('#round').value
    // console.log(event)
    loadData(query_season, query_round)
    
})

const getData = async ( query_season, query_round ) => {   
    let response = await axios.get(`https://ergast.com/api/f1/${query_season}/${query_round}/driverStandings.json`) 
    console.log(response.data)
    return response.data
}

// Creat Constand to hold DOM Elements //T: good example, best practice
const DOM_Elements = {
                //THIS is what gets sent over to the html file, and will be inserted wherever the'.driver-list' class is located
                drivers: '.driver-list', 
            }

// Create Driver List HTML 
const create_driver = ( position, name, url, nationality, sponsor, sponsorUrl, points ) => {
    //formatted HTML to be inserted into index.html file (must be kosher with in-use bootstrap !!important!!)
    const html = `
                <tr>
                <th scope="row">${position}</th>
                <td><a href="${url}">${name}</a></td>
                <td>${nationality}</td>
                <td><a href="${sponsorUrl}">${sponsor}</a></td>
                <td>${points}</td>
                </tr>
                `
    
    // "Paste" new list item on document -- aka send the formated html code to a DOM_element that gets sent to index.html
    document.querySelector(DOM_Elements.drivers).insertAdjacentHTML("beforeend", html)
}

// Function to Load Each Driver  
const loadData = async (query_season, query_round) => {
    clearData()  //clear data from table before populating it again (avoid accumulation problem!)
    const driverList = await getData(query_season, query_round);
    let path = driverList.MRData.StandingsTable.StandingsLists[0].DriverStandings  //stores root JSON path of drivers so crate_driver more consolidated

    for(i = 0; i < path.length; i++){
        create_driver(path[i].position,
                      path[i].Driver.familyName,
                      path[i].Driver.url,
                      path[i].Driver.nationality,
                      path[i].Constructors[0].name,
                      path[i].Constructors[0].url,
                      path[i].points
                      )};
    }

// Function to Clear data -- make button for this or put it before the from stuff (to avoid unwanted info accumlation)
const clearData = () => {
    document.querySelector(DOM_Elements.drivers).innerHTML = '';  //T: setting to empty string clears everything out of it
}