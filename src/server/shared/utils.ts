import { randomBytes } from 'crypto';

export const stringToTitleCase = (input: string): string => {
  return input.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

export const generateRandomToken = (length: number = 32): string => {
  return randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

export const craftConfirmationEmail = (
  firstName: string,
  lastName: string,
  url: string
): string => {
  return `
    Hallo ${firstName} ${lastName},\n
    Vielen Dank für die Registrierung bei APP_NAME.\n
    Um Ihre Registrierung abzuschließen und Ihre Email-Adresse zu bestätigen, klicken Sie bitte auf den folgenden Link:\n
    ${url}\n
    Dieser Registrierungslink ist 30 Minuten lang gültig. Sind bereits mehr als 30 Minuten vergangen, registrieren Sie sich bitte erneut.\n
    Wenn Sie sich nicht bei uns registriert haben, ignorieren Sie bitte diese Email.\n
    Vielen Dank,
    Das APP_NAME Team
  `;
};
