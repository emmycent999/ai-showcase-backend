# Certificate Email System - Zoho Configuration

## Email Setup (Zoho Mail)

Update your `.env` file with Zoho credentials:

```
EMAIL_HOST=smtp.zoho.com
EMAIL_USER=your_email@zohomail.com
EMAIL_PASS=your_zoho_password
```

**Note:** Use your Zoho account password or app-specific password if 2FA is enabled.

## Admin Dashboard Features

### Send Individual Certificate
- Click "Send Cert" button next to any registration
- Certificate PDF is generated and emailed automatically

### Send All Certificates
- Click "Send All Certificates" button at the top
- Sends certificates to all registered users
- Shows confirmation with count

## Certificate Generation

Certificates are automatically generated with:
- User's full name
- Registration type (Participant/Organizer/Alumni)
- Event details
- Official branding

## Testing Email

Before sending to all users, test with one registration:
1. Register a test user with your email
2. Click "Send Cert" for that user
3. Check your inbox for the certificate

## Troubleshooting

If emails fail to send:
1. Verify Zoho credentials in `.env`
2. Check Zoho SMTP is enabled in your account
3. Ensure port 465 (SSL) is not blocked
4. Check server logs for detailed error messages
