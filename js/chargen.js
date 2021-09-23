// TODO LIST:
// TODO: !!IMPORTANT!! STORE VARIABLES
//
// TODO: IMPROVE CODE READABILITY
// TODO: ADD EQUIPMENT CHOOSE SECTION
// TODO: ADD BACKSTORY WRITE-IN
// TODO: ADD CUSTOM BACKGROUNDS

// CONSTANTS
BASEURL = 'https://www.dnd5eapi.co/api/'

// Simple CSS Fade Transition
$('.transition').on('click', function () {
    $(this).parent().parent().fadeOut(500).remove(5)
    $('#tranScreen').fadeIn().fadeOut(1000, () => {
        $(this).parent().parent().next().fadeIn(300)
    })
})

// Toggle button limiter
$('.props').on('change', ':checkbox', function() {
    let limit = parseInt($(this).siblings('div').text().match(/\d/)[0])
    let checkedAmount = $(this).parent().children(':checkbox:checked').length
    if (checkedAmount === limit && $(this).prop('checked')) {
        $(this).siblings(':checkbox').not(':checked').prop('disabled', true)
    } else if (checkedAmount === limit-1 && $(this).prop('checked') === false) {
        $(this).siblings(':checkbox').not(':checked').prop('disabled', false)
    }
})

//// RACE FUNCTIONS
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
    $('#race-container .props').css('border-bottom', '1px solid ghostwhite').css('padding', '1rem')
}

// Manipulates data for selected race and renders
function raceRender() {
    $raceName.text(raceSelectData.name).css('font-size', '3rem').css('border-bottom', '1px solid black')
    $raceSpeed.text(`Speed: ${raceSelectData.speed} ft/6 seconds`).css('padding-top', '1rem')
    $raceSize.text(`Size: ${raceSelectData.size}-sized creature`)

    $raceBonusStats.text('Saving throw proficiencies: ')
    raceSelectData.ability_bonuses.forEach((ability) => {
        if (raceSelectData.ability_bonuses.indexOf(ability) === raceSelectData.ability_bonuses.length - 1) {
            $raceBonusStats.append(`<span class="bonusStat" 
                id=${ability.ability_score.index}>
                ${ability.ability_score.name} + ${ability.bonus}</span>`)
        } else {
            $raceBonusStats.append(`<span class="bonusStat" 
                id=${ability.ability_score.index}>
                ${ability.ability_score.name} + ${ability.bonus}, </span>`)
        }
    })

    $raceProficiencies.text('')
    if (raceSelectData.starting_proficiencies.length !== 0) {
        $raceProficiencies.text('Proficiencies: ')
        raceSelectData.starting_proficiencies.forEach((proficiency) => {
            if (raceSelectData.starting_proficiencies.indexOf(proficiency) === raceSelectData.starting_proficiencies.length - 1) {
                $raceProficiencies.append(`<span class="proficiencies" 
                    id=${proficiency.index}>
                    ${proficiency.name}</span>`)
            } else {
                $raceProficiencies.append(`<span class="proficiencies" 
                    id=${proficiency.index}>
                    ${proficiency.name}, </span>`)
            }
        })
    }


    $raceProfOptions.text('')
    if (raceSelectData.starting_proficiency_options !== undefined) {
        $raceProfOptions.append(`<br>`)
        $raceProfOptions.append(`<div>Choose from ${raceSelectData.starting_proficiency_options.choose} of the following proficiencies:</div>`)
        raceSelectData.starting_proficiency_options.from.forEach((proficiency) => {
            $raceProfOptions.append(`<input type="checkbox" class="btn-check btn-outline-dark m-1" 
            id="race-${proficiency.index}" autocomplete="off">`)
            $raceProfOptions.append(`<label class="btn btn-outline-dark m-1" for="race-${proficiency.index}">${proficiency.name}</label>`)
        })
    }

    $raceLanguages.text(`Languages known: `)
    raceSelectData.languages.forEach((language) => {
        if (raceSelectData.languages.indexOf(language) === raceSelectData.languages.length - 1) {
            $raceLanguages.append(`<span class="languages" 
                id=${language.index}>
                ${language.name}</span>`)
        } else {
            $raceLanguages.append(`<span class="languages" 
                id=${language.index}>
                ${language.name}, </span>`)
        }
    })

    $raceLangOptions.text('')
    if (raceSelectData.language_options !== undefined) {
        $raceLanguages.append('<br><br>')
        $raceLangOptions.append(`<div>Choose from ${raceSelectData.language_options.choose} of the following languages:</div>`)
        raceSelectData.language_options.from.forEach((language) => {
            $raceLangOptions.append(`<input type="checkbox" class="btn-check btn-outline-dark m-1" 
            id="race-${language.index}" autocomplete="off">`)
            $raceLangOptions.append(`<label class="btn btn-outline-dark m-1" for="race-${language.index}">${language.name}</label>`)
        })
    }

    $raceTraits.text('')
    if (raceSelectData.traits.length !== 0) {
        $raceTraits.text(`Racial Traits: `)
        raceSelectData.traits.forEach((trait) => {
            if (raceSelectData.traits.indexOf(trait) === raceSelectData.traits.length - 1) {
                $raceTraits.append(`<span class="traits" 
                    id=${trait.index}>
                    ${trait.name}</span>`)
            } else {
                $raceTraits.append(`<span class="traits" 
                    id=${trait.index}>
                    ${trait.name}, </span>`)
            }
        })
    } else {
        $('#race-traits').css('border-bottom', '').css('padding', '')
    }

    $raceDescription.text(raceSelectData.alignment + ' ' + raceSelectData.size_description + ' ' + raceSelectData.age)
}


