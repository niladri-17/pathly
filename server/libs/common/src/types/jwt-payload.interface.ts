export interface JwtPayload {
  sub: string;
  email: string;
  role: 'a' | 'u';
  iat?: number;
  exp?: number;
}
