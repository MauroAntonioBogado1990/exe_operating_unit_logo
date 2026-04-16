from odoo import models, api


class AccountMove(models.Model):
    _inherit = 'account.move'

    @api.onchange('journal_id')
    def _onchange_journal_set_operating_unit(self):
        if self.journal_id and self.journal_id.operating_unit_id:
            # only assign if journal belongs to same company (or has no company)
            if not self.journal_id.company_id or self.journal_id.company_id == self.company_id:
                self.operating_unit_id = self.journal_id.operating_unit_id

    @api.model
    def create(self, vals):
        if not vals.get('operating_unit_id') and vals.get('journal_id'):
            company_id = vals.get('company_id') or self.env.company.id
            journal = self.env['account.journal'].browse(vals['journal_id'])
            if journal.exists() and (not journal.company_id or journal.company_id.id == company_id):
                if journal.operating_unit_id:
                    vals['operating_unit_id'] = journal.operating_unit_id.id
        return super(AccountMove, self).create(vals)
