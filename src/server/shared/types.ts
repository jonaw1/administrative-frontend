export type User = {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  admin: boolean;
  active: boolean;
  deleted: boolean;
  password: string;
  confirmation_token: string;
  token_expires_at: Date;
};