//// CLASS Functions
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


// Populates class data from API
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

// Adds classes to selector list
function classAddList() {
    classData.results.forEach(function (cls) {
        $classList.append(`<option value=${cls.index}>${cls.name}</option>`)
    })
}

// Populates class data from API
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
    $('#class-container .props').css('border-bottom', '1px solid ghostwhite').css('padding', '1rem')
}


// TODO: ADD LATER WHEN EQ CHOICE PAGE IS DONE
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
    $className.text(classSelectData.name).css('font-size', '3rem').css('border-bottom', '1px solid black')
    $classHitDice.text('Hit dice size: ' + classSelectData.hit_die).css('padding-top', '1rem')

    $classSavingThrows.text('Saving throw proficiencies: ')
    classSelectData.saving_throws.forEach((save) => {
        if (classSelectData.saving_throws.indexOf(save) === classSelectData.saving_throws.length - 1) {
            $classSavingThrows.append(`<span class="saves" 
                id=${save.index}>
                ${save.name}</span>`)
        } else {
            $classSavingThrows.append(`<span class="saves" 
                id=${save.index}>
                ${save.name}, </span>`)
        }
    })

    $classProficiencies.text('Equipment and tool proficiencies: ')
    classSelectData.proficiencies.forEach((prof) => {
        if (classSelectData.proficiencies.indexOf(prof) === classSelectData.proficiencies.length - 1) {
            $classProficiencies.append(`<span class="profs" 
                id=${prof.index}>
                ${prof.name}</span>`)
        } else {
            $classProficiencies.append(`<span class="profs" 
                id=${prof.index}>
                ${prof.name}, </span>`)
        }
    })

    $classProfOptions.text('')
    if (classSelectData.hasOwnProperty("proficiency_choices")) {
        classSelectData.proficiency_choices.forEach((choice) => {
            $classProfOptions.append('<br>')
            $classProfOptions.append(`<div>Choose from ${choice.choose} of the following skill proficiencies:</div>`)
            choice.from.forEach((prof) => {
                $classProfOptions.append(`<input type="checkbox" class="btn-check btn-outline-dark m-1" 
                id="class-${prof.index}" autocomplete="off">`)
                $classProfOptions.append(`<label class="btn btn-outline-dark m-1" for="class-${prof.index}">${prof.name}</label>`)
            })
            $classProfOptions.append('<br>')
        })
    }

    $classEquipment.text('Starting equipment: ')
    classSelectData.starting_equipment.forEach((equip) => {
        $classEquipment.append(`<div class="equips" 
        id=${equip.equipment.index}>${equip.equipment.name}
        x${equip.quantity}</div>`)
    })

    $classEquipChoices.text('')
    let optionNo = 0;
    classSelectData.starting_equipment_options.forEach((option) => {
        $classEquipChoices.append('<br>')

        // Create new div for group
        $classEquipChoices.append('<div class="equip-group"></div>')

        // For every equipment group option, choose an amount from multiple groups
        $classEquipChoices.append(`<div class="choose-text">Choose from ${option.choose} of the following:</div>`)

        let closeGroup = $classEquipChoices.children('.equip-group').last()


        // For every group option, list all the equipment groups per group option
        option.from.forEach((equipGroup) => {
            optionNo += 1

            // Convert equip group object names into a completely new array

            if (equipGroup.hasOwnProperty('0')) {
                // If equip group has an object which is an object-array
                eqObj = equipGroup
                let equipInputFrag = '<input type="checkbox" class="btn-check btn-outline-dark m-1" autocomplete="off">'
                let equipLabelFrag = '<label class="btn btn-outline-dark m-1">'
                fragId = `class-${optionNo}-`

                // Loop over the entire object and perform the same checks
                Object.keys(eqObj).forEach((key) => {

                    eqObjOpt = eqObj[key]
                    if (eqObjOpt.hasOwnProperty('equipment')) {
                        // If equip group is a single item
                        equipLabelFrag += `${eqObjOpt.equipment.name} x${eqObjOpt.quantity} `
                        fragId += `${eqObjOpt.equipment.index}-${eqObjOpt.quantity}-`
                    } else if (eqObjOpt.hasOwnProperty('equipment_option')) {
                        // If equip group has options
                        equipLabelFrag += `${eqObjOpt.equipment_option.from.equipment_category.name} x${eqObjOpt.equipment_option.choose} `
                        fragId += `${eqObjOpt.equipment_option.from.equipment_category.index}-${eqObjOpt.equipment_option.choose}-`
                    }
                })
                equipLabelFrag = equipLabelFrag.slice(0, -1)
                equipLabelFrag += `</label>`
                fragId = fragId.slice(0, -1)

                $classEquipChoices.append(equipInputFrag)
                $classEquipChoices.children(':last-child')[0].setAttribute('id',`${fragId}`)
                
                $classEquipChoices.append(equipLabelFrag)
                $classEquipChoices.children(':last-child')[0].setAttribute('for',`${fragId}`)

            } else if (equipGroup.hasOwnProperty('equipment')) {
                // If equip group is a single item
                $classEquipChoices.append(`<input type="checkbox" class="btn-check btn-outline-dark m-1" 
                id="class-${optionNo}-${equipGroup.equipment.index}-${equipGroup.quantity}" 
                autocomplete="off">`)
                $classEquipChoices.append(`<label class="btn btn-outline-dark m-1" 
                for="class-${optionNo}-${equipGroup.equipment.index}-${equipGroup.quantity}">
                ${equipGroup.equipment.name} x${equipGroup.quantity}</label>`)

            } else if (equipGroup.hasOwnProperty('equipment_option')) {
                // If equip group has options -- solely for choosing multiple martial/simple weapons
                $classEquipChoices.append(`<input type="checkbox" class="btn-check btn-outline-dark m-1" 
                id="class-${optionNo}-${equipGroup.equipment_option.from.equipment_category.index}-${equipGroup.equipment_option.choose}" 
                autocomplete="off">`)
                $classEquipChoices.append(`<label class="btn btn-outline-dark m-1" 
                for="class-${optionNo}-${equipGroup.equipment_option.from.equipment_category.index}-${equipGroup.equipment_option.choose}">
                ${equipGroup.equipment_option.from.equipment_category.name} x${equipGroup.equipment_option.choose}</label>`)
            } else if (equipGroup.hasOwnProperty('equipment_category')) {
                // if equip group has category -- solely for foci
                $classEquipChoices.append(`<input type="checkbox" class="btn-check btn-outline-dark m-1" 
                id="class-${optionNo}-${equipGroup.equipment_category.index}-${option.choose}" 
                autocomplete="off">`)
                $classEquipChoices.append(`<label class="btn btn-outline-dark m-1" 
                for="class-${optionNo}-${equipGroup.equipment_category.index}-${option.choose}">
                ${equipGroup.equipment_category.name} x${option.choose}</label>`)
            }
            // FIXME: VERY INEFFICIENT: CHANGE TO ADD NEW DIV UP TOP
            $classEquipChoices.children('input').detach().appendTo(closeGroup)
            $classEquipChoices.children('label').detach().appendTo(closeGroup)
        })
        $classEquipChoices.children('.choose-text').detach().prependTo($classEquipChoices.children('.equip-group').last())
    })
}
// Renders class data


