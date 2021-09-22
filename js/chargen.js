// CONSTANTS
BASEURL = 'https://www.dnd5eapi.co/api/'

// Simple CSS Fade Transition
$('.transition').on('click', function () {
    $(this).parent().parent().fadeOut(500).remove(5)
    $('#tranScreen').fadeIn().fadeOut(1000, () => {
        $(this).parent().parent().next().fadeIn(300)
    })
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
    raceData.results.forEach(function (race) {
        $raceList.append(`<option value=${race.index}>${race.name}</option>`)
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
    $raceName.text(raceSelectData.name).css('font-size', '35px')
    $raceSpeed.text(`Speed: ${raceSelectData.speed} ft/6 seconds`)
    $raceSize.text(`Size: ${raceSelectData.size}-sized creature`)

    $raceBonusStats.text('Saving throw proficiencies: ')
    raceSelectData.ability_bonuses.forEach((ability) => {
        if (raceSelectData.ability_bonuses.indexOf(ability) === raceSelectData.ability_bonuses.length - 1) {
            $raceBonusStats.append(`<span class="bonusStat" id=${ability.ability_score.index}>${ability.ability_score.name} + ${ability.bonus}</span>`)
        } else {
            $raceBonusStats.append(`<span class="bonusStat" id=${ability.ability_score.index}>${ability.ability_score.name} + ${ability.bonus}, </span>`)
        }
    })

    $raceProficiencies.text('')
    if (raceSelectData.starting_proficiencies.length !== 0) {
        $raceProficiencies.text('Equipment and tool proficiencies: ')
        raceSelectData.starting_proficiencies.forEach((proficiency) => {
            if (raceSelectData.starting_proficiencies.indexOf(proficiency) === raceSelectData.starting_proficiencies.length - 1) {
                $raceProficiencies.append(`<span class="proficiencies" id=${proficiency.index}>${proficiency.name}</span>`)
            } else {
                $raceProficiencies.append(`<span class="proficiencies" id=${proficiency.index}>${proficiency.name}, </span>`)
            }
        })
    }


    $raceProfOptions.text('')
    if (raceSelectData.starting_proficiency_options !== undefined) {
        $raceProfOptions.text(`Choose from ${raceSelectData.starting_proficiency_options.choose} of the following proficiencies:`)
        $raceProfOptions.append('<br>')
        raceSelectData.starting_proficiency_options.from.forEach((proficiency) => {
            $raceProfOptions.append(`<button class="chosen-proficiencies btn btn-outline-dark m-1" data-bs-toggle="button" id=${proficiency.index}>${proficiency.name}</button>`)
        })
    }

    $raceLanguages.text(`Languages known: `)
    raceSelectData.languages.forEach((language) => {
        if (raceSelectData.languages.indexOf(language) === raceSelectData.languages.length - 1) {
            $raceLanguages.append(`<span class="languages" id=${language.index}>${language.name}</span>`)
        } else {
            $raceLanguages.append(`<span class="languages" id=${language.index}>${language.name}, </span>`)
        }
    })

    $raceLangOptions.text('')
    if (raceSelectData.language_options !== undefined) {
        $raceLangOptions.text(`Choose from ${raceSelectData.language_options.choose} of the following:`)
        $raceLangOptions.append('<br>')
        raceSelectData.language_options.from.forEach((language) => {
            $raceLangOptions.append(`<button class="chosen-languages btn btn-outline-dark m-1" data-bs-toggle="button" id=${language.index}>${language.name}</button>`)
        })
    }

    $raceTraits.text('')
    if (raceSelectData.traits.length !== 0) {
        $raceTraits.text(`Racial Traits: `)
        raceSelectData.traits.forEach((trait) => {
            if (raceSelectData.traits.indexOf(trait) === raceSelectData.traits.length - 1) {
                $raceTraits.append(`<span class="traits" id=${trait.index}>${trait.name}</span>`)
            } else {
                $raceTraits.append(`<span class="traits" id=${trait.index}>${trait.name}, </span>`)
            }
        })
    }

    $raceDescription.text(raceSelectData.alignment + ' ' + raceSelectData.size_description + ' ' + raceSelectData.age)
}


// Class Functions
$('#class-next').on('click', populateClassList)
$('#class-list').change(populateClassDetails)

let classData, classSelectData, classSelection, martialData, simpleData, groupNumber, eqObj, eqObjOpt, fragEquip, fragId

const $classList = $('#class-list')

const $className = $('#class-name')
const $classProperties = $('#class-properties')
const $classHitDice = $('#hit-dice')
const $classSavingThrows = $('#saving-throws')

const $classProficiencies = $('#class-proficiencies')
const $classProfOptions = $('#class-prof-choices')

const $classEquipment = $('#class-equipment')
const $classEquipChoices = $('#class-equip-choices')


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
    classData.results.forEach(function (cls) {
        $classList.append(`<option value=${cls.index}>${cls.name}</option>`)
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


// TO BE ADDED LATER
// function populateWeapons() {
//     $.ajax({
//         // Pull Martial Melee Weapons
//         url: BASEURL + 'equipment/martial-melee-weapons'
//     }).then(
//         (data) => {
//             martialMeleeData = data
//         },
//         (error) => {
//             console.log('Bad Request: ', error)
//         }
//     )

//     $.ajax({
//         // Pull Martial Ranged Weapons
//         url: BASEURL + 'equipment/martial-ranged-weapons'
//     }).then(
//         (data) => {
//             martialRangedData = data
//         },
//         (error) => {
//             console.log('Bad Request: ', error)
//         }
//     )

//     $.ajax({
//         // Pull Simple Melee Weapons
//         url: BASEURL + 'equipment/simple-melee-weapons'
//     }).then(
//         (data) => {
//             martialData = data
//         },
//         (error) => {
//             console.log('Bad Request: ', error)
//         }
//     )

//     $.ajax({
//         // Pull Simple Ranged Weapons
//         url: BASEURL + 'equipment/simple-ranged-weapons'
//     }).then(
//         (data) => {
//             martialData = data
//         },
//         (error) => {
//             console.log('Bad Request: ', error)
//         }
//     )
// }



function classRender() {
    $className.text(classSelectData.name).css('font-size', '35px')
    $classHitDice.text('Hit dice size: ' + classSelectData.hit_die)

    $classSavingThrows.text('Saving throw proficiencies: ')
    classSelectData.saving_throws.forEach((save) => {
        if (classSelectData.saving_throws.indexOf(save) === classSelectData.saving_throws.length - 1) {
            $classSavingThrows.append(`<span class="saves" id=${save.index}>${save.name}</span>`)
        } else {
            $classSavingThrows.append(`<span class="saves" id=${save.index}>${save.name}, </span>`)
        }
    })
    $classSavingThrows.splice(0, -3)

    $classProficiencies.text('Equipment and tool proficiencies: ')
    classSelectData.proficiencies.forEach((prof) => {
        if (classSelectData.proficiencies.indexOf(prof) === classSelectData.proficiencies.length - 1) {
            $classProficiencies.append(`<span class="profs" id=${prof.index}>${prof.name}</span>`)
        } else {
            $classProficiencies.append(`<span class="profs" id=${prof.index}>${prof.name}, </span>`)
        }
    })
    $classProficiencies.splice(0, -3)

    $classProfOptions.text('Skill proficiencies: ')
    if (classSelectData.hasOwnProperty("proficiency_choices")) {
        classSelectData.proficiency_choices.forEach((choice) => {
            $classProfOptions.append(`<div class="prof-options choose${choice.choose}">Choose from ${choice.choose} of the following:</div>`)
            choice.from.forEach((prof) => {
                $classProfOptions.append(`<button class="chosen-profs btn btn-outline-dark m-1" data-bs-toggle="button" id=${prof.index}>
                ${prof.name}</button>`)
            })
            $classProfOptions.append('<br>')
        })
    }

    $classEquipment.text('Starting equipment: ')
    classSelectData.starting_equipment.forEach((equip) => {
        $classEquipment.append(`<div class="equips" id=${equip.equipment.index}>${equip.equipment.name}
        x${equip.quantity}</div>`)
    })

    $classEquipChoices.text('')
    classSelectData.starting_equipment_options.forEach((option) => {
        // For every equipment group option, choose an amount from multiple groups
        $classEquipChoices.append(`<div class="equip-option choose${option.choose}">Choose from ${option.choose} of the following:</div>`)

        // Reset group number for every group option
        // console.log('option', option)
        // For every group option, list all the equipment groups per group option
        option.from.forEach((equipGroup) => {
            // console.log('equip group', equipGroup)
            // Convert equip group object names into a completely new array

            if (equipGroup.hasOwnProperty('0')) {
                // If equip group has an object which is an object-array
                eqObj = equipGroup
                fragEquip = '<button class="equips btn btn-outline-dark m-1" data-bs-toggle="button">'
                fragId = ''
                // console.log('equip group', eqObj)
                // Loop over the entire object and perform the same checks
                Object.keys(eqObj).forEach((key) => {
                    eqObjOpt = eqObj[key]
                    // console.log('equip title', eqObjOpt)
                    if (eqObjOpt.hasOwnProperty('equipment')) {
                        // If equip group is a single item
                        fragEquip += `${eqObjOpt.equipment.name} x${eqObjOpt.quantity} `
                        fragId += `${eqObjOpt.equipment.index}-${eqObjOpt.quantity}-`
                    } else if (eqObjOpt.hasOwnProperty('equipment_option')) {
                        // If equip group has options
                        fragEquip += `${eqObjOpt.equipment_option.from.equipment_category.name} 
                        x${eqObjOpt.equipment_option.choose} `
                        fragId += `${eqObjOpt.equipment_option.from.equipment_category.index} 
                        -${eqObjOpt.equipment_option.choose}-`
                    }
                })
                fragEquip = fragEquip.slice(0, -1)
                fragEquip += `</button>`
                fragId = fragId.slice(0, -1)
                // console.log(fragEquip, fragId)
                $classEquipChoices.append(fragEquip)

            } else if (equipGroup.hasOwnProperty('equipment')) {
                // If equip group is a single item
                // console.log('hasequip')
                $classEquipChoices.append(`<button class="equips btn btn-outline-dark m-1" data-bs-toggle="button" id="${equipGroup.equipment.index}-${equipGroup.quantity}">${equipGroup.equipment.name} x${equipGroup.quantity}`)

            } else if (equipGroup.hasOwnProperty('equipment_option')) {
                // If equip group has options -- solely for choosing multiple martial/simple weapons
                // console.log('hasequipoption')
                $classEquipChoices.append(`<button class="equips btn btn-outline-dark m-1" 
                id="${equipGroup.equipment_option.from.equipment_category.index}-${equipGroup.equipment_option.choose}">
                ${equipGroup.equipment_option.from.equipment_category.name} x${equipGroup.equipment_option.choose} </button>`)
            }
        })
    })
}
// TODO: ADD TOGGLE BUTTONS, WHEN REACH MAX CHOICE DISABLE BUTTONS

// Stat Functions
$('button#roll').on('click', showRoll)
$('button#buy').on('click', showBuy)
$('#roll-btn').on('click', rollStats)
$('.increment').on('click', increaseStat)
$('.decrement').on('click', decreaseStat)

$('.transition-stat').on('click', function () {
    $(this).parent().parent().parent().fadeOut(500).remove(5)
    $('#tranScreen').fadeIn().fadeOut(1000, () => {
        $(this).parent().parent().parent().next().fadeIn(300)
    })
})


let currentStat, currentArray = [],
    statNum

let remainingPoints = parseInt($('#points-remaining').text())
const $statPoints = $('#points-remaining')

const statNames = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']

function showRoll() {
    $(this).parent().parent().parent().fadeOut(500)
    $(this).parent().parent().fadeOut(500).remove(5)
    $('#tranScreen').fadeIn().fadeOut(1000, () => {
        $(this).parent().parent().parent().fadeIn(500)
        $('#stat-roll').fadeIn(300)
    })
}

function showBuy() {
    $(this).parent().parent().parent().fadeOut(500)
    $(this).parent().parent().fadeOut(500).remove(5)
    $('#tranScreen').fadeIn().fadeOut(1000, () => {
        $(this).parent().parent().parent().fadeIn(500)
        $('#point-buy').fadeIn(300)
    })
}


function rollStats() {
    for (i = 0; i < 6; i++) {
        currentArray = []
        for (j = 0; j < 4; j++) {
            currentArray.push(Math.floor(Math.random() * (6 - 1 + 1) + 1))
        }
        currentArray = currentArray.sort()
        currentArray.shift()
        currentStat = currentArray.reduce((total, current) => total + current)
    }

}

function increaseStat() {
    let $statTarget = $(this).parent().parent().children('.buy-stat')
    statNum = parseInt($statTarget.text())
    let decSib = $(this).parent().children('.decrement')

    // Exits loop if no points
    if (remainingPoints === 0) {
        return
    }

    // Adds stats, decreases remaining points
    if (statNum < 13) {
        if (statNum === 8 && decSib.hasClass('btn-outline-danger')) {
            decSib.addClass('btn-outline-secondary').removeClass('btn-outline-danger')
            decSib.removeAttr('data-bs-toggle title')
        }
        statNum += 1
        remainingPoints -= 1
        $statTarget.text(statNum)
        $statPoints.text(remainingPoints)
    } else if (statNum < 15) {
        statNum += 1
        remainingPoints -= 2
        $statTarget.text(statNum)
        $statPoints.text(remainingPoints)
    }

    // If stat is 15 after adding, cannot go higher
    if (statNum === 15) {
        $(this).attr('data-bs-toggle', "true")
        $(this).attr('title', "Cannot go higher than 15")
        $(this).removeClass('btn-outline-secondary').addClass('btn-outline-danger')
    }

    // If no points left, alerts user that they need points
    if (remainingPoints === 0) {
        $('.increment').attr('data-bs-toggle', "true")
        $('.increment').attr('title', "No points remaining!")
        $('.increment').removeClass('btn-outline-secondary').addClass('btn-outline-danger')
        return
    }


}

function decreaseStat() {
    let $statTarget = $(this).parent().parent().children('.buy-stat')
    statNum = parseInt($statTarget.text())
    let incSib = $(this).parent().children('.increment')

    // If regaining points, remove danger from all except if stat = 15
    if (remainingPoints === 0) {
        $('.increment').removeClass('btn-outline-danger').addClass('btn-outline-secondary')
        $('.increment').removeAttr('data-bs-toggle title')
        pointAlert()
    }

    // Remove stats, increases remaining points
    if (statNum > 13) {
        if (statNum === 15 && incSib.hasClass('btn-outline-danger')) {
            incSib.addClass('btn-outline-secondary').removeClass('btn-outline-danger')
            incSib.removeAttr('data-bs-toggle title')
        }
        statNum -= 1
        remainingPoints += 2
        $statTarget.text(statNum)
        $statPoints.text(remainingPoints)
    } else if (statNum > 8) {
        if (statNum === 9) {
            $(this).attr('data-bs-toggle', "true")
            $(this).attr('title', "Cannot go lower than 8")
            $(this).removeClass('btn-outline-secondary').addClass('btn-outline-danger')
        }
        statNum -= 1
        remainingPoints += 1
        $statTarget.text(statNum)
        $statPoints.text(remainingPoints)
    }

}

function pointAlert() {
    let $eachIncrement = $('.buy-stat-container').children().children('.alteration').children('.increment')
    let $eachStat = $('.buy-stat-container').children().children('.buy-stat')
    for (i = 0; i < 5; i++) {
        if (parseInt($($eachStat[i]).text()) === 15) {
            $($eachIncrement[i]).removeClass('btn-outline-secondary').addClass('btn-outline-danger')
            $($eachIncrement[i]).attr('data-bs-toggle', "true")
            $($eachIncrement[i]).attr('title', "Cannot go higher than 15")
        }
    }
}