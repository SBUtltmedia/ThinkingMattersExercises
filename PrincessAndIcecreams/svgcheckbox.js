// ✅ Store globally so svgcheckbox.js can access it
window.allFlavors = [
    ["Almond", "#D2B48C"], // Light Brown
    ["Bastani Sonnati (Persian)", "#FFD700"], // Yellow
    ["Butter Pecan", "#FFF5E1"], // Cream
    ["Cayenne Chocolate", "#5C4033"], // Dark Brown
    ["Chocolate Chip Cookie Dough", "#EED9C4"], // Beige
    ["Coconut Almond Chip", "#FFFFFF"], // White
    ["Dulce de Leche", "#C19A6B"], // Caramel
    ["English Toffee", "#8B4513"], // Brown
    ["Goat Cheese Beet Swirl", "#FFFFFF"], // White
    ["Green Tea Ice Cream", "#98FB98"], // Light Green
    ["Honey Avocado", "#FFC30B"], // Dark Yellow
    ["Honeyjack and Coke", "#654321"], // Dark Brown
    ["Huckleberry", "#800080"], // Purple
    ["Jalapeño", "#008000"], // Green
    ["Lavender Honey", "#D8BFD8"], // Light Purple
    ["Les Bourgeois and Ghirardelli", "#4B382A"], // Dark Brown
    ["Madagascar Vanilla", "#FAEBD7"], // Pale Yellow
    ["Mango", "#FFA500"], // Orange
    ["Mint Chocolate Chip", "#98FB98"], // Light Green
    ["Moose Tracks", "#EED9C4"], // Beige
    ["Passion Fruit", "#FF7518"], // Orange
    ["Pistachio", "#A7C796"], // Pale Green
    ["Peanut Butter", "#D2B48C"], // Light Brown
    ["Pralines and Cream", "#FFF5E1"], // Cream
    ["Red Velvet", "#C71585"], // Red
    ["Rum Raisin", "#FFF5E1"], // Cream
    ["Spumoni", "#008000"], // Green
    ["Strawberry", "#FFC0CB"], // Pink
    ["Sweet Potato Maple Walnut", "#D2691E"], // Orange
    ["Ube (Philippines, Purple Yam)", "#6A0DAD"], // Dark Purple
    ["Vietnamese Coffee", "#D2B48C"] // Light Brown
];



class SVGCheckbox extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._visitedDuringDrag = false;
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        const container = document.createElement('div');
        container.setAttribute('class', 'svg-checkbox-container');
    
        this.nativeCheckbox = document.createElement('input');
        this.nativeCheckbox.type = 'checkbox';
        if (this.hasAttribute('name')) this.nativeCheckbox.name = this.getAttribute('name');
        if (this.hasAttribute('value')) this.nativeCheckbox.value = this.getAttribute('value');
        if (this.hasAttribute('checked')) this.nativeCheckbox.checked = true;
        this.nativeCheckbox.style.display = 'none';
    
        // Attach to the existing SVG cone within the same container
        this.svgCheckbox = this.closest('div').querySelector('svg');
    
        if (this.svgCheckbox) {
            this.svgCheckbox.style.cursor = "pointer"; // Make the SVG clickable
            this.svgCheckbox.setAttribute("data-original-color", this.getFlavorColor()); // Store the correct color
            this.svgCheckbox.style.setProperty("--filter-mode", "url(#grayscale)"); // 🔹 Force grayscale
        }
    
        container.appendChild(this.nativeCheckbox);
        this.shadowRoot.appendChild(container);
    
        this.updateVisualState(); // ✅ Apply initial visual state
    }
    


 
    setupEventListeners() {
        const nativeCheckbox = this.shadowRoot.querySelector('input');
        const parentContainer = this.closest('div');
        const svgElement = parentContainer ? parentContainer.querySelector('svg') : null;
    
        if (!svgElement) return; // Ensure the SVG cone exists
    
        // 🔴 Ignore Right-Click for Selection
        svgElement.addEventListener('mousedown', (e) => {
            if (e.button === 2) {
                // If it's a right-click, do nothing (but don't block the context menu)
                return;
            }
    
            e.preventDefault(); // Prevent default selection behavior
            this.toggle(); // Toggle selection only on left-click
    
            window.dragStartState = nativeCheckbox.checked;
            window.isDragging = true;
            this._visitedDuringDrag = true;
    
            document.querySelectorAll('svg-checkbox').forEach(checkbox => {
                if (checkbox !== this) {
                    checkbox._visitedDuringDrag = false;
                }
            });
        }, { passive: false });
    
        // 🖱 Mouse Drag (Select Multiple)
        svgElement.addEventListener('mouseover', (e) => {
            if (window.isDragging && !this._visitedDuringDrag) {
                this.toggle();
                this._visitedDuringDrag = true;
            }
        });
    
        // 📱 Touch Events (Mobile)
        svgElement.addEventListener('touchstart', (e) => {
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
    
        svgElement.addEventListener('touchmove', (e) => {
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
    }
    




    toggle() {
        const nativeCheckbox = this.shadowRoot.querySelector('input');
        const parentContainer = this.closest('div');
        const svgElement = parentContainer ? parentContainer.querySelector('svg') : null;
        const flavorName = this.getAttribute("value"); // Get the flavor name
        let matchedFlavor = window.allFlavors.find(f => f[0] === flavorName);
    
        if (!svgElement || !matchedFlavor) return;
    
        // Toggle checkbox state
        nativeCheckbox.checked = !nativeCheckbox.checked;
    
        // Dispatch a change event to trigger any external listeners
        const changeEvent = new Event('change', { bubbles: true });
        nativeCheckbox.dispatchEvent(changeEvent);
    
        // Ensure the color toggles correctly
        let coneColor = matchedFlavor[1];
    
        if (nativeCheckbox.checked) {
            // If checked, apply the flavor's color
            svgElement.style.setProperty("--color_fill", coneColor);
            svgElement.style.setProperty("--filter-mode", "none");
        } else {
            // If unchecked, reset to grayscale
            svgElement.style.setProperty("--color_fill", ""); // Reset fill
            svgElement.style.setProperty("--filter-mode", "url(#grayscale)");
        }
    }
    
    

    updateVisualState() {
        const nativeCheckbox = this.shadowRoot.querySelector('input');
        const parentContainer = this.closest('div');
        const svgElement = parentContainer ? parentContainer.querySelector('svg') : null;
    
        if (!svgElement) return;
    
        if (nativeCheckbox.checked) {
            let flavorColor = this.getFlavorColor();
            svgElement.style.setProperty("--color_fill", flavorColor);
            svgElement.style.setProperty("--filter-mode", "none"); // Remove grayscale
        } else {
            // ✅ Force grayscale when unselected
            // svgElement.style.setProperty("--color_fill", ""); // Reset color
            svgElement.style.setProperty("--filter-mode", "url(#grayscale)");
        }
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

    // ✅ Function to get the correct flavor color from flavors.js
    getFlavorColor() {
        let flavorName = this.getAttribute('value'); // Get the ice cream flavor name
        if (!flavorName || !window.allFlavors) return "#FFFFFF"; // Default to white if missing
    
        let matchedFlavor = window.allFlavors.find(f => f[0] === flavorName);
        return matchedFlavor ? matchedFlavor[1] : "#FFFFFF"; // Return the correct color
    }
    
}

// Define the custom element
customElements.define('svg-checkbox', SVGCheckbox);

// Stop dragging when mouse or touch is released
document.addEventListener('mouseup', () => {
    window.isDragging = false;
});

document.addEventListener('touchend', () => {
    window.isDragging = false;
});
