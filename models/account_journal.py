from odoo import models, fields


class AccountJournal(models.Model):
    _inherit = 'account.journal'

    operating_unit_id = fields.Many2one(
        'operating.unit', string='Unidad Operativa',
        help='Unidad operativa asociada a este diario (usada para logo en facturas/tickets).'
    )
