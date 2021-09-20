// CONSTANTS
BASEURL = 'https://www.dnd5eapi.co/api/'

// Simple CSS Fade Transition
$('.transition').on('click', function() {
    $('#tranScreen').fadeIn().fadeOut(2000)
    $(this).parent().parent().fadeOut().remove(1000)
    $(this).parent().parent().next().fadeIn(3000)
})


// Race Functions
$('#raceNext').on('click', populateRaceList)
$('#raceList').change(populateRaceDetails)

let raceData, raceSelectDate
let raceSelection = $('#raceList option:selected').val()

const $raceList = $('#raceInfo #raceList')

const $raceProperties = $('#raceProperties')
const $raceName = $('#raceName')
const $raceSpeed = $('#raceSpeed')
const $raceSize = $('#raceSize')

const $raceBonuses = $('#raceBonuses')
const $raceBonusStats = $('#raceBonusStats')
const $raceProficiencies = $('#raceProficiencies')
const $raceLanguages = $('#raceLanguages')

const $raceFeats = $('#raceTraits')


function populateRaceList() {
    $.ajax({
        url: BASEURL + 'races/'
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

function populateRaceDetails() {
    raceSelection = $('#raceList option:selected').val()
    $.ajax({
        url: BASEURL + 'races/' + raceSelection
    }).then(
        (data) => {
            raceSelectData = data
            console.log('selected', raceSelection)
            raceRender()
        },
        (error) => {
            console.log('Bad Request: ', error)
        }
    )
}

function raceRender() {
    $raceName.text(raceSelectData.name)
}