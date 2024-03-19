const nodemailer = require("nodemailer")


const sendEmail = async (email, description, totalPrice) => {
    try {
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
  

  
        const info = await transporter.sendMail({
            from: 'feripau230@gmail.com',
            to: email,
            subject: "Gallery Art - Resumen de compra",
            html: `
            <!DOCTYPE html>
            <html lang="en">
            
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Confirmación de Compra</title>
                <style>
                    /* Estilos generales */
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        margin: 0;
                        padding: 0;
                        background-color: #f4f4f4;
                    }
            
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
            
                    h1,
                    p {
                        margin: 0;
                    }
            
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        background-color: #007bff;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 5px;
                    }
            
                    /* Estilos específicos */
                    .header {
                        background-color: #007bff;
                        color: #ffffff;
                        text-align: center;
                        padding: 20px;
                        border-top-left-radius: 8px;
                        border-top-right-radius: 8px;
                    }
            
                    .content {
                        padding: 20px;
                    }
            
                    .footer {
                        text-align: center;
                        padding: 20px;
                        background-color: #f4f4f4;
                        border-bottom-left-radius: 8px;
                        border-bottom-right-radius: 8px;
                    }
            
                    .invoice {
                        margin-top: 20px;
                        border-collapse: collapse;
                        width: 100%;
                    }
            
                    .invoice th,
                    .invoice td {
                        border: 1px solid #dddddd;
                        text-align: left;
                        padding: 8px;
                    }
            
                    .invoice th {
                        background-color: #f2f2f2;
                    }
                </style>
            </head>
            
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Gracias por su compra</h1>
                    </div>
                    <div class="content">
                        <p>A continuación, encontrará los detalles de su compra:</p>
                        <table class="invoice">
                            <thead>
                                <tr>
                                    <th>Descripción</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>${description}</td>
                           
                                </tr>
                          
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td><strong>Total:</strong></td>
                                    <td><strong>${totalPrice}</strong></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div class="footer">
                        <p>¡Gracias nuevamente por su compra!</p>
                    </div>
                </div>
            </body>
            
            </html>
              
            `,
        });
        return info;
    } catch (error) {
        console.log(error);
        throw new Error('Error sending email');
    }
};

module.exports = { sendEmail };
