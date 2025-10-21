export const Logout = (): void => {
  localStorage.clear();
  window.location.href = "/Login"; // Redirect to home page
};
