// odoo.define('pos_operating_unit_logo.pos_models', function (require) {
//     "use strict";
//     var models = require('point_of_sale.models');

//     // 1. IMPORTANTE: Decirle al POS que traiga el campo desde el backend
//     models.load_fields('pos.config', ['operating_unit_id']);

//     // 2. Cargar el modelo de la unidad operativa
//     models.load_models([{
//         model:  'operating.unit',
//         fields: ['name', 'report_logo', 'partner_id'],
//         // Usamos una función para el dominio con validación de existencia
//         domain: function(self){ 
//             if (self.config.operating_unit_id) {
//                 return [['id', '=', self.config.operating_unit_id[0]]]; 
//             }
//             return [['id', '=', 0]]; // Si no hay, devolvemos un dominio vacío
//         },
//         loaded: function(self, ou){
//             if (ou.length > 0) {
//                 self.operating_unit_data = ou[0]; 
//             } else {
//                 self.operating_unit_data = false;
//             }
//         },
//     }]);

//     // 3. Inyectar la información en el ticket
//     var _super_order = models.Order.prototype;
//     models.Order = models.Order.extend({
//         export_for_printing: function() {
//             var receipt = _super_order.export_for_printing.apply(this, arguments);
//             // Pasamos la data al objeto 'receipt' que lee el XML
//             receipt.operating_unit = this.pos.operating_unit_data;
//             return receipt;
//         }
//     });
// });
















odoo.define('pos_operating_unit_logo.pos_models', function (require) {
    "use strict";
    var models = require('point_of_sale.models');

    // 1. Traer el campo operating_unit_id desde pos.config
    models.load_fields('pos.config', ['operating_unit_id']);

    // 2. Cargar el modelo operating.unit con el nuevo campo user_ids
    models.load_models([{
        model:  'operating.unit',
        fields: ['name', 'report_logo', 'user_ids'],
        domain: function(self) {
            if (self.config.operating_unit_id) {
                return [['id', '=', self.config.operating_unit_id[0]]];
            }
            return [['id', '=', 0]];
        },
        loaded: function(self, ou) {
            // Guardamos todas las OUs cargadas para poder buscar por usuario
            self.operating_units_list = ou || [];

            // Intentamos encontrar la OU cuyo user_ids contiene al usuario de la sesión
            var session_user_id = self.pos_session && self.pos_session.user_id
                                  ? self.pos_session.user_id[0]
                                  : false;

            var matched = false;
            if (session_user_id) {
                matched = _.find(ou, function(unit) {
                    return unit.user_ids && unit.user_ids.indexOf(session_user_id) !== -1;
                });
            }

            // Si no hay match por usuario, usamos la OU configurada directamente en el POS
            self.operating_unit_data = matched || (ou.length > 0 ? ou[0] : false);
        },
    }]);

    // 3. Inyectar la información en el ticket
    var _super_order = models.Order.prototype;
    models.Order = models.Order.extend({
        export_for_printing: function() {
            var receipt = _super_order.export_for_printing.apply(this, arguments);
            receipt.operating_unit = this.pos.operating_unit_data;
            return receipt;
        }
    });
});