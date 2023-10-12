enum RadioMessage {
    message1 = 49434,
    ok = 31318,
    back = 39633,
    forward = 16348,
    left = 14947,
    right = 32391,
    clutch = 48290,
    speedlr = 5064
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
function ForwardBack () {
    if (pins.analogReadPin(AnalogPin.P1) > 1020 && pins.analogReadPin(AnalogPin.P1) < 1024) {
        basic.pause(10)
        countdown += 1
        if (countdown == 1) {
            back()
            countdown = 0
        }
    } else if (pins.analogReadPin(AnalogPin.P1) < 300) {
        basic.pause(10)
        countdownforward += 1
        if (countdownforward == 1) {
            forward()
            countdownforward = 0
        }
    }
}
function braking () {
    if (pins.analogReadPin(AnalogPin.P1) > 400 && pins.analogReadPin(AnalogPin.P1) < 800 && (pins.analogReadPin(AnalogPin.P2) > 400 && pins.analogReadPin(AnalogPin.P2) < 800)) {
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
        pins.analogReadPin(AnalogPin.P1),
        1023
        )
    }
}
buttonClicks.onButtonSingleClicked(buttonClicks.AorB.A, function () {
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
input.onButtonPressed(Button.B, function () {
    powerspeed += 1
    if (powerspeed == 2) {
        speed = pins.analogReadPin(AnalogPin.P1) / 4 * 1
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
    if (pins.analogReadPin(AnalogPin.P2) > 800) {
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
    } else if (pins.analogReadPin(AnalogPin.P2) < 300) {
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
            ctgagain = 0
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
buttonClicks.onButtonHeld(buttonClicks.AorB.A, function () {
    radio.sendMessage(RadioMessage.speedlr)
    basic.showIcon(IconNames.Surprised)
})
let ctgagain = 0
let powerspeed = 0
let countdownforward = 0
let countdown = 0
let _break = 0
let work = 0
let speed = 0
radio.setGroup(1)
radio.setTransmitPower(7)
speed = 222
radio.sendNumber(speed)
basic.forever(function () {
    ForwardBack()
    LeftRight()
    braking()
})
