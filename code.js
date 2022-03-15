let mainWindow = document.querySelector('.window')
const WINDOW_HEIGHT = mainWindow.offsetHeight
const WINDOW_WIDTH = mainWindow.offsetWidth
const windowSize = { height: WINDOW_HEIGHT, width: WINDOW_WIDTH }

let bio = document.querySelector('.cv-section')

let me = document.querySelector('.me')

let bioHeaders = document.querySelectorAll('.bio-header')

window.addEventListener('scroll', (e) => {
    for (let header of bioHeaders) {
        if (header.offsetTop + 200 < scrollY + window.screen.height) {
            if (!header.classList.contains('active')) {
                header.classList.add('active')
            }
        }
    }
})

let musicBox = document.querySelector('.music-box')
let audio = document.querySelector('audio')

window.onload = musicBox.addEventListener('click', (e) => {
    musicBox.classList.toggle('active')
    if (!musicBox.classList.contains('active')) {
        audio.pause()
    } else {
        audio.play()
    }
})

let textNotes = document.querySelector('.notes')
let musicPlayer = document.querySelector('.music-player')

let music = {
    size: {
        width: musicPlayer.offsetWidth,
        height: musicPlayer.offsetHeight,
    },
    position: {
        x: musicPlayer.offsetLeft,
        y: musicPlayer.offsetTop,
    },
    obj: musicPlayer,
    activate: false
}
notes = {
    size: {
        width: textNotes.offsetWidth,
        height: textNotes.offsetHeight,
    },
    position: {
        x: textNotes.offsetLeft,
        y: textNotes.offsetTop,
    },
    obj: textNotes,
    activate: false
}

const meHeight = me.offsetHeight
const meWidth = me.offsetWidth
let playerSize = { width: meWidth, height: meHeight }

mePosX = 0
mePosY = windowSize.height - meHeight
playerPosition = { x: mePosX, y: mePosY }

const playerVel = { x: 0, y: 0 }
const maxSpeed = 7
let speed = { x: 0, y: 0 }
let velocity = 0.32
let gravity = 0.32


function playMusic() {
    if (!musicBox.classList.contains('show') && player.music) {
        musicBox.classList.add('show')
        musicBox.classList.add('active')
        audio.play()
    }
}

function objectSetPos(obj, pos) {
    obj.style.left = pos.position.x + 'px'
    obj.style.top = pos.position.y + 'px'
}

function objectChangePos(obj) {
    obj.position.x += obj.speed.x
    obj.position.y -= obj.speed.y
    return obj
}

function objectCheckBoundaries(obj, maxBoundary) {
    if (obj.position.x + obj.size.width >= maxBoundary.width) {
        obj.position.x = maxBoundary.width - obj.size.width
    }
    if (obj.position.x <= maxBoundary.width - maxBoundary.width) {
        obj.position.x = maxBoundary.width - maxBoundary.width
    }
    return obj
}

player = {
    size: playerSize,
    position: playerPosition,
    speed: {
        x: 0, y: 0
    },
    velocity: playerVel,
    idle: true,
    direction: 'stop',
    jumpHeight: 6,
    jump: false,
    notes: false,
    music: false,
}

function scrollToBio() {
    window.scroll({
        top: bio.offsetTop,
        left: 0,
        behavior: 'smooth'
    });
}

window.addEventListener('keypress', (e) => {
    let keyCode = e.keyCode
    if (keyCode == 100 || keyCode == 1074) {
        player.velocity.x = velocity
        player.idle = false
        player.direction = 'right'
    }
    if (keyCode == 97 || keyCode == 1092) {
        player.velocity.x = velocity
        player.idle = false
        player.direction = 'left'
    }
    if (keyCode == 32 && !player.jump) {
        player.speed.y = player.jumpHeight
        player.jump = true
    }
    if (keyCode == 32) {
        e.preventDefault();
    }

    if (notes.activate && (keyCode == 120 || keyCode == 1095)) {
        scrollToBio()
    }

    if (player.music && music.activate && (keyCode == 112 || keyCode == 1079)) {
        musicBox.classList.toggle('active')
        if (!musicBox.classList.contains('active')) {
            audio.pause()
        } else {
            audio.play()
        }
    }
    if (player.music && !music.activate && (keyCode == 112 || keyCode == 1079)) {
        music.activate = true
        playMusic()
    }

})

window.addEventListener('keyup', (e) => {
    let keyCode = e.keyCode

    if (keyCode == 68 || keyCode == 65) {
        player.velocity.x = 0
        player.idle = true
    }
})

function objectRenderBox(box, status) {
    if (status) {
        if (!box.obj.classList.contains('active')) {
            box.obj.classList.add('active')
        }
    } else {
        if (box.obj.classList.contains('active')) {
            box.obj.classList.remove('active')
        }
    }
}

function setObjectAnimation(obj, p) {
    if (p.idle) {
        if (!obj.classList.contains('idle')) {
            obj.classList.add('idle')
        }
        if (obj.classList.contains('jump')) {
            obj.classList.remove('jump')
        }
        if (obj.classList.contains('run')) {
            obj.classList.remove('run')
        }
    }
    if (p.jump) {
        obj.classList.remove('idle')
        if (!obj.classList.contains('jump')) {
            obj.classList.add('jump')
        }
        if (obj.classList.contains('run')) {
            obj.classList.remove('run')
        }
    }
    if (p.direction != 'stop' && !p.idle && !p.jump) {
        obj.classList.remove('idle')
        if (!obj.classList.contains('run')) {
            obj.classList.add('run')
        }
    }
    if (p.direction == 'left') {
        obj.style.transform = 'scaleX(-1)'
    } else if (p.direction == 'right') {
        obj.style.transform = 'scaleX(1)'
    }
}

function update() {
    // update   
    player = objectCheckBoundaries(player, windowSize)
    player = objectChangePos(player)

    if (player.speed.x > maxSpeed) {
        player.speed.x = maxSpeed
    }
    if (player.speed.x < -maxSpeed) {
        player.speed.x = -maxSpeed
    }

    if (player.direction == 'right') {
        player.speed.x += player.velocity.x
        player.speed.y += player.velocity.y
    }
    if (player.direction == 'left') {
        player.speed.x -= player.velocity.x
        player.speed.y -= player.velocity.y
    }

    if (player.speed.x > 0 && player.idle) {
        player.speed.x -= velocity
    }

    if (player.speed.x < 0 && player.idle) {
        player.speed.x += velocity
    }

    if (player.speed.x < velocity && player.speed.x > -velocity && player.idle) {
        player.speed.x = 0
    }

    player.speed.y -= gravity

    if (player.position.y + player.size.height >= windowSize.height) {
        player.position.y = windowSize.height - player.size.height
        player.jump = false
    }
    if (player.speed.y < -maxSpeed) {
        player.speed.y = -maxSpeed
    }

    if (player.position.x + player.size.width >= notes.position.x
        && player.position.x <= notes.position.x + notes.size.width
    ) {
        player.notes = true
        notes.activate = true
    } else {
        player.notes = false
    }
    if (player.position.x + player.size.width >= music.position.x
        && player.position.x <= music.position.x + music.size.width
    ) {
        player.music = true
    } else {
        player.music = false
    }

    setObjectAnimation(me, player)

    // render
    objectSetPos(me, player)
    if (player.notes) {
        objectRenderBox(notes, true)
    } else {
        objectRenderBox(notes, false)
    }

    if (player.music && !music.activate) {
        objectRenderBox(music, true)
    } else {
        objectRenderBox(music, false)
    }

    requestAnimationFrame(update)
}
update()

