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
                <-- ! -->
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
                ${pageNumber == start ? 
                    'class="active"' : ''
                } 
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