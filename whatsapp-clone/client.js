// Kwiyandikisha mu client.js cyangwa muri component
async function subscribeToPushNotifications() {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.log('Notification permission denied.');
    return;
  }

  if ('serviceWorker' in navigator && 'PushManager' in window) {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array('YOUR_PUBLIC_VAPID_KEY'), // Iyi key ni VAPID key
    });

    await fetch('http://YOUR_TERMMUX_IP_ADDRESS:3000/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });
  }
}
