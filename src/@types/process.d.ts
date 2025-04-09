declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      readonly NODE_ENV: 'development' | 'production' | 'test';

      /** Bot Token */
      readonly TOKEN: string;
      /** Application or client ID */
      readonly APP_ID: string;

      /** DATABASE VARIABLES */
      /** Database host */
      readonly DB_HOST: string;
      /** Database port */
      readonly DB_PORT: string;
      /** Database user to authenticate */
      readonly DB_USER: string;
      /** Database password to authenticate */
      readonly DB_PWD: string;
      /** Database name */
      readonly DB_NAME: string;
    }
  }
}
