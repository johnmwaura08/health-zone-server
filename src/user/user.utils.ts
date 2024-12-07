export function generateEmailBody(
  name: string,
  password: string,
  frontendUrl: string,
  forgotPassword?: boolean,
) {
  const subject = forgotPassword
    ? 'Password Change Requested'
    : 'Welcome to Health Zone';
  const emailBody = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
            }
    
            h1 {
                color: #007BFF;
            }
    
            p {
                margin-bottom: 10px;
            }
    
            a {
                color: #007BFF;
                text-decoration: none;
                font-weight: bold;
            }
    
            a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <h1>${subject}</h1>
        <p>Hi ${name},</p>
        <p>Your temporary password is ${password}</p>
        <p>Thank you for choosing Health Zone.</p>
    </body>
    </html>
    `;

  return emailBody;
}
