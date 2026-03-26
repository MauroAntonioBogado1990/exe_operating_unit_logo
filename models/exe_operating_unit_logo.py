from odoo import models, fields


class OperatingUnit(models.Model):
    _inherit = "operating.unit"

    report_logo = fields.Binary("Logo Reporte", attachment=True,
                               help="Logo used in reports for this operating unit. Falls back to company logo.")

class PosConfig(models.Model):
    _inherit = 'pos.config'

    # Relacionamos el POS con una Unidad Operativa
    operating_unit_id = fields.Many2one(
        'operating.unit', 
        string='Unidad Operativa',
        help="Unidad operativa asociada a este punto de venta para el logo del ticket."
    )