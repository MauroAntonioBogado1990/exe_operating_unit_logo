{
    'name': 'POS Operating Unit Logo',
    'version': '13.0.1.0.0',
    'category': 'Point of Sale',
    'summary': 'Cambia el logo del ticket POS según la Unidad Operativa',
    'depends': ['point_of_sale', 'account', 'operating_unit'],
    'data': [
        'views/operating_unit_views.xml',
        # Agregamos un archivo nuevo para cargar el JS en el navegador
        'views/assets.xml', 
    ],
    'qweb': [
        'static/src/xml/pos_receipt.xml',
    ],
    'installable': True,
    'auto_install': False,
}