// TODO LIST:
// TODO: !!IMPORTANT!! STORE VARIABLES
//
// TODO: IMPROVE CODE READABILITY
// TODO: ADD EQUIPMENT CHOOSE SECTION
// TODO: ADD "ARMOR" TO THE END OF ARMOR
// TODO: ADD BACKSTORY WRITE-IN
// TODO: ADD CUSTOM BACKGROUNDS
// TODO: ADD NOTIFICATION THAT PROFICIENCY CONFLICTS
// TODO: ADD BLOCKER IF ALL CHOICES AREN'T MADE
// TODO: ADD FADE-IN ON LIST LOADS
// TODO: ADD REGEX TO CLEAN CODE
// TODO: ADD TEXT INPUT SECTIONS
// TODO: ENSURE INDEX/NAME AGREEMENT WITH IDS
// TODO: DISABLE BUTTON ON RELOAD



// CONSTANTS
BASEURL = 'https://www.dnd5eapi.co/api/'


// EVENTS
// Simple CSS Fade Transition
$('.transition').on('click', function () {
    $(this).parent().parent().fadeOut(500).remove(5)
    $('#tranScreen').fadeIn().fadeOut(1000, () => {
        $(this).parent().parent().next().fadeIn(300)
    })
})

// Fade transition specific for stat section
$('.transition-stat').on('click', function () {
    $(this).parent().parent().parent().fadeOut(500).remove(5)
    $('#tranScreen').fadeIn().fadeOut(1000, () => {
        $(this).parent().parent().parent().next().fadeIn(300)
    })
})

// Toggle button limiter
$('.props').on('change', ':checkbox', function () {
    let limit = parseInt($(this).siblings('div').text().match(/\d/)[0])
    let checkedAmount = $(this).parent().children(':checkbox:checked').length
    if (checkedAmount === limit && $(this).prop('checked')) {
        $(this).siblings(':checkbox').not(':checked').prop('disabled', true)
    } else if (checkedAmount === limit - 1 && $(this).prop('checked') === false) {
        $(this).siblings(':checkbox').not(':checked').prop('disabled', false)
    }
})

//// RACE FUNCTIONS
$('#race-next').on('click', populateRaceList)
$('#race-list').change(populateRaceDetails)
$('#class-next').on('click', raceSave)

let raceData, raceSelectData, raceSelection

const raceStorage = {
    raceName: '',
    speed: 0,
    size: '',
    statBonusName: [],
    statBonusValue: [],
    profs: [],
    langs: [],
    traits: []
}

const $raceList = $('#race-list')

const $raceProperties = $('#race-properties')
const $raceName = $('#race-name')
const $raceSpeed = $('#race-speed')
const $raceSize = $('#race-size')

