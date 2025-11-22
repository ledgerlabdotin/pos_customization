/**
 * Adds a small print helper to the ERPNext Point of Sale page.
 *
 * The code purposefully stays defensive: it checks the active route,
 * ensures the POS page wrapper exists, and only injects a single button.
 */
(() => {
    frappe.provide("pos_customization");

    const routeIsPOS = () => frappe.get_route_str && frappe.get_route_str() === "point-of-sale";
    const currentPage = () => frappe.container && frappe.container.page;

    const addButtonIfMissing = () => {
        const page = currentPage();
        if (!routeIsPOS() || !page) {
            return;
        }

        // Avoid adding duplicates when the POS page refreshes.
        if (page.custom_pos_customization_print_button) {
            return;
        }

        page.custom_pos_customization_print_button = page.add_inner_button(
            __("Print Current View"),
            () => window.print()
        );
    };

    // Watch for navigation changes and lazily add the button when the POS page appears.
    const watchRoute = () => {
        addButtonIfMissing();

        // A lightweight polling loop keeps things resilient even if the POS assets
        // finish loading after this file runs.
        const interval = setInterval(() => {
            if (!routeIsPOS()) {
                return;
            }

            addButtonIfMissing();
        }, 800);

        // Clear the polling loop once the user leaves the POS screen.
        const stopWhenRouteChanges = () => {
            if (!routeIsPOS()) {
                clearInterval(interval);
                document.removeEventListener("page-change", stopWhenRouteChanges);
            }
        };

        document.addEventListener("page-change", stopWhenRouteChanges);
    };

    // Run immediately after the current request cycle.
    frappe.after_ajax(watchRoute);
})();
