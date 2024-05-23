const GenerateVerificationEmail = (name, token) => `
<html>
    <head>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
        <style>
            body {
                font-family: Arial, sans-serif;
            }
            .container {
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 5px;
                background-color: #f9f9f9;
            }
        </style>
    </head>
    <body>
    <form>
        <div class="container">
            <p class="lead">Hello, ${name}</p>
            <p>Your token is <strong>${token}</strong></p>
            <p class="mt-3">Best regards,<br/>The Elysium Team</p>
        </div>
    </form>
    </body>
</html>
`;

module.exports = GenerateVerificationEmail;