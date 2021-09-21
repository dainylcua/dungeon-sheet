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
    $raceName.text(raceSelectData.name)
    $raceSpeed.text(`${raceSelectData.speed} ft`)
    $raceSize.text(`${raceSelectData.size}-sized creature`)

    $raceBonusStats.text('')
    raceSelectData.ability_bonuses.forEach((ability) => {
        $raceBonusStats.append(`<div class="bonusStat" id=${ability.ability_score.index}>
            ${ability.ability_score.name} + ${ability.bonus}</div>`)
    })

    $raceProficiencies.text('')
    if(raceSelectData.starting_proficiencies.length !== 0) {
        $raceProficiencies.text('Starting proficiencies:')
        raceSelectData.starting_proficiencies.forEach((proficiency) => {
            $raceProficiencies.append(`<div class="proficiencies" id=${proficiency.index}>
                ${proficiency.name}`)
        })
    }


    $raceProfOptions.text('')
    if(raceSelectData.starting_proficiency_options !== undefined) {
        $raceProfOptions.text(`Choose from ${raceSelectData.starting_proficiency_options.choose} of the following:`)
        $raceProfOptions.append('<br>')
        raceSelectData.starting_proficiency_options.from.forEach((proficiency) => {
            $raceProfOptions.append(`<button class="chosen-proficiencies btn btn-primary m-1" id=${proficiency.index}>
            ${proficiency.name}</button>`)
        })
    }

    $raceLanguages.text(`Languages known:`)
    raceSelectData.languages.forEach((language) => {
        $raceLanguages.append(`<div class="languages" id=${language.index}>
        ${language.name}</div>`)
    })

    $raceLangOptions.text('')
    if(raceSelectData.language_options !== undefined) {
        $raceLangOptions.text(`Choose from ${raceSelectData.language_options.choose} of the following:`)
        $raceLangOptions.append('<br>')
        raceSelectData.language_options.from.forEach((language) => {
            $raceLangOptions.append(`<button class="chosen-languages btn btn-primary m-1" id=${language.index}>
            ${language.name}</button>`)
        })
    }

    $raceTraits.text('')
    if(raceSelectData.traits.length !== 0) {
        $raceTraits.text(`Traits:`)
        raceSelectData.traits.forEach((trait) => {
            $raceTraits.append(`<div class="traits" id=${trait.index}>
            ${trait.name}</div>`)
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
    classData.results.forEach(function(cls) {
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
    $className.text(classSelectData.name)
    $classHitDice.text(classSelectData.hit_die)

    $classSavingThrows.text('')
    classSelectData.saving_throws.forEach((save) => {
        $classSavingThrows.append(`<div class="saves" index=${save.index}>${save.name}</div>`)
    })

    $classProficiencies.text('')
    classSelectData.proficiencies.forEach((prof) => {
        $classProficiencies.append(`<div class="profs" index=${prof.index}>${prof.name}</div>`)
    })

    $classProfOptions.text('')
    if(classSelectData.hasOwnProperty("proficiency_choices")) {
        classSelectData.proficiency_choices.forEach((choice) => {
            $classProfOptions.append(`<div class="prof-options choose${choice.choose}">Choose from ${choice.choose} of the following:</div>`)
            choice.from.forEach((prof) => {
                $classProfOptions.append(`<button class="chosen-profs btn btn-primary m-1" id=${prof.index}>
                ${prof.name}</button>`)
            })
            $classProfOptions.append('<br>')
        })
    }

    $classEquipment.text('')
    classSelectData.starting_equipment.forEach((equip) => {
        $classEquipment.append(`<div class="equips" index=${equip.equipment.index}>${equip.equipment.name}
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

            if(equipGroup.hasOwnProperty('0')) {
                // If equip group has an object which is an object-array
                eqObj = equipGroup
                fragEquip = '<button class="equips btn btn-primary m-1">'
                fragId = ''
                // console.log('equip group', eqObj)
                // Loop over the entire object and perform the same checks
                Object.keys(eqObj).forEach((key) => {
                    eqObjOpt = eqObj[key]
                    // console.log('equip title', eqObjOpt)
                    if(eqObjOpt.hasOwnProperty('equipment')) {
                        // If equip group is a single item
                        fragEquip += `${eqObjOpt.equipment.name} x${eqObjOpt.quantity} `
                        fragId += `${eqObjOpt.equipment.index}-${eqObjOpt.quantity}-`
                    } else if(eqObjOpt.hasOwnProperty('equipment_option')) {
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
                
            } else if(equipGroup.hasOwnProperty('equipment')) {
                // If equip group is a single item
                // console.log('hasequip')
                $classEquipChoices.append(`<button class="equips btn btn-primary m-1" 
                id="${equipGroup.equipment.index}-${equipGroup.quantity}">
                ${equipGroup.equipment.name} x${equipGroup.quantity}`)

            } else if(equipGroup.hasOwnProperty('equipment_option')) {
                // If equip group has options -- solely for choosing multiple martial/simple weapons
                // console.log('hasequipoption')
                $classEquipChoices.append(`<button class="equips btn btn-primary m-1" 
                id="${equipGroup.equipment_option.from.equipment_category.index}-${equipGroup.equipment_option.choose}">
                ${equipGroup.equipment_option.from.equipment_category.name} x${equipGroup.equipment_option.choose} </button>`)
            }
        })
    })
}

// Stat Functions