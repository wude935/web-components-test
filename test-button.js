const TestButtonTemplate = document.createElement('template')
TestButtonTemplate.innerHTML = /*html*/`
    <button>
        <div class='icon'>
            <slot name='icon-left'></slot>
        </div>
        <p class='text'></p>
        <div class='icon'>
            <slot name='icon-right'></slot>
        </div>
    </button>
    <link rel="stylesheet" type="text/css" href="test-button.css" media="screen"/>
`

class TestButton extends HTMLElement {
    pressState = false
    counter = 0
    // marks certain attributes to be watched for changes (🚨 similar to useState with initial state values being set by props?)
    static observedAttributes(){
        return ['disabled']
    }
    // getters causes a certain function to be called whenever a object property is used
    // makes getting certain shadow properties in JS much easier 
    get disabled() {
        return this.hasAttribute('disabled');
    }
    // setters call a function whenever an object property is set or changed (🚨 similar to useEffect?)
    set disabled(value) {
        if (value) {
            this.setAttribute('disabled', true)
        }
        else {
            this.removeAttribute('disabled')
        }
    }
    // creates a custom event (for practice purposes) so whenvever a user clicks so that other components can can catch the event through bubbling
    // (composed is set as true for the event to pass through the shadow DOM)
    testEvent = new CustomEvent('test-event', {detail: 'data from test-button', bubbles: true, composed: true}) 
    // increments the counter whenever you press the button and swaps between the text and the count
    // testing state 
    changeText(pressState){
        this.pressState = !pressState;
        if (pressState) {
            this.counter += 1
            this.shadowRoot.querySelector('.text').textContent = this.counter
        }
        else {
            this.shadowRoot.querySelector('.text').textContent = this.getAttribute('text')
        }
        // calls the testEvent
        this.dispatchEvent(this.testEvent)
    }

    constructor() {
        super()
        // 🚨 attach internals helps accessibility? 
        const internals = this.attachInternals();
        internals.role = 'button'
        internals.arialLabel = 'Test'
        // sets up shadow root
        this.attachShadow({mode: 'open'})
        this.shadowRoot.appendChild(TestButtonTemplate.content.cloneNode(true));
        // takes HTML attribute and puts it inside the element
        this.shadowRoot.querySelector('.text').textContent = this.getAttribute('text')
        // takes HTML attribute and changes the element's CSS
        this.shadowRoot.querySelector('button').style.backgroundColor = this.getAttribute('background-color')
        // changes text whenever the button is clicked
        this.shadowRoot.querySelector('button').addEventListener('click', () => this.changeText(this.pressState))
    }
}

window.customElements.define('test-button', TestButton)