const $raceBonuses = $('#race-bonuses')
const $raceBonusStats = $('#race-bonus-stats')
const $raceBonusOptions = $('#race-bonus-options')

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

    $raceName.text('')
    $raceName.append(`<span id="race-name-${raceSelectData.name}">
        ${raceSelectData.name}</span>`).css('font-size', '3rem').css('border-bottom', '1px solid black')

    $raceSpeed.text('')
    $raceSpeed.append(`<span id="race-speed-${raceSelectData.speed}">
        Speed: ${raceSelectData.speed} ft/6 seconds</span>`).css('padding-top', '1rem')

    $raceSize.text('')
    $raceSize.append(`<span id="race-size-${raceSelectData.size}">
        Size: ${raceSelectData.size}-sized creature</span>`)

    $raceBonusStats.text('Ability bonuses: ')
    raceSelectData.ability_bonuses.forEach((ability) => {
        if (raceSelectData.ability_bonuses.indexOf(ability) === raceSelectData.ability_bonuses.length - 1) {
            $raceBonusStats.append(`<span class="bonusStat" 
                id=race-boon-${ability.ability_score.index}-${ability.bonus}>
                ${ability.ability_score.name} + ${ability.bonus}</span>`)
        } else {
            $raceBonusStats.append(`<span class="bonusStat" 
                id=race-boon-${ability.ability_score.index}-${ability.bonus}>
                ${ability.ability_score.name} + ${ability.bonus}, </span>`)
        }
    })

    $raceBonusOptions.text('')
    if (raceSelectData.ability_bonus_options !== undefined) {
        $raceBonusOptions.append(`<br>`)
        $raceBonusOptions.append(`<div>Choose from ${raceSelectData.ability_bonus_options.choose} of the following stat bonuses:</div>`)
        raceSelectData.ability_bonus_options.from.forEach((option) => {
            $raceBonusOptions.append(`<input type="checkbox" class="btn-check btn-outline-dark m-1" 
                id="race-ability-choice-${option.ability_score.index}-${option.bonus}" autocomplete="off">`)
            $raceBonusOptions.append(`<label class="btn btn-outline-dark m-1" 
                for="race-ability-choice-${option.ability_score.index}-${option.bonus}">${option.ability_score.name} + ${option.bonus}</label>`)
        })
    }

    $raceProficiencies.text('')
    if (raceSelectData.starting_proficiencies.length !== 0) {
        $raceProficiencies.text('Proficiencies: ')
        raceSelectData.starting_proficiencies.forEach((proficiency) => {
            if (raceSelectData.starting_proficiencies.indexOf(proficiency) === raceSelectData.starting_proficiencies.length - 1) {
                $raceProficiencies.append(`<span class="proficiencies" 
                    id=race-prof-${proficiency.index}>
                    ${proficiency.name}</span>`)
            } else {
                $raceProficiencies.append(`<span class="proficiencies" 
                    id=race-prof-${proficiency.index}>
                    ${proficiency.name}, </span>`)
            }
        })
    }

    // TODO: ADD PROFICIENCY: TEXT TO OPTIONS
    $raceProfOptions.text('')
    if (raceSelectData.starting_proficiency_options !== undefined) {
        $raceProfOptions.append(`<br>`)
        $raceProfOptions.append(`<div>Choose from ${raceSelectData.starting_proficiency_options.choose} of the following proficiencies:</div>`)
        raceSelectData.starting_proficiency_options.from.forEach((proficiency) => {
            $raceProfOptions.append(`<input type="checkbox" class="btn-check btn-outline-dark m-1" 
            id="race-prof-choice-${proficiency.index}" autocomplete="off">`)
            $raceProfOptions.append(`<label class="btn btn-outline-dark m-1" for="race-prof-choice-${proficiency.index}">${proficiency.name}</label>`)
        })
    }

    $raceLanguages.text(`Languages known: `)
    raceSelectData.languages.forEach((language) => {
        if (raceSelectData.languages.indexOf(language) === raceSelectData.languages.length - 1) {
            $raceLanguages.append(`<span class="languages" 
                id=race-language-${language.index}>
                ${language.name}</span>`)
        } else {
            $raceLanguages.append(`<span class="languages" 
                id=race-language-${language.index}>
                ${language.name}, </span>`)
        }
    })

    $raceLangOptions.text('')
    if (raceSelectData.language_options !== undefined) {
        $raceLanguages.append('<br><br>')
        $raceLangOptions.append(`<div>Choose from ${raceSelectData.language_options.choose} of the following languages:</div>`)
        raceSelectData.language_options.from.forEach((language) => {
            $raceLangOptions.append(`<input type="checkbox" class="btn-check btn-outline-dark m-1" 
            id="race-language-choice-${language.index}" autocomplete="off">`)
            $raceLangOptions.append(`<label class="btn btn-outline-dark m-1" for="race-language-choice-${language.index}">${language.name}</label>`)
        })
    }

    $raceTraits.text('')
    if (raceSelectData.traits.length !== 0) {
        $raceTraits.text(`Racial Traits: `)
        raceSelectData.traits.forEach((trait) => {
            if (raceSelectData.traits.indexOf(trait) === raceSelectData.traits.length - 1) {
                $raceTraits.append(`<span class="traits" 
                    id=race-trait-${trait.index}>
                    ${trait.name}</span>`)
            } else {
                $raceTraits.append(`<span class="traits" 
                    id=race-trait-${trait.index}>
                    ${trait.name}, </span>`)
            }
        })
    } else {
        $('#race-traits').css('border-bottom', '').css('padding', '')
    }

    $raceDescription.text(raceSelectData.alignment + ' ' + raceSelectData.size_description + ' ' + raceSelectData.age)
}

