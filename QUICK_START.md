# Quick Start Guide

Your Backpack App is ready! 🎉

## The app is now running at: http://localhost:4321

## What to do next:

1. **Open your browser** and go to `http://localhost:4321`

2. **Create an account**:
   - Click "Register"
   - Choose a username (3-31 characters, letters/numbers/hyphens/underscores)
   - Choose a password (minimum 6 characters)

3. **Try the features**:
   - After registering, you'll be logged in automatically
   - Click "Dashboard" to save and manage data
   - Test the API by saving some key-value pairs

## Example: Testing the Dashboard

1. Go to the Dashboard
2. In the "Save Data" form:
   - Key: `note`
   - Value: `{"title": "My First Note", "content": "Hello from Backpack!"}`
3. Click "Save Data"
4. Click "Load All Data" to see your saved data
5. Try adding more entries or deleting existing ones

## API Usage Example

Once you're logged in, you can use the API programmatically:

```javascript
// Save data
await fetch('/api/data/save', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    key: 'settings',
    value: { theme: 'dark', language: 'en' }
  })
});

// Get all data
const response = await fetch('/api/data/get');
const result = await response.json();
console.log(result.data);

// Get specific key
const response = await fetch('/api/data/get?key=settings');
const result = await response.json();
console.log(result.data.value);

// Delete data
await fetch('/api/data/delete?key=settings', {
  method: 'DELETE'
});
```

## Stop the server

To stop the development server, press `Ctrl+C` in the terminal.

## What you got:

✅ Full-stack Bun + Astro app
✅ User registration and login
✅ Session management with Lucia
✅ SQLite database
✅ RESTful API endpoints
✅ Protected routes
✅ Dashboard UI for data management

Enjoy building with your new app! 🚀
