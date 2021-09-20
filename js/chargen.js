// CONSTANTS
BASEURL = 'https://www.dnd5eapi.co/api/'

// Simple CSS Fade Transition
$('.transition').on('click', function() {
    $('#tranScreen').fadeIn().fadeOut(2000)
    $(this).parent().parent().fadeOut().remove(1000)
    $(this).parent().parent().next().fadeIn(3000)
})


// Race Functions
$('#race-next').on('click', populateRaceList)
$('#race-list').change(populateRaceDetails)

let raceData, raceSelectData, raceSelection

const $raceList = $('#race-list')

const $raceProperties = $('#race-properties')
const $raceName = $('#race-name')
const $raceSpeed = $('#race-speed')
const $raceSize = $('#race-size')

const $raceBonuses = $('#race-bonuses')
const $raceBonusStats = $('#race-bonus-stats')

const $raceProficiencies = $('#race-proficiencies')
const $raceProfOptions = $('#race-prof-options')

const $raceLanguages = $('#race-languages')
const $raceLangOptions = $('#race-lang-options')

const $raceTraits = $('#race-traits')

const $raceDescription = $('#race-description')

// Pulls data for all races in the standard ruleset
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

// Adds list of races to dropdown menu
function raceAddList() {
    raceData.results.forEach(function(race) {
        $raceList.append(`<option value="${race.index}">${race.name}</option>`)
    })
}

// Pulls data for selected race
function populateRaceDetails() {
    raceSelection = $('#race-list option:selected').val()
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

// Manipulates data for selected race and renders
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


// Class Functions
$('#class-next').on('click', populateClassList)
$('#class-list').change(populateClassDetails)

let classData, classSelectData, classSelection

const $classList = $('#class-list')

const $className = $('#class-name')
const $classProperties = $('#class-properties')
const $classHitDice = $('#hit-dice')
const $classSavingThrows = $('#saving-throws')
const $classProficiencies = $('#class-proficiencies')
const $classEquipment = $('#class-equipment')




function populateClassList() {
    $.ajax({
        url: BASEURL + 'classes/'
    }).then(
        (data) => {
            classData = data
            classAddList()
        },
        (error) => {
            console.log('Bad Request: ', error)
        }
    )
}

function classAddList() {
    classData.results.forEach(function(cls) {
        $classList.append(`<option value="${cls.index}">${cls.name}</option>`)
    })
}


function populateClassDetails() {
    classSelection = $('#class-list option:selected').val()
    $.ajax({
        url: BASEURL + 'classes/' + classSelection
    }).then(
        (data) => {
            classSelectData = data
            classRender()
        },
        (error) => {
            console.log('Bad Request: ', error)
        }
    )
}

function classRender() {
    console.log(classSelectData.name)
    $className.text(classSelectData.name)
}