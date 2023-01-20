$(document).ready(function () {
  const tableBody = $("#tableBody");
  const tableHeadID = $("#tableHeadID");
  const tableHeadFname = $("#tableHeadFname");
  const tableHeadLName = $("#tableHeadLName");
  const tableHeadEmail = $("#tableHeadEmail");
  const creationModal = $("#creationModal");
  const creationModalSubmitButton = $("#creationModal-submitButton");
  const creationModalEmailInput = $("#creationModal-emailInput");
  const creationModalFnameInput = $("#creationModal-fnameInput");
  const creationModalLnameInput = $("#creationModal-lnameInput");
  const showInfoModal = $("#showInfoModal");
  const showInfoModalLabel = $("#showInfoModalLabel");
  const showInfoModalBody = $("#showInfoModalBody");
  const removeBtn = $("#removeBtn");
  const editBtn = $("#editBtn");
  const updateBtn = $("#updateBtn");
  const editFields = [
    {
      fieldname: "first_name",
      fieldId: "editModal-fnameInput",
      label: "FirstName *",
      type: "text",
    },
    {
      fieldname: "last_name",
      fieldId: "editModal-lnameInput",
      label: "LastName *",
      type: "text",
    },
    {
      fieldname: "email",
      fieldId: "editModal-emailInput",
      label: "Email *",
      type: "email",
    },
  ];
  let idCounter = calculateMaxId();
  let selectedId = -1;

  function calculateMaxId() {
    let ids = users.map((el) => el.id);
    let max = Math.max.apply({}, ids);
    return max + 1;
  }

  creationModalSubmitButton.on("click", () => {
    const newUser = {
      id: idCounter,
      first_name: creationModalFnameInput.val().trim(),
      last_name: creationModalLnameInput.val().trim(),
      email: creationModalEmailInput.val().trim(),
    };
    if (!newUser.first_name || !newUser.last_name || !newUser.email) {
      alert("Invalid inputs");
      return null;
    }
    if (!!users.find((el) => el.email === newUser.email)) {
      alert("User already exist");
      return null;
    }
    idCounter += 1;
    users.push(newUser);
    creationModal.modal("hide");
    creationModalFnameInput.val("");
    creationModalLnameInput.val("");
    creationModalEmailInput.val("");
    tableBodyRenderer();
  });

  const inputGenerator = (id, label, value, type) => {
    return `
    <div class="mb-3">
      <label for="creationModal-lnameInput" class="form-label"
        >${label}</label
      >
      <input
        type="${type}"
        class="form-control"
        id="${id}"
        value="${value}"
      />
    </div>
    `;
  };

  const editModeBodyGenerator = (user) => {
    let html = "";
    for (const field of editFields) {
      let value = user[field.fieldname];
      html += inputGenerator(field.fieldId, field.label, value, field.type);
    }
    showInfoModalBody.html(html);
  };

  const infoModalBodyGenerator = (user) => {
    return `
        <p>FirstName: ${user.first_name}</p>
        <p>LastName: ${user.last_name}</p>
        <p>Email: ${user.email}</p>
    `;
  };

  updateBtn.on("click", function () {
    let newUserInformation = { id: selectedId };
    for (const field of editFields) {
      let value = $(`#${field.fieldId}`).val();
      newUserInformation[field.fieldname] = value;
    }
    const duplicatedUser = users.find(
      (el) => el.email === newUserInformation.email && el.id !== selectedId
    );
    if (!!duplicatedUser) {
      alert("User already exist");
      return null;
    }
    users = users.map((el) => {
      if (el.id === selectedId) {
        return newUserInformation;
      }
      return el;
    });
    tableBodyRenderer();
    showInfoModal.modal("hide");
  });

  editBtn.on("click", function () {
    removeBtn.removeClass("d-none");
    updateBtn.removeClass("d-none");
    editBtn.addClass("d-none");
    const targetUser = users.find((el) => el.id === selectedId);
    editModeBodyGenerator(targetUser);
  });

  removeBtn.on("click", function () {
    users = users.filter((el) => el.id !== selectedId);
    tableBodyRenderer();
  });

  this.handleOnClickTableRow = (id) => {
    selectedId = id;
    showInfoModalLabel.text(`UserId: ${selectedId}`);
    const targetUser = users.find((el) => el.id === id);
    showInfoModalBody.html(infoModalBodyGenerator(targetUser));

    removeBtn.addClass("d-none");
    updateBtn.addClass("d-none");
    editBtn.removeClass("d-none");
  };
  const rowGenerator = (user) => {
    return `
      <tr data-bs-toggle="modal" data-bs-target="#showInfoModal" onclick="handleOnClickTableRow(${user.id})">
        <th scope="row">1</th>
        <td>${user.id}</td>
        <td>${user.first_name}</td>
        <td>${user.last_name}</td>
        <td>${user.email}</td>
      </tr>
      `;
  };

  const tableBodyRenderer = () => {
    let html = "";

    for (const user of users) {
      html += rowGenerator(user);
    }

    tableBody.html(html);
  };

  const sortEvents = () => {
    tableHeadID.on("click", function () {
      users.sort((a, b) => a.id - b.id);
      tableBodyRenderer();
    });
    tableHeadFname.on("click", function () {
      users.sort((a, b) => a.first_name.localeCompare(b.first_name));
      tableBodyRenderer();
    });
    tableHeadLName.on("click", function () {
      users.sort((a, b) => a.last_name.localeCompare(b.last_name));
      tableBodyRenderer();
    });
    tableHeadEmail.on("click", function () {
      users.sort((a, b) => a.email.localeCompare(b.email));
      tableBodyRenderer();
    });
  };

  tableBodyRenderer();
  sortEvents();
});
