class SVGCheckbox extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        // Track if this checkbox has been visited during current drag operation
        this._visitedDuringDrag = false;
    }

    async connectedCallback() {
        console.log("Hi")
        this.render();
        await this.loadSVG();
        this.setupEventListeners();
    }

    //  connectedCallback() {
    //     this.render();
    //     this.setupEventListeners();
    // }

    // async render() {
     render() {
        const container = document.createElement('div');
        container.setAttribute('class', 'svg-checkbox-container');

        this.nativeCheckbox = document.createElement('input');
        this.nativeCheckbox.type = 'checkbox';
        if (this.hasAttribute('name')) this.nativeCheckbox.name = this.getAttribute('name');
        if (this.hasAttribute('value')) this.nativeCheckbox.value = this.getAttribute('value');
        if (this.hasAttribute('checked')) this.nativeCheckbox.checked = true;
        this.nativeCheckbox.style.display = 'none';
       
        // this.svgCheckbox = await this.loadSVG();

        container.appendChild(this.nativeCheckbox);
        // container.appendChild(this.svgCheckbox);

        const style = document.createElement('style');
        style.textContent = `
            .svg-checkbox-container {
                display: inline-block;
                cursor: pointer;
                user-select: none;
                position: relative;
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            }
            .svg-checkbox {
                transition: transform 0.1s ease;
            }
            .svg-checkbox:active {
                transform: scale(0.9);
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(container);

        this.updateVisualState();
    }

    async loadSVG() {
        const svgContainer = document.createElement('div');
        svgContainer.setAttribute('class', 'svg-container');

        try {
            const response = await fetch('icecream.svg');  // Ensure this file exists
            if (!response.ok) throw new Error("Failed to load SVG");

            let svgData = await response.text();
            svgContainer.innerHTML = svgData;

            // Apply initial color
            this.applyFlavorColor(svgContainer);
        } catch (error) {
            console.error("Error loading SVG:", error);
            svgContainer.innerHTML = `<p>SVG Load Error</p>`;
        }

        this.shadowRoot.querySelector('.svg-checkbox-container').appendChild(svgContainer);
    }

    createSVGCheckbox() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'svg-checkbox');
        svg.setAttribute('width', '24');
        svg.setAttribute('height', '24');
        svg.setAttribute('viewBox', '0 0 24 24');

        const box = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        box.setAttribute('x', '2');
        box.setAttribute('y', '2');
        box.setAttribute('width', '20');
        box.setAttribute('height', '20');
        box.setAttribute('rx', '3');
        box.setAttribute('ry', '3');
        box.setAttribute('fill', 'none');
        box.setAttribute('stroke', '#000');
        box.setAttribute('stroke-width', '2');

        const checkmark = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        checkmark.setAttribute('d', 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z');
        checkmark.setAttribute('fill', '#000');
        checkmark.style.display = 'none';

        svg.appendChild(box);
        svg.appendChild(checkmark);

        return svg;
    }

    setupEventListeners() {
        const container = this.shadowRoot.querySelector('.svg-checkbox-container');
        const nativeCheckbox = this.shadowRoot.querySelector('input');

        // Handle mousedown - start of drag
        container.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.toggle();
           
            // Set this checkbox as the starting point of drag
            window.dragStartState = nativeCheckbox.checked;
            window.isDragging = true;
           
            // Mark as visited during this drag
            this._visitedDuringDrag = true;
           
            // Reset all checkboxes' visited status except this one
            document.querySelectorAll('svg-checkbox').forEach(checkbox => {
                if (checkbox !== this) {
                    checkbox._visitedDuringDrag = false;
                }
            });
        }, { passive: false });

        // Handle mouseover during drag
        container.addEventListener('mouseover', (e) => {
            if (window.isDragging && !this._visitedDuringDrag) {
                // Toggle this checkbox (don't just set it to match the initial state)
                this.toggle();
                // Mark as visited during this drag
                this._visitedDuringDrag = true;
            }
        });

        // Handle touch events
        container.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.toggle();
           
            window.isDragging = true;
           
            // Mark as visited during this drag
            this._visitedDuringDrag = true;
           
            // Reset all checkboxes' visited status except this one
            document.querySelectorAll('svg-checkbox').forEach(checkbox => {
                if (checkbox !== this) {
                    checkbox._visitedDuringDrag = false;
                }
            });
        }, { passive: false });

        container.addEventListener('touchmove', (e) => {
            if (window.isDragging) {
                // Find the checkbox under the touch point
                const touch = e.touches[0];
                const element = document.elementFromPoint(touch.clientX, touch.clientY);
               
                // If it's a checkbox that hasn't been visited in this drag operation
                if (element) {
                    const checkboxElement = element.closest('svg-checkbox');
                    if (checkboxElement && !checkboxElement._visitedDuringDrag) {
                        checkboxElement.toggle();
                        checkboxElement._visitedDuringDrag = true;
                    }
                }
            }
        }, { passive: false });
    }

    toggle() {
        const nativeCheckbox = this.shadowRoot.querySelector('input');
        nativeCheckbox.checked = !nativeCheckbox.checked;
       
        const changeEvent = new Event('change', { bubbles: true });
        nativeCheckbox.dispatchEvent(changeEvent);
       
        this.updateVisualState();
    }

    updateVisualState() {
        // const nativeCheckbox = this.shadowRoot.querySelector('input');
        // const checkmark = this.shadowRoot.querySelector('path');
        // const box = this.shadowRoot.querySelector('rect');

        // if (nativeCheckbox.checked) {
        //     checkmark.style.display = 'block';
        //     box.setAttribute('fill', '#4CAF50');
        //     box.setAttribute('stroke', '#4CAF50');
        //     checkmark.setAttribute('fill', 'white');
        // } else {
        //     checkmark.style.display = 'none';
        //     box.setAttribute('fill', 'none');
        //     box.setAttribute('stroke', '#000');
        // }
    }


    applyFlavorColor(svgContainer) {
        // const flavorName = this.getAttribute('value');
        // if (!flavorName || !window.allFlavors) return;
    
        // let matchedFlavor = window.allFlavors.find(f => f[0] === flavorName);
        // if (!matchedFlavor) return;
    
        // const coneColor = matchedFlavor[1];

        // console.log(coneColor);
        
        // let checkStyles = {true:{"filter": "none", "fill": coneColor, "transform": "scale(1.3)"}, 
        // false:{"filter": "grayscale(100%)", "fill": "#D3D3D3", "transform": "scale(1)"}}

        // console.log(checkStyles[this.checkedState]);

        // Object.entries(checkStyles[this.checkedState]).forEach(([key, value]) => {
        //     svgContainer.style[key] = value;
        // });

    }

    get checked() {
        return this.shadowRoot.querySelector('input').checked;
    }

    set checked(value) {
        const nativeCheckbox = this.shadowRoot.querySelector('input');
        nativeCheckbox.checked = value;
        this.updateVisualState();
    }

    get value() {
        return this.getAttribute('value');
    }
}
