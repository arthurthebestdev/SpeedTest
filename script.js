document.getElementById('startTest').addEventListener('click', function() {
  const resultsElement = document.getElementById('results');
  resultsElement.classList.add('visible'); 

  performSpeedTest(); 
});

async function performSpeedTest() {
  const downloadSpeed = await measureSpeedWithLiveUpdates('download.php');
  document.getElementById('download-speed').textContent = `${downloadSpeed.toFixed(2)} Mbps (avg)`;

  const uploadSpeed = await measureSpeedWithLiveUpdates('upload.php', true);
  document.getElementById('upload-speed').textContent = `${uploadSpeed.toFixed(2)} Mbps (avg)`;
}

async function measureSpeedWithLiveUpdates(url, isUpload = false) {
  let testEndTime = Date.now() + 15000; 
  let resultElementId = isUpload ? 'upload-speed' : 'download-speed';

  while (Date.now() < testEndTime) {
    const startTime = Date.now();
    const response = await fetch(url, {
      method: isUpload ? 'POST' : 'GET',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: isUpload ? new Blob([new Uint8Array(1024 * 256)]) : null 
    });
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000; 
    const dataSize = isUpload ? 1024 * 256 * 8 : (await response.text()).length * 8; 
    const speedMbps = dataSize / (1024 * 1024) / duration; 
    speeds.push(speedMbps);


    document.getElementById(resultElementId).textContent = `${speedMbps.toFixed(2)} Mbps`;

   
    await new Promise(resolve => setTimeout(resolve, 1000));
  }


  const averageSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
  return averageSpeed;
}
