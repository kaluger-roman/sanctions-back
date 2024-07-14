export enum Paths {
  main = "/main",
  servicesCompanies = "/services/companies",
  servicesPrivate = "/services/private",
  contacts = "/contacts",
  search_app = "/search_app",
  billing = "/billing",
  resetSanctionsDatabase = "/admin/reset_sanctions_database",
  auth = "/auth",
  register = "/register",
  recoverPasswordRequest = "/recover_password_request",
  recoverPasswordConfirm = "/recover_password_confirm/:token",

  // path that does not match tabs must be below
  root = "/",
  admin = "/admin",
}
