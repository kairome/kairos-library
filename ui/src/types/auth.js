export type LoginCredentials = {
  email: string,
  password: string,
};

export type SignupCredentials = {
  name: string,
  email: string,
  password: string,
  username: string,
};

export type AuthUser = {
  name?: string,
  username?: string,
  isLoggedIn?: boolean,
};
