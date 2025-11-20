// Add "Print Draft" button to the POS menu (ERPNext v15+)
frappe.provide('erpnext.PointOfSale');

(function () {
    function patch_pos_controller() {
        const Controller = erpnext?.PointOfSale?.Controller;

        // wait until POS controller is loaded
        if (!Controller || !Controller.prototype) {
            setTimeout(patch_pos_controller, 500);
            return;
        }

        // avoid re-patching when the page is revisited
        if (Controller.prototype._print_draft_patched) {
            return;
        }

        const original_prepare_menu = Controller.prototype.prepare_menu;

        Controller.prototype.prepare_menu = function (...args) {
            const result = original_prepare_menu?.apply(this, args);

            this.page?.add_menu_item(
                __("Print Draft"),
                async () => {
                    await this.print_draft_invoice();
                },
                false,
                "Ctrl+P"
            );

            return result;
        };

        Controller.prototype.print_draft_invoice = async function () {
            if (!this.frm || !this.frm.doc) {
                frappe.msgprint(__("No POS Invoice to print."));
                return;
            }

            // ensure draft is saved (docstatus = 0)
            if (this.frm.is_dirty?.()) {
                await this.frm.save();
            }

            this.frm.print_doc();
        };

        Controller.prototype._print_draft_patched = true;
    }

    patch_pos_controller();
})();
