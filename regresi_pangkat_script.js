let regressionChart; // Deklarasikan variabel grafik secara global

function addRow() {
    const table = document.getElementById('data-table').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    newRow.innerHTML = '<td><input type="number" class="x-value" min="0"></td><td><input type="number" class="y-value" min="0"></td>';
}

function resetFields() {
    const xInputs = document.querySelectorAll('.x-value');
    const yInputs = document.querySelectorAll('.y-value');
    
    xInputs.forEach(input => input.value = '');
    yInputs.forEach(input => input.value = '');
    
    document.getElementById('result').innerHTML = '';
    document.getElementById('result-table').style.display = 'none';
    
    if (regressionChart) { // Periksa jika grafik ada sebelum menghancurkannya
        regressionChart.destroy();
        regressionChart = null; // Set ke null setelah dihancurkan
        document.getElementById('regressionChart').style.display = 'none';
    }
}

function getInputData() {
    const xValues = Array.from(document.querySelectorAll('.x-value')).map(input => parseFloat(input.value));
    const yValues = Array.from(document.querySelectorAll('.y-value')).map(input => parseFloat(input.value));

    // Validasi input
    if (xValues.includes(NaN) || yValues.includes(NaN) || xValues.some(x => x <= 0) || yValues.some(y => y <= 0)) {
        alert('Masukkan semua nilai X dan Y dengan angka yang valid dan positif.');
        return null;
    }
    return { xValues, yValues };
}

function calculateRegression() {
    const data = getInputData();
    if (!data) return;

    const { xValues, yValues } = data;
    
    // Hitung regresi pangkat
    const logX = xValues.map(x => Math.log(x));
    const logY = yValues.map(y => Math.log(y));
    
    const { slope: b, intercept: lnA } = linearRegression(logX, logY);
    const a = Math.exp(lnA);

    displayResult(`Model Regresi Pangkat: Y = ${a.toFixed(4)} \u22C5 X<sup>${b.toFixed(4)}</sup>`);
    
    // Hitung regresi linier
    const { slope: linearSlope, intercept: linearIntercept } = calculateLinearRegression(xValues, yValues);
    
    displayTable(xValues, yValues, logX, logY);
    
    drawChart(xValues, yValues, a, b, linearSlope, linearIntercept);
}

function linearRegression(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
}
function calculateLinearRegression(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
}

function calculateRegression() {
    const data = getInputData();
    if (!data) return;

    const { xValues, yValues } = data;
    
    // Hitung regresi pangkat
    const logX = xValues.map(x => Math.log(x));
    const logY = yValues.map(y => Math.log(y));
    
    const { slope: b, intercept: lnA } = linearRegression(logX, logY);
    const a = Math.exp(lnA);

    displayResult(`Model Regresi Pangkat: Y = ${a.toFixed(4)} ⋅ X<sup>${b.toFixed(4)}</sup>`);
    
    // Hitung regresi linier
    const { slope: linearSlope, intercept: linearIntercept } = calculateLinearRegression(xValues, yValues);
    
    // Hitung nilai yang diprediksi untuk MSE dan R²
    const predictedValues = xValues.map(x => a * Math.pow(x, b));
    
    // Hitung MSE
    //const mse = predictedValues.reduce((sum, predicted, i) => sum + Math.pow(yValues[i] - predicted, 2), 0) / yValues.length;

    // Hitung R²
    const meanY = yValues.reduce((sum, value) => sum + value, 0) / yValues.length;
    const ssTot = yValues.reduce((sum, value) => sum + Math.pow(value - meanY, 2), 0);
    const ssRes = predictedValues.reduce((sum, predicted, i) => sum + Math.pow(yValues[i] - predicted, 2), 0);
    const rSquared = 1 - (ssRes / ssTot);

    displayTable(xValues, yValues, logX, logY);
    
    drawChart(xValues, yValues, a, b, linearSlope, linearIntercept);

    // Tampilkan MSE dan R²
    displayMetrics(rSquared);
}

function displayMetrics(rSquared) {
    const metricsDiv = document.getElementById('result');
    metricsDiv.innerHTML += `<br><strong>R²:</strong> ${rSquared.toFixed(4)}`;
}

