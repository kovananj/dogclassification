function checkFiles(files) {
    console.log(files);

    if (files.length != 1) {
        showAlert('Bitte genau eine Datei hochladen.', 'danger');
        return;
    }

    const fileSize = files[0].size / 1024 / 1024; // in MiB
    if (fileSize > 10) {
        showAlert('Datei zu gross (max. 10Mb)', 'danger');
        return;
    }

    document.getElementById('answerPart').style.visibility = 'visible';
    const file = files[0];

    // Preview
    if (file) {
        document.getElementById('preview').src = URL.createObjectURL(files[0]);
    }

    // Upload
    const formData = new FormData();
    formData.append('image', file);

    fetch('/analyze', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
      .then(data => {
          console.log(data);
          displayResults(data);
      })
      .catch(error => {
          console.log(error);
          showAlert('Fehler beim Hochladen der Datei.', 'danger');
      });
}

function showAlert(message, type) {
    const alerts = document.getElementById('alerts');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.appendChild(document.createTextNode(message));
    alerts.appendChild(alert);

    setTimeout(() => alert.remove(), 3000);
}

function displayResults(data) {
    const answerElement = document.getElementById('answer');
    answerElement.innerHTML = ''; // Clear previous results

    data.forEach(item => {
        const className = item.className.replace(/_/g, ' '); // Replace underscores with spaces
        const probability = (item.probability * 100).toFixed(2); // Convert to percentage

        const resultDiv = document.createElement('div');
        resultDiv.className = 'result-item';

        const classNameElement = document.createElement('h5');
        classNameElement.textContent = className;

        const probabilityElement = document.createElement('p');
        probabilityElement.textContent = `Probability: ${probability}%`;

        resultDiv.appendChild(classNameElement);
        resultDiv.appendChild(probabilityElement);
        answerElement.appendChild(resultDiv);
    });
}
