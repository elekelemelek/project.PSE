// variables
const serverUrl = "http://localhost:3000/userActions";

// downloading data from server
function getUserActions() {
  fetch(serverUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch user actions data");
      }
      return response.json();
    })
    .then((userActionsData) => {
      // Process and use the user actions data
      const reportContainer = document.getElementById("report-container");
      const reportHTML = generateReportHTML(userActionsData);

      // Inject the report into the container
      reportContainer.innerHTML = reportHTML;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// generating report
function generateReportHTML(userActionsData) {
  const totalUsers = new Set(userActionsData.map((action) => action.userId))
    .size;
  const scrollActions = userActionsData.filter(
    (action) => action.type === "avatarScroll"
  );
  const scrolledUsers = new Set(scrollActions.map((action) => action.userId))
    .size;
  console.log(scrolledUsers, totalUsers);
  const percentageScrolled = (scrolledUsers / totalUsers) * 100;

  let reportHTML = `
    <h2>User Actions Report</h2>
    <table>
      <thead>
        <tr>
          <th>Total Users</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${totalUsers}</td>
        </tr>
      </tbody>
    </table>

    <table>
      <thead>
        <tr>
          <th>Percentage of Users Who Scrolled</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${percentageScrolled.toFixed(2)}%</td>
        </tr>
      </tbody>
    </table>

    <h3>User Actions Data</h3>
    <table>
      <thead>
        <tr>
          <th>User ID</th>
          <th>Type</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
  `;

  // Iterate through user actions data and populate the table rows
  userActionsData.forEach((action) => {
    reportHTML += `
        <tr>
          <td>${action.userId}</td>
          <td>${action.type}</td>
          <td>${action.timestamp}</td>
        </tr>
    `;
  });

  reportHTML += `
      </tbody>
    </table>
  `;

  return reportHTML;
}

getUserActions();