// Stores race values
function raceSave() {
    raceStorage.raceName = $raceName.children().attr('id').slice(10)
    raceStorage.speed = $raceSpeed.children().attr('id').slice(11)
    raceStorage.size = $raceSize.children().attr('id').slice(10)
    $.each($raceBonusStats.children(), function (index, stat) {
        if (stat.getAttribute('id') !== undefined && stat.getAttribute('id') !== null) {
            raceStorage.statBonusName.push(stat.getAttribute('id').slice(10, 13))
            raceStorage.statBonusValue.push(parseInt(stat.getAttribute('id').slice(14)))
        }
    })
    $.each($raceBonusOptions.children(':checkbox:checked'), function (index, stat) {
        if (stat.getAttribute('id') !== undefined && stat.getAttribute('id') !== null) {
            raceStorage.statBonusName.push(stat.getAttribute('id').slice(20, 23))
            raceStorage.statBonusValue.push(parseInt(stat.getAttribute('id').slice(24)))
        }
    })
    $.each($raceProficiencies.children(), function (index, prof) {
        if (prof.getAttribute('id') !== undefined && prof.getAttribute('id') !== null) {
            raceStorage.profs.push(prof.getAttribute('id').slice(10))
        }
    })
    $.each($raceProfOptions.children(':checkbox:checked'), function (index, prof) {
        if (prof.getAttribute('id') !== undefined && prof.getAttribute('id') !== null) {
            raceStorage.profs.push(prof.getAttribute('id').slice(17))
        }
    })
    $.each($raceLanguages.children(), function (index, lang) {
        if (lang.getAttribute('id') !== undefined && lang.getAttribute('id') !== null) {
            raceStorage.langs.push(lang.getAttribute('id').slice(14))
        }
    })
    $.each($raceLangOptions.children(':checkbox:checked'), function (index, lang) {
        if (lang.getAttribute('id') !== undefined && lang.getAttribute('id') !== null) {
            raceStorage.langs.push(lang.getAttribute('id').slice(21))
        }
    })
    $.each($raceTraits.children(), function (index, trait) {
        if (trait.getAttribute('id') !== undefined && trait.getAttribute('id') !== null) {
            raceStorage.traits.push(trait.getAttribute('id').slice(11))
        }
    })
}



//// CLASS Functions
$('#class-next').on('click', populateClassList)
$('#class-list').change(populateClassDetails)
$('#stat-next').on('click', classSave)

let classData, classSelectData, classSelection, martialData, simpleData, groupNumber, eqObj, eqObjOpt, fragEquip, fragId

