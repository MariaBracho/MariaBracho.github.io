import { Render } from "../UI/render.js";
import { Operador } from "./calculatormethods.js";
import { Calculadora } from "./calculator.js"

let calculate = new Calculadora()
let calculator = new Operador()
let render = new Render()

render.renderInput()
render.renderButtons()
render.renderSigns()
render.renderResult()
calculator.getkeysboards()
calculator.getscreenkeys()
calculator.NoRepeat()

const resolveOperation = (callback) => {
    try {
        callback()
        return [true, "Operacion exitosa"]
    } catch (error) {
        const ERROR_MESSAGE = "Error de formato"
        console.error('Error', ERROR_MESSAGE)
        return [false, ERROR_MESSAGE]
    }
}


export const onSubmitResult = () => resolveOperation(() => {
    let currentOperation = calculator.getOperation()


    const sign = calculator.findSigns(currentOperation)

    const operationOne = calculator.getOp1()
    const operationTwo = calculator.getOp2()

    const [newOperationOne, newOperationTwo] = calculate.getvalues(operationOne, operationTwo)

    const operationToResolve = calculate.getOperationByMethod(sign)
    let resultOfOperation = operationToResolve(newOperationOne, newOperationTwo)

    const newStackHistory = { results: resultOfOperation, operation: currentOperation }


    calculator.addHistory(newStackHistory)

    localStorage.setItem("calculo", JSON.stringify(calculator.history))



    if (isNaN(resultOfOperation)) {
        resultOfOperation = "Error de formato"
        console.log("no es un numero")
    }
    let newResult = resultOfOperation
    calculator.setResult(newResult)


    render.renderResult(newResult)

    setNewValueToInput(calculator.input + calculator.lastsigns)
})

export const onSubmitResult_onlyOpcion = () => resolveOperation(() => {
    let currentOperation = calculator.getOperation()

    let result = calculator.specialOperations()
    const newStackHistory = { results: result, operation: currentOperation }
    console.log(newStackHistory)


    calculator.addHistory(newStackHistory)

    localStorage.setItem("calculo", JSON.stringify(calculator.history))

    let newResult = result
    calculator.setResult(newResult)


    render.renderResult(newResult)

    setNewValueToInput(calculator.input)

})

export const setNewValueToInput = (newValue) => {
    document.getElementById("valor").value = newValue
}


const showHistory = () => {
    const onSubmitResultisTrue = () => {
        if (onSubmitResult) {
            let getLocalStorage = localStorage.getItem("calculo")
            calculator.history = JSON.parse(getLocalStorage)
        }
        if (calculator.history == null) {
            calculator.history = []
        }
    }
    onSubmitResultisTrue()

    render.renderButton()

    document.getElementById("hidehistory-button").addEventListener("click", hiddeHistory)
    historyfilter()


}
export const historyfilter = (history = calculator.history) => {

    if (history) {
        let resultAndOperation = history.filter((number) => {
            return render.renderHistory(number.operation, number.results)
        })
        return resultAndOperation
    }
}
const hiddeHistory = () => {
    render.hideHistory()
}

document.getElementById("historybutton").addEventListener("click", showHistory)


document.getElementById("20").addEventListener("click", () => {
    const [status] = onSubmitResult()

    if (!status) {
        const [status, message] = onSubmitResult_onlyOpcion()

        if (!status) throw render.renderResult(message)
    }
})

document.getElementById("valor").addEventListener('keyup', ((e) => {
    let enter = "Enter"
    if (e.code === enter) {
        try {
            onSubmitResult()
        } catch (e) {
            console.log(e, "error de formato")
            render.renderResult(" Error de formato")
        }
    }
}))

document.getElementById("reset").addEventListener("click", () => {
    render.renderResult("0")
    document.getElementById("valor").value = ""
})

document.getElementById("historybutton-clear").addEventListener("click", () => {
    localStorage.clear()
    calculator.history = []

})