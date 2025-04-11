const { google } = require('googleapis');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    // Vercel: leitura manual do body
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }

    const rawBody = Buffer.concat(buffers).toString();
    const { email } = JSON.parse(rawBody);

    if (!email) {
      return res.status(400).json({ message: 'Email é obrigatório.' });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Emails!A1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[email, new Date().toISOString()]],
      },
    });

    return res.status(200).json({ message: 'Email adicionado com sucesso!' });
  } catch (error) {
    console.error('Erro na função submit-email:', error);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};
// trigger deploy
// trigger redeploy
// redeploy trigger
// redeploy trigger
