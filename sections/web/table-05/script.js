const trades = [
    {
        stock: {
            src: 'assets/tesla.png',
            ticker: 'TSLA',
            name: 'Tesla Inc.',
        },
        price: 205.43,
        quantity: 15,
        type: 'buy',
        status: 'completed',
        orderDate: '2024-06-04T12:00:00',
    },
    {
        stock: {
            src: 'assets/apple.png',
            ticker: 'AAPL',
            name: 'Apple Inc.',
        },
        price: 220.15,
        quantity: 30,
        type: 'buy',
        orderType: 'limit',
        status: 'completed',
        orderDate: '2024-07-04T12:00:00',
    },
    {
        stock: {
            src: 'assets/google.png',
            ticker: 'GOOG',
            name: 'Alphabet Inc.',
        },
        price: 187.39,
        quantity: 100,
        type: 'buy',
        orderType: 'limit',
        status: 'completed',
        orderDate: '2024-07-04T12:00:00',
    },
 
    {
        stock: {
            src: 'assets/shell.png',
            ticker: 'SHELL',
            name: 'Shell Plc.',
        },
        price: 33.25,
        quantity: 100,
        type: 'sell',
        status: 'completed',
        orderDate: '2024-06-05T10:00:00',
    },
    {
        stock: {
            src: 'assets/oxy.png',
            ticker: 'OXY',
            name: 'Occidental',
        },
        price: 62.39,
        quantity: 200,
        type: 'buy',
        orderType: 'limit',
        status: 'completed',
        orderDate: '2024-07-04T12:00:00',
    },
    {
        stock: {
            src: 'assets/nvidia.png',
            ticker: 'NVDA',
            name: 'NVidia Corp.',
        },
        price: 205.43,
        quantity: 15,
        type: 'buy',
        status: 'completed',
        orderDate: '2024-07-03T11:00:00',
    },
 
  
    {
        stock: {
            src: 'assets/google.png',
            ticker: 'GOOG',
            name: 'Alphabet Inc.',
        },
        price: 187.39,
        quantity: 50,
        type: 'sell',
        orderType: 'limit',
        status: 'completed',
        orderDate: '2024-07-04T12:00:00',
    },
    {
        stock: {
            src: 'assets/apple.png',
            ticker: 'AAPL',
            name: 'Apple Inc.',
        },
        price: 225.15,
        quantity: 15,
        type: 'sell',
        orderType: 'limit',
        status: 'completed',
        orderDate: '2024-07-12T12:00:00',
    },
];

const tableWidget = document.getElementsByClassName('table-widget');

const itemsOnPage = 4;

const numberOfPages = Math.ceil(trades.length / itemsOnPage);

const start = (new URLSearchParams(window.location.search)).get('page') || 1;

const mappedRecords = trades
    .filter((_, i) => (
        ((start - 1) * itemsOnPage) < i + 1) && 
        (i+1 <= start * itemsOnPage)
    )
    .map(
        (trade) => {
            return `<tr>
                <td class="team-member-profile">
                    <img
                        src="${trade.stock.src}"
                        alt="${trade.stock.name}"
                    >
                    <span class="profile-info">
                        <span class="profile-info__name">
                            ${trade.stock.ticker}
                        </span>
                        <span class=profile-info__alias>
                            ${trade.stock.name}
                        </span>
                    </span>
                </td>
                <td>
                    <div class='order-type order-type--${trade.type}'>
                        ${trade.type.toUpperCase()}
                    </div>
                </td>
                <td>
                    ${trade.quantity}
                </td>
                <td>
                    ${trade.price}
                </td>
                <td>
                    ${Math.round(trade.quantity * trade.price * 100) / 100}
                </td>
                <td>
                    ${new Date(trade.orderDate).toLocaleDateString('en-us', 
                        {
                            'weekday': 'short',
                            'year': 'numeric', 
                            'month': 'short', 
                            'day': 'numeric',
                        }
                    )}
                </td>
            </tr>`;
        }
    );


const linkList = [];

for (let i = 0; i < numberOfPages; i++) {
    const pageNumber = i + 1;
    linkList.push(
        `<li>
            <a
                href="?page=${pageNumber}" 
                ${pageNumber == start ? 'class="active"' : ''} 
                title="page ${pageNumber}">
                ${pageNumber}
            </a>
        </li>`
    );
}

const table = DOMPurify.sanitize(`
    <table>
        <caption>
            All Trades
            <div class="table-row-count">
                <div class="status"></div>
                (${trades.length}) Trades
            </div>
        </caption> 
        <thead>
            <tr>
                <th>Stock</th>
                <th>Order Type</th>
                <th>Quantity</th>
                <th>Price [$]</th>
                <th>Trade Value [$]</th>
                <th>Order Date</th>
            </tr>
        </thead>
        <tbody id="table-rows">
            ${mappedRecords.join('')}
        </tbody>
        <tfoot>
            <tr>
                <td colspan="6">
                    <ul class="pagination">
                        <!--? generated pages -->
                        ${linkList.join('')}
                    </ul>
                </td>
            </tr>
        </tfoot>
</table>`);

tableWidget[0].innerHTML = table;