const $buttonStart = document.getElementById('button-start')
const $bottomLabel = document.getElementById('bottom-label')
var countShots = 0

class View {
    displayCellDamage(cell) {
        cell.style.backgroundColor = 'rgba(255, 84, 84, 0.45)'
    }

    displayCellMiss(cell) {
        cell.style.backgroundColor = 'rgba(156, 209, 255, 0.3)'
    }

    displayCellNoStyle(cell) {
        cell.style.removeProperty('background-color')
    }
}


class Game {
    cellsShips = []
    cellsAround = []
    cellsDamage = []
    cellsMiss = []
}


class Controller {
    clickOnCell(cell) {
        cell.addEventListener('click', function () {
            if (cell.className === 'ship') {
                view.displayCellDamage(cell)
                cell.className = 'damage'
                game.cellsDamage.push(cell.id)
                controller.checkShipIsSunk(cell)
                countShots++
                $bottomLabel.textContent = `${countShots}`
                console.log(game.cellsDamage)
                if (game.cellsDamage.length === 20) {
                    $bottomLabel.textContent = 'Ты выиграл!'
                }
            }
            else if (cell.className === 'empty') {
                view.displayCellMiss(cell)
                cell.className = 'miss'
                game.cellsMiss.push(cell.id)
                countShots++
                $bottomLabel.textContent = `${countShots}`
            }
        })
    }

    mouseMove(cell) {
        cell.addEventListener('mousemove', function () {
            if (cell.className !== 'damage' && cell.className !== 'miss') {
                view.displayCellMiss(cell)
            }
        })
        cell.addEventListener('mouseleave', function () {
            if (cell.className !== 'damage' && cell.className !== 'miss') {
                view.displayCellNoStyle(cell)
            }
        })
    }

    checkShipIsSunk(cell) {
        for (var i = 0; i < game.cellsShips.length; i++) {
            if (i < 4) {
                var elementDOM = document.getElementById(game.cellsShips[i][0])
                if (elementDOM.className === 'damage') {
                    game.cellsAround[i][0].forEach(id => {
                        var elDOM = document.getElementById(id)
                        if (elDOM.className !== 'miss') {
                            elDOM.className = 'miss'
                            view.displayCellMiss(elDOM)
                        }
                    })
                }
            }
            else if (i < 6) {
                for (var j = 0; j < game.cellsShips[i].length; j++) {
                    var isSunk = true
                    game.cellsShips[i][j].forEach(id => {
                        var elementDOM = document.getElementById(id)
                        if (elementDOM.className !== 'damage') {
                            isSunk = false
                        }
                    })
                    if (isSunk) {
                        game.cellsAround[i][j].forEach(id => {
                            var elementDOM = document.getElementById(id)
                            elementDOM.className = 'miss'
                            view.displayCellMiss(elementDOM)
                        })
                    }
                }
            }
            else {
                var isSunk = true
                game.cellsShips[i].forEach(id => {
                    var elementDOM = document.getElementById(id)
                    if (elementDOM.className !== 'damage') {
                        isSunk = false
                    }
                })
                if (isSunk) {
                    game.cellsAround[i].forEach(id => {
                        var elementDOM = document.getElementById(id)
                        elementDOM.className = 'miss'
                        view.displayCellMiss(elementDOM)
                    })
                }
            }
        }
    }

    verificationID(location) {
        var firstDigit = Number(location[0])
        var secondDigit = Number(location[1])
        var aroundCells = []
        for (var i = firstDigit - 1; i <= firstDigit + 1; i++) {
            if (i < 0 || i > 9) continue
            for (var j = secondDigit - 1; j <= secondDigit + 1; j++) {
                if (j < 0 || j > 9) continue
                const cell = document.getElementById(`${i}${j}`);
                if (cell.className === 'ship') return false
                if (location !== `${i}${j}`) aroundCells.push(`${i}${j}`)
            }
        }
        return aroundCells
    }

    getDirection() {
        if (Math.random() * 10 > 5) return true
        return false
    }

    generateRandomID(i, direction) {
        var location = Math.floor(Math.random() * (100 - 10 * i)).toString();
        if (location.length < 2) location = '0' + location

        if (direction === false && i > 0) {
            location = location.split('').reduce((x, y) => y + x)
        }

        return location
    }

