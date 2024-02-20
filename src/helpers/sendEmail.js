const nodemailer = require("nodemailer")

const sendEmail = async (email, nombre,calle, numExt, items, cantidadTotal, precioTotal) => {
  try {
    const direccion = calle + " " + "NumExterior: " + numExt;
      const config = {
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
              user: "feripau230@gmail.com",
              pass: "grxstizgsuiectdi"
          }
      };
      const transporter = nodemailer.createTransport(config);

      let itemsHTML = '';
      items.forEach(item => {
          itemsHTML += `
              <li>${item.Descr_Art} - Precio unitario: ${item.Price_Art} - Cantidad: ${item.cantidad}</li>
          `;
      });

      const info = await transporter.sendMail({
          from: 'feripau230@gmail.com',
          to: email,
          subject: "Gallery Art - Resumen de compra",
          html: `
              <h1>Resumen de compra</h1>
              <ul>
                  <li>Nombre: ${nombre}</li>
                  <li>Cantidad total: ${cantidadTotal}</li>
                  <li>Total: ${precioTotal}</li>
                  <li>Estado: Pagado</li>
              </ul>
              <p>Su compra será enviada a la siguiente dirección: Calle ${direccion}</p>
              <p>Detalles de la compra:</p>
              <ul>${itemsHTML}</ul>
              <p>¡Gracias por su compra!</p>
          `,
      });
      return info;
  } catch (error) {
      console.log(error);
      throw new Error('Error sending email');
  }
};

module.exports = {sendEmail }