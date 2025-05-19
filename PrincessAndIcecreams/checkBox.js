export default class SVGCheckuse extends HTMLElement {
    constructor() {
        super();
        this.attObj = {}


        this._visitedDuringDrag = false;
 
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.attachShadow({ mode: 'open' });
        // Track if this checkuse has been visited during current drag operation
        Array.from(this.attributes).forEach(({ name, value }) => {
           this.attObj[name] = value; 
        })
        
        const container = Object.assign(document.createElement('div'),{
          "className":  'svg-checkuse-container'
        });
     

        this.nativeCheckuse = document.createElement('input');
  

        this.nativeCheckuse.name = this.getAttribute('name');
        if (this.hasAttribute('value')) this.nativeCheckuse.value = this.getAttribute('value');
        if (this.hasAttribute('checked')) this.nativeCheckuse.checked = true;
        this.nativeCheckuse.style.display = 'none';
       
        this.svgCheckuse = this.createSVGCheckuse();

        container.appendChild(this.nativeCheckuse);
        container.appendChild(this.svgCheckuse);

        const style = document.createElement('style');
        style.textContent = `
            .svg-checkuse-container {
                cursor: pointer;
                user-select: none;
                position: relative;
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            }
                   .svg-checkuse-container:active {
                cursor: pointer;
                user-select: none;
                position: relative;
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            }

            .svg-checkuse {
                transition: transform 0.1s ease;
            }

            .svg-checkuse:hover {
                transform: scale(0.95);
            }

          .mousedown {
            display: block;
            width: 7.5%;
            transition: transform 0.1s ease;
            transform: scale(0.9);
            
            }
                
            .ghosted {
            filter: saturate(0);
            }


            .hide_checkmark {
            --show: 0.0;
            }

              .cls-1 {
        fill: #0c0;
      }

      .cls-1, .cls-2, .cls-3 {
        stroke-width: 0px;
      }

      .cls-2 {
        fill: blue;
      }

      .cls-3 {
        fill: #000;
      }

        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(container);     

        this.updateVisualState();
    }

    createSVGCheckuse() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'svg-checkuse');
        svg.setAttribute('width', '100');
        svg.setAttribute('height', '50');
        svg.setAttribute('viewBx', '0 0 100 100');
        this.hue = this.getAttribute('hue');
        this.saturation = this.getAttribute('saturation');
        this.lightness = this.getAttribute('lightness');


        console.log(this.attObj.hue || 0);
       const use = Object.assign(document.createElementNS('http://www.w3.org/2000/svg', 'use'), {style: `--hue:${this.attObj.hue || 0}; --saturation:${this.attObj.saturation || 0}; --lightness_main: ${this.attObj.lightness}; --lightness_highlight: ${parseInt(this.attObj.lightness) - 10}%;` });
       use.setAttributeNS("http://www.w3.org/1999/xlink", 'href', 'temp.svg#cone');

        const do_not_use =  Object.assign(document.createElementNS('http://www.w3.org/2000/svg', 'use') );
        do_not_use.setAttributeNS("http://www.w3.org/1999/xlink", 'href', 'temp.svg#do_not');
        
       do_not_use.classList.add("hide_checkmark");

    // use.setAttribute('xlink:href', "icecream.svg#cone");
       // Set inline style properties using style.setProperty

       
        svg.appendChild(use);
        svg.appendChild(do_not_use);

        return svg;
    }

    setupEventListeners() {
        const container = this.shadowRoot.querySelector('.svg-checkuse-container');
        const nativeCheckuse = this.shadowRoot.querySelector('input');


        // Handle mousedown - start of drag
        container.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.toggle();
            console.log("mouse down");
           
            // Set this checkuse as the starting point of drag
            window.dragStartState = nativeCheckuse.checked;
            window.isDragging = true;
            
           
            // Mark as visited during this drag
            this._visitedDuringDrag = true;


            


        console.log(container.classList)
        const icecream = this.svgCheckuse.querySelectorAll('use')[0];

        const checkmark = this.svgCheckuse.querySelectorAll('use')[1];


        if (container.classList.contains("mousedown")) {
            container.classList.remove("mousedown");
            checkmark.classList.add('hide_checkmark');

            console.log(checkmark);
        } else {
            container.classList.add("mousedown");
            checkmark.classList.remove('hide_checkmark');
            console.log(checkmark);

        }

           //console.log(this.classList);
           
            // Reset all checkusees' visited status except this one
            document.querySelectorAll('svg-checkuse').forEach(checkuse => {
                if (checkuse !== this) {
                    checkuse._visitedDuringDrag = false;
                }
            });
        }, { passive: false });

        // Handle mouseover during drag
        container.addEventListener('mouseover', (e) => {
            if (window.isDragging && !this._visitedDuringDrag) {
                // Toggle this checkuse (don't just set it to match the initial state)
                this.toggle();
                // Mark as visited during this drag
                this._visitedDuringDrag = true;

                        
                console.log(container.classList)

                const icecream = this.svgCheckuse.querySelectorAll('use')[0];

                const checkmark = this.svgCheckuse.querySelectorAll('use')[1];
        

                if (container.classList.contains("mousedown")) {
                    container.classList.remove("mousedown");
                    checkmark.classList.add('hide_checkmark');
        
                    console.log("contains")
                } else {
                    container.classList.add("mousedown");
                    checkmark.classList.remove('hide_checkmark');
                }
                        
            }
        });

        // Handle touch events
        container.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.toggle();
           
            window.isDragging = true;
           
            // Mark as visited during this drag
            this._visitedDuringDrag = true;
           
            // Reset all checkusees' visited status except this one
            document.querySelectorAll('svg-checkuse').forEach(checkuse => {
                if (checkuse !== this) {
                    checkuse._visitedDuringDrag = false;
                }
            });
        }, { passive: false });

        container.addEventListener('touchmove', (e) => {
            if (window.isDragging) {
                // Find the checkuse under the touch point
                const touch = e.touches[0];
                const element = document.elementFromPoint(touch.clientX, touch.clientY);
               
                // If it's a checkuse that hasn't been visited in this drag operation
                if (element) {
                    const checkuseElement = element.closest('svg-checkuse');
                    if (checkuseElement && !checkuseElement._visitedDuringDrag) {
                        checkuseElement.toggle();
                        checkuseElement._visitedDuringDrag = true;
                    }
                }
            }
        }, { passive: false });
    }

    toggle() {
        const nativeCheckuse = this.shadowRoot.querySelector('input');
        nativeCheckuse.checked = !nativeCheckuse.checked;
       
        const changeEvent = new Event('change', { bubbles: true });
        nativeCheckuse.dispatchEvent(changeEvent);



        console.log("clicked")

       
        this.updateVisualState();

    }

    updateVisualState() {
        // const nativeCheckuse = this.shadowRoot.querySelector('input');
        // const checkmark = this.shadowRoot.querySelector('path');
        // const use = this.shadowRoot.querySelector('rect');

        // if (nativeCheckuse.checked) {
        //     checkmark.style.display = 'block';
        //     use.setAttribute('fill', '#4CAF50');
        //     use.setAttribute('stroke', '#4CAF50');
        //     checkmark.setAttribute('fill', 'white');
        // } else {
        //     checkmark.style.display = 'none';
        //     use.setAttribute('fill', 'none');
        //     use.setAttribute('stroke', '#000');
        // }
    }

    get checked() {
        return this.shadowRoot.querySelector('input').checked;
    }

    set checked(value) {
        const nativeCheckuse = this.shadowRoot.querySelector('input');
        nativeCheckuse.checked = value;
        this.updateVisualState();
    }

    get value() {
        return this.getAttribute('value');
    }
}

// Define the custom element
customElements.define('svg-checkbox', SVGCheckuse);

// Stop dragging when mouse is released
document.addEventListener('mouseup', () => {
    window.isDragging = false;
});

document.addEventListener('touchend', () => {
    window.isDragging = false;
});

// Generate 32 ice cream flavors
// const flavors = [
//     'Vanilla', 'Chocolate', 'Strawberry', 'Mint Chocolate Chip',
//     'Cookie Dough', 'Rocky Road', 'Butter Pecan', 'Pistachio',
//     'Salted Caramel', 'Coffee', 'Cookies and Cream', 'Chocolate Chip',
//     'Neapolitan', 'Chocolate Fudge Brownie', 'Birthday Cake', 'Maple Walnut',
//     'Coconut', 'Raspberry Ripple', 'Peanut Butter', 'Tiramisu',
//     'Green Tea', 'Banana', 'Blueberry', 'Cherry Garcia',
//     'Rum Raisin', 'Pralines and Cream', 'Lemon Sorbet', 'Peach',
//     'Hazelnut', 'Mango Sorbet', 'Stracciatella', 'Dark Chocolate'
// ];

// const container = document.getElementById('flavorContainer');

// flavors.forEach((flavor, index) => {
//     const flavorItem = document.createElement('div');
//     flavorItem.className = 'flavor-item';

//     /*
//     const checkuse = document.createElement('svg-checkuse');
//     checkuse.setAttribute('name', 'iceCreamFlavors');
//     checkuse.setAttribute('value', flavor);

//     const label = document.createElement('span');
//     label.textContent = flavor;

//     flavorItem.appendChild(checkuse);
//     flavorItem.appendChild(label);
//     console.log(container + " container status");
//     */

//     const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
//     svg.setAttribute('class', 'svg-checkuse');
//     svg.setAttribute('width', '24');
//     svg.setAttribute('height', '24');
//     svg.setAttribute('viewuse', '0 0 24 24');

//    const use = Object.assign(document.createElementNS('http://www.w3.org/2000/svg', 'use'), {style: "--hue:0; --saturation:100%; --lightness_main: 50%; --lightness_highlight: 40%;  ", id: "cone"});
//    use.setAttribute('xlink:href', "icecream.svg#cone");
//    // Set inline style properties using style.setProperty
//    svg.appendChild(use);

//    const label = document.createElement('span');
//    label.textContent = flavor;

//    flavorItem.appendChild(svg);
//    flavorItem.appendChild(label);


//     container.appendChild(flavorItem);
// });

// function logSelectedFlavors() {
//     const selectedFlavors = Array.from(document.querySelectorAll('svg-checkuse'))
//         .filter(checkuse => checkuse.checked)
//         .map(checkuse => checkuse.value);
   
//     console.log('Selected Flavors:', selectedFlavors);
//     alert('Selected Flavors: ' + selectedFlavors.join(', '));
// }