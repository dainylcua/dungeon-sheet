let spellData, userInput

const $name = $('.name')
const $description = $('#description')
const $level = $('#level')
const $damage = $('#damage')
const $input = $('input[type="text"]')

const BASEURL = 'https://www.dnd5eapi.co/api/spells/'

$('form').on('submit', getData)

function getData(event) {
    event.preventDefault()
    userInput = modUserInput($input.val())
    console.log(userInput)
    $.ajax({
        url: BASEURL + userInput
    }).then(
        (data) => {
            spellData = data
            render()
        },
        (error) => {
            console.log('bad request: ', error)
        }
    )
}

function render() {
    $name.text(spellData.name)
    $description.text(spellData.desc.join(' '))
    $level.text(spellData.level)
    if(!!spellData.damage) {
        $damage.text(JSON.stringify(spellData.damage.damage_at_slot_level))
    } else {
        $damage.text('No Spell Damage')
    }   
}
const modUserInput = (input) => {
    // Converts input to lowercase and replaces spaces with dashes if found
    let newString = input.toLowerCase().split("")
    newString.forEach(function(char, idx) {
        if(char === ' ') {
            newString.splice(idx, 1, '-')
        }
    })
    return newString.join('')
}