// Add "Print Draft" button to new POS interface (ERPNext v15)
frappe.provide('erpnext.PointOfSale');

(function () {
    function setup_custom_pos() {
        // wait until POS controller is loaded
        if (!(window.erpnext && erpnext.PointOfSale && erpnext.PointOfSale.Controller)) {
            setTimeout(setup_custom_pos, 500);
            return;
        }

        const BaseController = erpnext.PointOfSale.Controller;

        class CustomPOSController extends BaseController {
            prepare_menu() {
                // keep original menu
                super.prepare_menu();

                // add our custom Print button
                this.page.add_menu_item(
                    __("Print Draft"),
                    async () => {
                        await this.print_draft_invoice();
                    },
                    false,
                    "Ctrl+P"
                );
            }

            async print_draft_invoice() {
                if (!this.frm || !this.frm.doc) {
                    frappe.msgprint(__("No POS Invoice to print."));
                    return;
                }

                // ensure draft is saved (docstatus = 0)
                if (this.frm.is_dirty()) {
                    await this.frm.save();
                }

                // open print dialog
                this.frm.print_doc();
                // or use:
                // this.frm.print_preview();
            }
        }

        // override default controller
        erpnext.PointOfSale.Controller = CustomPOSController;
    }

    setup_custom_pos();
})();
