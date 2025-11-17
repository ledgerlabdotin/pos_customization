// Add "Print Draft" button to new POS interface (ERPNext v15)
frappe.provide('erpnext.PointOfSale');

frappe.require('point-of-sale.bundle.js', function () {
    class CustomPOSController extends erpnext.PointOfSale.Controller {
        constructor(wrapper) {
            super(wrapper);
        }

        // extend POS menu
        prepare_menu() {
            // keep original menu items
            super.prepare_menu();

            // add our custom Print button
            this.page.add_menu_item(
                __("Print Draft"),
                async () => {
                    await this.print_draft_invoice();
                },
                false,
                'Ctrl+P' // shortcut
            );
        }

        async print_draft_invoice() {
            if (!this.frm || !this.frm.doc) {
                frappe.msgprint(__('No POS Invoice to print.'));
                return;
            }

            // ensure draft is saved (docstatus = 0, not submitted)
            if (this.frm.is_dirty()) {
                await this.frm.save();   // saves as draft
            }

            // open print dialog for current POS Invoice
            this.frm.print_doc();
            // or use:
            // this.frm.print_preview();
        }
    }

    // override default controller
    erpnext.PointOfSale.Controller = CustomPOSController;
});
