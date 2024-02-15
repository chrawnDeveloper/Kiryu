const currencies = [
    { code: "USD", name: "American Dollar - USD" },
    { code: "BRL", name: "Brazilian Real - BRL" },
    { code: "EUR", name: "Euro - EUR" },
];

function preencherSelect(idSelect, arrayCurrencies) {
    const select = document.getElementById(idSelect);

    arrayCurrencies.forEach(currency => {
        
        const option = document.createElement("option");
        option.value = currency.code;
        option.textContent = currency.name;
        select.appendChild(option);
    });
}

preencherSelect("originCurrency", currencies);
preencherSelect("destinyCurrency", currencies);

async function convertCurrency() {
    try {
        const originCurrency = document.getElementById('originCurrency').value;
        const destinyCurrency = document.getElementById('destinyCurrency').value;
        const value = document.getElementById('value').value;

        if(value == '' || value == null || value <= 0){
            alert("Enter a valid amount.");
        }

        else if(!(originCurrency == destinyCurrency)){

            const response = await fetch(`https://economia.awesomeapi.com.br/last/${originCurrency}-${destinyCurrency}`);
            const quoteResponse = await fetch(`https://economia.awesomeapi.com.br/json/daily/${originCurrency}-${destinyCurrency}/1`);
            const quoteJson = await quoteResponse.json();
            const data = await response.json();
            const quote = quoteJson[0];

            const title = buildTitle(quote, originCurrency, destinyCurrency);
    
            const exchangeRate = data[`${originCurrency}${destinyCurrency}`].bid;
            const results = value * exchangeRate;

           buildResultsInfoCicle(originCurrency, destinyCurrency, results, value, title, true);

        }
        else{

            buildResultsInfoCicle(originCurrency, null, null, value, null, false);

        }

    } catch (error) {
        console.error('Error in the currency conversion.', error.message);
        alert("Error in the currency conversion.");
    }

}

function limitInput(elemento, tamanhoMaximo) {
    if (elemento.value.length > tamanhoMaximo) {
        elemento.value = elemento.value.slice(0, tamanhoMaximo);
    }
}

function buildTitle(quote, originCurrency, destinyCurrency){

    const formattedValue1 = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: originCurrency,
    }).format(1);

    const formattedValue2 = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: destinyCurrency,
    }).format(quote.bid);


    const title = `Last Quote: ${originCurrency}-${destinyCurrency} (${quote.create_date})\n\n`+
    `${formattedValue1} ≅ ${formattedValue2} (Purchase)\n` +
    "Maximum: " + quote.high + "\n" +
    "Minimun: " + quote.low + "\n" +
    "Purchase: " + quote.bid + "\n" +
    "Sale: " + quote.ask + "\n\n" +
    "Value: " + quote.varBid + "\n" +
    "Percentage: " + quote.pctChange + "%\n" +
    "(Variation)";

    return title;
}

function buildResultsInfoCicle(originCurrency, destinyCurrency, results, value, title, cond){

    const infoCircle = document.getElementById('infoCircle');

    const formattedValue = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: originCurrency,
    }).format(value);
    
    document.getElementById('results').style.color = 'white';

    if(!cond){

        document.getElementById('results').innerHTML = `${`<span style="color: white;">${formattedValue}</span>`} = ${`<span style="color: #00CC00;">${formattedValue}</span>`}`;
        infoCircle.style.display = 'none';

    }
    else{

    const formattedsResults = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: destinyCurrency,
    }).format(results);


    document.getElementById('results').innerHTML = ` ${`<span style="color: white;">${formattedValue}</span>`} = ${`<span style="color: #00CC00;">${formattedsResults}</span>`}`;  

    infoCircle.style.display = 'inline-block';
    infoCircle.setAttribute('title', title);
    infoCircle.style.height = '16px';

}

}