// Stat Functions
$('button#roll').on('click', showRoll)
$('button#buy').on('click', showBuy)
$('#roll-btn').on('click', rollStats)
$('.increment').on('click', increaseStat)
$('.decrement').on('click', decreaseStat)

// Fade transition specific for stat section
$('.transition-stat').on('click', function () {
    $(this).parent().parent().parent().fadeOut(500).remove(5)
    $('#tranScreen').fadeIn().fadeOut(1000, () => {
        $(this).parent().parent().parent().next().fadeIn(300)
    })
})

let currentStat, statNum, currentArray = []

let remainingPoints = parseInt($('#points-remaining').text())
const $statPoints = $('#points-remaining')

const statNames = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']

// Shows stat roll section
function showRoll() {
    $(this).parent().parent().parent().fadeOut(500)
    $(this).parent().parent().fadeOut(500).remove(5)
    $('#tranScreen').fadeIn().fadeOut(1000, () => {
        $(this).parent().parent().parent().fadeIn(500)
        $('#stat-roll').fadeIn(300)
    })
}

// Shows point buy section
function showBuy() {
    $(this).parent().parent().parent().fadeOut(500)
    $(this).parent().parent().fadeOut(500).remove(5)
    $('#tranScreen').fadeIn().fadeOut(1000, () => {
        $(this).parent().parent().parent().fadeIn(500)
        $('#point-buy').fadeIn(300)
    })
}

