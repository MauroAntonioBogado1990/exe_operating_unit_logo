from odoo import models, fields


class OperatingUnit(models.Model):
    _inherit = "operating.unit"

    report_logo = fields.Binary("Logo Reporte", attachment=True,
                               help="Logo used in reports for this operating unit. Falls back to company logo.")
    user_ids = fields.Many2many(
        'res.users',
        string='Usuarios',
        help="Usuarios asociados a esta unidad operativa para la selección automática del logo en el ticket POS."
    )

class PosConfig(models.Model):
    _inherit = 'pos.config'

    # Relacionamos el POS con una Unidad Operativa
    operating_unit_id = fields.Many2one(
        'operating.unit', 
        string='Unidad Operativa',
        help="Unidad operativa asociada a este punto de venta para el logo del ticket."
    )