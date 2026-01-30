# Certificate Setup Instructions

## Image Placement

Place these certificate template images in the root directory:
- `C:\Users\PC\Downloads\AI Showcase\Participant.png`
- `C:\Users\PC\Downloads\AI Showcase\Alumni.png`
- `C:\Users\PC\Downloads\AI Showcase\Organizers.png`

## How It Works

1. Admin clicks "Send Cert" button for a user
2. System loads the appropriate certificate template based on user type
3. User's name is overlaid on the certificate image
4. Certificate is emailed as PNG attachment

## Adjusting Name Position

If the name doesn't appear in the right spot, edit `server/utils/pdfGenerator.js`:

```javascript
// Change these values:
const centerY = canvas.height / 2;  // Adjust Y position
ctx.font = 'bold 60px Arial';       // Adjust font size
ctx.fillStyle = '#000000';          // Change text color
```

## Testing

1. Register a test user
2. Go to Admin dashboard
3. Click "Send Cert" for that user
4. Check the email inbox

## Troubleshooting

If certificate generation fails:
- Ensure PNG files exist in the correct location
- Check server console for errors
- Verify canvas package is installed: `npm install canvas`