// Rolls stats
function rollStats() {
    for (i = 0; i < 6; i++) {
        currentArray = []
        for (j = 0; j < 4; j++) {
            currentArray.push(Math.floor(Math.random() * (6 - 1 + 1) + 1))
        }
        currentArray = currentArray.sort()
        currentArray.shift()
        currentStat = currentArray.reduce((total, current) => total + current)
        $(`#stat-roll .card-header:contains(${statNames[i]})`).siblings().text(currentStat)
    }

}

// Increases stat
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

// Decreases stat
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

// Alerts user if points run out
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

//// BACKGROUND FUNCTIONS
$('.background-next').on('click', populateBackgroundList)
$('#background-list').change(populateBackgroundDetails)

let backgroundSelection

const $backgroundList = $('#background-list')

const $backgroundProperties = $('#background-properties')
const $backgroundName = $('#background-name')
const $backgroundFeature = $('#background-feature')

const $backgroundProficiencies = $('#background-proficiencies')
const $backgroundProfOptions = $('#background-prof-choices')

const $backgroundEquipment = $('#background-equipment')
const $backgroundEquipChoices = $('#background-equip-choices')

const $backgroundLanguages = $('#background-languages')
const $backgroundLangOptions = $('#background-lang-options')

//
function populateBackgroundList() {
    $.ajax({
        url: BASEURL + 'backgrounds/'
    }).then(
        (data) => {
            backgroundData = data
            console.log('background list populated')
            backgroundAddList()
        },
        (error) => {
            console.log('Bad Request: ', error)
        }
    )
}

function backgroundAddList() {
    backgroundData.results.forEach(function (bg) {
        console.log('background populated')
        $backgroundList.append(`<option value=${bg.index}>${bg.name}</option>`)
    })
}

function populateBackgroundDetails() {
    backgroundSelection = $('#background-list option:selected').val()
    $.ajax({
        url: BASEURL + 'backgrounds/' + backgroundSelection
    }).then(
        (data) => {
            backgroundSelectData = data
            console.log('background selected')
            backgroundRender()
        },
        (error) => {
            console.log('Bad Request: ', error)
        }
    )
    // TODO: CHECK TO SEE IF THIS IS NEEDED
    $('#background-container .props').css('border-bottom', '1px solid ghostwhite').css('padding', '1rem')
}

