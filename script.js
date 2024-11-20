let trajectoryGraph; // Declare a variable to hold the chart instance
let points = []; // Declare points array to hold trajectory points

document.getElementById('calculateBtn').addEventListener('click', function() {
    // Clear previous results
    document.getElementById('timeOfFlight').innerText = '';
    document.getElementById('maxHeight').innerText = '';
    document.getElementById('horizontalRange').innerText = '';
    document.getElementById('velocityList').innerHTML = ''; // Clear previous velocity list

    // Get user inputs
    const u = parseFloat(document.getElementById('initialVelocity').value);
    const angle = parseFloat(document.getElementById('angle').value);
    const h = parseFloat(document.getElementById('initialHeight').value);
    const g = 9.8; // acceleration due to gravity in m/s²

    // Convert angle to radians
    const theta = angle * (Math.PI / 180);

    // Calculate time of flight
    const timeOfFlight = (u * Math.sin(theta) + Math.sqrt((u * Math.sin(theta)) ** 2 + 2 * g * h)) / g;

    // Calculate max height
    const maxHeight = h + (u ** 2 * Math.sin(theta) ** 2) / (2 * g);

    // Calculate horizontal range
    const horizontalRange = (u ** 2 * Math.sin(2 * theta)) / g;

    // Display results
    document.getElementById('timeOfFlight').innerText = `Time of Flight: ${timeOfFlight.toFixed(2)} s`;
    document.getElementById('maxHeight').innerText = `Maximum Height: ${maxHeight.toFixed(2)} m`;
    document.getElementById('horizontalRange').innerText = `Horizontal Range: ${horizontalRange.toFixed(2)} m`;

    // Clear previous graph
    const ctx = document.getElementById('trajectoryGraph').getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Calculate trajectory points
    points = [];
    const timeSteps = 100; // Number of points to calculate
    for (let i = 0; i <= timeSteps; i++) {
        const t = (i / timeSteps) * timeOfFlight; // Current time
        const x = u * Math.cos(theta) * t; // Horizontal distance
        const y = h + (u * Math.sin(theta) * t) - (0.5 * g * t ** 2); // Vertical position
        points.push({ x, y });
    }

    // Prepare data for the graph
    const data = {
        labels: points.map((point, index) => (index * (timeOfFlight / timeSteps)).toFixed(2)), // Time labels
        datasets: [{
            label: 'Projectile Trajectory',
            data: points.map(point => point.y),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            fill: true,
            tension: 0.4 // Smooth curve
        }]
    };

    // Destroy the previous chart instance if it exists
    if (trajectoryGraph) {
        trajectoryGraph.destroy();
    }

    // Create a new chart with animation
    trajectoryGraph = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            animation: {
                duration: 1500, // Animation duration in milliseconds
                easing: 'easeOutBounce', // Easing function for the animation
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time (s)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Height (m)'
                    },
                    beginAtZero: true
                }
            }
        }
    });

    // Calculate and display velocity at each second from 1 to 10 seconds
    for (let i = 1; i <= 10; i++) {
        const time = i; // Current time in seconds
        const velocityAtTime = u * Math.cos(theta) - g * time;
        const velocityListItem = document.createElement('li');
        velocityListItem.textContent = `Velocity at ${time} s: ${velocityAtTime.toFixed(2)} m/s`;
        document.getElementById('velocityList').appendChild(velocityListItem);
    }
});