export interface JwtPayload {
  userInfo: {
    id: string;
    name: string;
    email: string;
    role: 'a' | 'u';
    // permissionKey: string
  };
  orgInfo: {
    id: string;
    name: string;
  };
  iat: number;
  exp: number;
}
