odoo.define('pos_operating_unit_logo.journal_models', function (require) {
    "use strict";
    var models = require('point_of_sale.models');

    models.load_fields('pos.config', ['journal_id', 'operating_unit_id']);

    models.load_models([{
        model: 'account.journal',
        fields: ['id','name','operating_unit_id'],
        domain: function(self){
            if (self.config && self.config.journal_id) {
                return [['id','=',self.config.journal_id[0]]];
            }
            return [['id','=',0]];
        },
        loaded: function(self, journals){
            if (journals && journals.length) {
                self.pos_journal = journals[0];
            } else {
                self.pos_journal = false;
            }
        },
    }]);

    var _super_order = models.Order.prototype;
    models.Order = models.Order.extend({
        export_for_printing: function() {
            var receipt = _super_order.export_for_printing.apply(this, arguments);
            if (this.pos.pos_journal && this.pos.pos_journal.operating_unit_id) {
                receipt.operating_unit = this.pos.pos_journal.operating_unit_id;
            } else if (this.pos.config.operating_unit_id) {
                receipt.operating_unit = this.pos.config.operating_unit_id;
            } else {
                receipt.operating_unit = false;
            }
            return receipt;
        }
    });
});
