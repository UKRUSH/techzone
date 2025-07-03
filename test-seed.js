fetch('http://localhost:3001/api/seed', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
})
.then(response => response.json())
.then(data => {
  console.log('Seed result:', data);
})
.catch(error => {
  console.error('Error:', error);
});
