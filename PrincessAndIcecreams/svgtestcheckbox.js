class SVGCheckbox extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._visitedDuringDrag = false;
        this.checkedState = false;
    }

    async connectedCallback() {
        this.render();
        await this.loadSVG();
        this.setupEventListeners();
    }

    render() {
        const container = document.createElement('div');
        container.setAttribute('class', 'svg-checkbox-container');

        this.nativeCheckbox = document.createElement('input');
        this.nativeCheckbox.type = 'checkbox';
        this.nativeCheckbox.style.display = 'none';

        container.appendChild(this.nativeCheckbox);

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
            .svg-container {
                width: 50px;
                height: 50px;
                transition: transform 1s ease-in-out;
                filter: grayscale(100%); /* Default grayscale */
            }
            :host([checked]) .svg-container {
                transform: scale(1.3);
                filter: none; /* Remove grayscale when selected */
                animation: wiggle 0.2s ease-in-out 2;
            }
            @keyframes wiggle {
                0% { transform: scale(1.3) rotate(0deg); }
                25% { transform: scale(1.3) rotate(5deg); }
                50% { transform: scale(1.3) rotate(-5deg); }
                75% { transform: scale(1.3) rotate(3deg); }
                100% { transform: scale(1.3) rotate(0deg); }
            }
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(container);
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


    setupEventListeners() {
        const container = this.shadowRoot.querySelector('.svg-checkbox-container');
        const nativeCheckbox = this.shadowRoot.querySelector('input');
    
        // ✅ Handle normal left-click selection (ignore right-click)
        container.addEventListener('click', (e) => {
            if (e.button === 2) return; // ⛔ Ignore right-click for selection
            e.preventDefault();
            this.toggle();
        });
    
        // ✅ Handle mousedown - Start of Drag Selection (only left-click)
        container.addEventListener('mousedown', (e) => {
            if (e.button === 2) return; // ⛔ Ignore right-click
            e.preventDefault();
            this.toggle(); // First checkbox should toggle
    
            // Set this checkbox as the starting point of drag
            window.dragStartState = nativeCheckbox.checked;
            window.isDragging = true;
    
            // Mark as visited during this drag
            this._visitedDuringDrag = true;
    
            // Reset visited status for all checkboxes except this one
            document.querySelectorAll('svg-checkbox').forEach(checkbox => {
                if (checkbox !== this) {
                    checkbox._visitedDuringDrag = false;
                }
            });
        }, { passive: false });
    
        // ✅ Handle mouseover during drag selection (only left-click drag)
        container.addEventListener('mouseover', (e) => {
            if (window.isDragging && !this._visitedDuringDrag) {
                this.toggle(); // Toggle selection on hover
                this._visitedDuringDrag = true;
            }
        });
    
        // ✅ Handle touch-based drag selection (for mobile users)
        container.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.toggle();
    
            window.isDragging = true;
            this._visitedDuringDrag = true;
    
            document.querySelectorAll('svg-checkbox').forEach(checkbox => {
                if (checkbox !== this) {
                    checkbox._visitedDuringDrag = false;
                }
            });
        }, { passive: false });
    
        container.addEventListener('touchmove', (e) => {
            if (window.isDragging) {
                const touch = e.touches[0];
                const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
                if (element) {
                    const checkboxElement = element.closest('svg-checkbox');
                    if (checkboxElement && !checkboxElement._visitedDuringDrag) {
                        checkboxElement.toggle();
                        checkboxElement._visitedDuringDrag = true;
                    }
                }
            }
        }, { passive: false });
    
        // ✅ Stop dragging when mouse or touch is released
        document.addEventListener('mouseup', () => {
            window.isDragging = false;
        });
    
        document.addEventListener('touchend', () => {
            window.isDragging = false;
        });
    }
    
    

    toggle() {
        this.checkedState = !this.checkedState;
        this.setAttribute("checked", this.checkedState ? "" : null);
        this.nativeCheckbox.checked = this.checkedState;
        
        // Update SVG color when toggled
        this.applyFlavorColor(this.shadowRoot.querySelector('.svg-container'));
    }

    applyFlavorColor(svgContainer) {
        const flavorName = this.getAttribute('value');
        if (!flavorName || !window.allFlavors) return;
    
        let matchedFlavor = window.allFlavors.find(f => f[0] === flavorName);
        if (!matchedFlavor) return;
    
        const coneColor = matchedFlavor[1];

        console.log(coneColor);
        
        let checkStyles = {true:{"filter": "none", "fill": coneColor, "transform": "scale(1.3)"}, 
        false:{"filter": "grayscale(100%)", "fill": "#D3D3D3", "transform": "scale(1)"}}

        console.log(checkStyles[this.checkedState]);

        Object.entries(checkStyles[this.checkedState]).forEach(([key, value]) => {
            svgContainer.style[key] = value;
        });
    }
    

    get checked() {
        return this.checkedState;
    }

    set checked(value) {
        this.checkedState = value;
        this.setAttribute("checked", value ? "" : null);
        this.nativeCheckbox.checked = value;
    }
}

customElements.define('svg-checkbox', SVGCheckbox);
