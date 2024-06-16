document.addEventListener("DOMContentLoaded", () => {
    const app = document.getElementById("app");
    const converterLink = document.getElementById("converter-link");
    const ratesLink = document.getElementById("rates-link");

    const loadConverterPage = () => {
        app.innerHTML = `
            <h1>Currency Converter</h1>
            <input type="text" id="conversion-input" placeholder="e.g., 15 usd in rub">
            <button id="convert-button">Convert</button>
            <div id="conversion-result"></div>
        `;

        document.getElementById("convert-button").addEventListener("click", async () => {
            const input = document.getElementById("conversion-input").value;
            const [amount, from, , to] = input.split(" ");
            const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from.toUpperCase()}`);
            const data = await response.json();
            const rate = data.rates[to.toUpperCase()];
            const result = `${amount} ${from.toUpperCase()} = ${(amount * rate).toFixed(2)} ${to.toUpperCase()}`;
            document.getElementById("conversion-result").textContent = result;
        });
    };

    const loadRatesPage = async () => {
        app.innerHTML = `
            <h1>Exchange Rates</h1>
            <select id="base-currency">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="RUB">RUB</option>
            </select>
            <div id="rates"></div>
        `;

        const fetchRates = async (baseCurrency) => {
            const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
            const data = await response.json();
            const ratesDiv = document.getElementById("rates");
            ratesDiv.innerHTML = "";
            for (const [currency, rate] of Object.entries(data.rates)) {
                const rateElement = document.createElement("div");
                rateElement.textContent = `${currency}: ${rate}`;
                ratesDiv.appendChild(rateElement);
            }
        };

        document.getElementById("base-currency").addEventListener("change", (event) => {
            fetchRates(event.target.value);
        });

        await fetchRates("USD");
    };

    converterLink.addEventListener("click", (event) => {
        event.preventDefault();
        loadConverterPage();
    });

    ratesLink.addEventListener("click", (event) => {
        event.preventDefault();
        loadRatesPage();
    });

    // Load the default page
    loadConverterPage();
});
