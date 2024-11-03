export enum Paths {
  main = "/main",
  servicesCompanies = "/services/companies",
  servicesPrivate = "/services/private",
  contacts = "/contacts",
  search_app = "/search_app",
  billing = "/billing",
  profile = "/profile",
  resetSanctionsDatabase = "/admin/reset_sanctions_database",
  auth = "/auth",
  register = "/register",
  registrationConfirm = "/registration_confirm/:token",
  recoverPasswordRequest = "/recover_password_request",
  recoverPasswordConfirm = "/recover_password_confirm/:token",
  profileTariff = "/profile/tariff",
  profileMy = "/profile/my",

  // path that does not match tabs must be below
  root = "/",
  admin = "/admin",
}
