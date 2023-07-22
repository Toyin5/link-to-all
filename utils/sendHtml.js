export default function sendHtml(url) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Verify your email address</title>
    <style>
      /* Set the overall width of the email */
      body {
        width: 600px;
        margin: 0 auto;
      }
  
      /* Style the header */
      header {
        background-color: #000;
        color: #fff;
        padding: 20px;
        text-align: center;
      }
  
      /* Style the logo */
      img {
        max-width: 100%;
      }
  
      /* Style the content area */
      main {
        padding: 20px;
      }
  
      /* Style the footer */
      footer {
        background-color: #f0f0f0;
        color: #000;
        padding: 20px;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <header>
      <img src="/logo.png" alt="logo" />
      <h1>Verify your email address</h1>
    </header>
    <main>
      <p>Hi</p>
      <p>We just need to verify your email address before you can access <strong>LinktoAll</strong>.</p>
      <p>To verify your email address, please click on the following link:</p>
      <button><a href="${url}" target="_blank">Verify your email address</a></button>
      <p>If you don't click on the link within 10 hours, your account will be deleted.</p>
      <p>Thank you for your patience.</p>
    </main>
    <footer>
      <p>Copyright &copy; ${new Date().getFullYear()} <strong>LinkToAll</strong></p>
    </footer>
  </body>
  </html>
        `;
}
