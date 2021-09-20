// CONSTANTS
BASEURL = 'https://www.dnd5eapi.co/api/'

// Simple CSS Fade Transition
$('.transition').on('click', function() {
    $('#tranScreen').fadeIn().fadeOut(2000)
    $(this).parent().parent().fadeOut().remove(1000)
    $(this).parent().parent().next().fadeIn(3000)
})


// Race Functions
$('#raceNext').on('click', populateRaces)

let raceData
const $raceName = $('#raceInfo #raceName')
const $raceFeats = $('#raceInfo #raceFeats')
const $raceList = $('#raceInfo #raceList')

function populateRaces() {
    $.ajax({
        url: BASEURL + 'races'
    }).then(
        (data) => {
            raceData = data
            raceAddList()
        },
        (error) => {
            console.log('Bad Request: ', error)
        }
    )
    
}


function raceAddList() {
    raceData.results.forEach(function(race) {
        $raceList.append(`<option value="${race.index}">${race.name}</option>`)
    })
}

function raceRender() {

}