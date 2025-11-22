"""Frappe hooks for the POS Customization app."""

from __future__ import annotations

from pos_customization import __version__

app_name = "pos_customization"
app_title = "POS Customization"
app_publisher = "POS Customization Maintainers"
app_description = "Usability improvements for ERPNext's Point of Sale interface."
app_email = "support@example.com"
app_license = "MIT"
app_version = __version__

required_apps = ["erpnext"]

# Load custom JS on the POS page
page_js = {
    "point-of-sale": "pos_customization/public/js/pos_print_button.js",
}
