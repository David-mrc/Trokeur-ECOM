export class Registration {
  constructor(
    public login: string,
    public email: string,
    public password: string,
    public firstName: string,
    public lastName: string,
    public city: string,
    public postalCode: string,
    public langKey: string
  ) {}
}