function backgroundRender() {
    $backgroundName.text(backgroundSelectData.name).css('font-size', '3rem').css('border-bottom', '1px solid black')

    $backgroundFeature.text('')
    $backgroundFeature.text('Background feature: ' + backgroundSelectData.feature.name).css('padding-top', '1rem')
    $backgroundFeature.append(`<div id="background-feature-text" style="border-top:1px dashed black">${backgroundSelectData.feature.desc.join(' ')}</div>`)

    // Identical to race proficiency
    $backgroundProficiencies.text('')
    if (backgroundSelectData.starting_proficiencies.length !== 0) {
        $backgroundProficiencies.text('Proficiencies: ')
        backgroundSelectData.starting_proficiencies.forEach((proficiency) => {
            if (backgroundSelectData.starting_proficiencies.indexOf(proficiency) === backgroundSelectData.starting_proficiencies.length - 1) {
                $backgroundProficiencies.append(`<span class="proficiencies" 
                    id=${proficiency.index}>
                    ${proficiency.name}</span>`)
            } else {
                $backgroundProficiencies.append(`<span class="proficiencies" 
                    id=${proficiency.index}>
                    ${proficiency.name}, </span>`)
            }
        })
    }

    // Identical to race proficiency options
    $backgroundProfOptions.text('')
    if (backgroundSelectData.starting_proficiency_options !== undefined) {
        $backgroundProfOptions.append(`<br>`)
        $backgroundProfOptions.append(`<div>Choose from ${backgroundSelectData.starting_proficiency_options.choose} of the following proficiencies:</div>`)
        backgroundSelectData.starting_proficiency_options.from.forEach((proficiency) => {
            $backgroundProfOptions.append(`<input type="checkbox" class="btn-check btn-outline-dark m-1" 
            id="background-${proficiency.index}" autocomplete="off">`)
            $backgroundProfOptions.append(`<label class="btn btn-outline-dark m-1" for="background-${proficiency.index}">${proficiency.name}</label>`)
        })
    }

    // Identical to class equipment
    $backgroundEquipment.text('Starting equipment: ')
    backgroundSelectData.starting_equipment.forEach((equip) => {
        $backgroundEquipment.append(`<div class="equips" 
        id=${equip.equipment.index}>${equip.equipment.name}
        x${equip.quantity}</div>`)
    })

    // Identical to class equipment choices
    $backgroundEquipChoices.text('')
    let optionNo = 0;
    backgroundSelectData.starting_equipment_options.forEach((option) => {
        $backgroundEquipChoices.append('<br>')

        // Create new div for group
        $backgroundEquipChoices.append('<div class="equip-group"></div>')

        // For every equipment group option, choose an amount from multiple groups
        $backgroundEquipChoices.append(`<div class="choose-text">Choose from ${option.choose} of the following:</div>`)

        let closeGroup = $backgroundEquipChoices.children('.equip-group').last()


        // For every group option, list all the equipment groups per group option
        option.from.forEach((equipGroup) => {
            optionNo += 1

            // Convert equip group object names into a completely new array

            if (equipGroup.hasOwnProperty('0')) {
                // If equip group has an object which is an object-array
                eqObj = equipGroup
                let equipInputFrag = '<input type="checkbox" class="btn-check btn-outline-dark m-1" autocomplete="off">'
                let equipLabelFrag = '<label class="btn btn-outline-dark m-1">'
                fragId = `background-${optionNo}-`

                // Loop over the entire object and perform the same checks
                Object.keys(eqObj).forEach((key) => {

                    eqObjOpt = eqObj[key]
                    if (eqObjOpt.hasOwnProperty('equipment')) {
                        // If equip group is a single item
                        equipLabelFrag += `${eqObjOpt.equipment.name} x${eqObjOpt.quantity} `
                        fragId += `${eqObjOpt.equipment.index}-${eqObjOpt.quantity}-`
                    } else if (eqObjOpt.hasOwnProperty('equipment_option')) {
                        // If equip group has options
                        equipLabelFrag += `${eqObjOpt.equipment_option.from.equipment_category.name} x${eqObjOpt.equipment_option.choose} `
                        fragId += `${eqObjOpt.equipment_option.from.equipment_category.index}-${eqObjOpt.equipment_option.choose}-`
                    }
                })
                equipLabelFrag = equipLabelFrag.slice(0, -1)
                equipLabelFrag += `</label>`
                fragId = fragId.slice(0, -1)

                $backgroundEquipChoices.append(equipInputFrag)
                $backgroundEquipChoices.children(':last-child')[0].setAttribute('id',`${fragId}`)
                
                $backgroundEquipChoices.append(equipLabelFrag)
                $backgroundEquipChoices.children(':last-child')[0].setAttribute('for',`${fragId}`)

            } else if (equipGroup.hasOwnProperty('equipment')) {
                // If equip group is a single item
                $backgroundEquipChoices.append(`<input type="checkbox" class="btn-check btn-outline-dark m-1" 
                id="background-${optionNo}-${equipGroup.equipment.index}-${equipGroup.quantity}" 
                autocomplete="off">`)
                $backgroundEquipChoices.append(`<label class="btn btn-outline-dark m-1" 
                for="background-${optionNo}-${equipGroup.equipment.index}-${equipGroup.quantity}">
                ${equipGroup.equipment.name} x${equipGroup.quantity}</label>`)

            } else if (equipGroup.hasOwnProperty('equipment_option')) {
                // If equip group has options -- for choosing multiple martial/simple weapons or foci
                $backgroundEquipChoices.append(`<input type="checkbox" class="btn-check btn-outline-dark m-1" 
                id="background-${optionNo}-${equipGroup.equipment_option.from.equipment_category.index}-${equipGroup.equipment_option.choose}" 
                autocomplete="off">`)
                $backgroundEquipChoices.append(`<label class="btn btn-outline-dark m-1" 
                for="background-${optionNo}-${equipGroup.equipment_option.from.equipment_category.index}-${equipGroup.equipment_option.choose}">
                ${equipGroup.equipment_option.from.equipment_category.name} x${equipGroup.equipment_option.choose}</label>`)

            } else if (equipGroup.hasOwnProperty('equipment_category')) {
                // if equip group has category -- solely for foci
                $backgroundEquipChoices.append(`<input type="checkbox" class="btn-check btn-outline-dark m-1" 
                id="background-${optionNo}-${equipGroup.equipment_category.index}-${option.choose}" 
                autocomplete="off">`)
                $backgroundEquipChoices.append(`<label class="btn btn-outline-dark m-1" 
                for="background-${optionNo}-${equipGroup.equipment_category.index}-${option.choose}">
                ${equipGroup.equipment_category.name} x${option.choose}</label>`)
            }

            $backgroundEquipChoices.children('input').detach().appendTo(closeGroup)
            $backgroundEquipChoices.children('label').detach().appendTo(closeGroup)
            // FIXME: INEFFICIENT, SAME AS CLASS
        })
        $backgroundEquipChoices.children('.choose-text').detach().prependTo($backgroundEquipChoices.children('.equip-group').last())
    })

    // Identical to race languages but includes if statement, depending if background has language or not
    $backgroundLanguages.text(`Languages known: `)
    if (backgroundSelectData.languages !== undefined) {
        backgroundSelectData.languages.forEach((language) => {
            if (backgroundSelectData.languages.indexOf(language) === backgroundSelectData.languages.length - 1) {
                $backgroundLanguages.append(`<span class="languages" 
                    id=${language.index}>
                    ${language.name}</span>`)
            } else {
                $backgroundLanguages.append(`<span class="languages" 
                    id=${language.index}>
                    ${language.name}, </span>`)
            }
        })
    }

    // Identical to race language options
    $backgroundLangOptions.text('')
    if (backgroundSelectData.language_options !== undefined) {
        $backgroundLanguages.append('<br><br>')
        $backgroundLangOptions.append(`<div>Choose from ${backgroundSelectData.language_options.choose} of the following languages:</div>`)
        backgroundSelectData.language_options.from.forEach((language) => {
            $backgroundLangOptions.append(`<input type="checkbox" class="btn-check btn-outline-dark m-1" 
            id="background-${language.index}" autocomplete="off">`)
            $backgroundLangOptions.append(`<label class="btn btn-outline-dark m-1" for="background-${language.index}">${language.name}</label>`)
        })
    }
}