// Add "Print Draft" button to the POS UI (ERPNext v15+)
frappe.provide('erpnext.PointOfSale');

(function () {
    function patch_pos_controller() {
        const Controller = erpnext && erpnext.PointOfSale && erpnext.PointOfSale.Controller;

        // Wait until POS controller is loaded
        if (!Controller || !Controller.prototype) {
            setTimeout(patch_pos_controller, 500);
            return;
        }

        // Avoid re-patching when the page is revisited
        if (Controller.prototype._print_draft_patched) {
            return;
        }

        const original_make = Controller.prototype.make;
        const original_prepare_menu = Controller.prototype.prepare_menu;

        Controller.prototype.make = async function (...args) {
            const result = await (original_make && original_make.apply(this, args));

            // Rename Checkout to Print Invoice and add a visible Print Draft action
            this.set_print_actions && this.set_print_actions();
            return result;
        };

        Controller.prototype.prepare_menu = function (...args) {
            const result = original_prepare_menu && original_prepare_menu.apply(this, args);

            if (this.page && !this.page._print_draft_menu_added) {
                this.page.add_menu_item(
                    __("Print Draft"),
                    async () => {
                        await this.print_draft_invoice();
                    },
                    false,
                    "Ctrl+P"
                );

                this.page._print_draft_menu_added = true;
            }

            return result;
        };

        Controller.prototype.set_print_actions = function () {
            // Replace the Checkout button label while preserving its behavior
            if (this.page && typeof this.page.set_primary_action === "function" && typeof this.checkout === "function") {
                this.page.set_primary_action(__("Print Invoice"), () => this.checkout());

                const $primary = this.page.page && typeof this.page.page.find === "function" && this.page.page.find(".primary-action");
                if ($primary && $primary.length) {
                    $primary.text(__("Print Invoice"));
                }
            }

            // Add a visible secondary button for printing drafts
            if (!this._print_draft_button_added && this.page && typeof this.page.set_secondary_action === "function") {
                this.page.set_secondary_action(__("Print Draft"), async () => {
                    await this.print_draft_invoice();
                });

                this._print_draft_button_added = true;
            }
        };

        Controller.prototype.print_draft_invoice = async function () {
            if (!this.frm || !this.frm.doc) {
                frappe.msgprint(__("No POS Invoice to print."));
                return;
            }

            // Ensure draft is saved (docstatus = 0)
            if (this.frm.is_dirty && this.frm.is_dirty()) {
                await this.frm.save();
            }

            this.frm.print_doc();
        };

        Controller.prototype._print_draft_patched = true;
    }

    patch_pos_controller();
})();