const classStorage = {
    className: '',
    hitDice: 0,
    savingThrows: [],
    profs: [],
    equips: [],
}

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
    $className.text('')
    $className.append(`<span id="class-name-${classSelectData.name}">
        ${classSelectData.name}</span>`).css('font-size', '3rem').css('border-bottom', '1px solid black')

    $classHitDice.text('')
    $classHitDice.append(`<span id="class-hit-die-${classSelectData.hit_die}">
        Hit dice size: ${classSelectData.hit_die}</span>`).css('padding-top', '1rem')

    $classSavingThrows.text('Saving throw proficiencies: ')
    classSelectData.saving_throws.forEach((save) => {
        if (classSelectData.saving_throws.indexOf(save) === classSelectData.saving_throws.length - 1) {
            $classSavingThrows.append(`<span class="saves" 
                id="class-save-${save.index}">
                ${save.name}</span>`)
        } else {
            $classSavingThrows.append(`<span class="saves" 
                id="class-save-${save.index}">
                ${save.name}, </span>`)
        }
    })

    $classProficiencies.text('Equipment and tool proficiencies: ')
    classSelectData.proficiencies.forEach((prof) => {
        if (classSelectData.proficiencies.indexOf(prof) === classSelectData.proficiencies.length - 1) {
            $classProficiencies.append(`<span class="profs" 
                id="class-prof-${prof.index}">
                ${prof.name}</span>`)
        } else {
            $classProficiencies.append(`<span class="profs" 
                id="class-prof-${prof.index}">
                ${prof.name}, </span>`)
        }
    })

    $classProfOptions.text('')
    $classProfOptions.append('<br>')
    let optionNo = 0
    if (classSelectData.hasOwnProperty("proficiency_choices")) {
        classSelectData.proficiency_choices.forEach((choice) => {
            optionNo += 1
            $classProfOptions.append(`<div class="prof-group"><div>Choose from ${choice.choose} of the following proficiencies:</div></div>`)
            choice.from.forEach((prof) => {
                $classProfOptions.children('.prof-group').last().append(`<input type="checkbox" class="btn-check btn-outline-dark m-1" 
                    id="class-prof-${optionNo}-${prof.index}" autocomplete="off">`)
                $classProfOptions.children('.prof-group').last().append(`<label class="btn btn-outline-dark m-1" 
                    for="class-prof-${optionNo}-${prof.index}">${prof.name}</label>`)
            })
            if (classSelectData.proficiency_choices.indexOf(choice) === classSelectData.proficiency_choices.length - 1) {
                $classProfOptions.children('.prof-group').last().append(`<br>`)
            } else {
                $classProfOptions.children('.prof-group').last().append(`<br><br>`)
            }
        })
    }

    $classEquipment.text('Starting equipment: ')
    classSelectData.starting_equipment.forEach((equip) => {
        $classEquipment.append(`<div class="equips" 
        id="class-${equip.equipment.index}-${equip.quantity}">${equip.equipment.name}
        x${equip.quantity}</div>`)
    })

    $classEquipChoices.text('')
    optionNo = 0
    classSelectData.starting_equipment_options.forEach((option) => {
        $classEquipChoices.append('<br>')

        // Create new div for group
        $classEquipChoices.append('<div class="equip-group"></div>')

        // For every equipment group option, choose an amount from multiple groups
        $classEquipChoices.append(`<div class="choose-text">Choose from ${option.choose} of the following:</div>`)

        let closeGroup = $classEquipChoices.children('.equip-group').last()

        optionNo += 1
        // For every group option, list all the equipment groups per group option
        option.from.forEach((equipGroup) => {


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
                $classEquipChoices.children(':last-child')[0].setAttribute('id', `${fragId}`)

                $classEquipChoices.append(equipLabelFrag)
                $classEquipChoices.children(':last-child')[0].setAttribute('for', `${fragId}`)

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
            // TODO: VERY INEFFICIENT: CHANGE TO ADD NEW DIV UP TOP
            $classEquipChoices.children('input').detach().appendTo(closeGroup)
            $classEquipChoices.children('label').detach().appendTo(closeGroup)
        })
        $classEquipChoices.children('.choose-text').detach().prependTo($classEquipChoices.children('.equip-group').last())
    })
}
// Renders class data

