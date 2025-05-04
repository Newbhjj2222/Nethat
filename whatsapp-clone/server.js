const express = require('express');
const webPush = require('web-push');

const app = express();
app.use(express.json());

// Gushyiraho VAPID keys (Bikenewe kubikora byihariye)
const vapidKeys = webPush.generateVAPIDKeys();

// Shyiraho VAPID keys yawe (Bikenewe kandi)
webPush.setVapidDetails(
  'mailto:youremail@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Endpoint yo kwakira subscription
app.post('/subscribe', (req, res) => {
  const subscription = req.body;

  // Payload ya notification
  const payload = JSON.stringify({
    title: 'You have a new message!',
    body: 'Check out your notifications!',
  });

  // Kohereza notification
  webPush.sendNotification(subscription, payload)
    .then(() => res.status(200).json({ message: 'Notification sent successfully!' }))
    .catch((err) => {
      console.log('Error sending notification:', err);
      res.status(500).json({ message: 'Failed to send notification' });
    });
});

// Server itegereje ku port 3000
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