    generateShips() {
        // 0 - однопалубные, 1 - двухпалубные и т.д.
        for (var i = 0; i < 4; i++) {
            // кол-во кораблей каждого типа (больше палуб у корабля = меньше циклов)
            for (var j = 0; j < 4 - i; j++) {
                while (true) {
                    var direction = this.getDirection()
                    var location1 = this.generateRandomID(i, direction)
                    var checkLoc1 = this.verificationID(location1)
                    if (i === 0) {
                        if (checkLoc1) {
                            this.setCellsAsShip(i, j, [location1], [checkLoc1])
                            break
                        }
                    }
                    else if (i === 1) {
                        var [location2] = this.generateNextCells(i, direction, location1)
                        var checkLoc2 = this.verificationID(location2)
                        if (checkLoc1 && checkLoc2) {
                            this.setCellsAsShip(i, j, [location1, location2], checkLoc1.concat(checkLoc2))
                            break
                        }
                    }
                    else if (i === 2) {
                        var [location2, location3] = this.generateNextCells(i, direction, location1)
                        var checkLoc2 = this.verificationID(location2)
                        var checkLoc3 = this.verificationID(location3)
                        if (checkLoc1 && checkLoc2 && checkLoc3) {
                            this.setCellsAsShip(i, j, [location1, location2, location3], checkLoc1.concat(checkLoc2).concat(checkLoc3))
                            break
                        }
                    }
                    else if (i === 3) {
                        var [location2, location3, location4] = this.generateNextCells(i, direction, location1)
                        var checkLoc2 = this.verificationID(location2)
                        var checkLoc3 = this.verificationID(location3)
                        var checkLoc4 = this.verificationID(location4)
                        if (checkLoc1 && checkLoc2 && checkLoc3 && checkLoc4) {
                            this.setCellsAsShip(i, j, [location1, location2, location3, location4], checkLoc1.concat(checkLoc2).concat(checkLoc3).concat(checkLoc4))
                            break
                        }
                    }
                    else {
                        break
                    }
                }
            }
        }
    }

    generateNextCells(sizeShip, direction = true, location1 = '') {
        let i;
        var cells = [location1]

        if (direction) {
            for (i = 0; i < sizeShip; i++) {
                cells.push((Number(cells[i][0]) + 1).toString() + location1[1])
            }
        }
        else {
            for (i = 0; i < sizeShip; i++) {
                cells.push(location1[0] + (Number(cells[i][1]) + 1).toString())
            }
        }

        return cells.slice(1)
    }

    setCellsAsShip(i, j, arrayCellsShip, arrayCellsAround) {
        arrayCellsShip.forEach(cellID => {
            var elementDOM = document.getElementById(cellID)
            elementDOM.className = 'ship'
            //elementDOM.innerText = `${i + 1}`
        })
        if (i !== 0) {
            arrayCellsAround = arrayCellsAround.filter((item, index) => {
                var elementDOM = document.getElementById(item)
                return (elementDOM.className !== 'ship' && arrayCellsAround.indexOf(item) === index)
            })
        }
        if (i === 0) {
            game.cellsAround.push(arrayCellsAround)
            game.cellsShips.push([arrayCellsShip])
        }
        else if (i === 1) {
            if (j === 0) {
                game.cellsShips.push([])
                game.cellsAround.push([])
            }
            game.cellsShips[4].push(arrayCellsShip)
            game.cellsAround[4].push(arrayCellsAround)
        }
        else if (i === 2) {
            if (j === 0) {
                game.cellsShips.push([])
                game.cellsAround.push([])
            }
            game.cellsShips[5].push(arrayCellsShip)
            game.cellsAround[5].push(arrayCellsAround)
        }
        else if (i === 3) {
            game.cellsShips.push(arrayCellsShip)
            game.cellsAround.push(arrayCellsAround)
        }
    }
}


class App {
    start() {
        $bottomLabel.textContent = 'Огонь!'
        $buttonStart.disabled = true

        const cells = document.querySelectorAll('td')
        cells.forEach(cell => controller.clickOnCell(cell))
        cells.forEach(cell => controller.mouseMove(cell))

        controller.generateShips()
    }
}


const view = new View()
const game = new Game()
const controller = new Controller()
const app = new App()


$buttonStart.onclick = app.start