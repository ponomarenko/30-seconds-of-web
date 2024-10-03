const transactions = [
    {
        src: 'assets/profile.jpg',
        name: 'James Alexander',
        alias: '@james',
        amount: '$1,000',
        email: 'james@example.com',
        status: 'completed',
        date: '2023-10-20T16:12:00Z',
    },
    // transactions
];

const tableWidget = document.getElementsByClassName('table-widget');

const itemsOnPage = 5;

const numberOfPages = Math.ceil(transactions.length / itemsOnPage);

const start = (new URLSearchParams(window.location.search)).get('page') || 1;

const mappedRecords = transactions
    .filter((_, i) => (
        ((start - 1) * itemsOnPage) < i + 1) && 
        (i+1 <= start * itemsOnPage)
    )
    .map(
        (teamMember) => {
            
            return `<tr>
                <td class="team-member-profile">
                    <img
                        src="${teamMember.src}"
                        alt="${teamMember.name}"
                    >
                    <span class="profile-info">
                        <span class="profile-info__name">
                            ${teamMember.name}
                        </span>
                        <span class=profile-info__alias>
                            ${teamMember.email}
                        </span>
                    </span>
                </td>
                <td>
                    ${teamMember.amount}
                </td>
                <td>
                    <span
                        class="status status--${teamMember.status}"
                    >
                        ${teamMember.status}
                    </span>
                </td>
                <td>
                    ${new Date(teamMember.date).toLocaleDateString('en-us', 
                        {
                            'weekday': 'short',
                            'year': 'numeric', 
                            'month': 'short', 
                            'day': 'numeric',
                            'hour': 'numeric',
                            'minute': 'numeric',
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

const table = DOMPurify.sanitize(`<table>
    <caption>
        Transactions
        <span class="table-row-count">(${transactions.length})</span>
    </caption> 
    <thead>
        <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Processed</th>
        </tr>
    </thead>
    <tbody id="table-rows">
        ${mappedRecords.join('')}
    </tbody>
    <tfoot>
        <tr>
            <td colspan="4">
                <ul class="pagination">
                    <!--? generated pages -->
                    ${linkList.join('')}
                </ul>
            </td>
        </tr>
    </tfoot>
</table>`);

tableWidget[0].innerHTML = table;