function displayMetrics(rSquared) {
    const metricsDiv = document.getElementById('result');
    metricsDiv.innerHTML += `<br><strong>R²:</strong> ${rSquared.toFixed(4)}`;
}



function displayResult(message) {
    document.getElementById('result').innerHTML = message;
}

function displayTable(x, y, lnX, lnY) {
    const tbody = document.getElementById('result-table').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    let sumX = 0;
    let sumY = 0;
    let sumLnX = 0;
    let sumLnY = 0;
    let sumLnX2 = 0;
    let sumLnXlnY = 0;

    x.forEach((xi, i) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${xi}</td>
            <td>${y[i]}</td>
            <td>${lnX[i].toFixed(4)}</td>
            <td>${lnY[i].toFixed(4)}</td>
            <td>${(lnX[i] ** 2).toFixed(4)}</td>
            <td>${(lnX[i] * lnY[i]).toFixed(4)}</td>
        `;

        // Hitung jumlah untuk setiap kolom
        sumX += xi;
        sumY += y[i];
        sumLnX += lnX[i];
        sumLnY += lnY[i];
        sumLnX2 += (lnX[i] ** 2);
        sumLnXlnY += (lnX[i] * lnY[i]);
    });

    // Tambahkan baris sigma
    const sigmaRow = tbody.insertRow();
    sigmaRow.innerHTML = `
        <td><strong>Σ</strong></td>
        <td><strong>${sumY}</strong></td>
        <td><strong>${sumLnX.toFixed(4)}</strong></td>
        <td><strong>${sumLnY.toFixed(4)}</strong></td>
        <td><strong>${sumLnX2.toFixed(4)}</strong></td>
        <td><strong>${sumLnXlnY.toFixed(4)}</strong></td>
    `;

    document.getElementById('result-table').style.display = 'table';
}


function drawChart(xValues, yValues, a, b, linearSlope, linearIntercept) {
    const canvas = document.getElementById('regressionChart');
    const ctx = canvas.getContext('2d');

   // Tampilkan canvas
   canvas.style.display = 'block';

   // Mengurutkan nilai X untuk grafik
   const sortedX = [...xValues].sort((a, b) => a - b);
   
   // Hitung nilai Y untuk kurva regresi pangkat
   const regressionY = sortedX.map(x => a * Math.pow(x, b));
   
   // Hitung nilai Y untuk garis regresi linier
   const linearY = sortedX.map(x => linearSlope * x + linearIntercept);

   // Hapus grafik lama jika ada
   if (regressionChart) {
       regressionChart.destroy(); // Hancurkan grafik sebelumnya
   }

   // Buat grafik baru
   regressionChart = new Chart(ctx, {
       type: 'scatter',
       data: {
           datasets: [
               {
                   label: 'Data Asli',
                   data: xValues.map((x, i) => ({ x: parseFloat(x.toFixed(2)), y: parseFloat(yValues[i].toFixed(2)) })),
                   backgroundColor: 'rgba(255, 99, 132)',
                   pointRadius: 5
               },
               {
                   label: 'Kurva Regresi Pangkat',
                   data: sortedX.map((x) => ({ x: parseFloat(x.toFixed(2)), y: parseFloat(regressionY[sortedX.indexOf(x)].toFixed(2)) })),
                   type: 'line',
                   borderColor: 'rgba(54, 162, 235)',
                   tension: 0.4,
                   fill: false,
                   pointRadius: 0
               },
               {
                   label: 'Garis Regresi Linier',
                   data: sortedX.map((x) => ({ x: parseFloat(x.toFixed(2)), y: parseFloat(linearY[sortedX.indexOf(x)].toFixed(2)) })),
                   type: 'line',
                   borderColor: 'rgba(75, 192, 192)',
                   tension: 0.4,
                   fill: false,
                   pointRadius: 0
               }
           ]
       },
       options: {
           responsive: true,
           plugins: {
               legend: {
                   display: true,
                   position: 'top'
               }
           },
           scales: {
               x: {
                   type: 'linear',
                   position: 'bottom',
                   title: {
                       display: true,
                       text: 'Nilai X'
                   }
               },
               y: {
                   title: {
                       display: true,
                       text: 'Nilai Y'
                   }
               }
           }
       }
   });
}
