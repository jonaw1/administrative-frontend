const toggleProfileForm = () => {
  const disabled = document.getElementById("profileFirstNameInput").disabled;
  if (!disabled) {
    document.getElementById("editProfileForm").submit();
    document.getElementById("profileModal").modal("show");
  }
  document.getElementById("profileFirstNameInput").disabled = !disabled;
  document.getElementById("profileLastNameInput").disabled = !disabled;
  document.getElementById("profileEmailInput").disabled = !disabled;
  const editButton = document.getElementById("editButton");
  editButton.innerHTML = disabled ? "Speichern" : "Ändern";
  const requiredStars = document.getElementsByClassName("required-star");
  for (const star of requiredStars) {
    star.hidden = disabled ? false : true;
  }
};