// Stores class values
function classSave() {
    classStorage.className = $className.children().attr('id').slice(11)
    classStorage.hitDice = $classHitDice.children().attr('id').slice(14)

    $.each($classSavingThrows.children(), function (index, save) {
        if (save.getAttribute('id') !== undefined && save.getAttribute('id') !== null) {
            classStorage.savingThrows.push(save.getAttribute('id').slice(11))
        }
    })

    $.each($classProficiencies.children(), function (index, prof) {
        if (prof.getAttribute('id') !== undefined && prof.getAttribute('id') !== null) {
            classStorage.profs.push(prof.getAttribute('id').slice(11))
        }
    })

    $.each($classProfOptions.find(':checkbox:checked'), function (index, prof) {
        if (prof.getAttribute('id') !== undefined && prof.getAttribute('id') !== null) {
            classStorage.profs.push(prof.getAttribute('id').slice(13))
        }
    })

    $.each($classEquipment.children(), function (index, eqs) {
        if (eqs.getAttribute('id') !== undefined && eqs.getAttribute('id') !== null) {
            classStorage.equips.push(eqs.getAttribute('id').slice(6))
        }
    })
    $.each($classEquipChoices.find(':checkbox:checked'), function (index, eqs) {
        if (eqs.getAttribute('id') !== undefined && eqs.getAttribute('id') !== null) {
            classStorage.equips.push(eqs.getAttribute('id').slice(8))
        }
    })
}


// Stat Functions
$('button#roll').on('click', showRoll)
$('button#buy').on('click', showBuy)
$('#roll-btn').on('click', rollStats)
$('.increment').on('click', increaseStat)
$('.decrement').on('click', decreaseStat)
$('#roll-finish').on('click', saveRoll)
$('#buy-finish').on('click', saveBuy)

let currentStat, statNum, incSib, decSib, currentArray = []
let $statTarget
let remainingPoints = parseInt($('#points-remaining').text())

const statNames = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']

const statStorage = {
    stats: statNames,
    statValues: []
}

const $statPoints = $('#points-remaining')
const $eachIncrement = $('.buy-stat-container').children().children('.alteration').children('.increment')
const $eachStat = $('.buy-stat-container').children().children('.buy-stat')
const $statRoll = $('#stat-roll')
const $pointBuy = $('#point-buy')
const $statInfo = $('#stat-info')
const $statContent = $('#stat-content')
const $rollStatSection = $('.roll-stat-container')
const $buyStatSection = $('.buy-stat-container')

// Shows stat roll section
function showRoll() {
    // $(this).parent().parent().parent().fadeOut(500)
    $statInfo.fadeOut(500)
    // $(this).parent().parent().fadeOut(500).remove(5)
    $statContent.fadeOut(500).remove(5)
    $('#tranScreen').fadeIn().fadeOut(1000, () => {
        // $(this).parent().parent().parent().fadeIn(500)
        $statInfo.fadeIn(500)
        $statRoll.fadeIn(300)
    })
}

