// Mensaje profesional de WhatsApp para pedido directo de 1 producto
  const getDirectWhatsAppUrl = (product: Product) => {
    const selectedOpt = selectedProductOptions[product.id] || product.options?.[0]?.name || '';
    const lines = [
      '*PEDIDO WEB · ÁUREA BY SIU*',
      '',
      'Hola, deseo realizar el siguiente pedido:',
      '',
      `• *Pieza:* ${product.name} (${product.id})`,
      `• *Valor:* $${product.price.toFixed(2)} USD`,
      selectedOpt ? `• *Opción:* ${selectedOpt}` : '',
      '• *Envío:* $5.00 GYE / Samborondón / Daule | $6.00 Nacional',
      '',
      '*DATOS PARA EL ENVÍO*',
      '• *Nombre:* ',
      '• *Ciudad / Sector:* ',
      '• *Dirección y referencia:* ',
      '• *Método de pago:* ',
      '',
      'Quedo atento/a a su confirmación. ¡Muchas gracias!'
    ].filter(line => line !== null && line !== undefined && !(line === '' && false));

    // Filtrar solo si selectedOpt estaba vacío
    const cleanLines = lines.filter((line, idx) => !(line === '' && idx === 6 && !selectedOpt));

    return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(cleanLines.join('\n'))}`;
  };

  // Mensaje profesional de WhatsApp desde el carrito completo
  const sendCartToWhatsApp = () => {
    if (cart.length === 0) return;

    const zoneLabel = shippingZone === 'local' 
      ? 'GYE / Samborondón / Daule ($5.00 USD)' 
      : 'Resto del Ecuador - Nacional ($6.00 USD)';

    const paymentLabel = paymentMethod === 'contra_entrega'
      ? 'Pago Contra Entrega (Efectivo)'
      : 'Transferencia Bancaria / DeUna';

    const lines = [
      '*PEDIDO WEB · ÁUREA BY SIU*',
      '',
      '*DETALLE DE PIEZAS*',
    ];

    cart.forEach((item, idx) => {
      lines.push(`${idx + 1}. *${item.product.name}* (${item.product.id}) x${item.quantity} — $${(item.product.price * item.quantity).toFixed(2)} USD`);
      if (item.selectedOption !== 'Estándar') {
        lines.push(`   _Opción: ${item.selectedOption}_`);
      }
    });

    lines.push('');
    lines.push('*RESUMEN DE PAGO*');
    lines.push(`• *Subtotal:* $${subtotalPrice.toFixed(2)} USD`);
    lines.push(`• *Envío:* ${zoneLabel}`);
    lines.push(`• *TOTAL A PAGAR:* $${totalCartPrice.toFixed(2)} USD`);
    lines.push(`• *Forma de pago:* ${paymentLabel}`);
    lines.push('');
    lines.push('*DATOS DE ENTREGA*');
    lines.push(`• *Nombre:* ${customerName.trim() || ''}`);
    lines.push(`• *Celular:* ${customerPhone.trim() || ''}`);
    lines.push(`• *Dirección:* ${customerAddress.trim() || ''}`);
    lines.push('');
    lines.push(
      paymentMethod === 'transferencia'
        ? 'Por favor compártanme los datos de cuenta o DeUna para realizar el pago. ¡Muchas gracias!'
        : 'Quedo atento/a para coordinar el horario de entrega. ¡Muchas gracias!'
    );

    window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(lines.join('\n'))}`, '_blank');
  };
