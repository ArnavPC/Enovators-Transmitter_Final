enum RadioMessage {
    message1 = 49434,
    ok = 31318,
    back = 39633,
    forward = 16348,
    left = 14947,
    right = 32391,
    clutch = 48290
}
function back () {
    if (work == 0) {
        radio.sendMessage(RadioMessage.back)
        work = 1
        _break = 0
        basic.showLeds(`
            . . # . .
            . . # . .
            # . # . #
            . # # # .
            . . # . .
            `)
    }
}
input.onButtonPressed(Button.A, function () {
    radio.sendMessage(RadioMessage.ok)
    basic.showLeds(`
        # . . . .
        . # . . .
        . . # . .
        . . . # .
        . . . . #
        `)
    basic.pause(500)
    basic.showLeds(`
        . . . . .
        . . . . #
        . . . # .
        # . # . .
        . # . . .
        `)
})
function ForwardBack () {
    if (input.acceleration(Dimension.Y) > -1023 && input.acceleration(Dimension.Y) < -300) {
        basic.pause(50)
        countdownforward += 1
        if (countdownforward == 1) {
            forward()
            countdownforward = 0
        }
    } else if (input.acceleration(Dimension.Y) > 300) {
        basic.pause(50)
        countdown += 1
        if (countdown == 1) {
            back()
            countdown = 0
        }
    }
}
function braking () {
    if (input.acceleration(Dimension.Y) > -300 && input.acceleration(Dimension.Y) < 300 && (input.acceleration(Dimension.X) > -300 && input.acceleration(Dimension.X) < 300)) {
        if (_break == 0) {
            _break = 1
            work = 0
            radio.sendMessage(RadioMessage.clutch)
            basic.showLeds(`
                . . . . .
                . . . . .
                . . # . .
                . . . . .
                . . . . .
                `)
        }
    }
    if (powerspeed == 1) {
        _break = 1
        work = 1
        led.plotBarGraph(
        input.acceleration(Dimension.Y),
        1023
        )
    }
}
input.onButtonPressed(Button.B, function () {
    powerspeed += 1
    if (powerspeed == 2) {
        speed = input.acceleration(Dimension.Y) / 4 * -1
        radio.sendNumber(speed)
        basic.showIcon(IconNames.Chessboard)
        basic.pause(500)
        basic.showIcon(IconNames.Yes)
        work = 0
    }
    if (powerspeed == 3) {
        powerspeed = 0
    }
})
function LeftRight () {
    if (input.acceleration(Dimension.X) > -1023 && input.acceleration(Dimension.X) < -300) {
        if (work == 0) {
            radio.sendMessage(RadioMessage.left)
            work = 1
            _break = 0
            basic.showLeds(`
                . . # . .
                . # . . .
                # # # # #
                . # . . .
                . . # . .
                `)
        }
    } else if (input.acceleration(Dimension.X) > 300) {
        if (work == 0) {
            radio.sendMessage(RadioMessage.right)
            work = 1
            _break = 0
            basic.showLeds(`
                . . # . .
                . . . # .
                # # # # #
                . . . # .
                . . # . .
                `)
        }
    }
}
function forward () {
    if (work == 0) {
        radio.sendMessage(RadioMessage.forward)
        work = 1
        _break = 0
        basic.showLeds(`
            . . # . .
            . # # # .
            # . # . #
            . . # . .
            . . # . .
            `)
    }
}
let powerspeed = 0
let countdown = 0
let countdownforward = 0
let _break = 0
let work = 0
let speed = 0
radio.setGroup(1)
radio.setTransmitPower(7)
speed = 255
radio.sendNumber(speed)
basic.forever(function () {
    ForwardBack()
    LeftRight()
    braking()
})