// Shows point buy section
function showBuy() {
    // $(this).parent().parent().parent().fadeOut(500)
    $statInfo.fadeOut(500)
    $statContent.fadeOut(500).remove(5)
    $('#tranScreen').fadeIn().fadeOut(1000, () => {
        // $(this).parent().parent().parent().fadeIn(500)
        $statInfo.fadeIn(500)
        $pointBuy.fadeIn(300)
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
    $statTarget = $(this).parent().parent().children('.buy-stat')
    statNum = parseInt($statTarget.text())
    decSib = $(this).parent().children('.decrement')

    // Exits loop if not enough points
    if (remainingPoints === 0) {
        return
    } else if (remainingPoints === 1 && (statNum === 13 || statNum === 14)) {
        return
    }

    // Adds stats, decreases remaining points
    if (statNum < 13) {
        // Removes decrement limiter if adding point
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

    // Alerts user for stats = 13 or 14 if only 1 point left
    if (remainingPoints === 1) {
        pointAlert()
    }
}

// Decreases stat
function decreaseStat() {
    $statTarget = $(this).parent().parent().children('.buy-stat')
    statNum = parseInt($statTarget.text())
    incSib = $(this).parent().children('.increment')

    // Remove stats, increases remaining points
    if (statNum > 13) {
        // Removes increment disable if stat is no longer 15
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

    // If 1 or 2 points remaining, remove danger from all increments unless 15
    if (remainingPoints === 1 || remainingPoints === 2) {
        $('.increment').removeClass('btn-outline-danger').addClass('btn-outline-secondary')
        $('.increment').removeAttr('data-bs-toggle title')
        pointAlert()
    }
}

// Globally alerts user based on limiting conditions
function pointAlert() {
    for (i = 0; i < 5; i++) {
        // If stat is 15, cannot add more
        if (parseInt($eachStat[i].textContent) === 15) {
            $eachIncrement[i].classList.remove('btn-outline-secondary')
            $eachIncrement[i].classList.add('btn-outline-danger')
            $eachIncrement[i].setAttribute('data-bs-toggle', "true")
            $eachIncrement[i].setAttribute('title', "Cannot go higher than 15")
        }

        // If only one point left and stat is 14, cannot add more
        if (remainingPoints === 1 && (parseInt($($eachStat[i]).text()) === 13 || parseInt($($eachStat[i]).text()) === 14)) {
            $eachIncrement[i].classList.remove('btn-outline-secondary')
            $eachIncrement[i].classList.add('btn-outline-danger')
            $eachIncrement[i].setAttribute('data-bs-toggle', "true")
            $eachIncrement[i].setAttribute('title', "Needs more points")
        }
    }
}

function saveRoll() {
    for (i = 0; i < 6; i++) {
        statStorage.statValues.push(parseInt($rollStatSection.children().children('.roll-stat')[i].textContent))
    }
}

function saveBuy() {
    for (i = 0; i < 6; i++) {
        statStorage.statValues.push(parseInt($buyStatSection.children().children('.buy-stat')[i].textContent))
    }
}

//// BACKGROUND FUNCTIONS
$('.background-next').on('click', populateBackgroundList)
$('#background-list').change(populateBackgroundDetails)
$('#overview-next').on('click', backgroundSave)

let backgroundSelection

const backgroundStorage = {
    backName: '',
    feature: '',
    profs: [],
    equips: [],
    langs: []
}

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
            backgroundAddList()
        },
        (error) => {
            console.log('Bad Request: ', error)
        }
    )
}

function backgroundAddList() {
    backgroundData.results.forEach(function (bg) {
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
            backgroundRender()
        },
        (error) => {
            console.log('Bad Request: ', error)
        }
    )
}

function backgroundRender() {
    $backgroundName.text('')
    $backgroundName.append(`<span id="background-name-${backgroundSelectData.name}">
        ${backgroundSelectData.name}</span>`).css('font-size', '3rem').css('border-bottom', '1px solid black')

    $backgroundFeature.text('')
    $backgroundFeature.append(`<span id="background-feature-${backgroundSelectData.feature.name}">
    Background feature: + ${backgroundSelectData.feature.name}</span>`).css('padding-top', '1rem')
    $backgroundFeature.append(`<div id="background-feature-text" style="border-top:1px dashed black">${backgroundSelectData.feature.desc.join(' ')}</div>`)

    // Identical to race proficiency
    $backgroundProficiencies.text('')
    if (backgroundSelectData.starting_proficiencies.length !== 0) {
        $backgroundProficiencies.text('Proficiencies: ')
        backgroundSelectData.starting_proficiencies.forEach((proficiency) => {
            if (backgroundSelectData.starting_proficiencies.indexOf(proficiency) === backgroundSelectData.starting_proficiencies.length - 1) {
                $backgroundProficiencies.append(`<span class="proficiencies" 
                    id="background-prof-${proficiency.index}">
                    ${proficiency.name}</span>`)
            } else {
                $backgroundProficiencies.append(`<span class="proficiencies" 
                    id="background-prof-${proficiency.index}">
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
                id="background-prof-${proficiency.index}" autocomplete="off">`)
            $backgroundProfOptions.append(`<label class="btn btn-outline-dark m-1" 
                for="background-prof-${proficiency.index}">${proficiency.name}</label>`)
        })
    }

    // Identical to class equipment
    $backgroundEquipment.text('Starting equipment: ')
    backgroundSelectData.starting_equipment.forEach((equip) => {
        $backgroundEquipment.append(`<div class="equips" 
        id="background-equip-${equip.equipment.index}">
        ${equip.equipment.name} x${equip.quantity}</div>`)
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

        optionNo += 1
        // For every group option, list all the equipment groups per group option
        option.from.forEach((equipGroup) => {


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
                $backgroundEquipChoices.children(':last-child')[0].setAttribute('id', `${fragId}`)

                $backgroundEquipChoices.append(equipLabelFrag)
                $backgroundEquipChoices.children(':last-child')[0].setAttribute('for', `${fragId}`)

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
            // TODO: INEFFICIENT, SAME AS CLASS
        })
        $backgroundEquipChoices.children('.choose-text').detach().prependTo($backgroundEquipChoices.children('.equip-group').last())
    })

    // Identical to race languages but includes if statement, depending if background has language or not
    $backgroundLanguages.text(`Languages known: `)
    if (backgroundSelectData.languages !== undefined) {
        backgroundSelectData.languages.forEach((language) => {
            if (backgroundSelectData.languages.indexOf(language) === backgroundSelectData.languages.length - 1) {
                $backgroundLanguages.append(`<span class="languages" 
                    id="background-lang-${language.index}">
                    ${language.name}</span>`)
            } else {
                $backgroundLanguages.append(`<span class="languages" 
                    id="background-lang-${language.index}">
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
            id="background-lang-${language.index}" autocomplete="off">`)
            $backgroundLangOptions.append(`<label class="btn btn-outline-dark m-1" 
            for="background-lang-${language.index}">${language.name}</label>`)
        })
    }
}

function backgroundSave() {
    backgroundStorage.backName = $backgroundName.children().attr('id').slice(16)
    backgroundStorage.feature = $backgroundFeature.children('').not('#background-feature-text').attr('id').slice(19)

    $.each($backgroundProficiencies.children(), function (index, prof) {
        if (prof.getAttribute('id') !== undefined && prof.getAttribute('id') !== null) {
            backgroundStorage.profs.push(prof.getAttribute('id').slice(16))
        }
    })

    $.each($backgroundProfOptions.find(':checkbox:checked'), function (index, prof) {
        if (prof.getAttribute('id') !== undefined && prof.getAttribute('id') !== null) {
            backgroundStorage.profs.push(prof.getAttribute('id').slice(13))
        }
    })

    $.each($backgroundEquipment.children(), function (index, eqs) {
        if (eqs.getAttribute('id') !== undefined && eqs.getAttribute('id') !== null) {
            backgroundStorage.equips.push(eqs.getAttribute('id').slice(17))
        }
    })
    $.each($backgroundEquipChoices.find(':checkbox:checked'), function (index, eqs) {
        if (eqs.getAttribute('id') !== undefined && eqs.getAttribute('id') !== null) {
            backgroundStorage.equips.push(eqs.getAttribute('id').slice(13))
        }
    })
    $.each($backgroundLanguages.children(), function (index, lang) {
        if (lang.getAttribute('id') !== undefined && lang.getAttribute('id') !== null) {
            backgroundStorage.langs.push(lang.getAttribute('id').slice(14))
        }
    })
    $.each($backgroundLangOptions.children(':checkbox:checked'), function (index, lang) {
        if (lang.getAttribute('id') !== undefined && lang.getAttribute('id') !== null) {
            backgroundStorage.langs.push(lang.getAttribute('id').slice(16))
        }
    })
}

//// RACE FUNCTIONS
$('#overview-next').on('click', overviewRender)

let currObj, finalStorage

const $overviewRace = $('#overview-race')
const $overviewClass = $('#overview-class')
const $overviewBackground = $('#overview-background')

const $overviewHitDice = $('#overview-hit-dice')
const $overviewSpeed = $('#overview-speed')
const $overviewSize = $('#overview-size')
const $overviewLanguage = $('#overview-language')

const $overviewTraits = $('#overview-traits')
const $overviewFeature = $('#overview-features')

const $overviewSavingThrows = $('#overview-saving-throws')
const $overviewStatVals = $('#overview-stat-vals')
const $overviewProficiencies = $('#overview-proficiencies')

const $overviewEquipment = $('#overview-equipment')

function overviewRender () {
    finalStorage = storageCombiner(raceStorage, classStorage, statStorage, backgroundStorage)

    $overviewRace.append(`<span>Race: ${finalStorage.raceName}</span>`).css('font-size', '2rem').css('border-bottom', '1px solid black')
    $overviewSpeed.append(`<span>Speed: ${finalStorage.speed}ft per 6 seconds</span>`)
    $overviewSize.append(`<span>Size: ${finalStorage.size}-sized creature</span>`)
    finalStorage.langs.forEach((lang) => {
        $overviewLanguage.append(`<li class="list-group-item">${lang}</li>`)
    })
    if(finalStorage.traits !== undefined) {
        finalStorage.traits.forEach((trait) => {
            $overviewTraits.append(`<li class="list-group-item">${trait}</li>`)
        })
    }


    $overviewBackground.append(`<span>Background: ${finalStorage.backName}</span>`).css('font-size', '2rem').css('border-bottom', '1px solid black')
    $overviewFeature.append(`<span>Background Feature: ${finalStorage.feature}</span>`)


    $overviewClass.append(`<span>Class: ${finalStorage.className}</span>`).css('font-size', '2rem').css('border-bottom', '1px solid black')
    $overviewHitDice.append(`<span>Hit Dice: ${finalStorage.hitDice}</span>`)
    $overviewSavingThrows.append(`<span>Proficient Saving Throws: ${finalStorage.savingThrows.join(', ').toUpperCase()}</span>`)


    finalStorage.stats.forEach((stat, idx) => {
        // For each stat
        let bonusValue = 0
        finalStorage.statBonusName.forEach((bonusStat, idxBonus) => {
            // For every stat that has a race bonus
            if(bonusStat.toUpperCase() === stat) {
                // If the bonus stat is the current stat, add value
                bonusValue = finalStorage.statBonusValue[idxBonus]
            }
        })
        $overviewStatVals.append(`<li class="list-group-item">${stat}: ${finalStorage.statValues[idx]} + ${bonusValue} = ${finalStorage.statValues[idx] + bonusValue}</li>`)
    })
    finalStorage.profs.forEach((prof) => {
        $overviewProficiencies.append(`<li class="list-group-item">${prof}</li>`)
    })
    finalStorage.equips.forEach((equip) => {
        $overviewEquipment.append(`<li class="list-group-item">${equip}</li>`)
    })
}

function storageCombiner(...objs) {
    let combinedObj = {}
    // ...objs is an `array of objects`
    // For every object in the `array of objects` passed in
    for(let obj in objs) {
        // currObj is the current object in the `array of objects`
        // For every property in the current object
        currObj = objs[obj]
        for(let currProp in currObj) {
            // currProp is the current property in the current object in the `array of objects`
            // Add current object properties into combinedObj if they do not exist
            if (!combinedObj.hasOwnProperty(currProp)) {
                // If combinedObj does NOT have the property
                // Initialize new property in combinedObj
                combinedObj[currProp] = currObj[currProp]
            } else if (combinedObj.hasOwnProperty(currProp)) {
                // If combinedObj DOES have the property (all mergable properties are arrays)
                // Create temporary array which is a merge of the both
                // !! FIXME: GETS RID OF REFERENCES, BE CAREFUL IF APPLYING INTO OTHER DOCUMENTS
                let tempArray = [...combinedObj[currProp], ...currObj[currProp]]
                // Merge property arrays
                combinedObj[currProp] = tempArray
            }
        }
    }
    return combinedObj
}