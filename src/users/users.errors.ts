export const userErrors = {
    NOT_FOUND: 'User not found',
    EXISTS: (login: string) => `User with login '${login}' already exists`,
    INCORRECT_OLD_PASSWORD: 'Incorrect old password provided',
    PASSWORD_MATCH: 'Password matches the old one',

}