let controller; // Declare the controller outside to reuse it

document.getElementById("startRequest").addEventListener("click", () => {
    // Initialize the AbortController
    controller = new AbortController();
    const signal = controller.signal;

    // Update status and enable the Cancel button
    document.getElementById("status").innerText = "Status: Request in progress...";
    const cancelButton = document.getElementById("cancelRequest");
    cancelButton.disabled = false;
    cancelButton.classList.add("enabled");

    // Send the request to the API
    fetch("https://localhost:7026/api/AdvancedQualityDevelopTest/long-running-operation", { signal })
        .then((response) => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error("Request was canceled or failed.");
            }
        })
        .then((data) => {
            document.getElementById("status").innerText = `Status: ${data}`;
        })
        .catch((err) => {
            if (err.name === "AbortError") {
                document.getElementById("status").innerText = "Status: Request canceled.";
            } else {
                document.getElementById("status").innerText = `Status: Error - ${err.message}`;
            }
        })
        .finally(() => {
            // Disable Cancel button after the request completes
            cancelButton.disabled = true;
            cancelButton.classList.remove("enabled");
        });
});

document.getElementById("cancelRequest").addEventListener("click", () => {
    if (controller) {
        controller.abort(); // Cancel the request
        document.getElementById("status").innerText = "Status: Request canceled.";
        const cancelButton = document.getElementById("cancelRequest");
        cancelButton.disabled = true;
        cancelButton.classList.remove("enabled");
    }
});
