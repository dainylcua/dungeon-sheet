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

let raceData, raceSelectData
let raceSelection = $('#raceList option:selected').val()

const $raceList = $('#raceInfo #raceList')

const $raceProperties = $('#raceProperties')
const $raceName = $('#raceName')
const $raceSpeed = $('#raceSpeed')
const $raceSize = $('#raceSize')

const $raceBonuses = $('#raceBonuses')
const $raceBonusStats = $('#raceBonusStats')

const $raceProficiencies = $('#raceProficiencies')
const $raceProfOptions = $('#raceProfOptions')

const $raceLanguages = $('#raceLanguages')
const $raceLangOptions = $('#raceLangOptions')

const $raceTraits = $('#raceTraits')

const $raceDescription = $('#raceDescription')


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
            raceRender()
        },
        (error) => {
            console.log('Bad Request: ', error)
        }
    )
}

function raceRender() {
    $raceName.text(raceSelectData.name)
    $raceSpeed.text(`${raceSelectData.speed} ft`)
    $raceSize.text(`${raceSelectData.size}-sized creature`)

    $raceBonusStats.text('')
    raceSelectData.ability_bonuses.forEach((ability) => {
        $raceBonusStats.append(`<div class="bonusStat" id="${ability.ability_score.index}">
            ${ability.ability_score.name} + ${ability.bonus}</div>`)
    })

    $raceProficiencies.text('')
    if(raceSelectData.starting_proficiencies.length !== 0) {
        $raceProficiencies.text('Starting proficiencies:')
        raceSelectData.starting_proficiencies.forEach((proficiency) => {
            $raceProficiencies.append(`<div class="proficiencies" id="${proficiency.index}">
                ${proficiency.name}`)
        })
    }


    $raceProfOptions.text('')
    if(raceSelectData.starting_proficiency_options !== undefined) {
        $raceProfOptions.text(`Choose from ${raceSelectData.starting_proficiency_options.choose} of the following:`)
        $raceProfOptions.append('<br>')
        raceSelectData.starting_proficiency_options.from.forEach((proficiency) => {
            $raceProfOptions.append(`<button class="chosen-proficiencies btn btn-primary m-1" id="${proficiency.index}">
            ${proficiency.name}</button>`)
        })
    }

    $raceLanguages.text(`Languages known:`)
    raceSelectData.languages.forEach((language) => {
        $raceLanguages.append(`<div class="languages" id="${language.index}">
        ${language.name}</div>`)
    })

    $raceLangOptions.text('')
    if(raceSelectData.language_options !== undefined) {
        $raceLangOptions.text(`Choose from ${raceSelectData.language_options.choose} of the following:`)
        $raceLangOptions.append('<br>')
        raceSelectData.language_options.from.forEach((language) => {
            $raceLangOptions.append(`<button class="chosen-languages btn btn-primary m-1" id="${language.index}">
            ${language.name}</button>`)
        })
    }

    $raceTraits.text('')
    if(raceSelectData.traits.length !== 0) {
        $raceTraits.text(`Traits:`)
        raceSelectData.traits.forEach((trait) => {
            $raceTraits.append(`<div class="traits" id="${trait.index}"">
            ${trait.name}</div>`)
        })
    }

    $raceDescription.text(raceSelectData.alignment + ' ' + raceSelectData.size_description + ' ' + raceSelectData.age)
}
